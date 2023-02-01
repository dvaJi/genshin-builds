import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";

import LayoutHeader from "@components/tof/LayoutHeader";
import LayoutFooter from "@components/tof/LayoutFooter";
import DynamicBackground from "@components/DynamicBackground";

import { AppBackgroundStyle } from "@state/background-atom";

type Props = {
  children: React.ReactNode;
  bgStyle?: AppBackgroundStyle;
};

function Layout({ children, bgStyle }: Props) {
  const router = useRouter();

  return (
    <div className="flex h-full min-h-screen flex-col bg-vulcan-900">
      <Head>
        <title>Tower of Fantasy Builds | Tower of Fantasy Wiki Database</title>
        <meta
          property="og:title"
          content="TOF Builds | Tower of Fantasy Wiki Database"
        />
        <meta
          property="twitter:title"
          content="TOF Builds | Tower of Fantasy Wiki Database"
        />
        <meta
          name="description"
          content="Learn about every character in Tower of Fantasy including their skills, talents, builds, and tier list."
        />
        <meta
          property="og:description"
          content="Learn about every character in Tower of Fantasy including their skills, talents, builds, and tier list."
        />
        <meta
          property="twitter:description"
          content="Learn about every character in Tower of Fantasy including their skills, talents, builds, and tier list."
        />
      </Head>
      <div className="h-20" />
      <LayoutHeader />
      <DynamicBackground bgStyle={bgStyle} />
      <main
        className={clsx(
          "z-10 mb-8 text-gray-400",
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
