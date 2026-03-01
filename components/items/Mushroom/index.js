const Mushroom = ({ moving = false }) => (
  <div className='relative w-16 h-16'>
    <div className='absolute left-6 top-1 w-4 h-2 bg-mystery-yellow'></div>
    <div className='absolute left-5 top-2 w-6 h-2 bg-mystery-yellow border-r-9 border-mario-red'></div>
    <div className='absolute left-4 top-3 w-8 h-2 bg-mystery-yellow border-r-16 border-mario-red'></div>
    <div className='absolute left-3 top-4 w-10 h-2 bg-mystery-yellow border-r-20 border-mario-red'></div>
    <div className='absolute left-2 top-5 w-12 h-2 bg-mystery-yellow'>
      <div className='absolute bg-mario-red w-3 h-1 left-7'></div>
    </div>

    <div className='absolute left-1 top-6 w-14 h-2 bg-mystery-yellow'>
      <div className='absolute bg-mario-red w-3 h-1 left-2 top-1'></div>
    </div>
    
    <div className='absolute top-8 w-full h-4 bg-mystery-yellow'>
      <div className='absolute bg-mario-red w-5 h-2 left-2 top-0'></div>
      <div className='absolute bg-mario-red w-3 h-1 left-3 top-2'></div>
      
      <div className='absolute bg-mario-red w-2 h-1 left-12 top-0'></div>
      <div className='absolute bg-mario-red w-3 h-1 left-12 top-1'></div>
      <div className='absolute bg-mario-red w-2 h-1 left-13 top-2'></div>
    </div>

    <div className='absolute left-1 top-12 w-14 h-1 bg-mystery-yellow pr-1 pl-1'>
      <div className='bg-mario-red w-full h-full pr-3 pl-3'>
        <div className="bg-white w-full h-full"></div>
      </div>
    </div>

    <div className='absolute left-4 top-13 w-8 h-3 bg-white'>
      <div className='absolute left-6 top-1 w-1 h-2 bg-mystery-yellow'></div>
    </div>
    <div className='absolute left-5 top-16 w-6 h-1 bg-white'>
      <div className='absolute left-4 top-0 w-1 h-1 bg-mystery-yellow'></div>
    </div>
  </div>
)

export default Mushroom
