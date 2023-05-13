import useIntl from "@hooks/use-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";

const LayoutFooter = () => {
  const { t } = useIntl("layout");

  const router = useRouter();
  return (
    <footer className="z-20 border-t border-gray-800 border-opacity-50 bg-hsr-surface1 px-20 py-14 text-gray-400">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col">
            <h4 className="mb-3 text-gray-200">HSR-Builds</h4>
            <Link href="/privacy-policy" className="my-2">
              {t({ id: "privacy_policy", defaultMessage: "Privacy Policy" })}
            </Link>
            <Link href="/contact" className="my-2">
              {t({ id: "contact", defaultMessage: "Contact" })}
            </Link>
          </div>
          <div className="flex flex-1 flex-col">
            <Link href={router.asPath} locale="en" className="my-2">
              English
            </Link>
            <Link href={router.asPath} locale="es" className="my-2">
              Español
            </Link>
            <Link href={router.asPath} locale="ja" className="my-2">
              日本語
            </Link>
            <Link href={router.asPath} locale="zh-tw" className="my-2">
              中文（繁體）
            </Link>
            <Link href={router.asPath} locale="de" className="my-2">
              Deutsch
            </Link>
            <Link href={router.asPath} locale="fr" className="my-2">
              Français
            </Link>
            <Link href={router.asPath} locale="it" className="my-2">
              Italiano
            </Link>
          </div>
          <div className="flex flex-1 flex-col">
            <Link href={router.asPath} locale="id" className="my-2">
              Indonesia
            </Link>
            <Link href={router.asPath} locale="ko" className="my-2">
              한국어
            </Link>
            <Link href={router.asPath} locale="pt" className="my-2">
              Português
            </Link>
            <Link href={router.asPath} locale="ru" className="my-2">
              Pусский
            </Link>
            <Link href={router.asPath} locale="th" className="my-2">
              ภาษาไทย
            </Link>
            <Link href={router.asPath} locale="tr" className="my-2">
              Türkçe
            </Link>
            <Link href={router.asPath} locale="vi" className="my-2">
              Tiếng Việt
            </Link>
          </div>
          <div className="flex-1">
            <p className="text-sm">
              {t({
                id: "footer",
                defaultMessage:
                  "HSRBuilds is a Database, Tier List, and Guide for Honkai: Star Rail.",
              })}
            </p>
            <p className="mt-3 text-sm">
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
};

export default memo(LayoutFooter);
