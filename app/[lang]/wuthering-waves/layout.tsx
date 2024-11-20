import { Poppins } from "next/font/google";
import type { VideoGame, WithContext } from "schema-dts";

import GoogleAnalytics from "@components/GoogleAnalytics";
import IntlProvider from "@components/IntlProvider";
import getTranslations from "@hooks/use-translations";
import { GA_TRACKING_ID } from "@lib/gtag";
import { cn } from "@lib/utils";

import "../../../styles/globals.css";
import Footer from "./footer";
import "./globals.css";
import Header from "./header";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
  subsets: [],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function WWLayout({ children, params }: Props) {
  const { lang } = await params;
  const { langData, messages } = await getTranslations(
    lang,
    "wuthering-waves",
    "layout"
  );

  const jsonLd: WithContext<VideoGame> = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Wuthering Waves",
    url: "https://wutheringwaves.kurogames.com/",
    image: "https://genshinbuilds.aipurrjects.com/genshin/games/wuthering.webp",
    description:
      "Wuthering Waves is a free-to-play action role-playing game developed and published by Kuro Games.",
    author: {
      "@type": "Organization",
      name: "Kuro Games",
    },
    applicationCategory: "Game",
    operatingSystem: "ANDROID, IOS, WINDOWS",
  };

  return (
    <IntlProvider game="wuthering-waves" locale={langData} messages={messages}>
      <GoogleAnalytics gtagId={GA_TRACKING_ID} />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      ></script>
      <div
        className={cn(
          "flex h-full min-h-screen flex-col bg-zinc-950",
          poppins.className
        )}
      >
        <Header locale={lang} />

        <main className="z-10 mb-8 mt-4 text-gray-300">
          <div className="container mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </IntlProvider>
  );
}
