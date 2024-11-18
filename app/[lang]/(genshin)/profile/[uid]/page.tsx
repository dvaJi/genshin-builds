import { Profile } from "interfaces/profile";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { submitGenshinUID } from "@app/actions";
import { genPageMetadata } from "@app/seo";
import DynamicBackground from "@components/DynamicBackground";
import TimeAgo from "@components/TimeAgo";
import ProfileArtifactsTable from "@components/genshin/ProfileArtifactsTable";
import ProfileBuildsTable from "@components/genshin/ProfileBuildsTable";
import ProfileFavorites from "@components/genshin/ProfileFavorites";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getBuild, getPlayer } from "@lib/genshinShowcase";
import { getUrl, getUrlLQ } from "@lib/imgUrl";

import { FavoriteGenshinProfile } from "./favorite";
import { SyncGenshinProfile } from "./sync";

type Props = {
  params: Promise<{ lang: string; uid: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, uid } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "profile");
  const player = await getPlayer(uid);

  if (!player) return undefined;

  const title = t({
    id: "title",
    defaultMessage: "{name} Genshin Impact Showcase",
    values: { name: player.nickname },
  });
  const description = t({
    id: "description",
    defaultMessage: "Genshin Impact Showcase for {name}",
    values: { name: player.nickname },
  });

  return genPageMetadata({
    title,
    description,
    path: `/profile/${uid}`,
    image: getUrl(`/profile/${player.namecardId}_1.png`),
    locale,
  });
}

export default async function GenshinPlayerProfile({ params }: Props) {
  const { lang, uid } = await params;
  const { t, langData, locale } = await getTranslations(
    lang,
    "genshin",
    "profile"
  );

  if (!uid || !/^\d{6,10}$/.test(uid.toString())) {
    console.log("Invalid UID", uid);
    return notFound();
  }

  const player = await getPlayer(uid);

  if (!player) {
    console.log("Player not found", uid);
    const formdata = new FormData();
    formdata.append("uid", uid);
    const submitRes = await submitGenshinUID({}, formdata);
    if (submitRes.message !== "Success") {
      return notFound();
    }
  }

  const res = await getBuild(langData, uid);

  if (res.code !== 200 || !res.data) {
    console.log("Build not found", uid);
    return notFound();
  }

  const profile = res.data as Profile;
  const bgImage = getUrlLQ(`/profile/${profile.namecardId}_1.png`);
  const bgGradient = "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)";

  return (
    <>
      <DynamicBackground
        bgStyle={{ image: bgImage, gradient: { background: bgGradient } }}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div className="relative z-10">
        <ProfileFavorites />
      </div>
      <div
        className="relative z-10 mt-4 rounded-xl bg-cover bg-center"
        style={{
          backgroundImage: `url(${getUrlLQ(
            `/profile/${profile.namecardId}_1.png`
          )})`,
        }}
      >
        <div className="flex w-full justify-between rounded-xl bg-vulcan-900/50 shadow-xl">
          <div className="flex">
            <div className="flex items-center">
              <img
                src={getUrl(
                  `/profile/${
                    profile.profileCostumeId
                      ? profile.profileCostumeId
                      : profile.profilePictureId
                  }.png`,
                  142,
                  142
                )}
                className="m-2 min-w-[90px] rounded-full border-2 border-vulcan-600 md:m-0 md:rounded-xl md:border-0"
                alt="profile"
              />
            </div>
            <div className="flex flex-col justify-center p-2 md:p-4">
              <span className="text-xxs md:text-xs">
                {t({
                  id: "uuid",
                  defaultMessage: "UUID: {uuid}",
                  values: { uuid: uid },
                })}
                <span className="ml-2 inline-block">
                  | <TimeAgo date={profile.updatedAt} locale={locale} />
                </span>
              </span>
              <h2 className="text-xl font-semibold text-white md:text-4xl">
                {profile.nickname}
              </h2>
              <p className="text-xxs italic text-slate-300 md:text-sm">
                {profile.signature}
              </p>
            </div>
          </div>
          <div className="m-4 flex flex-wrap items-baseline justify-end">
            <div
              className="mx-px rounded-lg bg-gray-600 px-2 py-1 text-xs font-semibold text-slate-50 md:mx-1 md:text-base"
              title="Region"
            >
              {profile.region}
            </div>
            <div
              className="mx-px rounded-lg bg-yellow-700 px-2 py-1 text-xs font-semibold text-slate-50 md:mx-1 md:text-base"
              title="Level"
            >
              AR{profile.level}
            </div>
            <SyncGenshinProfile lang={lang} uid={uid} />
            <FavoriteGenshinProfile profile={profile} />
          </div>
        </div>
      </div>
      {profile.builds.length === 0 ? (
        <div className="card relative z-10 m-2 mx-auto max-w-xl text-center text-white">
          Please enable the &quot;Show Character Details&quot; option in your
          Character Showcase in-game to see the details.
        </div>
      ) : null}
      <div>
        <ProfileBuildsTable data={profile.builds} />
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center", "z-10"]}
      />
      <div>
        <ProfileArtifactsTable data={profile.builds} />
      </div>
    </>
  );
}
