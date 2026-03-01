import level1_1 from 'libs/levels/1-1'

const level1_2 = {
  ...level1_1,
  id: '1-2',
  world: 1,
  stage: 2,
  label: '1 - 2',
  background: 'black',
  decorations: {
    ...level1_1.decorations,
    clouds: [
      { x: 14, y: 1, size: 2 },
      { x: 34, y: 2, size: 1 },
      { x: 56, y: 1, size: 3 },
      { x: 79, y: 2, size: 2 },
      { x: 102, y: 1, size: 1 },
      { x: 126, y: 2, size: 2 },
      { x: 150, y: 1, size: 3 },
      { x: 176, y: 2, size: 1 },
      { x: 201, y: 1, size: 2 },
    ],
  },
}

export default level1_2
