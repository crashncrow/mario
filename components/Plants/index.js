import Bush from 'components/Bush'

const m = [
  {position: 12, size: 3},
  {position: 24, size: 1},
  {position: 42, size: 2},
  {position: 60, size: 3},
  {position: 71, size: 1},
  {position: 90, size: 2},
  {position: 108, size: 3},
  {position: 118, size: 1},
  {position: 134, size: 2},
]

const Plants = () =>{
  return (
    <>
      {
        m.map((cloud, i) => (
          <Bush position={cloud.position} size={cloud.size} key={`bush_${i}`}/>
        ))
      }
    </>
  )
}

export default Plants
