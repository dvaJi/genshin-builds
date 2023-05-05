import dynamic from "next/dynamic";
import { AppProps as NextAppProps } from "next/app";

import LayoutGenshin from "@components/genshin/Layout";
import TOFLayout from "@components/tof/Layout";
import HSRLayout from "@components/hsr/Layout";

import { isHSR, isTOF } from "@utils/games";
import { AppBackgroundStyle } from "@state/background-atom";

const FeedbackAlert = dynamic(() => import("./FeedbackAlert"), {
  ssr: false,
});

type AppProps<P = any> = { pageProps: P } & Omit<NextAppProps<P>, "pageProps">;

type Props = {
  lngDict?: Record<string, string>;
  bgStyle?: AppBackgroundStyle;
};

const App = ({ Component, pageProps, router }: AppProps<Props>) => {
  // Render the correct layout based on the game
  if (isTOF(router.route)) {
    return (
      <TOFLayout bgStyle={pageProps?.bgStyle}>
        <FeedbackAlert />
        <Component {...pageProps} />
      </TOFLayout>
    );
  }

  if (isHSR(router.route)) {
    return (
      <HSRLayout bgStyle={pageProps?.bgStyle}>
        <FeedbackAlert />
        <Component {...pageProps} />
      </HSRLayout>
    );
  }

  // Render Genshin Layout by default
  return (
    <LayoutGenshin bgStyle={pageProps?.bgStyle}>
      <FeedbackAlert />
      <Component {...pageProps} />
    </LayoutGenshin>
  );
};

export default App;
