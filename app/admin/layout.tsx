import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";

import AuthProvider from "@app/auth-provider";
import Breadcrumb from "@components/Breadcrumb";
import Sidebar from "@components/admin/Sidebar";
import "../../styles/globals.css";

const inter = Inter({
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-inter",
  subsets: [],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://genshin-builds.com/admin"),
  title: {
    default: "Genshin Builds | Administration Panel",
    template: "%s | Genshin Builds | Administration Panel",
  },
  description: "Administration Panel",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthProvider>
          <section
            className={clsx(
              "flex h-screen overflow-hidden bg-zinc-900 text-sm text-white",
              inter.className
            )}
          >
            <div className="hidden w-20 flex-shrink-0 flex-col border-r border-zinc-700 bg-zinc-900 sm:flex">
              <div className="flex h-16 items-center justify-center text-blue-500">
                <Image
                  src="/icons/android-icon-72x72.png"
                  width={48}
                  height={48}
                  alt="Logo"
                  priority={true}
                />
              </div>
              <Sidebar />
            </div>
            <main className="flex h-full flex-grow flex-col overflow-hidden">
              <div className="hidden h-16 w-full border-b border-zinc-700 px-10 lg:flex">
                <Breadcrumb
                  homeElement={"Home"}
                  separator={<span className="text-zinc-400">/</span>}
                  activeClasses="!text-white"
                  containerClasses="flex h-full items-center"
                  listClasses="hover:underline mx-2 text-zinc-300"
                  capitalizeLinks
                />
              </div>
              <div className="flex flex-grow overflow-x-hidden">{children}</div>
            </main>
          </section>
        </AuthProvider>
      </body>
    </html>
  );
}
