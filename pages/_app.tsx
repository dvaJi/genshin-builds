import { useRouter } from "next/router";
import { useEffect } from "react";
import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import IntlProvider from "@components/IntlProvider";
import App from "@components/App";
import * as gtag from "@lib/gtag";
import client from "@lib/apollo-client";

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
      <ApolloProvider client={client}>
        <App {...props} />
      </ApolloProvider>
    </IntlProvider>
  );
}

export default Root;
