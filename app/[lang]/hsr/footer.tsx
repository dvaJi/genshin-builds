"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineTwitter } from "react-icons/ai";
import { RiPatreonFill } from "react-icons/ri";

import useIntl from "@hooks/use-intl";

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
    <footer className="z-20 border-t border-card border-opacity-50 bg-card px-20 py-14 text-card-foreground">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col">
            <h4 className="mb-3 text-gray-200">Star Rail Builds</h4>
            <Link
              href={`/${locale}/privacy-policy`}
              className="my-2"
              prefetch={false}
            >
              {t({ id: "privacy_policy", defaultMessage: "Privacy Policy" })}
            </Link>
            <Link href={`/${locale}/contact`} className="my-2" prefetch={false}>
              {t({ id: "contact", defaultMessage: "Contact" })}
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
          <div className="flex flex-1 flex-col">
            <p className="mb-2 text-lg font-semibold text-foreground">Games</p>
            <div className="space-y-2">
              {/* Genshin Impact */}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-foreground">
                  Genshin Impact
                </p>
                <Link
                  href={`/${locale}/characters`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Characters
                </Link>
                <Link
                  href={`/${locale}/teams`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Best Teams
                </Link>
                <Link
                  href={`/${locale}/builds`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Builds
                </Link>
              </div>

              {/* Zenless Zone Zero */}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-foreground">
                  Zenless Zone Zero
                </p>
                <Link
                  href={`/${locale}/zenless/characters`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Characters
                </Link>
                <Link
                  href={`/${locale}/zenless/tierlist`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Tierlist
                </Link>
              </div>

              {/* Wuthering Waves */}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-foreground">
                  Wuthering Waves
                </p>
                <Link
                  href={`/${locale}/wuthering-waves`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Characters
                </Link>
                <Link
                  href={`/${locale}/wuthering-waves/tierlist/characters`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Tierlist Characters
                </Link>
                <Link
                  href={`/${locale}/wuthering-waves/tierlist/weapons`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Tierlist Weapons
                </Link>
                <Link
                  href={`/${locale}/wuthering-waves/tierlist/echoes`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Tierlist Echoes
                </Link>
              </div>
            </div>
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
