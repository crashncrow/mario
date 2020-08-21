import Head from 'next/head'
import Mario from 'components/Mario'
import Floor from 'components/Floor'
import Pipe from 'components/Pipe'

export default function Home() {
  return (
    <div className="h-screen overflow-x-scroll bg-blue-500 ">
      <Head>
        <title>It's Me, Mario!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full w-full text-center pt-32">
        <Mario />
        <Pipe />
        <Floor />
      </main>
    </div>
  )
}
