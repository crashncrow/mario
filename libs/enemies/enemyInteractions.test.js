import { describe, expect, it } from 'vitest'
import {
  getEnemyBounds,
  hasBoundsOverlap,
  hasMarioEnemyContact,
  resolveMarioEnemyCollision,
} from 'libs/enemies/enemyInteractions'

const pixels = 64

const makeEnemy = (overrides = {}) => ({
  id: 'enemy_1',
  type: 'goomba',
  x: 0,
  y: 0,
  width: 64,
  height: 64,
  state: 'walking',
  vx: -60,
  vy: 0,
  ...overrides,
})

const goombaConfig = { stompable: true, shellLike: false, score: 100 }
const koopaConfig = { stompable: true, shellLike: true, score: 100, shellSpeed: 480 }
const getEnemyTypeConfig = type => ({ goomba: goombaConfig, koopa: koopaConfig }[type])

describe('getEnemyBounds', () => {
  it('insets the hitbox from the raw x/y/width/height', () => {
    const enemy = makeEnemy({ x: 100, y: 200, width: 64, height: 64 })

    expect(getEnemyBounds(enemy)).toEqual({
      left: 106,
      right: 158,
      bottom: 202,
      top: 262,
    })
  })
})

describe('hasBoundsOverlap', () => {
  it('is true for overlapping boxes', () => {
    expect(hasBoundsOverlap(
      { left: 0, right: 10, bottom: 0, top: 10 },
      { left: 5, right: 15, bottom: 5, top: 15 },
    )).toBe(true)
  })

  it('is false for disjoint boxes', () => {
    expect(hasBoundsOverlap(
      { left: 0, right: 10, bottom: 0, top: 10 },
      { left: 20, right: 30, bottom: 20, top: 30 },
    )).toBe(false)
  })
})

describe('hasMarioEnemyContact', () => {
  it('is false with no enemies', () => {
    expect(hasMarioEnemyContact({
      marioX: 0, marioY: 0, pixels, playerForm: 'small', enemies: [],
    })).toBe(false)
  })

  it('is true when Mario overlaps a live enemy', () => {
    const enemies = [makeEnemy({ x: 0, y: 0 })]

    expect(hasMarioEnemyContact({
      marioX: 0, marioY: 0, pixels, playerForm: 'small', enemies,
    })).toBe(true)
  })

  it('ignores enemies in the "dead" state', () => {
    const enemies = [makeEnemy({ x: 0, y: 0, state: 'dead' })]

    expect(hasMarioEnemyContact({
      marioX: 0, marioY: 0, pixels, playerForm: 'small', enemies,
    })).toBe(false)
  })

  it('is false for an enemy far from Mario', () => {
    const enemies = [makeEnemy({ x: 5000, y: 5000 })]

    expect(hasMarioEnemyContact({
      marioX: 0, marioY: 0, pixels, playerForm: 'small', enemies,
    })).toBe(false)
  })
})

describe('resolveMarioEnemyCollision', () => {
  it('stomps a regular stompable enemy: kills it and awards score', () => {
    const enemy = makeEnemy({ type: 'goomba', x: 0, y: 0, width: 64, height: 64 })
    // Enemy top = 0 + 2 = 2 (getEnemyBounds insets by 2). Land Mario right on it, falling.
    const result = resolveMarioEnemyCollision({
      marioX: 0,
      marioY: 2,
      previousMarioY: 100,
      marioVy: -50,
      pixels,
      playerForm: 'small',
      enemies: [enemy],
      getEnemyTypeConfig,
    })

    expect(result.stomped).toBe(true)
    expect(result.hitEnemy).toBe(false)
    expect(result.scoreDelta).toBe(100)
    expect(result.nextEnemies[0].state).toBe('dead')
  })

  it('hurts Mario when he walks into an enemy from the side (not stomped)', () => {
    const enemy = makeEnemy({ type: 'goomba', x: 0, y: 0, width: 64, height: 64 })
    // Same Y band as the enemy (no vertical approach from above) -> side contact.
    const result = resolveMarioEnemyCollision({
      marioX: 0,
      marioY: 0,
      previousMarioY: 0,
      marioVy: 0,
      pixels,
      playerForm: 'small',
      enemies: [enemy],
      getEnemyTypeConfig,
    })

    expect(result.hitEnemy).toBe(true)
    expect(result.stomped).toBe(false)
    expect(result.scoreDelta).toBe(0)
  })

  it('first stomp turns a walking koopa into a stationary shell instead of killing it', () => {
    const koopa = makeEnemy({ type: 'koopa', x: 0, y: 0, width: 64, height: 64, state: 'walking' })
    const result = resolveMarioEnemyCollision({
      marioX: 0,
      marioY: 2,
      previousMarioY: 100,
      marioVy: -50,
      pixels,
      playerForm: 'small',
      enemies: [koopa],
      getEnemyTypeConfig,
    })

    expect(result.stomped).toBe(true)
    expect(result.nextEnemies[0].state).toBe('shell')
    expect(result.scoreDelta).toBe(100)
  })

  it('touching a stationary shell (no stomp) kicks it into motion without hurting Mario', () => {
    const shell = makeEnemy({ type: 'koopa', x: 0, y: 0, width: 64, height: 64, state: 'shell', vx: 0 })
    const result = resolveMarioEnemyCollision({
      marioX: 0,
      marioY: 0,
      previousMarioY: 0,
      marioVy: 0,
      pixels,
      playerForm: 'small',
      enemies: [shell],
      getEnemyTypeConfig,
    })

    expect(result.hitEnemy).toBe(false)
    expect(result.stomped).toBe(false)
    expect(result.nextEnemies[0].state).toBe('shell-moving')
    expect(result.nextEnemies[0].vx).not.toBe(0)
  })

  it('a moving shell hurts Mario if touched without stomping', () => {
    const movingShell = makeEnemy({ type: 'koopa', x: 0, y: 0, width: 64, height: 64, state: 'shell-moving', vx: 480 })
    const result = resolveMarioEnemyCollision({
      marioX: 0,
      marioY: 0,
      previousMarioY: 0,
      marioVy: 0,
      pixels,
      playerForm: 'small',
      enemies: [movingShell],
      getEnemyTypeConfig,
    })

    expect(result.hitEnemy).toBe(true)
    expect(result.stomped).toBe(false)
  })

  it('stomping a moving shell stops it in place instead of hurting Mario', () => {
    const movingShell = makeEnemy({ type: 'koopa', x: 0, y: 0, width: 64, height: 64, state: 'shell-moving', vx: 480 })
    const result = resolveMarioEnemyCollision({
      marioX: 0,
      marioY: 2,
      previousMarioY: 100,
      marioVy: -50,
      pixels,
      playerForm: 'small',
      enemies: [movingShell],
      getEnemyTypeConfig,
    })

    expect(result.hitEnemy).toBe(false)
    expect(result.stomped).toBe(true)
    expect(result.nextEnemies[0].state).toBe('shell')
    expect(result.nextEnemies[0].vx).toBe(0)
  })

  it('does not interact with a dead enemy', () => {
    const deadEnemy = makeEnemy({ x: 0, y: 0, state: 'dead' })
    const result = resolveMarioEnemyCollision({
      marioX: 0,
      marioY: 0,
      previousMarioY: 0,
      marioVy: 0,
      pixels,
      playerForm: 'small',
      enemies: [deadEnemy],
      getEnemyTypeConfig,
    })

    expect(result.hitEnemy).toBe(false)
    expect(result.stomped).toBe(false)
    expect(result.enemiesChanged).toBe(false)
  })
})
