export const normalizeLevelEnemies = enemiesByType => (
  Object.entries(enemiesByType).flatMap(([type, entries]) => (
    entries.map(entry => ({
      type,
      ...entry,
    }))
  ))
)
