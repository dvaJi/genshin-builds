import { AppProps } from "next/app";

import LayoutGenshin from "@components/genshin/Layout";
import TOFLayout from "@components/tof/Layout";

import { isTOF } from "@utils/games";

const App = ({ Component, pageProps, router }: AppProps) => {
  // Render the correct layout based on the game
  if (isTOF(router.route)) {
    return (
      <TOFLayout>
        <Component {...pageProps} />
      </TOFLayout>
    );
  }

  // Render Genshin Layout by default
  return (
    <LayoutGenshin>
      <Component {...pageProps} />
    </LayoutGenshin>
  );
};

export default App;
