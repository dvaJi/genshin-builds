import Link from "next/link";

import useTranslations from "@hooks/use-translations";
import { getUrl } from "@lib/imgUrl";

export default async function Shortcuts({ lang }: { lang: string }) {
  const { t } = await useTranslations(lang, "genshin", "layout");

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
    <nav className="card">
      <ul className="group grid grid-cols-4 md:grid-cols-6">
        {routes.map((route) => (
          <li className="relative" key={route.title}>
            <Link
              href={`/${lang}${route.path}`}
              className="flex flex-col items-center justify-center bg-contain bg-center bg-no-repeat py-4 transition-opacity group-hover:opacity-70 group-hover:hover:opacity-100 group-hover:hover:brightness-200"
              style={{
                backgroundImage:
                  `url('${getUrl("/shortcuts_bg.png")}')`,
              }}
            >
              <p className="h-16 w-16">
                <img
                  src={route.image}
                  alt={route.title}
                  className="object-cover object-center"
                />
              </p>
              <p className="mt-0.5 px-1 text-center font-semibold">
                {route.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
