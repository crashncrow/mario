import { getWorldTheme } from 'libs/world/theme'

const FloorTile = ({ theme = 'overworld' }) => {
  const worldTheme = getWorldTheme(theme)

  return (
  <div className={`flex flex-wrap w-16 mb-0 ${worldTheme.floorDarkBg}`}>
    <div className='flex flex-wrap w-16 h-16'>
      <div className='w-10 h-15 b'>
        <div className='w-full h-10 border-r-4 border-black'>
          <div className={`h-1 border-l-4 ${worldTheme.floorDarkBorder} ${worldTheme.floorLightBg}`}></div>
          <div className={`h-9 border-l-4 ${worldTheme.floorLightBorder}`}></div>
        </div>
        <div className={`w-full h-2 border-r-4 ${worldTheme.floorLightBorder}`}>
          <div className='flex flex-wrap w-full h-2 border-r-4 border-black'>
            <div className={`w-2 h-2 border-t-4 border-black ${worldTheme.floorLightBg}`}></div>
            <div className='w-2 h-2 border-b-4 border-black'></div>
          </div>
        </div>

        <div className='w-full h-3'>
          <div className={`w-9 h-3 border-l-4 border-r-4 pl-1 ${worldTheme.floorLightBorder}`}>
            <div className={`h-1 pl-2 ${worldTheme.floorLightBg}`}>
              <div className='h-3 bg-black pt-1 pr-1'>
                <div className={`h-2 ${worldTheme.floorLightBg} border-b-4 ${worldTheme.floorDarkBorder}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='w-6'>
        <div className={`h-1 w-full border-l-4 border-r-4 ${worldTheme.floorDarkBorder} ${worldTheme.floorLightBg}`}></div>
        <div className={`h-4 w-5 border-l-4 ${worldTheme.floorLightBorder}`}>
          <div className='h-4 w-5 border-r-4 border-black'>
            <div className='pt-3 h-1 w-1 border-b-4 border-black'></div>
          </div>
        </div>
        <div className={`h-1 w-full border-l-4 border-r-4 bg-black ${worldTheme.floorDarkBorder}`}></div>
        <div className='h-9 w-full border-r-4 border-black'>
          <div className={`h-4 w-full border-l-4 border-t-4 ${worldTheme.floorLightBorder}`}></div>
          <div className='h-1 w-1 ml-4 mt-4 bg-black'></div>
        </div>
      </div>

      <div className={`flex flex-wrap w-full h-1 border-l-4 border-r-4 bg-black ${worldTheme.floorDarkBorder}`}>
        <div className={`ml-6 h-1 w-1 ${worldTheme.floorDarkBg}`}></div>
        <div className={`h-1 w-1 ${worldTheme.floorLightBg}`}></div>
      </div>
    </div>
  </div>
)
}

export default FloorTile
