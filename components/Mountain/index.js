import { useAppContext } from 'contexts/AppContext'

const Mountain = ({x, size}) => {
  const { pixels } = useAppContext()

  return (
    <div className="absolute bottom-0 left-0 mb-16 " style={{left: `${x * pixels}px` }}>
        {
          Array((size === 2? 35 : 16)).fill(1).map((x, i, elements) => {
            if(i > 2){
              return <div key={`mountain_${i}`} className={`h-1 w-${12 + (i * 2)} ml-${elements.length - i - 1} bg-green-dark border-l-4 border-r-4 border-black`}></div>
            }
            else if( i === 0){
              return <div key={`mountain_${i}`} className={`h-1 w-6 ml-${size === 2? '37' : '18'} bg-black`}></div>
            }
            else if( i === 1){
              return  <div key={`mountain_${i}`} className={`h-1 w-12 ml-${size === 2? '34' : '15'} bg-black`}>
                        <div className="w-6 h-1 ml-3 mr-3 bg-green-dark"></div>
                      </div>
            }
            else if( i === 2){
              return <div key={`mountain_${i}`} className={`h-1 w-16 ml-${size === 2? '32' : '13'} bg-green-dark border-l-8 border-r-8 border-black`}></div>
            }
          })
        }
        {
          (size ===2) ?
            <>
              <div className="absolute left-0 top-0 h-4 w-2 bg-black mt-7 ml-41"></div>
              <div className="absolute left-0 top-0 h-4 w-3 bg-black mt-4 ml-44"></div>
              <div className="absolute left-0 top-0 h-6 w-1 bg-black mt-3 ml-45"></div>

              <div className="absolute left-0 top-0 h-4 w-2 bg-black mt-22 ml-26"></div>
              <div className="absolute left-0 top-0 h-4 w-3 bg-black mt-19 ml-29"></div>
              <div className="absolute left-0 top-0 h-6 w-1 bg-black mt-18 ml-30"></div>

              <div className="absolute left-0 top-0 h-4 w-2 bg-black mt-22 ml-48"></div>
              <div className="absolute left-0 top-0 h-4 w-3 bg-black mt-19 ml-51"></div>
              <div className="absolute left-0 top-0 h-6 w-1 bg-black mt-18 ml-52"></div>
            </>
          :
            <>
              <div className="absolute left-0 top-0 h-4 w-2 bg-black mt-7 ml-22"></div>
              <div className="absolute left-0 top-0 h-4 w-3 bg-black mt-4 ml-25"></div>
              <div className="absolute left-0 top-0 h-6 w-1 bg-black mt-3 ml-26"></div>
            </>
        }
        
      </div>
  )
}

export default Mountain
