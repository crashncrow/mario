import Brick from 'components/Brick'

const m = [
  //69, 2, 16, 3, 143
  15, 2, 20, 3, 10
]

const levels = 1

const Floor = () =>{
  return (
    <div className="absolute bottom-0">
      {
      Array(levels).fill(1).map((x, k) => (
        <div className='inline-flex' style={{margin: '-14px 0'}} key={`floor_level${k}`}>
        {
        m.map((y, i) => {
            return Array(y).fill(1).map((x, j) => {
              return <Brick key={`brick_1_${j}`} render={!(i%2)}/>
            })
          })
        }
        </div>
      ))
      }
    </div>
  )
}

export default Floor
