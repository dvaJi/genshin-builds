"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

import * as gtag from "@lib/gtag";

type Props = {
  gtagId?: string;
};

export default function GoogleAnalytics({ gtagId }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (gtagId) {
      const url = `${pathname}?${searchParams}`;
      gtag.pageview(url);
      if (
        typeof window !== "undefined" &&
        typeof window.freestar !== "undefined"
      ) {
        freestar.queue.push(function () {
          freestar.trackPageview();
        });
      }
    }
  }, [gtagId, pathname, searchParams]);

  if (!gtagId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtagId}', {
              page_path: window.location.pathname,
            });`,
        }}
      />
    </>
  );
}
