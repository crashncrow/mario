import 'styles/tailwind.css'
import localFont from 'next/font/local'
import { AppContextProvider } from 'contexts/AppContext'

const pressStart2P = localFont({
  src: '../public/fonts/press-start-2p-latin-400-normal.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
})

function MyApp({ Component, pageProps }) {
  return (
    <div className={pressStart2P.className}>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </div>
  )
}

export default MyApp
