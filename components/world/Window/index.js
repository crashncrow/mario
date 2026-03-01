import { useAppContext } from 'contexts/AppContext'

const Window = ({x, y, left = 1}) => {
  const { pixels } = useAppContext()
  const marginClass = left ? 'ml-8' : 'ml-0'

  return (
    <>
      <div 
        className={`flex flex-wrap absolute bg-transparent bottom-0`} 
        style={{left: `${x * pixels}px`, bottom: `${(y * pixels)}px`}}>

        <div className="w-16 h-16" >          
          <div className={`absolute w-8 h-16 bg-black mt-0 ${marginClass}`}></div>
        </div>
      </div>
    </>
  )
}

export default Window
