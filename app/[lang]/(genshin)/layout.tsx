import GoogleAnalytics from "@components/GoogleAnalytics";
import IntlProvider from "@components/IntlProvider";
import Footer from "./footer";
import Header from "./header";

import useHook from "@hooks/use-hook";
import useTranslations from "@hooks/use-translations";
import { TOF_GA_TRACKING_ID } from "@lib/gtag";

import "../../../styles/globals.css";

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

export default function GenshinLayout({ children, params }: Props) {
  const { messages, common } = useHook(
    "useTranslations",
    useTranslations(params.lang, "genshin", "layout")
  );

  return (
    <html lang={params.lang}>
      <body>
        <IntlProvider locale={params.lang} messages={messages} common={common}>
          <GoogleAnalytics gtagId={TOF_GA_TRACKING_ID} />
          <div className="flex min-h-screen flex-col bg-vulcan-900">
            <Header />

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
