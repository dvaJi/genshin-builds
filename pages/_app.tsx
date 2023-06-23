import { AppProps as NextAppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";

import App from "@components/App";
import IntlProvider from "@components/IntlProvider";
import * as gtag from "@lib/gtag";

import "../styles/globals.css";
import "../styles/hsr-globals.css";

const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type AppProps<P = any> = { pageProps: P } & Omit<NextAppProps<P>, "pageProps">;

type Props = {
  lngDict?: Record<string, string>;
  common?: Record<string, string>;
};

function Root(props: AppProps<Props>) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
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
      {process.env.NEXT_PUBLIC_FRST_PLACEMENTS &&
        process.env.NEXT_PUBLIC_FRST_PLACEMENTS.split(",").map((name) => (
          <FrstAds key={name} placementName={name} />
        ))}
      <App {...props} />
    </IntlProvider>
  );
}

export default Root;
