import Document, { Html, Head, Main, NextScript } from "next/document";

import { GAD_ID, PRADS_ID } from "@lib/constants";
import {
  GA_TRACKING_ID,
  TOF_GA_TRACKING_ID,
  HSR_GA_TRACKING_ID,
} from "@lib/gtag";

export default class MyDocument extends Document {
  render() {
    let gaTrackingID = GA_TRACKING_ID;
    const isTOF = this.props.__NEXT_DATA__.page.startsWith("/tof");
    const isHSR = this.props.__NEXT_DATA__.page.startsWith("/hsr");

    if (isTOF) {
      gaTrackingID = TOF_GA_TRACKING_ID;
    } else if (isHSR) {
      gaTrackingID = HSR_GA_TRACKING_ID;
    }

    return (
      <Html>
        <Head>
          {GA_TRACKING_ID && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaTrackingID}', {
              page_path: window.location.pathname,
            });
          `,
              }}
            />
          )}
          {GAD_ID && (
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            />
          )}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/icons/apple-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/icons/apple-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/icons/apple-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/icons/apple-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/icons/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/icons/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/icons/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icons/android-icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/icons/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#1a1d27" />
          {process.env.NEXT_PUBLIC_CUSTOM_HEAD_ONE_NAME && (
            <meta
              name={process.env.NEXT_PUBLIC_CUSTOM_HEAD_ONE_NAME}
              content={process.env.NEXT_PUBLIC_CUSTOM_HEAD_ONE_CONTENT}
            />
          )}
          <meta
            name="msapplication-TileImage"
            content="/icons/ms-icon-144x144.png"
          />
          <meta name="theme-color" content="#1a1d27" />
        </Head>
        <body className="antialiased dark:text-slate-400">
          <Main />
          <NextScript />
          {GA_TRACKING_ID && (
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${
                isTOF ? TOF_GA_TRACKING_ID : GA_TRACKING_ID
              }`}
            />
          )}
          {PRADS_ID && (
            <div>
              <script
                src={`https://cdn.prplads.com/agent.js?publisherId=${PRADS_ID}`}
                data-pa-tag
                async
              ></script>
              <script
                src="https://cdn.prplads.com/video-agent.js?publisherId=e21c9387886d075fe1e601fb1a0e329c:e6e0e3e754066d18442819d10fce94ff4112c38f647aad8b1cfdf47d35fdf1d795eae8a634db775e31b9ba712aaca63235ce010d72f4ff31d12663c0526d53f6"
                async
              ></script>
            </div>
          )}
        </body>
      </Html>
    );
  }
}
