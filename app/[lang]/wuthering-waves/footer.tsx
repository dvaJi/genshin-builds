import Link from "next/link";
import { AiOutlineTwitter } from "react-icons/ai";
import { RiPatreonFill } from "react-icons/ri";

import Logo from "@components/wuthering-waves/Logo";

export default function HSRFooter() {
  return (
    <footer className="z-20 border-t border-zinc-700 border-opacity-50 bg-zinc-900/30 px-20 py-14 text-gray-400">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col">
            <h4 className="mb-3 text-gray-200">
              <Logo />
            </h4>
            <Link href={`/en/privacy-policy`} className="my-2" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href={`/en/contact`} className="my-2" prefetch={false}>
              Contact
            </Link>
            <a
              href="https://twitter.com/earlyggcom"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-3xl px-3 py-1 text-lg font-semibold transition-colors hover:bg-white hover:text-black"
            >
              <AiOutlineTwitter className="inline" />{" "}
              <span className="text-base">Twitter</span>
            </a>
            <a
              href="https://www.patreon.com/GenshinBuilds"
              target="_blank"
              rel="noopener noreferrer"
              className="group my-1 text-lg"
            >
              <RiPatreonFill className="inline group-hover:text-red-400" />{" "}
              <span className="text-base">Patreon</span>
            </a>
          </div>
          <div className="flex flex-1 flex-col"></div>
          <div className="flex flex-1 flex-col"></div>
          <div className="flex-1">
            <p className="text-sm">
              WutheringWaves Builds is a Database, Tier List, and Build Guide
              for Wuthering Waves.
            </p>
            <p className="mt-3 text-xs">
              WutheringWaves Builds is not endorsed by Kuro Game. All images are
              owned by Kuro Game.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
