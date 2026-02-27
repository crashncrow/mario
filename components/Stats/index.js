const Stats = ({ time = 400, coins = 0, score = 0 }) => {
  const coinsText = String(coins).padStart(2, '0')
  const scoreText = String(score).padStart(6, '0')

  return (
    <div className='fixed top-0 inset-x-0 p-4 z-50 pointer-events-none'>
      <div className='grid grid-cols-4 text-white'>
        <div className='text-center'>
          <div>MARIO</div>
          <div>{scoreText}</div>
        </div>

        <div className='text-center'>
          <div>COINS</div>
          <div className='inline-flex items-center gap-1'>
            {/* COIN */}
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
            x {coinsText}
          </div>
        </div>

        <div className='text-center'>
          <div>WORLD</div>
          <div>1 - 1</div>
        </div>

        <div className='text-center'>
          <div>TIME</div>
          <div>{time}</div>
        </div>
      </div>
    </div>
  )
}

export default Stats
