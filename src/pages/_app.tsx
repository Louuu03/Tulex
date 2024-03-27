// pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import '../styles/globals.scss';
import HeaderComponent from '@/components/commmon/header';
import Navbar from '@/components/commmon/navbar';
import fakedata from '@/utils/fakedata';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Head>
        <title>Tulex </title>
        <link rel='icon' href='/pictures/Icon.webp' type='image/webp' />
        <meta
          name='description'
          content='Join Tulex, the ultimate platform for language learners. Engage in themed writing challenges and real-time speaking exchanges to improve your skills. With feedback, leaderboards, and diverse content powered by the ChatGPT API, Tulex offers a unique blend of learning, competition, and social interaction. Start your language journey with Tulex today!'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='robots' content='index, follow' />
        <meta
          property='og:title'
          content='Tulex: The Ultimate Language Exchange Platform'
        />
        <meta
          property='og:description'
          content='Improve your language skills with Tulex through writing and speaking exchanges. Engage in themed challenges, receive feedback, and connect with learners worldwide.'
        />
        <meta property='og:type' content='website' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content='Tulex: The Ultimate Language Exchange Platform'
        />
        <meta
          name='twitter:description'
          content='Improve your language skills with Tulex through writing and speaking exchanges. Engage in themed challenges, receive feedback, and connect with learners worldwide.'
        />
      </Head>

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
