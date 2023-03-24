import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";
import { GetServerSideProps } from "next";
import BuildsTable from "@components/genshin/ProfileBuildsTable";
import ArtifactsTable from "@components/genshin/ProfileArtifactsTable";
import { getURL } from "@utils/helpers";

function Profile({ profile }: any) {
  return (
    <div>
      <div
        className="rounded-xl bg-cover bg-center"
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
              <span className="text-xs">UUID: {profile.uuid}</span>
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
          </div>
        </div>
      </div>
      <div>
        <BuildsTable data={profile.builds} />
      </div>
      <div>
        <ArtifactsTable data={profile.builds} />
      </div>
      <div className="flex justify-center">
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
      }
    };
  }

  const res = await fetch(
    `${getURL()}/api/get_build?uid=${uid}&lang=${localeToLang(
      locale
    )}`
  );

  // TODO: handle when the profile is not processed yet, vs when the profile is not found (uuid not valid)
  if (!res.ok) {
    console.log(res.body);
    return {
      notFound: true,
    };
  }

  const lngDict = await getLocale(locale, "genshin");
  const profile = await res.json();

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
