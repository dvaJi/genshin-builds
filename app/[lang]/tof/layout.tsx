import clsx from "clsx";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import type { VideoGame, WithContext } from "schema-dts";

import GoogleAnalytics from "@components/GoogleAnalytics";
import { GA_TRACKING_ID } from "@lib/gtag";

import Footer from "./footer";
import TOFHeader from "./header";
import "./theme.css";

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
  params: Promise<{ lang: string }>;
};

export default async function TofLayout({ children, params }: Props) {
  const { lang } = await params;
  const jsonLd: WithContext<VideoGame> = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Tower of Fantasy",
    url: "http://www.toweroffantasy-global.com/",
    image: "https://images.genshin-builds.com/genshin/games/tof.webp",
    description:
      "Tower of Fantasy is a free-to-play action role-playing game developed and published by Hotta Studio.",
    author: {
      "@type": "Organization",
      name: "Hotta Studio",
    },
    applicationCategory: "Game",
    operatingSystem: "ANDROID, IOS, WINDOWS",
  };
  return (
    <>
      <GoogleAnalytics gtagId={GA_TRACKING_ID} />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      ></script>
      <div
        className={clsx(
          "flex h-full min-h-screen flex-col bg-vulcan-900",
          openSans.className,
        )}
      >
        <TOFHeader locale={lang} />
        {/* TODO: need to think a way to add this back in */}
        {/* <DynamicBackground bgStyle={bgStyle} /> */}

        <main className="z-10 mb-8 text-gray-400">
          <div className="container mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </>
  );
}
