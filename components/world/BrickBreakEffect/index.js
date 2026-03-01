import { useEffect, useState } from 'react'

const PIECES = [
  { key: 'tl', startLeft: 8, startBottom: 36, endX: -18, endY: 40 },
  { key: 'tr', startLeft: 40, startBottom: 36, endX: 18, endY: 40 },
  { key: 'bl', startLeft: 8, startBottom: 8, endX: -28, endY: -36 },
  { key: 'br', startLeft: 40, startBottom: 8, endX: 28, endY: -36 },
]

const FragmentPiece = ({ piece, active }) => (
  <div
    className='absolute h-4 w-4 bg-brick-dark border-r-2 border-b-2 border-black'
    style={{
      left: `${piece.startLeft}px`,
      bottom: `${piece.startBottom}px`,
      transform: active
        ? `translate(${piece.endX}px, ${piece.endY}px)`
        : 'translate(0, 0)',
      transition: 'transform 420ms ease-out, opacity 420ms linear',
      opacity: active ? 0 : 1,
    }}
  >
    <div className='h-1 w-full bg-brick-light' />
    <div className='h-3 w-full border-l-2 border-black' />
  </div>
)

const BrickBreakEffect = () => {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setActive(true)
    })

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className='relative h-16 w-16 pointer-events-none'>
      {PIECES.map(piece => (
        <FragmentPiece key={piece.key} piece={piece} active={active} />
      ))}
    </div>
  )
}

export default BrickBreakEffect
