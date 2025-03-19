import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Button from "@components/ui/Button";
import { Link } from "@i18n/navigation";
import { db } from "@lib/db";
import { players } from "@lib/db/schema";

import { ProfileTable } from "./datatable";

type Props = {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<Record<string, string>>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.leaderboard_profiles",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/leaderboard/profiles`,
    locale: lang,
  });
}

export default async function ProfilesAchievementsPage({
  // params,
  searchParams,
}: Props) {
  // const { lang } = await params;
  const { page } = await searchParams;
  const t = await getTranslations("Genshin.leaderboard_profiles");

  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    return <div>{t("invalid_page_number")}</div>;
  }

  // const totalPlayers = await db.select({ count: count() }).from(players);
  const perPage = 20;
  const playersData = await db.query.players.findMany({
    orderBy: [desc(players.finishAchievementNum)],
    limit: perPage,
    offset: (Number(page ?? "1") - 1) * 20,
  });

  return (
    <div>
      <div className="card">
        <h1 className="text-2xl font-semibold text-gray-200">{t("title")}</h1>
        <p>{t("description")}</p>
        <Link href={`/profile`} prefetch={false}>
          <Button className="mt-4">{t("add_profile")}</Button>
        </Link>
      </div>
      <ProfileTable data={playersData} />
      <div className="my-4 flex items-center justify-center gap-2 text-sm text-slate-300">
        <Link
          href={`/leaderboard/profiles?page=${Number(page ?? "1") - 1}`}
          prefetch={false}
        >
          <button
            className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
            disabled={(page ?? "1") === "1"}
          >
            {t("previous")}
          </button>
        </Link>
        {/* <span className="mx-2 text-lg">{pagination.pageIndex + 1}</span> */}
        <Link
          href={`/leaderboard/profiles?page=${Number(page ?? "1") + 1}`}
          prefetch={false}
        >
          <button
            className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
            disabled={playersData.length < 20}
          >
            {t("next")}
          </button>
        </Link>
      </div>
    </div>
  );
}
