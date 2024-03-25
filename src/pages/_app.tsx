// pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import '../styles/globals.scss';
import HeaderComponent from '@/components/commmon/header';
import Navbar from '@/components/commmon/navbar';
import fakedata from '@/utils/fakedata';
import { UserProvider } from '@/hooksAndContext/userContext';
import { TokenProvider } from '@/hooksAndContext/tokenContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <TokenProvider>
        <UserProvider>
          <HeaderComponent
            userName={fakedata.currentUser.name}
            userImage={fakedata.currentUser.image}
          />
          <Component {...pageProps} />
          <Navbar />
        </UserProvider>
      </TokenProvider>
    </ChakraProvider>
  );
}

export default MyApp;
