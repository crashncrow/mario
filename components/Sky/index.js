import Cloud from 'components/Cloud'

const m = [
  {position: 9, size: 1},
  {position: 20, size: 1},
  {position: 29, size: 3},
  {position: 38, size: 2},
  {position: 58, size: 1},
  {position: 68, size: 1},
  {position: 78, size: 3},
  {position: 86, size: 2},
  {position: 105, size: 1},
  {position: 116, size: 1},
  {position: 122, size: 3},
  {position: 130, size: 2},
]

const Sky = () =>{
  return (
    <>
      {
        m.map((cloud, i) => (
          <Cloud position={cloud.position} size={cloud.size} key={`cloud_${i}`}/>
        ))
      }
    </>
  )
}

export default Sky
