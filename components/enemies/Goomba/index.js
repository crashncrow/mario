const Goomba = ({ debug = false, state = 'walk', enemy }) => {
  const isWalking = state === 'walk' && Math.abs(enemy?.vx ?? 0) > 0
  const walkPhase = isWalking ? Math.floor((enemy?.x ?? 0) / 24) % 2 === 1 : false

  return (
    <div className='relative w-16 h-16'>
      {debug && <div className='absolute inset-0 border-4 border-mario-red z-50'></div>}

      {state === 'dead' ? (
        <>
          <div className='absolute w-4 h-1 bottom-5 left-8 bg-orange-700'></div>
          <div className='absolute w-10 h-1 bottom-4 left-5 bg-orange-700'></div>
          <div className='absolute w-14 h-1 bottom-3 left-3 bg-orange-700'></div>
          
          <div className='absolute w-16 h-2 bottom-1 left-2 bg-orange-700'></div>

          <div className='absolute w-3 h-1 bottom-3 left-5 bg-black'></div>
          <div className='absolute w-3 h-1 bottom-3 left-12 bg-black'></div>

          <div className='absolute w-4 h-1 bottom-2 left-4 bg-red-200'></div>
          <div className='absolute w-4 h-1 bottom-2 left-8 bg-black'></div>
          <div className='absolute w-4 h-1 bottom-2 left-12 bg-red-200'></div>

          <div className='absolute w-12 h-1 bottom-0 left-4 bg-red-200'></div>
        </>
      ) : (
        <>
          <div className='w-full h-1 px-6'>
            <div className='w-full h-full bg-orange-700'></div>
          </div>
          <div className='w-full h-1 px-5'>
            <div className='w-full h-full bg-orange-700'></div>
          </div>
          <div className='w-full h-1 px-4'>
            <div className='w-full h-full bg-orange-700'></div>
          </div>
          <div className='w-full h-1 px-3'>
            <div className='w-full h-full bg-orange-700'></div>
          </div>
          <div className='w-full h-1 px-2'>
            <div className='w-full h-full bg-orange-700 px-1'>
              <div className='w-full h-full border-x-10 border-black'></div>
            </div>
          </div>
          <div className='w-full h-2 px-1'>
            <div className='w-full h-full bg-orange-700'></div>
          </div>
          <div className='w-full h-3 px-0'>
            <div className='w-full h-full bg-orange-700'></div>
          </div>
          <div className='w-full h-1 px-1'>
            <div className='w-full h-full bg-orange-700 px-4'>
              <div className='w-full h-full bg-red-200'></div>
            </div>
          </div>
          <div className='w-full h-4 px-4'>
            <div className='w-full h-full bg-red-200'></div>
          </div>

          <div>
            <div className='absolute w-3 h-4 top-5 left-4 bg-red-200'></div>
            <div className='absolute w-1 h-3 top-5 left-5 bg-black'></div>
            <div className='absolute w-3 h-4 top-5 right-4 bg-red-200'></div>
            <div className='absolute w-1 h-3 top-5 right-5 bg-black'></div>

            <div className='absolute w-4 h-1 top-5 left-6 bg-orange-700'></div>
            <div className='absolute w-5 h-1 top-6 left-5 bg-black'></div>
          </div>

          <div
            className='absolute bottom-0 h-4 w-full'
            style={{
              transform: `scaleX(${walkPhase ? -1 : 1})`,
              transformOrigin: 'center bottom',
            }}
          >
            <div className='absolute bottom-0 left-0 w-5'>
              <div className='absolute bottom-2 left-2 h-1 w-2 bg-black'></div>
              <div className='absolute bottom-1 left-2 h-1 w-3 bg-black'></div>
              <div className='absolute bottom-0 left-3 h-1 w-3 bg-black'></div>
            </div>

            <div className='absolute bottom-0 right-1 w-5'>
              <div className='absolute bottom-3 right-2 h-1 w-2 bg-black'></div>
              <div className='absolute bottom-2 right-1 h-1 w-5 bg-black'></div>
              <div className='absolute bottom-1 right-1 h-1 w-6 bg-black'></div>
              <div className='absolute bottom-0 right-2 h-1 w-5 bg-black'></div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Goomba
