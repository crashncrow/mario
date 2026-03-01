import { useCallback } from 'react'
import { createEnemyState } from 'libs/enemies/createEnemyState'
import { resolveMarioEnemyCollision } from 'libs/enemies/enemyInteractions'
import { getEnemyTypeConfig } from 'libs/enemies/enemyTypes'

export default function useEnemyState({
  enemiesRef,
  pixels,
  playerForm,
  playerDamageCooldownRef,
  setEnemies,
  setEnemyHit,
  setPlayerForm,
  setScore,
  createEnemyId,
}) {
  const spawnEnemy = useCallback(enemy => {
    const nextEnemy = createEnemyState({
      enemy,
      id: createEnemyId(),
      index: enemiesRef.current.length,
      pixels,
    })
    const nextEnemies = [ ...enemiesRef.current, nextEnemy ]
    enemiesRef.current = nextEnemies
    setEnemies(nextEnemies)
    return nextEnemy
  }, [createEnemyId, enemiesRef, pixels, setEnemies])

  const resolveEnemyCollision = useCallback(({
    marioX,
    marioY,
    previousMarioY,
    marioVy,
  }) => {
    const result = resolveMarioEnemyCollision({
      marioX,
      marioY,
      previousMarioY,
      marioVy,
      pixels,
      playerForm,
      enemies: enemiesRef.current,
      getEnemyTypeConfig,
    })

    if (result.scoreDelta > 0) {
      setScore(prev => prev + result.scoreDelta)
    }

    if (result.stomped || result.enemiesChanged) {
      const nextEnemies = result.nextEnemies
      enemiesRef.current = nextEnemies
      setEnemies(nextEnemies)
    }

    return {
      hitEnemy: result.hitEnemy,
      stomped: result.stomped,
      nextVy: result.nextVy,
      nextY: result.nextY,
    }
  }, [enemiesRef, pixels, playerForm, setEnemies, setScore])

  const onEnemyHit = useCallback(() => {
    const now = Date.now()
    if (now < playerDamageCooldownRef.current) return

    if (playerForm === 'big') {
      playerDamageCooldownRef.current = now + 1200
      setPlayerForm('small')
      return
    }

    setEnemyHit(true)
  }, [playerDamageCooldownRef, playerForm, setEnemyHit, setPlayerForm])

  return {
    spawnEnemy,
    resolveEnemyCollision,
    onEnemyHit,
  }
}
