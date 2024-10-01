import clsx from "clsx";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Link from "next/link";
import { AiOutlineTwitter } from "react-icons/ai";

import GoogleAnalytics from "@components/GoogleAnalytics";
import IntlProvider from "@components/IntlProvider";
import LanguageSelector from "@components/ui/LanguageSelector";
import { GA_TRACKING_ID } from "@lib/gtag";

import "../../../styles/globals.css";
import "./globals.css";
import ZenlessHeader from "./header";

const nunito = Nunito({
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://genshin-builds.com/zenless"),
  title: {
    default: "Zenless Zone Zero Builds",
    template: "%s | Zenless Zone Zero Builds",
  },
  description:
    "Zenless Zone Zero Builds is a Database, Tier List, and Guide for Zenless Zone Zero on PC, mobile and consoles.",
  openGraph: {
    title: "Zenless Zone Zero Builds",
    description:
      "Zenless Zone Zero Builds is a Database, Tier List, and Guide for Zenless Zone Zero on PC, mobile and consoles.",
    url: "https://genshin-builds.com",
    siteName: "Zenless Zone Zero Builds",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "ZenlessBuilds",
    card: "summary_large_image",
  },
};

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

export default function ZenlessLayout({ children, params }: Props) {
  return (
    <IntlProvider
      game="zenless"
      locale={params.lang}
      messages={
        {
          layout: {
            home: "Home",
            characters: "Characters",
            bangboos: "Bangboos",
            "disk-drives": "Disk Drives",
            "w-engines": "W Engines",
            blog: "Blog",
          },
        } as any
      }
    >
      <GoogleAnalytics gtagId={GA_TRACKING_ID} />
      <section
        className={clsx(
          "flex min-h-screen flex-col bg-neutral-800 text-gray-100",
          nunito.className
        )}
      >
        <ZenlessHeader locale={params.lang} />

        <div className="news-detail py-4 text-zinc-100 lg:min-h-[600px] lg:px-20 xl:min-h-[750px]">
          <div className="container mx-auto">{children}</div>
          <div className="section__foot" />
        </div>

        <footer className="bg-zinc-950 px-4 pb-4 md:px-2 lg:px-0">
          <div className="mb-4 bg-zinc-900 py-2">
            <div className="container mx-auto flex">
              <h4 className="text-lg text-gray-200">ZenlessBuilds</h4>
            </div>
          </div>
          <div className="container mx-auto">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex flex-col items-start gap-2">
                <Link
                  href="/privacy-policy"
                  className="rounded-3xl px-3 py-1 font-semibold transition-colors hover:bg-white hover:text-black"
                  prefetch={false}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/contact"
                  className="rounded-3xl px-3 py-1 font-semibold transition-colors hover:bg-white hover:text-black"
                  prefetch={false}
                >
                  Contact
                </Link>
                <Link
                  href="/zenless/codes"
                  className="rounded-3xl px-3 py-1 font-semibold transition-colors hover:bg-white hover:text-black"
                  title="Zenless Zone Zero (ZZZ) All Redeem Codes"
                >
                  Codes
                </Link>
                <a
                  href="https://twitter.com/earlyggcom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl px-3 py-1 text-lg font-semibold transition-colors hover:bg-white hover:text-black"
                >
                  <AiOutlineTwitter className="inline" />{" "}
                  <span className="text-base">Twitter</span>
                </a>
                <LanguageSelector />
              </div>

              <div className="flex flex-1 flex-col" />
              <div className="flex flex-1 flex-col"></div>
              <div className="flex-1">
                <p className="text-sm">
                  ZenlessBuilds is a Database, Tier List, and Guide for Zenless
                  Zone Zero on PC, mobile and consoles.
                </p>
                <p className="mt-3 text-xs">
                  ZenlessBuilds is not endorsed by HoYoverse or COGNOSPHERE PTE.
                  LTD., and does not reflect the views or opinions of anyone
                  officially involved in producing or managing Zenless Zone
                  Zero.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </IntlProvider>
  );
}
