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
        {/* <div className="relative left-0 top-0 z-50 w-full border-b border-vulcan-700 bg-vulcan-800/70 shadow-md backdrop-blur md:border-b-0">
          <div className="mx-auto block w-full max-w-6xl items-center px-4 py-2 text-sm md:flex md:py-0 ">
            <div className="flex items-center justify-between pr-4 md:inline-block md:pr-0">
              <Link href={`/${params.lang}/tof`} className="h-full w-full">
                <Logo />
              </Link>
            </div>
            <div
              className={clsx(
                "absolute left-0 z-10 mt-2 block max-h-[80vh] w-screen overflow-auto bg-vulcan-800 pb-4 pt-2 md:relative md:ml-10 md:mt-0 md:flex md:flex-grow md:justify-between md:overflow-visible md:bg-transparent md:py-0"
              )}
            >
              <ul className="flex flex-col md:flex-row">
                {navRoutes.map((route) => (
                  <li key={route.id} className="group relative md:py-4">
                    <Link
                      className="ml-4 mt-4 block font-semibold text-slate-300 hover:text-slate-50 md:ml-0 md:mt-0 md:px-3 md:py-2"
                      href={`/${params.lang}${route.href}`}
                    >
                      {route.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <GameSelector
                  currentGame={GAME.TOF}
                  className="z-40 text-slate-200"
                />
              </div>
            </div>
          </div>
        </div> */}
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
