const size = 64

const Brick = ({x, y}) => {
  return (
    <>
      <div 
        className={`flex flex-wrap absolute bg-brick-dark border-b-4 border-black bottom-0`} 
        style={{left: `${x * size}px`, bottom: `${(y * size)}px`}}>

        <div className="flex flex-wrap w-16 h-15" >
          <div className="h-full w-full border-t-4 border-brick-light">
            <div className="h-3 w-full border-r-4 border-b-4 border-black">
              <div className="h-full w-8 border-r-4 border-black">
              </div>
            </div>  
            <div className="h-4 w-full border-b-4 border-black">
              <div className="h-4 w-9 border-r-4 border-l-4 ml-3 border-black">
              </div>
            </div>
            <div className="h-4 w-full border-r-4 border-b-4 border-black">
              <div className="h-full w-8 border-r-4 border-black">
              </div>
            </div>
            <div className="h-4 w-full border-b-4 border-black">
              <div className="h-full w-9 border-r-4 border-l-4 ml-3 border-black">
              </div>
            </div>
          </div>    
        </div>
      </div>
    
    </>
  )
}

export default Brick
