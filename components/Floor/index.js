import Brick from 'components/Brick'

const c = {
  0: 'bg-black',
  1: 'bg-yellow-200',
  2: 'bg-orange-500'
}

const m = [
  1, 1, 1, 1, 1, , 1, 1, 1, 0, 0, 1, 1, 1, 1, 1,
]

const Floor = () =>{
  return (
    <>
    <div className='inline-flex' style={{margin: '-6px 0'}}>
      {m.map((x, i) => (
        <Brick key={`brick_1_${i}`} render={x}/>
      ))}
    </div>
    <div className='inline-flex' style={{margin: '-6px 0'}}>
      {m.map((x, i) => (
        <Brick key={`brick_2_${i}`} render={x}/>
      ))}
    </div>
    </>

  )
}

export default Floor
