import clsx from "clsx";
import { Poppins } from "next/font/google";

import GoogleAnalytics from "@components/GoogleAnalytics";
import IntlProvider from "@components/IntlProvider";
import { GA_TRACKING_ID } from "@lib/gtag";

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
  params: { lang: string };
};

export default async function WWLayout({ children, params }: Props) {
  return (
    <IntlProvider locale={params.lang} messages={{}}>
      <GoogleAnalytics gtagId={GA_TRACKING_ID} />
      <div
        className={clsx(
          "flex h-full min-h-screen flex-col bg-zinc-950",
          poppins.className
        )}
      >
        <Header locale={params.lang} />

        <main className="z-10 mb-8 mt-4 text-gray-300">
          <div className="container mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </IntlProvider>
  );
}
