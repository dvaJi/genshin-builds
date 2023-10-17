import clsx from "clsx";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import Breadcrumb from "@components/Breadcrumb";
import DynamicBackground from "@components/DynamicBackground";
import UserAvatar from "@components/admin/UserAvatar";
import { Session } from "@lib/session";
import { AppBackgroundStyle } from "@state/background-atom";
import { GAME } from "@utils/games";

type Props = {
  children: React.ReactNode;
  bgStyle?: AppBackgroundStyle;
  fontClass?: string;
  session?: Session;
};

function AdminLayout({ children, bgStyle, fontClass, ...props }: Props) {
  const router = useRouter();
  return (
    <div
      className={clsx(
        "flex h-screen overflow-hidden bg-zinc-900 text-sm text-white",
        fontClass
      )}
    >
      <Head>
        <title>Genshin Builds | Administration Panel</title>
        <meta name="description" content="Administration Panel" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
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
        {props.session && (
          <>
            <div className="mx-auto mt-4 flex flex-grow flex-col space-y-4 text-zinc-400">
              {Object.values(GAME).map((game) => (
                <button
                  key={game.name}
                  className={clsx(
                    "flex h-10 w-full items-center rounded px-2",
                    router.asPath.startsWith(game.adminPath)
                      ? "bg-zinc-700 text-white"
                      : "hover:bg-zinc-700"
                  )}
                  onClick={() => router.push(game.adminPath)}
                >
                  <Image
                    className="rounded"
                    src={`/imgs/games/${game.slug}.webp`}
                    alt={game.name}
                    width={32}
                    height={32}
                  />
                  {/* <span className="text-sm md:hidden lg:inline-block">
                {game.name}
              </span> */}
                </button>
              ))}
              <button className="flex h-10 w-12 items-center justify-center rounded-md text-zinc-500">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </button>
            </div>
            <div className="mb-2 flex items-center justify-center">
              <UserAvatar session={props.session} />
            </div>
          </>
        )}
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
        <div className="flex flex-grow overflow-x-hidden">
          <DynamicBackground bgStyle={bgStyle} />
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
