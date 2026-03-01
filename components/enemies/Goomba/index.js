const Goomba = ({ debug = false, state = 'walk' }) => (
  <div className='relative w-16 h-16'>
    {debug && <div className='absolute inset-0 border-4 border-mario-red z-50'></div>}

    {state === 'dead' ? (
      <div className='absolute left-2 top-11 w-12 h-4 bg-amber-900 rounded-full opacity-70'></div>
    ) : (
      <>
        <div className='w-full h-2 px-5'>
          <div className='w-full h-full bg-orange-800'></div>
        </div>
        <div className='w-full h-2 px-4'>
          <div className='w-full h-full bg-orange-800'></div>
        </div>
        <div className='w-full h-2 px-2'>
          <div className='w-full h-full bg-orange-800'></div>
        </div>
        <div className='w-full h-2 px-1'>
          <div className='w-full h-full bg-orange-800'></div>
        </div>
        <div className='w-full h-2 px-1'>
          <div className='w-full h-full bg-orange-800'></div>
        </div>

        <div className='w-full h-1 px-2'>
          <div className='w-full h-full bg-orange-800'></div>
        </div>
         <div className='w-full h-2 px-3'>
          <div className='w-full h-full bg-red-200'></div>
        </div>
         <div className='w-full h-2 px-3'>
          <div className='w-full h-full bg-black'></div>
        </div>
      </>
    )}
  </div>
)

export default Goomba
