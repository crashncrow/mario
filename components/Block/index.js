import { memo } from 'react'
import useBlockBump from 'hooks/useBlockBump'
import { TILE_SIZE } from 'libs/worldConstants'

const INTERACTIVE_VARIANTS = ['mystery', 'brick']

const BlockShell = ({ x, y, isBumping = false, className = '', children }) => (
  <div
    className={`absolute ${isBumping ? 'mb-2' : ''}`}
    style={{ left: `${x * TILE_SIZE}px`, bottom: `${y * TILE_SIZE}px` }}
  >
    <div className={`flex flex-wrap w-16 h-16 ${className}`}>
    {children}
    </div>  
  </div>
)

const MysteryBlock = ({ x, y, touches, content, isBumping, hidden = false }) => {
  if (hidden && touches === 0) return null

  return (
    <BlockShell x={x} y={y} isBumping={isBumping}>
      <div className='w-14 h-1 ml-1 mr-1 bg-brick-dark'></div>
      <div className='flex flex-wrap h-15 w-full border-r-4 border-b-4 border-black'>
        <div className='w-1 h-full bg-brick-dark'></div>
        <div
          className={`flex flex-wrap w-14 h-full bg-mystery-yellow ${touches === 0 ? 'animate-pulse' : ''}`}
        >
          <div className='w-1 h-12 border-t-4 border-b-4 border-black m-1'></div>
          <div className='w-8 h-full'></div>
          <div className='w-1 h-12 border-t-4 border-b-4 border-black m-1'></div>
        </div>
      </div>
      {touches === 0 && content !== 'none' && (
        <>
          <div className='absolute w-5 h-1 mt-3 ml-5 mr-1 bg-brick-dark'></div>
          <div className='absolute w-7 h-3 mt-4 ml-4 border-l-8 border-r-8 border-brick-dark'>
            <div className='w-full h-full border-l-4 border-t-4 border-black'></div>
          </div>
          <div className='absolute w-3 h-1 bg-brick-dark top-0 right-0 mt-7 mr-5'></div>
          <div className='absolute w-3 h-4 border-b-4 border-r-4 border-black top-0 right-0 mt-5 mr-4'></div>
          <div className='absolute w-2 h-5 border-b-8 border-t-8 border-black top-0 left-0 mt-9 ml-8'></div>
          <div className='absolute w-2 h-5 border-b-8 border-t-8 border-brick-dark top-0 left-0 mt-8 ml-7'></div>
        </>
      )}
    </BlockShell>
  )
}

const BrickBlock = ({ x, y, border, isBumping }) => (
  <BlockShell x={x} y={y} isBumping={isBumping} className='bg-brick-dark'>
    <div className='flex flex-wrap h-full w-full'>
      <div className={`h-full w-full ${border ? 'border-t-4 border-brick-light' : 'border-t-0'}`}>
        <div className={`${border ? 'h-3' : 'h-4'} w-full border-r-4 border-b-4 border-black`}>
          <div className='h-full w-8 border-r-4 border-black'></div>
        </div>
        <div className='h-4 w-full border-b-4 border-black'>
          <div className='h-4 w-9 border-r-4 border-l-4 ml-3 border-black'></div>
        </div>
        <div className='h-4 w-full border-r-4 border-b-4 border-black'>
          <div className='h-full w-8 border-r-4 border-black'></div>
        </div>
        <div className='h-4 w-full border-b-4 border-black'>
          <div className='h-full w-9 border-r-4 border-l-4 ml-3 border-black'></div>
        </div>
      </div>
    </div>
  </BlockShell>
)

const SolidBlock = ({ x, y, isBumping = false }) => (
  <BlockShell x={x} y={y} isBumping={isBumping} className='bg-black'> 
      <div className='absolute w-15 h-1 border-l-4 border-brick-dark bg-brick-light'></div>
      <div className='absolute w-13 h-1 border-l-4 border-brick-dark bg-brick-light ml-1 mt-1'></div>
      <div className='absolute w-11 h-1 border-l-4 border-brick-dark bg-brick-light ml-2 mt-2'></div>
      <div className='absolute w-9 h-1 border-l-4 border-brick-dark bg-brick-light ml-3 mt-3'></div>

      <div className='absolute w-1 h-14 bg-brick-light mt-1 ml-0'></div>
      <div className='absolute w-1 h-12 bg-brick-light mt-2 ml-1'></div>
      <div className='absolute w-1 h-10 bg-brick-light mt-3 ml-2'></div>
      <div className='absolute w-1 h-8 bg-brick-light mt-4 ml-3'></div>

      <div className='absolute w-1 h-1 bg-brick-dark right-0 bottom-0 mr-0 mb-0'></div>
      <div className='absolute w-1 h-1 bg-brick-dark right-0 bottom-0 mr-1 mb-1'></div>
      <div className='absolute w-1 h-1 bg-brick-dark right-0 bottom-0 mr-2 mb-2'></div>
      <div className='absolute w-1 h-1 bg-brick-dark right-0 bottom-0 mr-3 mb-3'></div>

      <div className='w-8 h-8 bg-brick-dark m-4'></div>
  </BlockShell>
)

const Block = ({
  variant = 'brick',
  x,
  y,
  touches = 0,
  border = true,
  content = 'coin',
  hidden = false,
}) => {
  const normalizedVariant = (variant || '').toLowerCase()
  const interactive = INTERACTIVE_VARIANTS.includes(normalizedVariant)
  const isBumping = useBlockBump({ touches, interactive })
  const commonProps = { x, y }
  const stateProps = { touches, content }

  const renderers = {
    brick: () => (
      <BrickBlock
        {...commonProps}
        {...stateProps}
        border={border}
        isBumping={isBumping}
      />
    ),
    mystery: () => (
      <MysteryBlock
        {...commonProps}
        {...stateProps}
        hidden={hidden}
        isBumping={isBumping}
      />
    ),
    solid: () => <SolidBlock {...commonProps} />,
  }

  const render = renderers[normalizedVariant] ?? renderers.brick
  return render()
}

export default memo(Block)
