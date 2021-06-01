import { useAppContext } from 'contexts/AppContext'

const Floor = ({ segments }) => {
  const { renderLimit, pixels } = useAppContext()

  return segments.map((el, i) => (
    <div
      className='absolute bottom-0'
      style={{ left: `${el.x * pixels}px` }}
      key={i}
    >
      <div className='inline-flex'>
        {Array(Math.min(el.size, parseInt(renderLimit / pixels)))
          .fill(1)
          .map((ele, j) => (
            <div
              className={`flex flex-wrap w-16 bg-brick-dark mb-0`}
              key={`floor_${j}}`}
            >
              <div className='flex flex-wrap w-16 h-16'>
                <div className='w-10 h-15 b'>
                  <div className='w-full h-10 border-r-4 border-black'>
                    <div className='h-1 border-l-4 border-brick-dark bg-brick-light'></div>
                    <div className='h-9 border-l-4 border-brick-light'></div>
                  </div>
                  <div className='w-full h-2 border-r-4 border-brick-light'>
                    <div className='flex flex-wrap w-full h-2 border-r-4 border-black'>
                      <div className='w-2 h-2 border-t-4 border-black bg-brick-light'></div>
                      <div className='w-2 h-2 border-b-4 border-black '></div>
                    </div>
                  </div>

                  <div className='w-full h-3'>
                    <div className='w-9 h-3 border-l-4 border-r-4 border-brick-light pl-1'>
                      <div className='h-1 bg-brick-light pl-2'>
                        <div className='h-3 bg-black pt-1 pr-1'>
                          <div className='h-2 bg-brick-light border-b-4 border-brick-dark'></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='w-6'>
                  <div className='h-1 w-full border-l-4 border-r-4 border-brick-dark bg-brick-light'></div>
                  <div className='h-4 w-5 border-l-4 border-brick-light'>
                    <div className='h-4 w-5 border-r-4 border-black'>
                      <div className='pt-3 h-1 w-1 border-b-4 border-black'></div>
                    </div>
                  </div>
                  <div className='h-1 w-full border-l-4 border-r-4 border-brick-dark bg-black'></div>
                  <div className='h-9 w-full border-r-4 border-black'>
                    <div className='h-4 w-full border-l-4 border-t-4 border-brick-light'></div>
                    <div className='h-1 w-1 ml-4 mt-4 bg-black'></div>
                  </div>
                </div>

                <div className='flex flex-wrap w-full h-1 border-l-4 border-r-4 border-brick-dark bg-black'>
                  <div className='ml-6 h-1 w-1 bg-brick-dark'></div>
                  <div className='h-1 w-1 bg-brick-light'></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  ))
}

export default Floor
