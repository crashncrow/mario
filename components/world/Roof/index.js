import { useAppContext } from 'contexts/AppContext'

const Roof = ({ x, y, bg = 0 }) => {
  const { pixels } = useAppContext()

  return (
    <>
      <div
        className={`flex flex-wrap absolute bg-transparent bottom-0`}
        style={{ left: `${x * pixels}px`, bottom: `${(y * pixels)}px` }}>

        <div className="w-16 h-16" >
          <div className='absolute w-1 h-8 bg-brick-light mt-0 ml-3'></div>
          <div className='absolute w-1 h-8 bg-brick-light mt-0 ml-11'></div>
          <div className="absolute w-8 h-8 bg-transparent ml-3 mt-0 border-b-4 border-brick-light " >
            {bg === 1 && (
              <div className="h-full w-7 bg-brick-dark ml-1">
                <div className="h-4 w-full border-b-4 border-black mt-0">
                  <div className="h-full border-l-4 ml-3 border-black">
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="absolute w-3 h-8 bg-brick-dark ml-0 mt-0 border-b-4 border-t-4 border-black border-t-brick-light" ></div>
          <div className="absolute w-4 h-8 bg-brick-dark ml-12 mt-0 border-b-4 border-t-4 border-black border-t-brick-light"></div>

          <div className="h-4 w-full border-b-4 border-black mt-4">
            <div className="h-full w-9 border-r-4 border-l-4 ml-3 border-black">
            </div>
          </div>
          <div className="h-4 w-full border-r-4 border-b-4 border-black bg-brick-dark">
            <div className="h-full w-8 border-r-4 border-black">
            </div>
          </div>
          <div className="h-4 w-full border-b-4 border-black bg-brick-dark">
            <div className="h-full w-9 border-r-4 border-l-4 ml-3 border-black">
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Roof
