import clsx from "clsx";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Nunito } from "next/font/google";
import { notFound } from "next/navigation";
import { AiOutlineTwitter } from "react-icons/ai";
import { RiPatreonFill } from "react-icons/ri";
import type { VideoGame, WithContext } from "schema-dts";

import GoogleAnalytics from "@components/GoogleAnalytics";
import LanguageSelector from "@components/ui/LanguageSelector";
import { localesAvailables } from "@i18n/config";
import { Link, redirect } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import { GA_TRACKING_ID } from "@lib/gtag";

import ZenlessHeader from "./header";
import "./theme.css";

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
  params: Promise<{ lang: string }>;
};

export default async function ZenlessLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  if (!localesAvailables["zenless"].includes(lang)) {
    redirect({
      href: `/zenless/`,
      locale: routing.defaultLocale,
    });
  }

  const jsonLd: WithContext<VideoGame> = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Zenless Zone Zero",
    url: "https://zenless.hoyoverse.com/",
    image: "https://images.genshin-builds.com/genshin/games/zenless.webp",
    description:
      "Zenless Zone Zero is a free-to-play action role-playing game developed and published by miHoYo.",
    author: {
      "@type": "Organization",
      name: "miHoYo",
    },
    applicationCategory: "Game",
    operatingSystem: "ANDROID, IOS, WINDOWS",
  };

  return (
    <NextIntlClientProvider>
      <GoogleAnalytics gtagId={GA_TRACKING_ID} />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      ></script>
      <section
        className={clsx(
          "flex min-h-screen flex-col bg-neutral-800 text-gray-100",
          nunito.className,
        )}
      >
        <ZenlessHeader />

        <div className="news-detail py-4 text-zinc-100 lg:min-h-[600px] lg:px-20 xl:min-h-[750px]">
          <div className="container mx-auto">{children}</div>
          <div className="section__foot" />
        </div>

        <footer className="z-20 border-t border-card border-opacity-50 bg-card px-4 py-6 text-card-foreground backdrop-blur md:px-20 md:py-14">
          <div className="container mx-auto">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex flex-1 flex-col">
                <p className="mb-2 text-lg font-semibold text-foreground">
                  ZenlessBuilds
                </p>
                <Link
                  href={`/privacy-policy`}
                  className="my-1 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Privacy Policy
                </Link>
                <Link
                  href={`/contact`}
                  className="my-1 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Contact
                </Link>
                <Link
                  href={`/zenless/codes`}
                  className="my-1 text-muted-foreground hover:text-foreground"
                  title="Zenless Zone Zero (ZZZ) All Redeem Codes"
                >
                  Codes
                </Link>
                <a
                  href="https://twitter.com/earlyggcom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group my-1 text-lg"
                >
                  <AiOutlineTwitter className="inline group-hover:text-blue-400" />{" "}
                  <span className="text-base">Twitter</span>
                </a>
                <a
                  href="https://www.patreon.com/GenshinBuilds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group my-1 text-lg"
                >
                  <RiPatreonFill className="inline group-hover:text-red-400" />{" "}
                  <span className="text-base">Patreon</span>
                </a>
              </div>

              <div className="flex flex-1 flex-col">
                <p className="mb-2 text-lg font-semibold text-foreground">
                  Games
                </p>
                <div className="space-y-2">
                  {/* Genshin Impact */}
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-foreground">
                      Genshin Impact
                    </p>
                    <Link
                      href={`/characters`}
                      className="my-1 text-sm text-muted-foreground hover:text-foreground"
                      prefetch={false}
                    >
                      Characters
                    </Link>
                    <Link
                      href={`/teams`}
                      className="my-1 text-sm text-muted-foreground hover:text-foreground"
                      prefetch={false}
                    >
                      Best Teams
                    </Link>
                    <Link
                      href={`/builds`}
                      className="my-1 text-sm text-muted-foreground hover:text-foreground"
                      prefetch={false}
                    >
                      Builds
                    </Link>
                  </div>

                  {/* Honkai: Star Rail */}
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-foreground">
                      Honkai: Star Rail
                    </p>
                    <Link
                      href={`/hsr`}
                      className="my-1 text-sm text-muted-foreground hover:text-foreground"
                      prefetch={false}
                    >
                      Characters
                    </Link>
                    <Link
                      href={`/hsr/tierlist`}
                      className="my-1 text-sm text-muted-foreground hover:text-foreground"
                      prefetch={false}
                    >
                      Tierlist
                    </Link>
                  </div>

                  {/* Wuthering Waves */}
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-foreground">
                      Wuthering Waves
                    </p>
                    <Link
                      href={`/wuthering-waves`}
                      className="my-1 text-sm text-muted-foreground hover:text-foreground"
                      prefetch={false}
                    >
                      Characters
                    </Link>
                    <Link
                      href={`/wuthering-waves/tierlist/characters`}
                      className="my-1 text-sm text-muted-foreground hover:text-foreground"
                      prefetch={false}
                    >
                      Tierlist Characters
                    </Link>
                    <Link
                      href={`/wuthering-waves/tierlist/weapons`}
                      className="my-1 text-sm text-muted-foreground hover:text-foreground"
                      prefetch={false}
                    >
                      Tierlist Weapons
                    </Link>
                    <Link
                      href={`/wuthering-waves/tierlist/echoes`}
                      className="my-1 text-sm text-muted-foreground hover:text-foreground"
                      prefetch={false}
                    >
                      Tierlist Echoes
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <LanguageSelector />
              </div>
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
    </NextIntlClientProvider>
  );
}
