import Brick from 'components/Brick'

const c = {
  0: 'bg-black',
  1: 'bg-yellow-200',
  2: 'bg-orange-500'
}

const m = [
  //69, 2, 16, 3, 143
  15, 2, 20, 3, 10
]

const Floor = () =>{
  return (
    <div className="absolute bottom-0">
      <div className='inline-flex' style={{margin: '-14px 0'}}>
        {
        m.map((y, i) => {
            return Array(y).fill(1).map((x, j) => {
              return <Brick key={`brick_1_${j}`} render={!(i%2)}/>
            })
          })
        }
      </div>

      {/* 
      <div className='inline-flex' style={{margin: '-14px 0'}}>
        {
        m.map((y, i) => {
            return Array(y).fill(1).map((x, j) => {
              return <Brick key={`brick_2_${j}`} render={!(i%2)}/>
            })
          })
        }
      </div> 
      */}
    </div>

  )
}

export default Floor
