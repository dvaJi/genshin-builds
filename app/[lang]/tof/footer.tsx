import Link from "next/link";
import { AiOutlineTwitter } from "react-icons/ai";
import { RiPatreonFill } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="z-20 border-t border-gray-700 border-opacity-50 bg-vulcan-800 px-20 py-14 text-gray-400">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col">
            <h4 className="mb-3 text-gray-200">TOFBuilds</h4>
            <Link href="/privacy-policy" className="my-2" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="/contact" className="my-2" prefetch={false}>
              Contact
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
                  href={`/en/characters`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Characters
                </Link>
                <Link
                  href={`/en/teams`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Best Teams
                </Link>
                <Link
                  href={`/en/builds`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Builds
                </Link>
              </div>

              {/* Honkai: Star Rail */}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-foreground">
                  Honkai: Star Rail
                </p>
                <Link
                  href={`/en/hsr`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Characters
                </Link>
                <Link
                  href={`/en/hsr/tierlist`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
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
                  href={`/en/zenless/characters`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Characters
                </Link>
                <Link
                  href={`/en/zenless/tierlist`}
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
                  href={`/en/wuthering-waves`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Characters
                </Link>
                <Link
                  href={`/en/wuthering-waves/tierlist/characters`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Tierlist Characters
                </Link>
                <Link
                  href={`/en/wuthering-waves/tierlist/weapons`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Tierlist Weapons
                </Link>
                <Link
                  href={`/en/wuthering-waves/tierlist/echoes`}
                  className="my-1 text-sm text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Tierlist Echoes
                </Link>
              </div>
            </div>
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
