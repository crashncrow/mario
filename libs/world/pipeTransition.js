export const PIPE_TRANSITION_DURATION_MS = 300
export const PIPE_TRAVEL_PX = 48

export const getPipeTransitionDelta = direction => {
  if (direction === 'down') return { x: 0, y: PIPE_TRAVEL_PX }
  if (direction === 'up') return { x: 0, y: -PIPE_TRAVEL_PX }
  if (direction === 'right') return { x: PIPE_TRAVEL_PX, y: 0 }
  if (direction === 'left') return { x: -PIPE_TRAVEL_PX, y: 0 }
  return { x: 0, y: 0 }
}

export const getPipeExitStartOffset = direction => {
  const delta = getPipeTransitionDelta(direction)
  return {
    x: -delta.x,
    y: -delta.y,
  }
}
