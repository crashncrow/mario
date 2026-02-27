const Coin = ({ variant = 'hud' }) => {
  if (variant === 'pickup') {
    return <div className='w-6 h-8 border-4 border-amber-300 rounded-full bg-amber-400'></div>
  }

  return (
    <div className='inline-flex flex-col leading-none'>
      <div className='flex justify-center'>
        <div className='w-1 h-1 bg-amber-300'></div>
        <div className='w-2 h-1 bg-amber-300'></div>
        <div className='w-1 h-1 bg-black'></div>
      </div>
      <div className='flex'>
        <div className='w-1 h-1 bg-amber-300'></div>
        <div className='w-1 h-1 bg-amber-200'></div>
        <div className='w-1 h-1 bg-amber-300'></div>
        <div className='w-1 h-1 bg-amber-200'></div>
        <div className='w-1 h-1 bg-black'></div>
      </div>
      <div className='flex'>
        <div className='w-1 h-1 bg-amber-300'></div>
        <div className='w-1 h-1 bg-amber-300'></div>
        <div className='w-1 h-1 bg-amber-400'></div>
        <div className='w-1 h-1 bg-amber-300'></div>
        <div className='w-1 h-1 bg-black'></div>
      </div>
      <div className='flex'>
        <div className='w-1 h-1 bg-amber-300'></div>
        <div className='w-1 h-1 bg-amber-200'></div>
        <div className='w-1 h-1 bg-amber-300'></div>
        <div className='w-1 h-1 bg-amber-200'></div>
        <div className='w-1 h-1 bg-black'></div>
      </div>
      <div className='flex justify-center'>
        <div className='w-1 h-1 bg-amber-300'></div>
        <div className='w-2 h-1 bg-amber-300'></div>
        <div className='w-1 h-1 bg-black'></div>
      </div>
    </div>
  )
}

export default Coin
