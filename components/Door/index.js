import { useAppContext } from 'contexts/AppContext'

const Door = ({x, y}) => {
  const { pixels } = useAppContext()

  return (
    <>
      <div 
        className={`flex flex-wrap absolute bg-transparent bottom-0`} 
        style={{left: `${x * pixels}px`, bottom: `${(y * pixels)}px`}}>
        
        <div className="w-16 h-16" >          
          <div className={`absolute w-6 h-1 bg-black mt-0 ml-5`}></div>
          <div className={`absolute w-10 h-1 bg-black mt-1 ml-3`}></div>
          <div className={`absolute w-12 h-1 bg-black mt-2 ml-2`}></div>
          <div className={`absolute w-14 h-3 bg-black mt-3 ml-1`}></div>
          <div className={`absolute w-16 h-10 bg-black mt-6 ml-0`}></div>
        </div>
        <div className="w-16 h-16" >          
          <div className={`absolute w-16 h-16 bg-black`}></div>
        </div>
      </div>
    </>
  )
}

export default Door
