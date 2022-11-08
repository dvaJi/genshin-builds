import Document, { Html, Head, Main, NextScript } from "next/document";

import { GAD_ID } from "@lib/constants";
import { GA_TRACKING_ID, TOF_GA_TRACKING_ID } from "@lib/gtag";

export default class MyDocument extends Document {
  render() {
    const isTOF = this.props.__NEXT_DATA__.page.startsWith("/tof");
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
            gtag('config', '${isTOF ? TOF_GA_TRACKING_ID : GA_TRACKING_ID}', {
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
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
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
        </body>
      </Html>
    );
  }
}
