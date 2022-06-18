import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import { Navbar } from '@/components/common/Header';
import Footer from '@/components/common/Footer';

import { AppProvider } from '@/context/AppContext';
import { EmailProvider } from '@/context/EmailProvider';

import GlobalStyle from '@/styles/GlobalStyle';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/context/AuthContainer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <AuthProvider>
        <EmailProvider>
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
        </EmailProvider>
      </AuthProvider>
    </AppProvider>
  )

}

export default MyApp;