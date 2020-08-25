import Mountain from 'components/Mountain'

const m = [
  {position: 0, size: 2},
  {position: 17, size: 1},
  {position: 49, size: 2},
  {position: 65, size: 1},
  {position: 96, size: 2},
  {position: 113, size: 1},
]

const Mountains = () =>{
  return (
    <>
      {
        m.map((mountain, i) => (
          <Mountain position={mountain.position} size={mountain.size} key={`mountain_${i}`}/>
        ))
      }
    </>
  )
}

export default Mountains
