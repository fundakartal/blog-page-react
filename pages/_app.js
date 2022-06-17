import Header from '../components/header'
import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <div className='antialiased text-gray-700'>
      <Head>
        <title>My Blog</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Header />
      <main className='mt-6 mb-20'>
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default MyApp
