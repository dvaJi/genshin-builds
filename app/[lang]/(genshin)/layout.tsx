import { routing } from "i18n/routing";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import type { VideoGame, WithContext } from "schema-dts";

import GoogleAnalytics from "@components/GoogleAnalytics";
import { GA_TRACKING_ID } from "@lib/gtag";

import Footer from "./footer";
import Header from "./header";
import "./theme.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function GenshinLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  const jsonLd: WithContext<VideoGame> = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Genshin Impact",
    url: "https://genshin.mihoyo.com/",
    image: "https://images.genshin-builds.com/genshin/games/genshin.webp",
    description:
      "Genshin Impact is a free-to-play action role-playing game developed and published by miHoYo.",
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
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />

        <main className="z-10 mb-8 mt-4">
          <div className="mx-auto md:container">{children}</div>
        </main>

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
