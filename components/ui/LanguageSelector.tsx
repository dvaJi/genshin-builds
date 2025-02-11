"use client";

import clsx from "clsx";
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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-dropdown-toggle="dropdown"
        className="border-border bg-secondary/30 text-foreground hover:bg-secondary/50 focus:ring-ring inline-flex items-center rounded-lg border px-5 py-2.5 text-center focus:outline-none focus:ring-2"
        type="button"
        ref={contentRef as any}
      >
        {current.name}
      </button>
      <div
        className={clsx(
          "divide-border bg-card z-10 divide-y rounded-lg shadow-lg lg:w-60",
          isOpen ? "block" : "hidden"
        )}
      >
        <ul className="text-card-foreground py-2 text-sm">
          {languages.map((option) => (
            <li key={option.id} className="">
              <Link
                href={redirectedPathName(option.id)}
                className="hover:bg-foreground/10 block px-4 py-2"
                prefetch={false}
              >
                {option.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default memo(LanguageSelector);
