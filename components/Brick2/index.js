import { useAppContext } from 'contexts/AppContext'

const Brick2 = ({x, y}) => {
  const { pixels } = useAppContext()

  return (
    <>
      <div 
        className={`flex flex-wrap absolute bg-black bottom-0`} 
        style={{left: `${x * pixels}px`, bottom: `${(y * pixels)}px`}}>

        <div className="w-16 h-16" >
          <div className="absolute w-15 h-1 border-l-4 border-brick-dark bg-brick-light"></div>
          <div className="absolute w-13 h-1 border-l-4 border-brick-dark bg-brick-light ml-1 mt-1"></div>
          <div className="absolute w-11 h-1 border-l-4 border-brick-dark bg-brick-light ml-2 mt-2"></div>
          <div className="absolute w-9 h-1 border-l-4 border-brick-dark bg-brick-light ml-3 mt-3"></div>
          
          <div className='absolute w-1 h-14 bg-brick-light mt-1 ml-0'></div>
          <div className='absolute w-1 h-12 bg-brick-light mt-2 ml-1'></div>
          <div className='absolute w-1 h-10 bg-brick-light mt-3 ml-2'></div>
          <div className='absolute w-1 h-8 bg-brick-light mt-4 ml-3'></div>
          
          

          <div className='absolute w-1 h-1 bg-brick-dark right-0 bottom-0 mr-0 mb-0'></div>
          <div className='absolute w-1 h-1 bg-brick-dark right-0 bottom-0 mr-1 mb-1'></div>
          <div className='absolute w-1 h-1 bg-brick-dark right-0 bottom-0 mr-2 mb-2'></div>
          <div className='absolute w-1 h-1 bg-brick-dark right-0 bottom-0 mr-3 mb-3'></div>

          <div className="w-8 h-8 bg-brick-dark m-4"></div>
        </div>
      </div>
    </>
  )
}

export default Brick2
