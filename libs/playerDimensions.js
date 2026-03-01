export const getPlayerDimensions = ({ pixels, playerForm = 'small' }) => ({
  width: pixels,
  height: playerForm === 'big' || playerForm === 'fire' ? pixels * 1.5 : pixels,
})

export const getPlayerBounds = ({ x, y, pixels, playerForm = 'small' }) => {
  const { width, height } = getPlayerDimensions({ pixels, playerForm })

  return {
    left: x + 12,
    right: x + width - 22,
    bottom: y,
    top: y + height,
    width,
    height,
  }
}
