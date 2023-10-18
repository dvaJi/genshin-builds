import { AppProps as NextAppProps } from "next/app";
import { Noto_Sans } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";

import App from "@components/App";
import IntlProvider from "@components/IntlProvider";
import * as gtag from "@lib/gtag";
import { Session } from "@lib/session";

import "../styles/globals.css";
import "../styles/hsr-globals.css";

const notoSans = Noto_Sans({
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans",
  subsets: ["latin", "latin-ext", "vietnamese"],
});

type AppProps<P = any> = { pageProps: P } & Omit<NextAppProps<P>, "pageProps">;

type Props = {
  lngDict?: Record<string, string>;
  common?: Record<string, string>;
  session?: Session;
};

function Root(props: AppProps<Props>) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
      if (
        typeof window !== "undefined" &&
        typeof window.freestar !== "undefined"
      ) {
        freestar.queue.push(function () {
          freestar.trackPageview();
        });
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <IntlProvider
      common={props.pageProps.common}
      messages={props.pageProps.lngDict}
      locale={router.locale}
    >
      <App
        {...props}
        pageProps={{
          ...props.pageProps,
          fontClass: `${notoSans.variable} font-sans`,
        }}
      />
    </IntlProvider>
  );
}

export default Root;
