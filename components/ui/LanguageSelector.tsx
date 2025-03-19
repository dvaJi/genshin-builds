"use client";

import clsx from "clsx";
import { useLocale } from "next-intl";
import { memo, startTransition, useCallback, useMemo, useState } from "react";

import { useClickOutside } from "@hooks/use-clickoutside";
import { useRouter } from "@i18n/navigation";

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
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);

  const router = useRouter();
  const locale = useLocale();

  const contentRef = useClickOutside(isOpen ? close : undefined, []);

  const current = useMemo(
    () => languages.find((lang) => lang.id === locale) || languages[0],
    [locale],
  );

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-dropdown-toggle="dropdown"
        className="inline-flex items-center rounded-lg border border-border bg-secondary/30 px-5 py-2.5 text-center text-foreground hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-ring"
        type="button"
        ref={contentRef as any}
      >
        {current.name}
      </button>
      <div
        className={clsx(
          "z-10 divide-y divide-border rounded-lg bg-card shadow-lg lg:w-60",
          isOpen ? "block" : "hidden",
        )}
      >
        <ul className="py-2 text-sm text-card-foreground">
          {languages.map((option) => (
            <li
              key={option.id}
              className="block px-4 py-2 hover:bg-foreground/10"
              onClick={() => onSelectChange(option.id)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default memo(LanguageSelector);
