export const FLAG_OFFSET_X_PX = 12
export const FLAG_WIDTH_PX = 32
export const FLAG_HEIGHT_PX = 564

export const getFlagBounds = ({ x, y, pixels }) => ({
  left: (x * pixels) + FLAG_OFFSET_X_PX,
  right: (x * pixels) + FLAG_OFFSET_X_PX + FLAG_WIDTH_PX,
  bottom: y * pixels,
  top: (y * pixels) + FLAG_HEIGHT_PX,
})
