const Goomba = ({ debug = false, state = 'walk' }) => (
  <div className='relative w-16 h-16'>
    {debug && <div className='absolute inset-0 border-4 border-mario-red z-50'></div>}

    {state === 'dead' ? (
      <div className='absolute left-2 top-11 w-12 h-4 bg-amber-900 rounded-full opacity-70'></div>
    ) : (
      <>
        <div className='absolute left-2 top-3 w-12 h-7 rounded-t-full bg-amber-700'></div>
        <div className='absolute left-2 top-8 w-12 h-6 bg-amber-700'></div>
        <div className='absolute left-3 top-10 w-10 h-4 bg-amber-900'></div>

        <div className='absolute left-4 top-9 w-3 h-2 bg-white'></div>
        <div className='absolute left-9 top-9 w-2 h-2 bg-white'></div>
        <div className='absolute left-10 top-9 w-3 h-2 bg-white'></div>
        <div className='absolute left-15 top-9 w-2 h-2 bg-white'></div>

        <div className='absolute left-6 top-9 w-1 h-1 bg-black'></div>
        <div className='absolute left-13 top-9 w-1 h-1 bg-black'></div>

        <div className='absolute left-1 top-13 w-6 h-2 bg-amber-950'></div>
        <div className='absolute left-9 top-13 w-6 h-2 bg-amber-950'></div>
      </>
    )}
  </div>
)

export default Goomba
