import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import type { VideoGame, WithContext } from "schema-dts";

import GoogleAnalytics from "@components/GoogleAnalytics";
import { localesAvailables } from "@i18n/config";
import { redirect } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import { GA_TRACKING_ID } from "@lib/gtag";
import { cn } from "@lib/utils";

import Footer from "./footer";
import Header from "./header";
import "./theme.css";

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

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  if (!localesAvailables["wuthering-waves"].includes(lang)) {
    redirect({
      href: `/wuthering-waves/`,
      locale: routing.defaultLocale,
    });
  }

  const jsonLd: WithContext<VideoGame> = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Wuthering Waves",
    url: "https://wutheringwaves.kurogames.com/",
    image: "https://images.genshin-builds.com/genshin/games/wuthering.webp",
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
    <NextIntlClientProvider>
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
          poppins.className,
        )}
      >
        <Header />

        <main className="z-10 mb-8 mt-4 text-gray-300">
          <div className="container mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
