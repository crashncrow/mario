import { useEffect } from 'react'
import Head from 'next/head'
import Sky from 'components/Sky'
import Mario from 'components/Mario'
import Floor from 'components/Floor'
import Pipe from 'components/Pipe'
import Plants from 'components/Plants'
import Brick from 'components/Brick'
import Box from 'components/Box'

import { useAppContext } from 'contexts/AppContext'

const purge = [
  'w-1',  'w-2',  'w-3',  'w-4',  'w-5',  'w-6',  'w-7', 'w-8', 
  'w-9',  'w-10', 'w-11', 'w-12', 'w-13', 'w-14', 'w-15', 
  'w-16', 'w-17', 'w-18', 'w-19', 'w-20', 'w-21', 'w-22',
  'w-23', 'w-24', 'w-25', 'w-26', 'w-27', 'w-28', 'w-29', 
  'w-30', 'w-31', 'w-32', 'w-33', 'w-34', 'w-35', 'w-36', 
  'w-37', 'w-38', 'w-39', 'w-40', 'w-41', 'w-42', 'w-43', 
  'w-44', 'w-45', 'w-46', 'w-47', 'w-48', 'w-49', 'w-50', 
  'w-51', 'w-52', 'w-53', 'w-54', 'w-55', 'w-56', 'w-57', 
  'w-58', 'w-59', 'w-60', 'w-61', 'w-62', 'w-63', 'w-64', 
  'w-65', 'w-66', 'w-67', 'w-68', 'w-69', 'w-70', 'w-71', 
  'w-72', 'w-73', 'w-74', 'w-75', 'w-76', 'w-77', 'w-78', 
  'w-79', 'w-80', 

  'ml-9', 'ml-10', 'ml-11', 'ml-12', 'ml-13', 'ml-14', 'ml-15', 
  'ml-16', 'ml-17', 'ml-18', 'ml-19', 'ml-20', 'ml-21', 'ml-22',
  'ml-23', 'ml-24', 'ml-25', 'ml-26', 'ml-27', 'ml-28', 'ml-29',
]

export default function Home() {
  const { bottom, setBottom } = useAppContext()

  const trackClick = (e) => {
    console.log(e)
    console.log(bottom)
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

        <Box position={5} size={1}/>

        <Brick position={9} size={1}/>
        <Box position={10} size={1}/>
        <Brick position={11} size={1}/>
        <Box position={12} size={1}/>

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
