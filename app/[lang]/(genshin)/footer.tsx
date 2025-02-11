"use client";

import Link from "next/link";
import { AiOutlineTwitter } from "react-icons/ai";
import { RiPatreonFill } from "react-icons/ri";

import LanguageSelector from "@components/ui/LanguageSelector";
import useIntl from "@hooks/use-intl";

export default function GenshinFooter() {
  const { locale } = useIntl("layout");
  return (
    <footer className="bg-card border-card text-card-foreground relative z-10 border-t border-opacity-50 px-4 py-6 backdrop-blur md:px-20 md:py-14">
      <div className="container mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col">
            <p className="mb-2 text-lg font-semibold text-white">
              GenshinBuilds
            </p>
            <button id="pmLink" className="my-1 text-left hover:!text-white">
              Privacy Manager
            </button>
            <Link
              href={`/${locale}/privacy-policy`}
              className="my-1 hover:text-white"
              prefetch={false}
            >
              Privacy Policy
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="my-1 hover:text-white"
              prefetch={false}
            >
              Contact
            </Link>
            <Link
              href={`/${locale}/changelog`}
              className="my-1 hover:text-white"
              prefetch={false}
            >
              Changelog
            </Link>
            <a
              href="https://twitter.com/earlyggcom"
              target="_blank"
              rel="noopener noreferrer"
              className="group my-1 text-lg"
            >
              <AiOutlineTwitter className="inline group-hover:text-blue-400" />{" "}
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

          <div className="flex flex-1 flex-col">
            <LanguageSelector />
          </div>
          <div className="flex flex-1 flex-col"></div>
          <div className="flex-1">
            <p className="text-sm">
              GenshinBuilds is a Database, Tier List, and Guide for Genshin
              Impact on PC, mobile and consoles.
            </p>
            <p className="mt-3 text-xs">
              GenshinBuilds is not endorsed by miHoYo Co Ltd. and does not
              reflect the views or opinions of MiHoyo or anyone officially
              involved in producing or managing Genshin Impact.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
