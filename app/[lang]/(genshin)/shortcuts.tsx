import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { Link } from "@i18n/navigation";
import { getUrl } from "@lib/imgUrl";

export default async function Shortcuts() {
  const t = await getTranslations("Genshin.layout");

  const routes = [
    {
      title: t("characters"),
      path: "/characters",
      image: getUrl("/characters_icon.png"),
    },
    {
      title: t("weapons"),
      path: "/weapons",
      image: getUrl("/weapons_icon.png"),
    },
    {
      title: t("artifacts"),
      path: "/artifacts",
      image: getUrl("/artifacts_icon.png"),
    },
    {
      title: t("builds"),
      path: "/builds",
      image: getUrl("/builds_icon.png"),
    },
    {
      title: t("teams"),
      path: "/teams",
      image: getUrl("/teams_icon.png"),
    },
    {
      title: t("tierlist"),
      path: "/tierlist",
      image: getUrl("/tierlist_icon.png"),
    },
    {
      title: t("tcg"),
      path: "/tcg",
      image: getUrl("/tcg_icon.png"),
    },
    {
      title: t("tcg") + " " + t("best_decks"),
      path: "/tcg/best-decks",
      image: getUrl("/best_decks_icon.png"),
    },
    {
      title: t("materials"),
      path: "/materials",
      image: getUrl("/materials_icon.png"),
    },
    {
      title: t("food"),
      path: "/food",
      image: getUrl("/food_icon.png"),
    },
    {
      title: t("banners"),
      path: "/banners/characters",
      image: getUrl("/banners_icon.png"),
    },
    {
      title: t("leaderboard"),
      path: "/leaderboard",
      image: getUrl("/leaderboard_icon.png"),
    },
  ];

  return (
    <nav className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />

      <ul className="relative grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:gap-4">
        {routes.map((route) => (
          <li
            className="group relative transform transition-all duration-300 hover:scale-105"
            key={route.title}
          >
            <Link href={route.path} className="block overflow-hidden">
              <div className="relative flex flex-col items-center rounded-xl bg-muted/40 p-3 transition-all duration-500 hover:bg-muted">
                <div className="relative h-12 w-12 md:h-16 md:w-16">
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Icon background */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-muted/50 to-secondary/50 shadow-lg" />

                  {/* Icon */}
                  <div className="relative flex h-full w-full items-center justify-center">
                    <Image
                      src={route.image}
                      alt={route.title}
                      width={64}
                      height={64}
                      className="h-10 w-10 transform-gpu object-contain transition-all duration-300 group-hover:scale-110 md:h-12 md:w-12"
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="relative mt-3">
                  <p className="text-center text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground md:text-base">
                    {route.title}
                  </p>

                  {/* Underline effect */}
                  <div className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
