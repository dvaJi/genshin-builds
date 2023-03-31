import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";

import { getBuild } from "@pages/api/get_build";
import BuildsTable from "@components/genshin/ProfileBuildsTable";
import ArtifactsTable from "@components/genshin/ProfileArtifactsTable";

import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";
import { Profile } from "interfaces/profile";
import { MdSync } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import useIntl from "@hooks/use-intl";

const ProfileFavorites = dynamic(
  () => import("@components/genshin/ProfileFavorites"),
  { ssr: false }
);

interface Props {
  profile: Profile;
}

function Profile({ profile }: Props) {
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
      .then((res) => res.json())
      .then((json) => {
        if (json.statusCode !== 200) {
          refreshData();
        }
      })
      .finally(() => {
        setIsSyncing(false);
      });
  };
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
            <div>
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
                className="rounded-xl"
                alt="profile"
              />
            </div>
            <div className="flex flex-col justify-center p-4">
              <span className="text-xs">
                {t({
                  id: "uuid",
                  defaultMessage: "UUID: {uuid}",
                  values: { uuid: profile.uuid },
                })}
              </span>
              <h2 className="text-4xl font-semibold text-white">
                {profile.nickname}
              </h2>
              <p className="italic text-slate-300">{profile.signature}</p>
            </div>
          </div>
          <div className="m-4 flex items-baseline justify-end">
            <div
              className="mx-1 rounded-lg bg-gray-600 py-1 px-2 font-semibold text-slate-50"
              title="Region"
            >
              {profile.region}
            </div>
            <div
              className="mx-1 rounded-lg bg-yellow-700 py-1 px-2 font-semibold text-slate-50"
              title="Level"
            >
              AR{profile.level}
            </div>
            <div
              className="mx-1 cursor-pointer rounded-lg bg-gray-700/40 py-1 px-2 font-semibold text-slate-50 hover:bg-gray-700/90"
              title="Sync Data"
              onClick={onSync}
            >
              <MdSync
                className={clsx("-mt-1 inline-block", {
                  "animate-spin": isSyncing,
                })}
              />
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
