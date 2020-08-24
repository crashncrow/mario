import { useEffect } from 'react'
import Head from 'next/head'
import Mario from 'components/Mario'
import Floor from 'components/Floor'
import Pipe from 'components/Pipe'
import Cloud from 'components/Cloud'
import Bush from 'components/Bush'

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
    setBottom(bottom + 130)

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
        <Cloud position={9} size={1}/>
        <Cloud position={20} size={1}/>
        <Cloud position={29} size={3}/>
        <Cloud position={38} size={2}/>
        <Cloud position={58} size={1}/>
        <Cloud position={68} size={1}/>
        <Cloud position={78} size={3}/>
        <Cloud position={86} size={2}/>
        <Cloud position={105} size={1}/>
        <Cloud position={116} size={1}/>
        <Cloud position={122} size={3}/>
        <Cloud position={130} size={2}/>

        <Mario />
        <div className="inline-block">  
          
          <Bush position={12} size={3}/>

          <Bush position={24} size={1}/>
          
          <Pipe position={29} size={1}/>
                    
          <Pipe position={39} size={2}/>

          <Bush position={42} size={2}/>

          <Pipe position={47} size={3}/>

          <Pipe position={58} size={3}/>

          <Bush position={60} size={3}/>

          <Bush position={71} size={1}/>

          <Bush position={90} size={2}/>

          <Bush position={108} size={3}/>

          <Bush position={118} size={1}/>

          <Bush position={134} size={2}/>
          
        </div>
      </main>
      
    </div>
    <Floor />
    </>
  )
}
