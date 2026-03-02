import Coin from 'components/items/Coin'

const Stats = ({ time = 400, coins = 0, score = 0, world = 1, stage = 1 }) => {
  const coinsText = String(coins).padStart(2, '0')
  const scoreText = String(score).padStart(6, '0')

  return (
    <div className='fixed top-0 inset-x-0 p-4 z-50 pointer-events-none text-sm md:text-xl'>
      <div className='mx-auto grid w-full max-w-3xl grid-cols-4 text-center text-white'>
        <div className='text-left'>
          <div>MARIO</div>
          <div>{scoreText}</div>
        </div>

        <div>
          <div></div>
          <div className='inline-flex gap-2'>
            <Coin />
            x {coinsText}
          </div>
        </div>

        <div>
          <div>WORLD</div>
          <div>{world} - {stage}</div>
        </div>

        <div className='text-right'>
          <div>TIME</div>
          <div>{time}</div>
        </div>
      </div>
    </div>
  )
}

export default Stats
