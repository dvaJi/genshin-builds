import Link from "next/link";
import { useRouter } from "next/router";
import SidebarLink from "./SidebarLink";

import { IoIosBuild, IoIosPeople } from "react-icons/io";
import { GiBroadsword, GiEvilBud } from "react-icons/gi";

interface LayoutHeaderProps {}

export const LayoutHeader: React.FC<LayoutHeaderProps> = () => {
  const router = useRouter();
  return (
    <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-vulcan-800 md:block flex-shrink-0">
      <div className="py-4 text-gray-500 dark:text-gray-400">
        <Link href="/">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200">
            Genshin Builds
          </a>
        </Link>
        <ul className="mt-6">
          <SidebarLink href="/comp-builder" icon={<IoIosBuild />} route={router.route}>
            Team Builder
          </SidebarLink>
          <SidebarLink href="/characters" icon={<IoIosPeople />} route={router.route}>
            Characters
          </SidebarLink>
          <SidebarLink href="/weapons" icon={<GiBroadsword />} route={router.route}>
            Weapons
          </SidebarLink>
          <SidebarLink href="/artifacts" icon={<GiEvilBud />} route={router.route}>
            Artifacts
          </SidebarLink>
        </ul>
      </div>
    </aside>
  );
};
