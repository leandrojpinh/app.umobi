import type { AppProps } from 'next/app';
import GlobalStyle from '@/styles/GlobalStyle';
import { Navbar } from '@/components/common/Header';
import Footer from '@/components/common/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  )

}

export default MyApp;