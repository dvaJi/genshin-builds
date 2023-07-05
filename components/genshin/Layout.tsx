import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";

import DynamicBackground from "@components/DynamicBackground";
import LayoutFooter from "@components/genshin/LayoutFooter";
import LayoutHeader from "@components/genshin/LayoutHeader";
import { AppBackgroundStyle } from "@state/background-atom";

type Props = {
  children: React.ReactNode;
  bgStyle?: AppBackgroundStyle;
};

function Layout({ children, bgStyle }: Props) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-vulcan-900">
      <Head>
        <title>Genshin Builds | Genshin Impact Wiki Database</title>
        <meta
          property="og:title"
          content="Genshin Builds | Genshin Impact Wiki Database"
        />
        <meta
          property="twitter:title"
          content="Genshin Builds | Genshin Impact Wiki Database"
        />
        <meta
          name="description"
          content="Learn about every character in Genshin Impact including their skills, talents, builds, and tier list."
        />
        <meta
          property="og:description"
          content="Learn about every character in Genshin Impact including their skills, talents, builds, and tier list."
        />
        <meta
          property="twitter:description"
          content="Learn about every character in Genshin Impact including their skills, talents, builds, and tier list."
        />
      </Head>
      <LayoutHeader />
      <DynamicBackground bgStyle={bgStyle} />
      <main
        className={clsx(
          "z-10 mb-8 mt-4 text-gray-400",
          !["/builder/builds", "/todo"].includes(router.route)
            ? "container mx-auto lg:px-20"
            : ""
        )}
      >
        {children}
      </main>
      <LayoutFooter />
    </div>
  );
}

export default Layout;
