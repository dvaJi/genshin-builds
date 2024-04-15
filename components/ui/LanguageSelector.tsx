"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useState } from "react";

import { useClickOutside } from "@hooks/use-clickoutside";
import useIntl from "@hooks/use-intl";

const languages = [
  { id: "en", name: "English" },
  { id: "es", name: "Español" },
  { id: "ja", name: "日本語" },
  { id: "zh-tw", name: "中文（繁體）" },
  { id: "cn", name: "中文(简体)" },
  { id: "de", name: "Deutsch" },
  { id: "fr", name: "Français" },
  { id: "it", name: "Italiano" },
  { id: "id", name: "Indonesia" },
  { id: "ko", name: "한국어" },
  { id: "pt", name: "Português" },
  { id: "ru", name: "Pусский" },
  { id: "th", name: "ภาษาไทย" },
  { id: "tr", name: "Türkçe" },
  { id: "vi", name: "Tiếng Việt" },
];

function LanguageSelector() {
  const { locale } = useIntl("layout");
  const pathName = usePathname();
  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);
  const contentRef = useClickOutside(isOpen ? close : undefined, []);

  const current = languages.find((lang) => lang.id === locale) || languages[0];

  return (
    <>
      <button
        className="inline-flex items-center rounded-lg border border-vulcan-700 bg-vulcan-700/30 px-5 py-2.5 text-center text-white hover:border-vulcan-600 hover:bg-vulcan-600/50 focus:outline-none focus:ring-4 focus:ring-slate-600"
        onClick={() => setIsOpen(!isOpen)}
        ref={contentRef as any}
      >
        {current.name}
      </button>
      <div
        className={`z-10 divide-y divide-gray-100 rounded-lg bg-vulcan-700 shadow-lg lg:w-60 ${
          isOpen ? "" : "hidden"
        }`}
      >
        <ul className="grid grid-cols-2 py-2 text-sm text-gray-200">
          {languages.map((option) => (
            <li key={option.id} className="">
              <Link
                href={redirectedPathName(option.id)}
                className="block px-4 py-2 hover:bg-gray-600 hover:text-white"
                prefetch={false}
              >
                {option.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default memo(LanguageSelector);
