const BuzzyBeetle = ({ debug = false, state = 'walk' }) => (
  <div className='relative w-16 h-16'>
    {debug && <div className='absolute inset-0 border-4 border-mario-red z-50'></div>}

    {state === 'dead' ? (
      <div className='absolute left-3 top-11 w-10 h-4 bg-black rounded-full opacity-70'></div>
    ) : state === 'shell' || state === 'shell-moving' ? (
      <>
        <div className='absolute left-3 top-8 w-10 h-6 bg-slate-800 rounded-t-full'></div>
        <div className='absolute left-4 top-12 w-8 h-2 bg-black'></div>
        <div className='absolute left-2 top-12 w-3 h-3 bg-stone-500'></div>
        <div className='absolute left-11 top-12 w-3 h-3 bg-stone-500'></div>
      </>
    ) : (
      <>
        <div className='absolute left-5 top-1 w-6 h-5 bg-slate-700 rounded-t-full'></div>
        <div className='absolute left-3 top-5 w-10 h-7 bg-slate-800 rounded-t-full'></div>
        <div className='absolute left-4 top-10 w-8 h-3 bg-black'></div>

        <div className='absolute left-2 top-10 w-3 h-5 bg-stone-500'></div>
        <div className='absolute left-11 top-10 w-3 h-5 bg-stone-500'></div>

        <div className='absolute left-1 top-13 w-4 h-2 bg-stone-900'></div>
        <div className='absolute left-11 top-13 w-4 h-2 bg-stone-900'></div>

        <div className='absolute left-6 top-4 w-4 h-6 bg-stone-500'></div>
        <div className='absolute left-5 top-3 w-2 h-2 bg-white'></div>
        <div className='absolute left-9 top-3 w-2 h-2 bg-white'></div>
        <div className='absolute left-6 top-4 w-1 h-1 bg-black'></div>
        <div className='absolute left-10 top-4 w-1 h-1 bg-black'></div>
      </>
    )}
  </div>
)

export default BuzzyBeetle
