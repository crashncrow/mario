import level1_1 from 'libs/levels/1-1'
import level1_2 from 'libs/levels/1-2'
import level1_1_bonus from 'libs/levels/1-1-bonus'

export const WORLD_COUNT = 8
export const LEVELS_PER_WORLD = 4

const createLevelDefinition = (world, stage, baseLevel = level1_1) => ({
  ...baseLevel,
  id: `${world}-${stage}`,
  world,
  stage,
  label: `${world} - ${stage}`,
  type: baseLevel.type ?? 'main',
  background: baseLevel.background ?? 'sky',
  theme: baseLevel.theme ?? 'overworld',
  decorations: {
    clouds: baseLevel.decorations?.clouds ?? [],
    mountains: baseLevel.decorations?.mountains ?? [],
    plants: baseLevel.decorations?.plants ?? [],
  },
  spawns: {
    ...(baseLevel.spawns ?? {}),
  },
  transitions: [ ...(baseLevel.transitions ?? []) ],
})

export const LEVELS = Array.from({ length: WORLD_COUNT }, (_, worldIndex) => (
  Array.from({ length: LEVELS_PER_WORLD }, (_, stageIndex) => (
    worldIndex === 0 && stageIndex === 0
      ? level1_1
      : worldIndex === 0 && stageIndex === 1
        ? level1_2
        : createLevelDefinition(worldIndex + 1, stageIndex + 1)
  ))
)).flat()

export const SUBLEVELS = [
  level1_1_bonus,
]

const LEVELS_BY_ID = new Map([ ...LEVELS, ...SUBLEVELS ].map(level => [level.id, level]))

export const getLevelByIndex = index => LEVELS[index] ?? null
export const getLevelById = id => LEVELS_BY_ID.get(id) ?? null
export const getLevelIndexById = id => LEVELS.findIndex(level => level.id === id)

export const getNextLevelIndex = index => (
  index >= 0 && index < LEVELS.length - 1
    ? index + 1
    : null
)
