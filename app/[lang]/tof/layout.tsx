import clsx from "clsx";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import GoogleAnalytics from "@components/GoogleAnalytics";
import IntlProvider from "@components/IntlProvider";
import { GA_TRACKING_ID } from "@lib/gtag";

import "../../../styles/globals.css";
import Footer from "./footer";
import "./globals.css";
import TOFHeader from "./header";

const openSans = Open_Sans({
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-open-sans",
  subsets: ["vietnamese"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://genshin-builds.com/tof"),
  title: {
    default: "ToF Builds | Tower of Fantasy Wiki Database",
    template: "%s | ToF Builds",
  },
  description:
    "Learn about every character in Tower of Fantasy including their skills, talents, builds, and tier list.",
  openGraph: {
    title: "ToF Builds | Tower of Fantasy Wiki Database",
    description:
      "Learn about every character in Tower of Fantasy including their skills, talents, builds, and tier list.",
    url: "https://genshin-builds.com/tof",
    siteName: "ToF Builds",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "ToF Builds | Tower of Fantasy Wiki Database",
    card: "summary_large_image",
  },
};

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

export default function TofLayout({ children, params }: Props) {
  return (
    <IntlProvider locale={params.lang} messages={{}}>
      <GoogleAnalytics gtagId={GA_TRACKING_ID} />
      <div
        className={clsx(
          "flex h-full min-h-screen flex-col bg-vulcan-900",
          openSans.className
        )}
      >
        <TOFHeader locale={params.lang} />
        {/* TODO: need to think a way to add this back in */}
        {/* <DynamicBackground bgStyle={bgStyle} /> */}

        <main className="z-10 mb-8 text-gray-400">
          <div className="container mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </IntlProvider>
  );
}
