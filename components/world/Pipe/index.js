import { memo } from 'react'
import { TILE_SIZE } from 'libs/world/constants'

const PIPE_WIDTH = TILE_SIZE * 2
const PIPE_TOP_HEIGHT = TILE_SIZE - 4
const PIPE_BODY_INSET = 8
const PIPE_BODY_WIDTH = PIPE_WIDTH - (PIPE_BODY_INSET * 2)

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
  <div className='flex flex-wrap w-full h-full content-start'>
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

const Pipe = ({ x, size, pixels }) => {
  const bodyHeight = size * TILE_SIZE

  return (
    <div
      className='absolute bottom-0'
      style={{
        left: `${x * pixels}px`,
        bottom: `${pixels}px`,
        width: `${PIPE_WIDTH}px`,
        height: `${PIPE_TOP_HEIGHT + bodyHeight}px`,
      }}
    >
      <div
        className='absolute top-0 left-0 border-4 border-black bg-smb-green-light overflow-hidden'
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
        className='absolute left-2 border-l-4 border-r-4 border-t-4 border-black bg-smb-green-light overflow-hidden'
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

export default memo(Pipe)
