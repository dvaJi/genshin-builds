"use client";

import Link from "next/link";
import { AiOutlineTwitter } from "react-icons/ai";

import LanguageSelector from "@components/ui/LanguageSelector";

export default function GenshinFooter() {
  return (
    <footer
      className="border-t border-gray-700 border-opacity-50 bg-vulcan-800/90 px-4 py-6 text-gray-400 backdrop-blur md:px-20 md:py-14"
      style={{ zIndex: 1 }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col">
            <h4 className="mb-2 text-lg text-gray-200">GenshinBuilds</h4>
            <Link href="/privacy-policy" className="my-1 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/contact" className="my-1 hover:text-white">
              Contact
            </Link>
            <Link href="/changelog" className="my-1 hover:text-white">
              Changelog
            </Link>
            <a
              href="https://twitter.com/genshin_builds"
              target="_blank"
              rel="noopener noreferrer"
              className="group my-1 text-lg"
            >
              <AiOutlineTwitter className="inline group-hover:text-blue-400" />{" "}
              <span className="text-base">Twitter</span>
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
