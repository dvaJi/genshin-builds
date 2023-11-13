"use client";

import Script from "next/script";

type Props = {
  gtagId?: string;
};

export default function GoogleAnalytics({ gtagId }: Props) {

  if (!gtagId) {
    return null;
  }

  //You can show in the console the GA_TRACKING_ID to confirm
  console.log(gtagId);

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
