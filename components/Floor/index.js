import Brick from 'components/Brick'

const m = [
  69, 2, 16, 3, 143
  //15, 2, 20, 3, 10
]

const levels = 1

const Floor = () =>{
  return (
    <div className="absolute bottom-0">
      {
      Array(levels).fill(1).map((x, k) => (
        <div className='inline-flex' key={`floor_level${k}`}>
        {
        m.map((y, i) => {
            return Array(y).fill(1).map((x, j) => (
              <div className={`flex flex-wrap w-16 ${ (i%2 === 0) && 'bg-orange-500'} mb-0`}>
                <div className="flex flex-wrap w-16 h-16">
                  {
                    (i%2 === 0) &&
                    <>
                      <div className="w-10 h-15 b">
                      <div className="w-full h-10 border-r-4 border-black">
                        <div className="h-1 border-l-4 border-orange-500 bg-yellow-200"></div>
                        <div className="h-9 border-l-4 border-yellow-200"></div>
                      </div>
                      <div className="w-full h-2 border-r-4 border-yellow-200">
                        <div className="flex flex-wrap w-full h-2 border-r-4 border-black">
                          <div className="w-2 h-2 border-t-4 border-black bg-yellow-200"></div>
                          <div className="w-2 h-2 border-b-4 border-black "></div>
                        </div>
                      </div>

                      <div className="w-full h-3">
                        <div className="w-9 h-3 border-l-4 border-r-4 border-yellow-200 pl-1">
                          <div className="h-1 bg-yellow-200 pl-2">
                            <div className="h-3 bg-black pt-1 pr-1">
                              <div className="h-2 bg-yellow-200 border-b-4 border-orange-500"></div>    
                            </div>  
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-6">
                      <div className="h-1 w-full border-l-4 border-r-4 border-orange-500 bg-yellow-200"></div>
                      <div className="h-4 w-5 border-l-4 border-yellow-200">
                        <div className="h-4 w-5 border-r-4 border-black">
                          <div className="pt-3 h-1 w-1 border-b-4 border-black"></div>
                        </div>
                      </div>
                      <div className="h-1 w-full border-l-4 border-r-4 border-orange-500 bg-black"></div>
                      <div className="h-9 w-full border-r-4 border-black">
                        <div className="h-4 w-full border-l-4 border-t-4 border-yellow-200"></div>
                        <div className="h-1 w-1 ml-4 mt-4 bg-black"></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap w-full h-1 border-l-4 border-r-4 border-orange-500 bg-black">
                      <div className="ml-6 h-1 w-1 bg-orange-500"></div>
                      <div className="h-1 w-1 bg-yellow-200"></div>
                    </div>
                    </>
                  }
                </div>
              </div>
            ))
          })
        }
        </div>
      ))
      }
    </div>
  )
}

export default Floor
