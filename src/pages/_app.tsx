import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import { Navbar } from '@/components/common/Header';
import Footer from '@/components/common/Footer';

import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContainer';

import GlobalStyle from '@/styles/GlobalStyle';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <AuthProvider>
        <GlobalStyle />

        <Navbar />
        <Component {...pageProps} />
        <ToastContainer position="top-right"
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          toastStyle={{
            background: "var(--linear)",
            color: "var(--text)",
          }}
        />
        <Footer />
      </AuthProvider>
    </AppProvider>
  )

}

export default MyApp;