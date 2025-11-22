import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SoundProvider } from '@/hooks/useSoundEffects';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>FrogTV Live - Watch Frogs Watch TV</title>
        <meta name="description" content="Three frogs sit on a couch watching TV. You watch them. They react to you. It's absurd. It's mesmerizing. Welcome to FrogTV Live." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/frog-icon.png" />
      </Head>
      <SoundProvider>
        <Component {...pageProps} />
      </SoundProvider>
    </>
  );
}
