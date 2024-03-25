// pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import '../styles/globals.scss';
import HeaderComponent from '@/components/commmon/header';
import Navbar from '@/components/commmon/navbar';
import fakedata from '@/utils/fakedata';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
          <HeaderComponent
            userName={fakedata.currentUser.name}
            userImage={fakedata.currentUser.image}
          />
          <Component {...pageProps} />
          <Navbar />
    </ChakraProvider>
  );
}

export default MyApp;
