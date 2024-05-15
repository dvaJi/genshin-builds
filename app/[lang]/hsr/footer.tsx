"use client";

import Link from "next/link";

import useIntl from "@hooks/use-intl";
import { usePathname } from "next/navigation";

export default function HSRFooter() {
  const { t, locale } = useIntl("layout");
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
    <footer className="z-20 border-t border-gray-800 border-opacity-50 bg-hsr-surface1 px-20 py-14 text-gray-400">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col">
            <h4 className="mb-3 text-gray-200">Star Rail Builds</h4>
            <Link href={`/${locale}/privacy-policy`} className="my-2">
              {t({ id: "privacy_policy", defaultMessage: "Privacy Policy" })}
            </Link>
            <Link href={`/${locale}/contact`} className="my-2">
              {t({ id: "contact", defaultMessage: "Contact" })}
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
            <button onClick={redirectedPathName("zh-tw")} className="my-2">
              中文（繁體）
            </button>
            <button onClick={redirectedPathName("de")} className="my-2">
              Deutsch
            </button>
            <button onClick={redirectedPathName("fr")} className="my-2">
              Français
            </button>
            <button onClick={redirectedPathName("it")} className="my-2">
              Italiano
            </button>
          </div>
          <div className="flex flex-1 flex-col">
            <button onClick={redirectedPathName("id")} className="my-2">
              Indonesia
            </button>
            <button onClick={redirectedPathName("ko")} className="my-2">
              한국어
            </button>
            <button onClick={redirectedPathName("pt")} className="my-2">
              Português
            </button>
            <button onClick={redirectedPathName("ru")} className="my-2">
              Pусский
            </button>
            <button onClick={redirectedPathName("th")} className="my-2">
              ภาษาไทย
            </button>
            <button onClick={redirectedPathName("tr")} className="my-2">
              Türkçe
            </button>
            <button onClick={redirectedPathName("vi")} className="my-2">
              Tiếng Việt
            </button>
          </div>
          <div className="flex-1">
            <p className="text-sm">
              {t({
                id: "footer",
                defaultMessage:
                  "Star Rail Builds is a Database, Tier List, and Guide for Honkai: Star Rail.",
              })}
            </p>
            <p className="mt-3 text-xs">
              {t({
                id: "footer_advice",
                defaultMessage:
                  "Star Rail Builds is not endorsed by HoYoverse or COGNOSPHERE PTE. LTD., and does not reflect the views or opinions of anyone officially involved in producing or managing Honkai: Star Rail.",
              })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
