import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import DynamicBackground from "@components/DynamicBackground";
import ProfileArtifactsTable from "@components/genshin/ProfileArtifactsTable";
import ProfileBuildsTable from "@components/genshin/ProfileBuildsTable";
import { FavoriteGenshinProfile } from "./favorite";
import { SyncGenshinProfile } from "./sync";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getBuild, getPlayer } from "@lib/genshinShowcase";
import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { Profile } from "interfaces/profile";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

const ProfileFavorites = dynamic(
  () => import("@components/genshin/ProfileFavorites"),
  { ssr: false }
);

type Props = {
  params: { lang: string; uid: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "profile"
  );
  const player = await getPlayer(params.uid);

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
    path: `/profile/${params.uid}`,
    image: getUrl(`/profile/${player.namecardId}_1.png`),
    locale,
  });
}

export default async function GenshinPlayerProfile({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "profile"
  );

  const player = await getPlayer(params.uid);

  if (!player) {
    return notFound();
  }

  const res = await getBuild(langData, params.uid);

  if (res.code !== 200 || !res.data) {
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
      <div className="relative">
        <ProfileFavorites />
      </div>
      <div
        className="relative mt-4 rounded-xl bg-cover bg-center"
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
                  values: { uuid: params.uid },
                })}
                {/* <span className="ml-2 inline-block">| {timeAgo}</span> */}
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
            <SyncGenshinProfile lang={params.lang} uid={params.uid} />
            <FavoriteGenshinProfile profile={profile} />
          </div>
        </div>
      </div>
      <div>
        <ProfileBuildsTable data={profile.builds} />
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <div>
        <ProfileArtifactsTable data={profile.builds} />
      </div>
      <div className="mt-4 flex justify-center">
        <a href="https://enka.network/" target="_blank" rel="noreferrer">
          <img
            src={getUrl(`/enka_logo.png`, 42, 167)}
            width="167"
            height="42"
            alt="Enka Network"
          />
        </a>
      </div>
    </>
  );
}
