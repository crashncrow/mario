
const Mountain = ({position, size}) =>{
  return (
    <div className="absolute bottom-0 mb-16 " style={{left: `${position * 64}px`}}>
        {
          Array((size === 2? 32 : 16)).fill(1).map((x, i, elements) => {
            if(i > 2){
              return <div key={`mountain_${i}`} className={`h-1 w-${16 + (i * 2)} ml-${elements.length - i} bg-green-dark border-l-4 border-r-4 border-black`}></div>
            }
            else if( i === 0){
              return <div key={`mountain_${i}`} className={`h-1 w-10 ml-${size === 2? '35' : '19'} bg-black`}></div>
            }
            else if( i === 1){
              return  <div key={`mountain_${i}`} className={`h-1 w-16 ml-${size === 2? '32' : '16'} bg-black`}>
                        <div className="w-10 h-1 ml-3 mr-3 bg-green-dark"></div>
                      </div>
            }
            else if( i === 2){
              return <div key={`mountain_${i}`} className={`h-1 w-20 ml-${size === 2? '30' : '14'} bg-green-dark border-l-8 border-r-8 border-black`}></div>
            }
          })
        }
      </div>
  )
}

export default Mountain
