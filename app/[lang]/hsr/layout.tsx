import clsx from "clsx";
import { Noto_Sans } from "next/font/google";

import GoogleAnalytics from "@components/GoogleAnalytics";
import IntlProvider from "@components/IntlProvider";
import getTranslations from "@hooks/use-translations";
import { GA_TRACKING_ID } from "@lib/gtag";

import "../../../styles/globals.css";
import "../../../styles/hsr-globals.css";
import Footer from "./footer";
import Header from "./header";

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
  const { messages } = await getTranslations(lang, "hsr", "layout");

  return (
    <IntlProvider locale={lang} messages={messages} game="hsr">
      <GoogleAnalytics gtagId={GA_TRACKING_ID} />
      <div
        className={clsx(
          "flex h-full min-h-screen flex-col bg-hsr-bg",
          notoSans.className
        )}
      >
        <Header />

        <main className="z-10 mb-8 mt-4 text-gray-400">
          <div className="container mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </IntlProvider>
  );
}
