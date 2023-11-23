"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathName = usePathname();
  const redirectedPathName = (locale: string) => {
    return () => {
      if (!pathName) return "/";
      const segments = pathName.split("/");
      segments[1] = locale;
      return segments.join("/");
    };
  };

  return (
    <footer className="z-20 border-t border-gray-700 border-opacity-50 bg-vulcan-800 px-20 py-14 text-gray-400">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col">
            <h4 className="mb-3 text-gray-200">TOFBuilds</h4>
            <Link href="/privacy-policy" className="my-2">
              Privacy Policy
            </Link>
            <Link href="/contact" className="my-2">
              Contact
            </Link>
          </div>
          <div className="flex flex-1 flex-col">
            <button onClick={redirectedPathName("en")} className="my-2">
              English
            </button>
            <button onClick={redirectedPathName("es")} className="my-2">
              Español
            </button>
            <button onClick={redirectedPathName("ja")} className="my-2">
              日本語
            </button>
            <button onClick={redirectedPathName("de")} className="my-2">
              Deutsch
            </button>
          </div>
          <div className="flex flex-1 flex-col">
            <button onClick={redirectedPathName("fr")} className="my-2">
              Français
            </button>
            <button onClick={redirectedPathName("id")} className="my-2">
              Indonesia
            </button>
            <button onClick={redirectedPathName("pt")} className="my-2">
              Português
            </button>
            <button onClick={redirectedPathName("th")} className="my-2">
              ภาษาไทย
            </button>
          </div>
          <div className="flex-1">
            <p className="text-sm">
              TOFBuilds is a Database, Tier List, and Guide for Tower of
              Fantasy.
            </p>
            <p className="mt-3 text-xs">
              TOFBuilds is not endorsed by mHotta Studio or Perfect World, and
              does not reflect the views or opinions of Hotta Studio or Perfect
              World or anyone officially involved in producing or managing Tower
              of Fantasy.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
