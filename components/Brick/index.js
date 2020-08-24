const Brick = ({position, size}) => {
  return (
    <>
    
      <div className={`flex flex-wrap absolute bg-orange-500 border-b-4 border-black mb-24 top-0 mt-64`} style={{left: `${position * 64}px`, width:  `${size * 64}px`}}>
      {
      Array(size).fill(1).map((x, k) => (
        <div className="flex flex-wrap w-16 h-15" key={`bricks_${k}`}>
          <div className="h-full w-full border-t-4 border-yellow-200">
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
          ))
        }
      </div>
    
    </>
  )
}

export default Brick
