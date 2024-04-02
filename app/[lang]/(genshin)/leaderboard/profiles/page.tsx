import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import Button from "@components/ui/Button";
import useTranslations from "@hooks/use-translations";
import { db } from "@lib/db";
import { players } from "@lib/db/schema";
import { ProfileTable } from "./datatable";

type Props = {
  params: {
    lang: string;
  };
  searchParams: Record<string, string>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "leaderboard_profiles"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Profiles Lookup",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Discover how to add your Genshin Impact account to GenshinBuilds for profile lookup. Ensure your in-game profile settings are correctly configured. Learn about updating showcases, using in-game nicknames, UIDs, and Enka.Network's profile names.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/leaderboard/profiles`,
    locale,
  });
}

export default async function ProfilesAchievementsPage({
  params,
  searchParams,
}: Props) {
  const { page } = searchParams;

  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    return <div>Invalid page number</div>;
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
        <h1 className="text-2xl font-semibold text-gray-200">
          Genshin Impact Profiles Lookup
        </h1>
        <p>
          Learn how to add your Genshin Impact account to Genshin-Builds for
          profile lookup. Ensure your in-game profile settings are correctly
          configured to enable access. Please note that Genshin showcases may
          take up to 5 minutes to update. Use in-game account UID for profile
          lookup.
        </p>
        <Link href={`/${params.lang}/profile`}>
          <Button className="mt-4">Add your profile</Button>
        </Link>
      </div>
      <ProfileTable data={playersData} />
      <div className="my-4 flex items-center justify-center gap-2 text-sm text-slate-300">
        <Link href={`/leaderboard/profiles?page=${Number(page ?? "1") - 1}`}>
          <button
            className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
            disabled={(page ?? "1") === "1"}
          >
            Previous
          </button>
        </Link>
        {/* <span className="mx-2 text-lg">{pagination.pageIndex + 1}</span> */}
        <Link href={`/leaderboard/profiles?page=${Number(page ?? "1") + 1}`}>
          <button
            className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
            disabled={playersData.length < 20}
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
}
