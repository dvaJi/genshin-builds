import { memo, useState } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { RecoilRoot, useRecoilValue } from "recoil";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { LayoutHeader } from "../components/LayoutHeader";
import { LayoutFooter } from "../components/LayoutFooter";

import { appBackgroundStyleState } from "../state/background-atom";

import "../styles/globals.css";

function Root(props: AppProps) {
  const [theme, setTheme] = useState("dark");

  return (
    <div className={theme}>
      <DndProvider backend={HTML5Backend}>
        <RecoilRoot>
          <App themeState={{ theme, setTheme }} {...props} />
        </RecoilRoot>
      </DndProvider>
    </div>
  );
}

const App = memo(
  ({ themeState, Component, pageProps }: AppProps & { themeState: any }) => {
    const appBackgroundStyle = useRecoilValue(appBackgroundStyleState);
    const onToggleTheme = () =>
      themeState.setTheme(themeState.theme === "light" ? "dark" : "light");
    return (
      <>
        <div className="flex min-h-screen flex-col h-full bg-gray-50 dark:bg-vulcan-900">
          <Head>
            <title>Genshin Builds | Genshin Impact Wiki Database</title>
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
          <LayoutHeader
            onToggleTheme={onToggleTheme}
            theme={themeState.theme}
          />
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
          <main className="container mb-8 mx-auto z-10 text-gray-800 dark:text-gray-400">
            <Component {...pageProps} />
          </main>
        </div>
        <LayoutFooter />
      </>
    );
  }
);

export default Root;
