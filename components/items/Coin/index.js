const HudCoin = () => (
  <div className='inline-flex flex-col leading-none'>
    <div className='flex justify-center'>
      <div className='h-1 w-1 bg-smb-yellow'></div>
      <div className='h-1 w-2 bg-smb-yellow'></div>
      <div className='h-1 w-1 bg-black'></div>
    </div>
    <div className='flex'>
      <div className='h-1 w-1 bg-smb-yellow'></div>
      <div className='h-1 w-1 bg-smb-orange-light'></div>
      <div className='h-1 w-1 bg-smb-yellow'></div>
      <div className='h-1 w-1 bg-smb-orange-light'></div>
      <div className='h-1 w-1 bg-black'></div>
    </div>
    <div className='flex'>
      <div className='h-1 w-1 bg-smb-yellow'></div>
      <div className='h-1 w-1 bg-smb-yellow'></div>
      <div className='h-1 w-1 bg-smb-orange-light'></div>
      <div className='h-1 w-1 bg-smb-yellow'></div>
      <div className='h-1 w-1 bg-black'></div>
    </div>
    <div className='flex'>
      <div className='h-1 w-1 bg-smb-yellow'></div>
      <div className='h-1 w-1 bg-smb-orange-light'></div>
      <div className='h-1 w-1 bg-smb-yellow'></div>
      <div className='h-1 w-1 bg-smb-orange-light'></div>
      <div className='h-1 w-1 bg-black'></div>
    </div>
    <div className='flex justify-center'>
      <div className='h-1 w-1 bg-smb-yellow'></div>
      <div className='h-1 w-2 bg-smb-yellow'></div>
      <div className='h-1 w-1 bg-black'></div>
    </div>
  </div>
)

const WorldCoin = () => (
  <div className='top-0 left-0 h-16 w-16'>
    <div className='absolute left-8 top-0 h-full w-4 bg-smb-cyan-dark'></div>
    <div className='absolute left-7 top-2 h-12 w-6 bg-smb-cyan-dark'></div>
    <div className='absolute left-6 top-4 h-8 w-8 bg-smb-cyan-dark'></div>

    <div className='absolute left-6 top-0 h-full w-4 bg-smb-yellow'></div>
    <div className='absolute left-5 top-2 h-12 w-6 bg-smb-yellow'></div>
    <div className='absolute left-4 top-4 h-8 w-8 bg-smb-yellow'></div>

    <div className='absolute left-9 top-4 h-8 w-1 bg-smb-cyan-dark'></div>
    <div className='absolute left-6 top-4 h-8 w-1 bg-smb-orange-dark'></div>
    <div className='absolute left-7 top-3 h-1 w-2 bg-smb-orange-dark'></div>
    <div className='absolute left-7 top-12 h-1 w-2 bg-smb-cyan-dark'></div>    
  </div>
)

const SpinCoin = () => (
  // <div className='inline-flex items-end gap-1'>
  //   <div className='h-8 w-1 bg-smb-red'></div>
  //   <div className='h-8 w-1 bg-smb-orange-light'></div>
  //   <div className='h-8 w-1 bg-white'></div>
  //   <div className='relative h-8 w-6'>
  //     <div className='absolute inset-y-0 left-0 w-1 bg-smb-orange-light'></div>
  //     <div className='absolute inset-y-0 left-1 w-1 bg-smb-yellow'></div>
  //     <div className='absolute inset-y-0 left-2 w-2 bg-white'></div>
  //     <div className='absolute inset-y-0 left-4 w-1 bg-smb-orange-light'></div>
  //     <div className='absolute inset-y-0 right-0 w-1 bg-smb-yellow'></div>
  //   </div>
  // </div>
  <HudCoin />
)

const Coin = ({ variant = 'hud' }) => {
  const normalizedVariant = variant === 'pickup' ? 'spin' : variant

  const renderers = {
    hud: () => <HudCoin />,
    spin: () => <SpinCoin />,
    world: () => <WorldCoin />,
  }

  return (renderers[normalizedVariant] ?? renderers.hud)()
}

export default Coin
