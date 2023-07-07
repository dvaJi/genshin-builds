import Document, { Head, Html, Main, NextScript } from "next/document";

import { AD_ARTICLE_SLOT, GAD_ID } from "@lib/constants";
import {
  GA_TRACKING_ID,
  HSR_GA_TRACKING_ID,
  TOF_GA_TRACKING_ID,
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
      <Html lang={this.props.__NEXT_DATA__.locale ?? "en"}>
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
          <link href="https://www.google-analytics.com" rel="preconnect" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://a.pub.network/"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://b.pub.network/"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://c.pub.network/"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://d.pub.network/"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://c.amazon-adsystem.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://s.amazon-adsystem.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://secure.quantserve.com/"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://rules.quantcount.com/"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://pixel.quantserve.com/"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://cmp.quantcast.com/"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://btloader.com/"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://api.btloader.com/"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://confiant-integrations.global.ssl.fastly.net"
            crossOrigin="anonymous"
          />
          <link rel="preconnect" href="//i0.wp.com" />
          <link rel="preconnect" href="//i1.wp.com" />
          <link rel="preconnect" href="//i2.wp.com" />
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
          <meta
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />
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
          <meta content="Genshin-Builds.Com" property="og:site_name" />
          <meta content="website" property="og:type" />
          <meta content="/icons/meta-image.jpg" property="og:image" />
          <meta content="summary" name="twitter:card" />
          <meta content="/icons/meta-image.jpg" name="twitter:image" />
        </Head>
        <body className="antialiased dark:text-slate-400 overflow-x-hidden">
          {GAD_ID && AD_ARTICLE_SLOT ? (
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={GAD_ID}
              data-adtest={
                process.env.NODE_ENV === "development" ? "on" : "off"
              }
              data-ad-slot={AD_ARTICLE_SLOT}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          ) : null}
          <Main />
          <NextScript />
          {GA_TRACKING_ID && (
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingID}`}
            />
          )}
        </body>
      </Html>
    );
  }
}
