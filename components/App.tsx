import { AppProps as NextAppProps } from "next/app";
import dynamic from "next/dynamic";

import LayoutGenshin from "@components/genshin/Layout";

import { Session } from "@lib/session";
import { AppBackgroundStyle } from "@state/background-atom";

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

const App = ({ Component, pageProps }: AppProps<Props>) => {
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
