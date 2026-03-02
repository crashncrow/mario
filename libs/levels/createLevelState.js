export const createLevelObjectsState = level => (
  (level?.elements ?? []).map(element => ({ ...element }))
)
