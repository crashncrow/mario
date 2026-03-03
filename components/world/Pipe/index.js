import { memo } from 'react'
import { TILE_SIZE } from 'libs/world/constants'

const PIPE_WIDTH = TILE_SIZE * 2
const PIPE_TOP_HEIGHT = TILE_SIZE - 4
const PIPE_BODY_INSET = 8
const PIPE_BODY_WIDTH = PIPE_WIDTH - (PIPE_BODY_INSET * 2)
const SIDE_PIPE_BODY_LENGTH = TILE_SIZE * 3
const SIDE_PIPE_NOZZLE_WIDTH = TILE_SIZE - 4

const createAlternatingRows = ({ count, evenRow, oddRow }) => (
  Array.from({ length: count }, (_, index) => (
    index % 2 === 0 ? evenRow : oddRow
  ))
)

const TOP_PATTERN_ROWS = createAlternatingRows({
  count: 10,
  evenRow: '010101',
  oddRow: '101010',
})

const BODY_PATTERN_ROWS = createAlternatingRows({
  count: 16,
  evenRow: '010',
  oddRow: '101',
})

const PipePattern = ({ rows }) => (
  <div className='flex h-full w-full flex-wrap content-start'>
    {rows.flatMap((row, rowIndex) => (
      row.split('').map((cell, cellIndex) => (
        <div
          key={`${rowIndex}_${cellIndex}`}
          className={`h-1 w-1 ${cell === '1' ? 'bg-smb-green' : ''}`}
        ></div>
      ))
    ))}
  </div>
)

const VerticalPipe = ({ x, size, pixels }) => {
  const bodyHeight = size * TILE_SIZE

  return (
    <div
      className='absolute bottom-0 z-50'
      style={{
        left: `${x * pixels}px`,
        bottom: `${pixels}px`,
        width: `${PIPE_WIDTH}px`,
        height: `${PIPE_TOP_HEIGHT + bodyHeight}px`,
      }}
    >
      <div
        className='absolute top-0 left-0 overflow-hidden border-4 border-black bg-smb-green-light'
        style={{ width: `${PIPE_WIDTH}px`, height: `${PIPE_TOP_HEIGHT}px` }}
      >
        <div className='absolute top-4 left-0 h-12 w-5 border-t-4 border-r-8 border-smb-green'></div>

        <div className='absolute top-4 left-11 h-12 w-19 border-t-4 border-l-4 border-smb-green'>
          <div className='absolute top-0 left-2 h-full w-10 bg-smb-green'></div>
          <div className='absolute top-0 right-2 h-10 w-6'>
            <PipePattern rows={TOP_PATTERN_ROWS} />
          </div>
        </div>
      </div>

      <div
        className='absolute left-2 overflow-hidden border-l-4 border-r-4 border-t-4 border-black bg-smb-green-light'
        style={{
          bottom: 0,
          width: `${PIPE_BODY_WIDTH}px`,
          height: `${bodyHeight}px`,
        }}
      >
        <div className='absolute top-0 left-3 h-full w-2 bg-smb-green'></div>
        <div className='absolute top-0 left-10 h-full w-1 bg-smb-green'></div>
        <div className='absolute top-0 left-13 h-full w-8 bg-smb-green'></div>
        <div className='absolute top-0 right-2 h-full w-3'>
          <PipePattern rows={Array.from({ length: size }, () => BODY_PATTERN_ROWS).flat()} />
        </div>
      </div>
    </div>
  )
}

const HorizontalPipe = ({ x, y, size, pixels, direction = 'left' }) => {
  const bodyLength = size * TILE_SIZE
  const totalWidth = bodyLength + SIDE_PIPE_NOZZLE_WIDTH
  const nozzleOnLeft = direction === 'right'

  return (
    <div
      className='absolute z-50'
      style={{
        left: `${x * pixels}px`,
        bottom: `${y * pixels}px`,
        width: `${totalWidth}px`,
        height: `${PIPE_WIDTH}px`,
      }}
    >
      <div
        className={`absolute bottom-0 overflow-hidden border-4 border-black bg-smb-green-light ${nozzleOnLeft ? 'left-0' : 'right-0'}`}
        style={{ width: `${SIDE_PIPE_NOZZLE_WIDTH}px`, height: `${PIPE_WIDTH}px` }}
      >
        <div className={`absolute top-1 h-4 w-10 border-b-8 border-smb-green ${nozzleOnLeft ? 'right-3 border-r-4' : 'left-3 border-l-4'}`}></div>
        <div className={`absolute bottom-10 h-17 w-10 border-t-4 border-smb-green ${nozzleOnLeft ? 'right-3 border-r-4' : 'left-3 border-l-4'}`}>
          <div className='absolute left-0 top-2 h-9 w-full bg-smb-green'></div>
          <div className={`absolute bottom-2 h-6 w-8 ${nozzleOnLeft ? 'right-0' : 'left-0'}`}>
            <PipePattern rows={TOP_PATTERN_ROWS.slice(0, 6)} />
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-2 overflow-hidden border-b-4 border-t-4 border-black bg-smb-green-light ${nozzleOnLeft ? 'right-0 border-r-4' : 'left-0 border-l-4'}`}
        style={{
          width: `${bodyLength}px`,
          height: `${PIPE_BODY_WIDTH}px`,
        }}
      >
        <div className='absolute top-3 left-0 h-2 w-full bg-smb-green'></div>
        <div className='absolute top-10 left-0 h-1 w-full bg-smb-green'></div>
        <div className='absolute top-13 left-0 h-8 w-full bg-smb-green'></div>
        <div className='absolute bottom-2 left-0 h-3 w-full'>
          <PipePattern rows={Array.from({ length: size }, () => BODY_PATTERN_ROWS).flat()} />
        </div>
      </div>
    </div>
  )
}

const Pipe = ({ x, y = 1, size, pixels, direction = 'up' }) => {
  if (direction === 'left' || direction === 'right') {
    return <HorizontalPipe x={x} y={y} size={size} pixels={pixels} direction={direction} />
  }

  return <VerticalPipe x={x} size={size} pixels={pixels} />
}

export default memo(Pipe)
