import level1_1 from 'libs/levels/1-1'
import level1_2 from 'libs/levels/1-2'

export const WORLD_COUNT = 8
export const LEVELS_PER_WORLD = 4

const createLevelDefinition = (world, stage, baseLevel = level1_1) => ({
  ...baseLevel,
  id: `${world}-${stage}`,
  world,
  stage,
  label: `${world} - ${stage}`,
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

export const getLevelByIndex = index => LEVELS[index] ?? null

export const getNextLevelIndex = index => (
  index >= 0 && index < LEVELS.length - 1
    ? index + 1
    : null
)
