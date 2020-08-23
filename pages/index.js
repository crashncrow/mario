import { useEffect } from 'react'
import Head from 'next/head'
import Mario from 'components/Mario'
import Floor from 'components/Floor'
import Pipe from 'components/Pipe'
import Cloud from 'components/Cloud'

import { useAppContext } from 'contexts/AppContext'

export default function Home() {
  const { bottom, setBottom } = useAppContext()

  const trackClick = (e) => {
    console.log(e)
    setBottom(bottom + 100)

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
        <Cloud position={8}/>
        <Cloud position={22}/>
        <Cloud position={29}/>

        <Mario />
        <div className="inline-block">  
          
          <Pipe position={10} size={1}/>
          <Pipe position={20} size={2}/>
          <Pipe position={30} size={3}/>
          
        </div>
      </main>
      
    </div>
    <Floor />
    </>
  )
}
