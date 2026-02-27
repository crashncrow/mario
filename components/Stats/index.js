const Stats = ({ time = 400, coins = 0 }) => {
  const coinsText = String(coins).padStart(2, '0')

  return (
    <div className='fixed top-0 inset-x-0 p-4 z-50 pointer-events-none'>
      <div className='grid grid-cols-4 text-white'>
        <div className='text-center'>
          <div>MARIO</div>
          <div>000000</div>
        </div>

        <div className='text-center'>
          <div>COINS</div>
          <div>x{coinsText}</div>
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
