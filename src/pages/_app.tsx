import type { AppProps } from 'next/app';
import GlobalStyle from '@/styles/GlobalStyle';
import { Navbar } from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { AppProvider } from '@/context/AppContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <GlobalStyle />

      <Navbar />
      <Component {...pageProps} />
      <Footer />

    </AppProvider>
  )

}

export default MyApp;