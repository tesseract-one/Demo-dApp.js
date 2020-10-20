import React from 'react'
import type { AppProps /*, AppContext */ } from 'next/app'

// Global Styles
import '../assets/styles/global.scss'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App