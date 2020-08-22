import Head from 'next/head'
import Mario from 'components/Mario'
import Floor from 'components/Floor'
import Pipe from 'components/Pipe'
import Cloud from 'components/Cloud'

export default function Home() {
  return (
    <>
    <div className="h-screen overflow-x-scroll">
      <Head>
        <title>It's Me, Mario!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full w-full">
        <Cloud position={10}/>
        <Cloud position={20}/>
        <Mario />
        <div className="inline-block">  
          
          <Pipe position={10} size={1}/>
          <Pipe position={20} size={2}/>
          <Pipe position={30} size={3}/>
          
        </div>
        <Floor />
      </main>
      
    </div>
    
    </>
  )
}
