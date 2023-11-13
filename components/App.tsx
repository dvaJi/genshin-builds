import { AppProps as NextAppProps } from "next/app";
import dynamic from "next/dynamic";

import LayoutGenshin from "@components/genshin/Layout";
import HSRLayout from "@components/hsr/Layout";
import TOFLayout from "@components/tof/Layout";

import { Session } from "@lib/session";
import { AppBackgroundStyle } from "@state/background-atom";
import { isHSR, isTOF } from "@utils/games";

const FeedbackAlert = dynamic(() => import("./FeedbackAlert"), {
  ssr: false,
});

type AppProps<P = any> = { pageProps: P } & Omit<NextAppProps<P>, "pageProps">;

type Props = {
  lngDict?: Record<string, string>;
  bgStyle?: AppBackgroundStyle;
  fontClass?: string;
  session?: Session;
};

const App = ({ Component, pageProps, router }: AppProps<Props>) => {
  // Tower of Fantasy
  if (isTOF(router.route)) {
    return (
      <TOFLayout bgStyle={pageProps?.bgStyle} fontClass={pageProps?.fontClass}>
        <FeedbackAlert />
        <Component {...pageProps} />
      </TOFLayout>
    );
  }

  // Honkai Star Rail
  if (isHSR(router.route)) {
    return (
      <HSRLayout bgStyle={pageProps?.bgStyle} fontClass={pageProps?.fontClass}>
        <FeedbackAlert />
        <Component {...pageProps} />
      </HSRLayout>
    );
  }

  // Render Genshin Layout by default
  return (
    <LayoutGenshin
      bgStyle={pageProps?.bgStyle}
      fontClass={pageProps?.fontClass}
    >
      <FeedbackAlert />
      <Component {...pageProps} />
    </LayoutGenshin>
  );
};

export default App;
