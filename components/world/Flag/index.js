import { useAppContext } from 'contexts/AppContext'

const Flag = ({ x, y, debug = false }) => {
  const { pixels } = useAppContext()

  return (
    <>
      <div 
        className={`flex flex-wrap absolute bg-transparent w-16`} 
        style={{left: `${x * pixels}px`, bottom: `${(y * pixels)}px`}}>

        {debug && <div className='absolute w-full h-full border-4 border-mario-red z-50 pointer-events-none'></div>}

        <div className='relative w-full h-full flex flex-col items-center'>
          <div className='w-4 h-1 bg-black'></div>
          <div className='w-6 h-1 bg-black relative'>
            <div className='w-4 h-full bg-green-dark mx-auto'></div>
            <div className='absolute left-1 top-0 w-1 h-1 bg-green-light'></div>
          </div>
          <div className='w-8 h-1 bg-black relative'>
            <div className='w-6 h-full bg-green-dark mx-auto'></div>
            <div className='absolute left-1 top-0 w-1 h-2 bg-green-light'></div>
          </div>
          <div className='w-8 h-1 bg-black'>
            <div className='w-6 h-full bg-green-dark mx-auto'></div>
          </div>
          <div className='w-8 h-1 bg-black'>
            <div className='w-6 h-full bg-green-dark mx-auto'></div>
          </div>
          <div className='w-6 h-1 bg-black'>
            <div className='w-4 h-full bg-green-dark mx-auto'></div>
          </div>
          <div className='w-4 h-1 bg-black'></div>
        </div>

        <div className="relative w-full h-38 flex flex-col items-center" >
          <div className='w-2 h-full bg-green-light'></div>

          <div className='absolute left-4 top-1 w-28 h-20 pointer-events-none'>
            <div className='absolute right-26'>
              <div className='h-1 w-16 bg-white'></div>
              <div className='h-1 w-15 bg-white ml-1'></div>
              <div className='h-1 w-14 bg-white ml-2'></div>
              <div className='h-1 w-13 bg-white ml-3'></div>
              <div className='h-1 w-12 bg-white ml-4'></div>
              <div className='h-1 w-11 bg-white ml-5'></div>
              <div className='h-1 w-10 bg-white ml-6'></div>
              <div className='h-1 w-9 bg-white ml-7'></div>
              <div className='h-1 w-8 bg-white ml-8'></div>
              <div className='h-1 w-7 bg-white ml-9'></div>
              <div className='h-1 w-6 bg-white ml-10'></div>
              <div className='h-1 w-5 bg-white ml-11'></div>
              <div className='h-1 w-4 bg-white ml-12'></div>
              <div className='h-1 w-3 bg-white ml-13'></div>
              <div className='h-1 w-2 bg-white ml-14'></div>
              <div className='h-1 w-1 bg-white ml-15'></div>
            </div>

            <div className='absolute right-27 top-1 w-7 h-6'>
              <div className='absolute inset-0 bg-green-dark'></div>
              <div className='absolute left-0 top-0 w-7 h-1 bg-green-dark border-r-white border-l-white border-l-4 border-r-4'></div>
              <div className='absolute left-2 top-1 w-1 h-2 bg-white'></div>
              <div className='absolute left-4 top-1 w-1 h-2 bg-white'></div>
              <div className='absolute left-1 top-2 w-1 h-2 bg-white'></div>
              <div className='absolute left-5 top-2 w-1 h-2 bg-white'></div>
              <div className='absolute left-3 top-4 w-1 h-1 bg-white'></div>
              <div className='absolute left-2 top-5 w-3 h-2 bg-green-dark'></div>
            </div>
          </div>
        </div>

        <div className="relative w-full h-96 flex flex-col items-center" >
          <div className='w-2 h-full bg-green-light'></div>
        </div>
      </div>
    </>
  )
}

export default Flag
