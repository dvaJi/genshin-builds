import clsx from "clsx";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdStar, MdSync } from "react-icons/md";

import ArtifactsTable from "@components/genshin/ProfileArtifactsTable";
import BuildsTable from "@components/genshin/ProfileBuildsTable";
import { getBuild } from "@pages/api/get_build";

import useIntl from "@hooks/use-intl";
import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { getTimeAgo } from "@lib/timeago";
import { isProfileFav, updateFavorites } from "@state/profiles-fav";
import { localeToLang } from "@utils/locale-to-lang";
import { Profile } from "interfaces/profile";

const ProfileFavorites = dynamic(
  () => import("@components/genshin/ProfileFavorites"),
  { ssr: false }
);

interface Props {
  profile: Profile;
  locale: string;
}

function Profile({ profile, locale }: Props) {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const { t } = useIntl("profile");
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const onSync = () => {
    setIsSyncing(true);
    fetch("/api/submit_uuid?uid=" + profile.uuid, {
      method: "POST",
    })
      .then(() => refreshData())
      .finally(() => {
        setIsSyncing(false);
      });
  };

  const onFavorite = () => {
    updateFavorites({
      uuid: profile.uuid,
      nameCardId: profile.namecardId,
      nickname: profile.nickname,
      profilePictureId: profile.profilePictureId,
    });
  };

  const timeAgo = getTimeAgo(new Date(profile.updatedAt).getTime(), locale);

  return (
    <div>
      <ProfileFavorites />
      <div
        className="mt-4 rounded-xl bg-cover bg-center"
        style={{
          backgroundImage: `url(${getUrlLQ(
            `/profile/${profile.namecardId}_1.png`
          )})`,
        }}
      >
        <div className="flex w-full justify-between bg-vulcan-900/50 shadow-xl">
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
                  values: { uuid: profile.uuid },
                })}
                <span className="inline-block ml-2">| {timeAgo}</span>
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
            <div
              className="mx-px cursor-pointer rounded-lg bg-gray-700/40 px-2 py-1 text-xs font-semibold text-slate-50 hover:bg-gray-700/90 md:mx-1 md:text-base"
              title="Sync Data"
              onClick={onSync}
            >
              <MdSync
                className={clsx("-mt-1 inline-block", {
                  "animate-spin": isSyncing,
                })}
              />
            </div>
            <div
              className={clsx(
                "mx-px cursor-pointer rounded-lg bg-gray-700/40 px-2 py-1 text-xs font-semibold text-slate-50 hover:bg-gray-700/90 md:mx-1 md:text-base",
                {
                  "bg-yellow-500": isProfileFav(profile.uuid),
                }
              )}
              title="Favorite profile"
              onClick={onFavorite}
            >
              <MdStar className="-mt-1 inline-block" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <BuildsTable data={profile.builds} />
      </div>
      <div>
        <ArtifactsTable data={profile.builds} />
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale = "en",
}) => {
  if (!params) {
    return {
      notFound: true,
    };
  }
  const uid = params.uid;

  if (typeof uid !== "string") {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  const res = await getBuild(localeToLang(locale), uid);

  if (res.code !== 200) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  const lngDict = await getLocale(locale, "genshin");
  const profile = res.data;

  return {
    props: {
      locale,
      lngDict,
      profile,
      bgStyle: {
        image: getUrlLQ(`/profile/${profile.namecardId}_1.png`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default Profile;
