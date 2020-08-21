import Head from 'next/head'
import Mario from 'components/Mario'

export default function Home() {
  return (
    <div className="h-screen overflow-x-scroll">
      <Head>
        <title>It's Me, Mario!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-blue-500 h-full w-full text-center pt-32">
        <Mario />
      </main>
    </div>
  )
}
