import { AppProps as NextAppProps } from "next/app";
import dynamic from "next/dynamic";

import AdminLayout from "@components/admin/Layout";
import LayoutGenshin from "@components/genshin/Layout";
import HSRLayout from "@components/hsr/Layout";
import TOFLayout from "@components/tof/Layout";

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
};

const App = ({ Component, pageProps, router }: AppProps<Props>) => {
  // Render the correct layout based on the game
  if (isTOF(router.route)) {
    return (
      <TOFLayout bgStyle={pageProps?.bgStyle} fontClass={pageProps?.fontClass}>
        <FeedbackAlert />
        <Component {...pageProps} />
      </TOFLayout>
    );
  }

  if (isHSR(router.route)) {
    return (
      <HSRLayout bgStyle={pageProps?.bgStyle} fontClass={pageProps?.fontClass}>
        <FeedbackAlert />
        <Component {...pageProps} />
      </HSRLayout>
    );
  }

  // Admin
  if (router.route.startsWith("/admin")) {
    return (
      <AdminLayout
        bgStyle={pageProps?.bgStyle}
        fontClass={pageProps?.fontClass}
      >
        <Component {...pageProps} />
      </AdminLayout>
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
