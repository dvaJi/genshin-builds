import clsx from "clsx";
import { Noto_Sans } from "next/font/google";
import { cookies } from "next/headers";

import GoogleAnalytics from "@components/GoogleAnalytics";
import IntlProvider from "@components/IntlProvider";
import Footer from "./footer";
import Header from "./header";

import useHook from "@hooks/use-hook";
import useTranslations from "@hooks/use-translations";
import { TOF_GA_TRACKING_ID } from "@lib/gtag";

import "../../styles/globals.css";
import "../../styles/hsr-globals.css";

const notoSans = Noto_Sans({
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans",
  subsets: ["vietnamese"],
});

export default function HSRLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const lang = cookieStore.get("x-gb-lang");

  const { messages } = useHook(
    "useTranslations",
    useTranslations("hsr", "layout")
  );

  return (
    <html lang={lang?.value}>
      <body>
        <IntlProvider locale={lang?.value} messages={messages}>
          <GoogleAnalytics gtagId={TOF_GA_TRACKING_ID} />
          <div
            className={clsx(
              "flex h-full min-h-screen flex-col bg-hsr-bg",
              notoSans.className
            )}
          >
            <Header />
            {/* TODO: need to think a way to add this back in */}
            {/* <DynamicBackground bgStyle={bgStyle} /> */}

            <main className="z-10 mb-8 mt-4 text-gray-400">
              <div className="container mx-auto">{children}</div>
            </main>

            <Footer />
          </div>
        </IntlProvider>
      </body>
    </html>
  );
}
