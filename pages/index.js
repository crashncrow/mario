import { useEffect } from 'react'
import Head from 'next/head'
import Sky from 'components/Sky'
import Mario from 'components/Mario'
import Floor from 'components/Floor'
import Pipe from 'components/Pipe'
import Plants from 'components/Plants'
import Brick from 'components/Brick'

import { useAppContext } from 'contexts/AppContext'

const purge = [
  'w-1', 'w-2', 'w-3', 'w-4', 'w-5', 'w-6', 'w-7', 'w-8', 
  'w-9', 'w-10', 'w-11', 'w-12','w-13', 'w-14', 'w-15', 
  'w-16', 'w-17', 'w-18', 'w-19', 'w-20', 'w-21', 'w-22',
  'w-23', 'w-24', 'w-25', 'w-26', 'w-27', 'w-28', 'w-29', 
  'w-30', 'w-31', 'w-32', 'w-48', 'w-64'
]

export default function Home() {
  const { bottom, setBottom } = useAppContext()

  const trackClick = (e) => {
    console.log(e)
    setBottom(bottom + 200)

    setTimeout(() => setBottom(0), 200)
  }

  useEffect(() => {
    document.addEventListener('click', trackClick)
    return () => {
        document.removeEventListener('click', trackClick);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    <div className="h-screen overflow-x-scroll">
      <Head>
        <title>It's Me, Mario!</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <main className="h-full w-full">
        <Mario />
        <Sky />
        <Plants />

        <Brick position={9} size={1}/>
        <Brick position={11} size={1}/>

        <div className="inline-block">            
          <Pipe position={29} size={1}/>                    
          <Pipe position={39} size={2}/>
          <Pipe position={47} size={3}/>
          <Pipe position={58} size={3}/>
        </div>
      </main>
    </div>
    <Floor />
    </>
  )
}
