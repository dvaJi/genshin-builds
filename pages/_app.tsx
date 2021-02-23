import { useRouter } from "next/router";
import { useEffect } from "react";
import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
    <DndProvider backend={HTML5Backend}>
      <RecoilRoot>
        <App {...props} />
      </RecoilRoot>
    </DndProvider>
  );
}

export default Root;
