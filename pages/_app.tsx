import { useRouter } from "next/router";
import { useEffect } from "react";
import { AppProps } from "next/app";

import IntlProvider from "@components/IntlProvider";
import App from "@components/App";
import * as gtag from "@lib/gtag";

import "../styles/globals.css";

function Root(props: AppProps) {
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
    <IntlProvider messages={props.pageProps.lngDict}>
      <App {...props} />
    </IntlProvider>
  );
}

export default Root;
