import Head from "next/head";
import { AppProps } from "next/app";
import { useRecoilValue } from "recoil";

import LayoutHeader from "@components/LayoutHeader";
import LayoutFooter from "@components/LayoutFooter";

import { appBackgroundStyleState } from "@state/background-atom";

const App = ({ Component, pageProps }: AppProps) => {
  const appBackgroundStyle = useRecoilValue(appBackgroundStyleState);

  return (
    <>
      <div className="flex min-h-screen flex-col h-full bg-vulcan-900">
        <Head>
          <title>Genshin Builds | Genshin Impact Wiki Database</title>
          <script
            data-ad-client="ca-pub-8563239116285713"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
          <meta
            property="og:title"
            content="Genshin Builds | Genshin Impact Wiki Database"
          />
          <meta
            property="twitter:title"
            content="Genshin Builds | Genshin Impact Wiki Database"
          />
          <meta
            name="description"
            content="Learn about every character in Genshin Impact including their skills, talents, builds, and tier list."
          />
          <meta
            property="og:description"
            content="Learn about every character in Genshin Impact including their skills, talents, builds, and tier list."
          />
          <meta
            property="twitter:description"
            content="Learn about every character in Genshin Impact including their skills, talents, builds, and tier list."
          />
        </Head>
        <LayoutHeader />
        <div className="flex flex-col">
          <div className="absolute top-12 pointer-events-none left-0 right-0 bottom-0 flex items-start justify-center overflow-hidden z-0">
            {appBackgroundStyle.image && (
              <img className="w-full" src={appBackgroundStyle.image} />
            )}
          </div>
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ ...appBackgroundStyle.gradient }}
          ></div>
        </div>
        <main className="container mb-8 mx-auto z-10 text-gray-400">
          <Component {...pageProps} />
        </main>
      </div>
      <LayoutFooter />
    </>
  );
};

export default App;
