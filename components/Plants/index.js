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
      <div className="absolute bottom-0 mb-16 ">
        {
          Array(32).fill(1).map((x, i, elements) => {
            if(i > 2){
              return <div className={`h-1 w-${16 + (i * 2)} ml-${elements.length - i} bg-green-dark border-l-4 border-r-4 border-black`}></div>
            }
            else if( i === 0){
              return <div className={`h-1 w-10 ml-35 bg-black`}></div>
            }
            else if( i === 1){
              return  <div className={`h-1 w-16 ml-32 bg-black`}>
                        <div className="w-10 h-1 ml-3 mr-3 bg-green-dark"></div>
                      </div>
            }
            else if( i === 2){
              return <div className={`h-1 w-20 ml-30 bg-green-dark border-l-8 border-r-8 border-black`}></div>
            }
          })
        }
      </div>
      {
        m.map((cloud, i) => (
          <Bush position={cloud.position} size={cloud.size} key={`bush_${i}`}/>
        ))
      }
    </>
  )
}

export default Plants
