"use client";

import Link from "next/link";

import { setLanguage } from "@app/actions";
import useIntl from "@hooks/use-intl";

export default function HSRFooter() {
  const { t } = useIntl("layout");

  return (
    <footer className="z-20 border-t border-gray-800 border-opacity-50 bg-hsr-surface1 px-20 py-14 text-gray-400">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col">
            <h4 className="mb-3 text-gray-200">Star Rail Builds</h4>
            <Link href="/privacy-policy" className="my-2">
              {t({ id: "privacy_policy", defaultMessage: "Privacy Policy" })}
            </Link>
            <Link href="/contact" className="my-2">
              {t({ id: "contact", defaultMessage: "Contact" })}
            </Link>
          </div>
          <div className="flex flex-1 flex-col">
            <button onClick={() => setLanguage("en")} className="my-2">
              English
            </button>
            <button onClick={() => setLanguage("es")} className="my-2">
              Español
            </button>
            <button onClick={() => setLanguage("ja")} className="my-2">
              日本語
            </button>
            <button onClick={() => setLanguage("zh-tw")} className="my-2">
              中文（繁體）
            </button>
            <button onClick={() => setLanguage("de")} className="my-2">
              Deutsch
            </button>
            <button onClick={() => setLanguage("fr")} className="my-2">
              Français
            </button>
            <button onClick={() => setLanguage("it")} className="my-2">
              Italiano
            </button>
          </div>
          <div className="flex flex-1 flex-col">
            <button onClick={() => setLanguage("id")} className="my-2">
              Indonesia
            </button>
            <button onClick={() => setLanguage("ko")} className="my-2">
              한국어
            </button>
            <button onClick={() => setLanguage("pt")} className="my-2">
              Português
            </button>
            <button onClick={() => setLanguage("ru")} className="my-2">
              Pусский
            </button>
            <button onClick={() => setLanguage("th")} className="my-2">
              ภาษาไทย
            </button>
            <button onClick={() => setLanguage("tr")} className="my-2">
              Türkçe
            </button>
            <button onClick={() => setLanguage("vi")} className="my-2">
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
                  "Honkai: Star Rail is not endorsed by HoYoverse or COGNOSPHERE PTE. LTD., and does not reflect the views or opinions of anyone officially involved in producing or managing Honkai: Star Rail.",
              })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
