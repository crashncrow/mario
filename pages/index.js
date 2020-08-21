import Head from 'next/head'

// 0 - transparente
// 1 - rojo
// 2 - marron
// 3 - amarillo
const c = {
  0: 'bg-transparent',
  1: 'bg-red-500',
  2: 'bg-yellow-700',
  3: 'bg-yellow-500'
}

const m1 = [
  0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
  0, 0, 2, 2, 2, 3, 3, 2, 3, 0, 0, 0,
  0, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 0,
  0, 2, 3, 2, 2, 3, 3, 1, 2, 3, 3, 3,
  0, 2, 2, 1, 1, 3, 3, 2, 2, 2, 2, 0,
  0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0,
  0, 0, 2, 2, 1, 2, 2, 2, 0, 0, 0, 0,
  0, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 0,
  2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2,
  3, 3, 2, 1, 3, 1, 1, 3, 1, 2, 3, 3,
  3, 3, 3, 1, 1, 1, 1, 1, 1, 3, 3, 3,
  3, 3, 1, 1, 1, 0, 0, 1, 1, 1, 3, 3,
  0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0,
  0, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 0,
  2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2
]

export default function Home() {
  return (
    <div className='h-full overflow-x-scroll'>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-blue-500 h-screen w-full text-center p-32'>
        <div className='flex flex-wrap m-auto w-48'>
          {m1.map((x, i) => (
            <div 
              className={`h-4 w-4 border flex-none ${c[x]}`}
              key={`mario_${i}`}
              >
              </div>
          ))}
        </div>
      </main>
    </div>
  )
}
