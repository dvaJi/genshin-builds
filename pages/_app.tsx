import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "../styles/globals.css";
import { LayoutHeader } from "../components/LayoutHeader";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <RecoilRoot>
        <div className="flex h-screen bg-vulcan-900">
          <LayoutHeader />
          <div className="flex flex-col flex-1 w-full">
            <header className="z-10 py-4 shadow-md bg-vulcan-800">
              <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-300">
                <div className="flex justify-center flex-1 lg:mr-32">
                  <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
                    Patch version 1.1
                  </div>
                </div>
              </div>
            </header>
            <main className="h-full overflow-y-auto">
              <div className="container px-6 mx-auto grid">
                <Component {...pageProps} />
              </div>
            </main>
          </div>
        </div>
      </RecoilRoot>
    </DndProvider>
  );
}

export default MyApp;
