import GoogleAnalytics from "@components/GoogleAnalytics";
import IntlProvider from "@components/IntlProvider";
import getTranslations from "@hooks/use-translations";
import { GA_TRACKING_ID } from "@lib/gtag";

import "../../../styles/globals.css";
import Footer from "./footer";
import Header from "./header";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function GenshinLayout({ children, params }: Props) {
  const { lang } = await params;
  const { messages, common } = await getTranslations(lang, "genshin", "layout");

  return (
    <IntlProvider
      locale={lang}
      messages={messages}
      common={common}
      game="genshin"
    >
      <GoogleAnalytics gtagId={GA_TRACKING_ID} />
      <div className="flex min-h-screen flex-col bg-vulcan-900">
        <Header />

        <main className="z-10 mb-8 mt-4 text-gray-300">
          <div className="container mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </IntlProvider>
  );
}
