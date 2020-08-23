import 'styles/tailwind.css'
import { AppContextProvider } from 'contexts/AppContext'

function MyApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  )
}

export default MyApp
