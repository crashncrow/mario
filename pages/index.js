import Head from 'next/head'
import Mario from 'components/Mario'

export default function Home() {
  return (
    <div className='h-screen overflow-x-scroll'>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-blue-500 h-full w-full text-center p-32'>
        <Mario />
      </main>
    </div>
  )
}
