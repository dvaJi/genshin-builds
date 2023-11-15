import clsx from "clsx";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { AiOutlineTwitter } from "react-icons/ai";

import GoogleAnalytics from "@components/GoogleAnalytics";

import GameSelector from "@components/GameSelector";
import { GA_TRACKING_ID } from "@lib/gtag";
import { GAME } from "@utils/games";
import "../../styles/globals.css";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://genshin-builds.com/zenless"),
  title: {
    default: "ZenlessBuilds",
    template: "%s | ZenlessBuilds",
  },
  description:
    "ZenlessBuilds is a Database, Tier List, and Guide for Zenless Zone Zero on PC, mobile and consoles.",
  openGraph: {
    title: "ZenlessBuilds",
    description:
      "ZenlessBuilds is a Database, Tier List, and Guide for Zenless Zone Zero on PC, mobile and consoles.",
    url: "https://genshin-builds.com",
    siteName: "ZenlessBuilds",
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

export default function ZenlessLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <GoogleAnalytics gtagId={GA_TRACKING_ID} />
        <section
          className={clsx(
            "flex min-h-screen flex-col bg-zinc-950 text-gray-200",
            poppins.className
          )}
        >
          <header className="mx-4 bg-zinc-950 lg:mx-0">
            <div className="container mx-auto flex justify-between py-2">
              <div>
                <h1 className="text-xl">
                  <Link href="/zenless">ZenlessBuilds</Link>
                </h1>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/zenless/"
                  className="rounded-3xl px-2 py-1 font-semibold transition-colors hover:bg-white hover:text-black"
                >
                  Home
                </Link>
                <Link
                  href="/zenless/characters"
                  className="rounded-3xl px-2 py-1 font-semibold transition-colors hover:bg-white hover:text-black"
                >
                  Characters
                </Link>
                <Link
                  href="/zenless/blog"
                  className="rounded-3xl px-2 py-1 font-semibold transition-colors hover:bg-white hover:text-black"
                >
                  Blog
                </Link>
              </div>
              <div>
                <GameSelector
                  currentGame={GAME.ZENLESS}
                  className="z-40 rounded border border-zinc-800 text-zinc-200"
                  buttonClassName="bg-transparent hover:ring-2 ring-white data-[is-open=true]:ring-2"
                />
              </div>
            </div>
          </header>

          <div className="min-h-[600px] bg-zinc-100 py-4 text-zinc-950 lg:px-20">
            <div className="container mx-auto">{children}</div>
          </div>

          <footer className="mx-4 bg-zinc-950 md:mx-2 lg:mx-0">
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
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-3xl px-3 py-1 font-semibold transition-colors hover:bg-white hover:text-black"
                  >
                    Contact
                  </Link>
                  <a
                    href="https://twitter.com/genshin_builds"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-3xl px-3 py-1 text-lg font-semibold transition-colors hover:bg-white hover:text-black"
                  >
                    <AiOutlineTwitter className="inline" />{" "}
                    <span className="text-base">Twitter</span>
                  </a>
                </div>

                <div className="flex flex-1 flex-col">
                  {/* <LanguageSelector /> */}
                </div>
                <div className="flex flex-1 flex-col"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    ZenlessBuilds is a Database, Tier List, and Guide for
                    Zenless Zone Zero on PC, mobile and consoles.
                  </p>
                  <p className="mt-3 text-xs">
                    ZenlessBuilds is not endorsed by HoYoverse or COGNOSPHERE
                    PTE. LTD., and does not reflect the views or opinions of
                    anyone officially involved in producing or managing Zenless
                    Zone Zero.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </section>
      </body>
    </html>
  );
}
