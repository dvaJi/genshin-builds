import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Noto_Sans } from "next/font/google";
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

const notoSans = Noto_Sans({
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans",
  subsets: ["vietnamese"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function HSRLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  if (!localesAvailables.hsr.includes(lang)) {
    redirect({
      href: `/hsr/`,
      locale: routing.defaultLocale,
    });
  }

  const jsonLd: WithContext<VideoGame> = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Honkai: Star Rail",
    url: "https://hsr.hoyoverse.com/",
    image: "https://images.genshin-builds.com/genshin/games/hsr.webp",
    description:
      "Honkai: Star Rail is a free-to-play action role-playing game developed and published by miHoYo.",
    author: {
      "@type": "Organization",
      name: "Mihoyo",
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
          "flex h-full min-h-screen flex-col bg-background text-foreground",
          notoSans.className,
        )}
      >
        <Header />

        <main className="z-10 mb-8 mt-4">
          <div className="container mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
