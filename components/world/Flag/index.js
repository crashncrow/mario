import { FLAG_HEIGHT_PX, FLAG_OFFSET_X_PX, FLAG_WIDTH_PX } from 'libs/world/flag'

const FlagTop = ({ topColor, topHighlightColor }) => (
  <div className='relative w-full h-full flex flex-col items-center'>
    <div className='relative w-4 h-1 bg-black'></div>
    <div className={`relative w-6 h-1 border-x-4 border-black ${topColor}`}></div>
    <div className={`relative w-8 h-3 border-x-4 border-black ${topColor}`}></div>
    <div className={`relative w-6 h-1 border-x-4 border-black ${topColor}`}></div>
    <div className={`absolute left-2 top-1 w-1 h-1 ${topHighlightColor}`}></div>
    <div className={`absolute left-1 top-2 w-1 h-2 ${topHighlightColor}`}></div>
    <div className='relative w-4 h-1 bg-black'></div>
  </div>
)

const FlagBanner = ({ flagColor, skullColor }) => (
  <div className='absolute left-0 top-1 w-28 pointer-events-none'>
    <div className='absolute right-25'>
      <div className={`h-1 w-16 ml-0 ${flagColor}`}></div>
      <div className={`h-1 w-15 ml-1 ${flagColor}`}></div>
      <div className={`h-1 w-14 ml-2 ${flagColor}`}></div>
      <div className={`h-1 w-13 ml-3 ${flagColor}`}></div>
      <div className={`h-1 w-12 ml-4 ${flagColor}`}></div>
      <div className={`h-1 w-11 ml-5 ${flagColor}`}></div>
      <div className={`h-1 w-10 ml-6 ${flagColor}`}></div>
      <div className={`h-1 w-9  ml-7 ${flagColor}`}></div>
      <div className={`h-1 w-8  ml-8 ${flagColor}`}></div>
      <div className={`h-1 w-7  ml-9 ${flagColor}`}></div>
      <div className={`h-1 w-6 ml-10 ${flagColor}`}></div>
      <div className={`h-1 w-5 ml-11 ${flagColor}`}></div>
      <div className={`h-1 w-4 ml-12 ${flagColor}`}></div>
      <div className={`h-1 w-3 ml-13 ${flagColor}`}></div>
      <div className={`h-1 w-2 ml-14 ${flagColor}`}></div>
      <div className={`h-1 w-1 ml-15 ${flagColor}`}></div>
    </div>

    <FlagSkull skullColor={skullColor} />
  </div>
)

const FlagSkull = ({ skullColor }) => (
  <>
    <div className='absolute right-26 top-0 w-7 h-6'>
      <div className={`absolute right-1 top-1 w-5 h-1 ${skullColor}`}></div>
      <div className={`absolute right-0 top-2 w-2 h-1 ${skullColor}`}></div>
      <div className={`absolute right-3 top-2 w-1 h-2 ${skullColor}`}></div>
      <div className={`absolute right-5 top-2 w-2 h-1 ${skullColor}`}></div>
      <div className={`absolute right-0 top-3 w-1 h-2 ${skullColor}`}></div>
      <div className={`absolute right-6 top-3 w-1 h-2 ${skullColor}`}></div>
      <div className={`absolute right-2 top-4 w-3 h-1 ${skullColor}`}></div>
      <div className={`absolute right-0 top-5 w-3 h-2 ${skullColor}`}></div>
      <div className={`absolute right-4 top-5 w-3 h-2 ${skullColor}`}></div>
      <div className={`absolute right-2 top-6 w-3 h-2 ${skullColor}`}></div>
    </div>
  </>
)

const FlagPole = ({ poleColor, children = null }) => (
  <div className={`relative w-full h-134 flex flex-col items-center`}>
    <div className={`w-2 h-full ${poleColor}`}></div>
    {children}
  </div>
)

const Flag = ({
  x,
  y,
  pixels,
  debug = false,
  poleColor = 'bg-smb-green-light',
  flagColor = 'bg-white',
  skullColor = 'bg-smb-green',
  topColor = 'bg-smb-green',
  topHighlightColor = 'bg-smb-green-light',
}) => {
  return (
    <div
      className='absolute flex flex-wrap bg-transparent'
      style={{ left: `${(x * pixels) + FLAG_OFFSET_X_PX}px`, bottom: `${y * pixels}px` }}
    >
      {debug && (
        <div
          className='absolute border-4 border-smb-red z-50 pointer-events-none'
          style={{ left: 0, bottom: 0, width: `${FLAG_WIDTH_PX}px`, height: `${FLAG_HEIGHT_PX}px` }}
        ></div>
      )}

      <FlagTop topColor={topColor} topHighlightColor={topHighlightColor} />

      <FlagPole poleColor={poleColor}>
        <FlagBanner flagColor={flagColor} skullColor={skullColor} />
      </FlagPole>
    </div>
  )
}

export default Flag
