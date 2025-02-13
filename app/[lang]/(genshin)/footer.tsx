"use client";

import Link from "next/link";
import { AiOutlineTwitter } from "react-icons/ai";
import { RiPatreonFill } from "react-icons/ri";

import LanguageSelector from "@components/ui/LanguageSelector";
import useIntl from "@hooks/use-intl";

export default function GenshinFooter() {
  const { locale } = useIntl("layout");
  return (
    <footer className="relative z-10 border-t border-muted bg-card px-4 py-6 text-card-foreground backdrop-blur md:px-20 md:py-14">
      <div className="container mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col">
            <p className="mb-2 text-lg font-semibold text-foreground">
              GenshinBuilds
            </p>
            <button
              id="pmLink"
              className="my-1 text-left hover:!text-foreground"
            >
              Privacy Manager
            </button>
            <Link
              href={`/${locale}/privacy-policy`}
              className="my-1 text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Privacy Policy
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="my-1 text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Contact
            </Link>
            <Link
              href={`/${locale}/changelog`}
              className="my-1 text-muted-foreground hover:text-foreground"
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
          <div className="flex flex-1 flex-col">
            <p className="mb-2 text-lg font-semibold text-foreground">Games</p>
            <div className="space-y-2">
              {/* Honkai: Star Rail */}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-foreground">
                  Honkai: Star Rail
                </p>
                <Link
                  href={`/${locale}/hsr`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  title="Explore Honkai: Star Rail characters, skills, and builds"
                >
                  Characters
                </Link>
                <Link
                  href={`/${locale}/hsr/tierlist`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  title="Honkai: Star Rail tier list - Best characters ranked"
                >
                  Tierlist
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
                  title="Zenless Zone Zero character list - Abilities and stats"
                >
                  Characters
                </Link>
                <Link
                  href={`/${locale}/zenless/tierlist`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  title="Zenless Zone Zero tier list - Best agents ranked"
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
                  title="Discover Wuthering Waves characters, skills, and builds"
                >
                  Characters
                </Link>
                <Link
                  href={`/${locale}/wuthering-waves/tierlist/characters`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  title="Wuthering Waves tier list - Best characters ranked"
                >
                  Tierlist Characters
                </Link>
                <Link
                  href={`/${locale}/wuthering-waves/tierlist/weapons`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  title="Wuthering Waves weapon tier list - Best weapons ranked"
                >
                  Tierlist Weapons
                </Link>
                <Link
                  href={`/${locale}/wuthering-waves/tierlist/echoes`}
                  className="my-1 text-sm text-muted-foreground hover:text-primary"
                  prefetch={false}
                  title="Wuthering Waves echoes tier list - Best echoes for builds"
                >
                  Tierlist Echoes
                </Link>
              </div>
            </div>
          </div>

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
