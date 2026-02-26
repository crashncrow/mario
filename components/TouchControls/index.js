import { useEffect, useState } from 'react'

const TouchControls = ({ gameLoopEnabled, setLoopInput }) => {
  const [isMobileLike, setIsMobileLike] = useState(false)
  const [pressed, setPressed] = useState({
    left: false,
    right: false,
    jump: false,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(pointer: coarse)')
    const update = () => {
      setIsMobileLike(media.matches || window.innerWidth < 768)
    }

    update()
    media.addEventListener?.('change', update)
    window.addEventListener('resize', update)

    return () => {
      media.removeEventListener?.('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  if (!gameLoopEnabled || !isMobileLike) return null

  const press = (key, nextInput) => e => {
    const value = Boolean(nextInput[key])
    setPressed(prev => (prev[key] === value ? prev : { ...prev, [key]: value }))
    setLoopInput(nextInput)
  }

  return (
    <div className='fixed inset-x-0 bottom-4 px-4 flex items-end justify-between pointer-events-none' style={{ zIndex: 70 }}>
      <div className='flex gap-3 pointer-events-auto'>
        <button
          type='button'
          className={`w-14 h-14 border-2 text-xl transition-colors ${
            pressed.left ? 'bg-white text-black border-white' : 'bg-black/80 text-white border-white'
          }`}
          style={{ touchAction: 'none' }}
          onTouchStart={press('left', { left: true })}
          onTouchEnd={press('left', { left: false })}
          onTouchCancel={press('left', { left: false })}
          onMouseDown={press('left', { left: true })}
          onMouseUp={press('left', { left: false })}
          onMouseLeave={press('left', { left: false })}
        >
          ←
        </button>
        <button
          type='button'
          className={`w-14 h-14 border-2 text-xl transition-colors ${
            pressed.right ? 'bg-white text-black border-white' : 'bg-black/80 text-white border-white'
          }`}
          style={{ touchAction: 'none' }}
          onTouchStart={press('right', { right: true })}
          onTouchEnd={press('right', { right: false })}
          onTouchCancel={press('right', { right: false })}
          onMouseDown={press('right', { right: true })}
          onMouseUp={press('right', { right: false })}
          onMouseLeave={press('right', { right: false })}
        >
          →
        </button>
      </div>

      <div className='pointer-events-auto'>
        <button
          type='button'
          className={`min-w-20 h-14 px-4 border-2 text-sm transition-colors ${
            pressed.jump ? 'bg-white text-black border-white' : 'bg-black/80 text-white border-white'
          }`}
          style={{ touchAction: 'none' }}
          onTouchStart={press('jump', { jump: true })}
          onTouchEnd={press('jump', { jump: false })}
          onTouchCancel={press('jump', { jump: false })}
          onMouseDown={press('jump', { jump: true })}
          onMouseUp={press('jump', { jump: false })}
          onMouseLeave={press('jump', { jump: false })}
        >
          Jump
        </button>
      </div>
    </div>
  )
}

export default TouchControls
