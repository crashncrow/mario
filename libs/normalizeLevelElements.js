const TYPE_MAP = {
  solid: 'Solid',
  mystery: 'Mystery',
  brick: 'Brick',
  pipe: 'Pipe',
  floor: 'Floor',
}

export const normalizeLevelElements = elementsByType => (
  Object.entries(elementsByType).flatMap(([group, entries]) => {
    const type = TYPE_MAP[group] ?? group
    return entries.map(entry => ({
      type,
      ...entry,
    }))
  })
)
