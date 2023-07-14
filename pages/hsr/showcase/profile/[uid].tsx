import clsx from "clsx";
import { renderDescription } from "hsr-data";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AiFillLock } from "react-icons/ai";
import { Tooltip } from "react-tooltip";

import Stars from "@components/hsr/Stars";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHsrUrl, getHsrUrlLQ, getUrl } from "@lib/imgUrl";
import { getData, getLocale } from "@lib/localData";
import { getBuild } from "@pages/api/hsr/get_build";
import { localeToHSRLang } from "@utils/locale-to-lang";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  profile: any;
  propertiesCommon: Record<string, string>;
};

function Profile({ profile, propertiesCommon }: Props) {
  const [buildSelected, setBuildSelected] = useState(profile.builds[0]);
  const formatValues = (value: number, type: string) => {
    if (type.endsWith("_percent")) {
      return (value * 100).toFixed(1) + "%";
    }

    return Math.round(value);
  };

  return (
    <div>
      <section className="relative z-10 flex bg-hsr-surface1 p-4 shadow-2xl">
        <div>
          <img
            className="shadow-1 mx-auto rounded-full border-4 border-hsr-accent"
            width="100"
            height="100"
            alt="Icon"
            src={getHsrUrl(`/profiles/${profile.profilePictureId}.png`)}
          />
          <div className="font-header py-2 text-center text-2xl font-bold">
            {profile.nickname}
          </div>
        </div>
        <div className="mx-auto grid max-w-xl cursor-default grid-cols-2 gap-2 p-2 pt-2">
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1 truncate">UID</span>
            <span>{profile.uuid}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Trailblaze Lvl</span>
            <span>{profile.level}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Equilibrium Lvl</span>
            <span>{profile.worldLevel}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Achievements</span>
            <span>{profile.finishAchievementNum}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Characters</span>
            <span>{profile.friends}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Simulated</span>
            <span>{profile.passAreaProgress}</span>
          </div>
        </div>
      </section>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="relative z-20 my-6 flex items-center justify-center gap-3">
        {profile.builds.map((build: any) => (
          <button
            key={build._id}
            onClick={() => setBuildSelected(build)}
            className={clsx(
              "cursor-pointer rounded-full border-2 text-center align-middle shadow",
              {
                "border-hsr-accent": buildSelected._id === build._id,
                "border-black/10": buildSelected._id !== build._id,
              }
            )}
            data-tooltip-id="characters_tooltip"
            data-tooltip-content={build.name}
          >
            <div
              className={clsx(
                "flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 transition-all",
                buildSelected._id === build._id
                  ? "border-white/50 hover:border-white"
                  : "border-black/30 hover:border-white/60",
                {
                  "bg-yellow-700": build.rarity === 5,
                  "bg-purple-700": build.rarity === 4,
                }
              )}
            >
              <img
                className="color-rarity-5 h-16 w-16 rounded-full object-contain"
                width="100"
                height="100"
                alt={build.name}
                src={getHsrUrlLQ(`/profiles/${build.avatarId}.png`)}
              />
            </div>
          </button>
        ))}
        <Tooltip id="characters_tooltip" />
      </div>
      <div
        className="relative mx-auto flex min-h-[500px] max-w-[1100px] select-none overflow-hidden rounded-lg bg-zinc-900 bg-cover shadow-xl"
        style={{
          backgroundImage: `url(${getHsrUrl(
            `/bg/bgelement_${buildSelected.combat_type.id}.webp`
          )})`,
        }}
      >
        <img
          className="absolute -left-10 -top-10 z-10"
          src={getHsrUrl(
            `/profiles/${buildSelected.avatarId}_portrait.png`,
            600,
            600
          )}
          alt={buildSelected.name}
        />
        <div className="z-20 flex w-full justify-between gap-2 p-4">
          <div className="w-[450px]">
            <div className="text-4xl text-white shadow-black text-shadow">
              {buildSelected.name}
            </div>
            <div className="text-xl text-white shadow-black text-shadow">
              Lv.{buildSelected.level}
            </div>
            <div className="text-xl text-white shadow-black text-shadow">
              <Stars stars={buildSelected.rarity} />
            </div>
            <div className="mt-4 flex justify-between">
              <div className="flex flex-col gap-2">
                {buildSelected.ranks.map((rank: any, i: number) => (
                  <div
                    key={rank._id}
                    className="relative h-12 w-12 rounded-full border-2 border-white/50 bg-hsr-bg/80"
                    data-tooltip-id="talents_tooltip"
                    data-tooltip-place="right"
                    data-title-attr={rank.name}
                    data-tooltip-content={rank.desc}
                  >
                    <img
                      src={getHsrUrl(
                        `/profiles/${buildSelected.avatarId}_rank${i + 1}.png`,
                        70,
                        70
                      )}
                      alt={rank.name}
                    />
                    {!rank.isUnlocked ? (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                        <AiFillLock className="fill-white/80 text-xl" />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                {buildSelected.skills.map((skill: any, i: number) => (
                  <div
                    key={skill._id}
                    className="relative h-14 w-14 rounded-full border-2 border-white/50 bg-hsr-bg/80"
                    data-tooltip-id="talents_tooltip"
                    data-tooltip-place="left"
                    data-title-attr={skill.name}
                    data-tooltip-content={renderDescription(
                      skill.desc,
                      skill.levels[skill.level - 1].params
                    )}
                  >
                    <img
                      src={getHsrUrl(
                        `/profiles/${buildSelected.avatarId}_skill${i + 1}.png`,
                        60,
                        60
                      )}
                      alt={skill.name}
                    />
                    <div className="absolute -bottom-2 right-3 rounded bg-black px-3 text-xxs text-white">
                      {skill.level}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Tooltip
              id="talents_tooltip"
              render={({ content, activeAnchor }) => (
                <div className="z-40 w-44 text-xs">
                  <div className="pb-0.5 text-hsr-accent">
                    {activeAnchor?.getAttribute("data-title-attr")}
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: content ?? "" }} />
                </div>
              )}
            />
          </div>
          <div className="flex gap-6">
            <div className="w-[270px] flex-shrink-0">
              {/* LIGHTCONE */}
              <div className="flex gap-2">
                <div className="flex flex-shrink-0 flex-col items-center rounded border border-white/40 bg-gray-500">
                  <img
                    src={getHsrUrl(
                      `/lightcones/${buildSelected.lightCone.id}.png`,
                      90,
                      70
                    )}
                    alt={buildSelected.lightCone.name}
                  />
                  <Stars stars={buildSelected.lightCone.rarity} />
                </div>
                <div className="whitespace-break-spaces break-words">
                  <div className="text-white">
                    {buildSelected.lightCone.name}
                  </div>
                  <div className="text-white">
                    R{buildSelected.lightCone.rank} - Lv.
                    {buildSelected.lightCone.level}
                  </div>
                </div>
                {/* <div>
                weapon stats
              </div> */}
              </div>
              {/* CHARACTER STATS */}
              <div className="mt-2 flex flex-col shadow-lg">
                {Object.entries(buildSelected.attributes).map(
                  ([key, value]: any) => (
                    <div
                      key={key + value}
                      className="flex items-center justify-between border border-transparent border-b-black/20 bg-black/40 px-1 first:rounded-t"
                    >
                      <div className="flex flex-grow items-center gap-2">
                        <div>
                          <div className="flex h-6 w-6 items-center justify-center">
                            <img
                              width="50"
                              height="50"
                              alt={key}
                              src={getHsrUrl(`/property/${key}.png`)}
                            />
                          </div>
                        </div>
                        <div className="text-sm font-bold">
                          {propertiesCommon[key]}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-200">
                          {buildSelected.additions[key]
                            ? formatValues(
                                value + buildSelected.additions[key],
                                key
                              )
                            : formatValues(value, key)}
                        </div>
                        <div className="text-xxs">
                          <span>{formatValues(value, key)}</span>
                          {buildSelected.additions[key] ? (
                            <span className="ml-1 text-green-500">
                              +{formatValues(buildSelected.additions[key], key)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )
                )}
                {Object.entries(buildSelected.additions)
                  .filter(([key]: any) => !buildSelected.attributes[key])
                  .map(([key, value]: any) => (
                    <div
                      key={key + value}
                      className="not:last:border-b-black/20 flex items-center justify-between border border-transparent bg-black/40 px-1 last:rounded-b"
                    >
                      <div className="flex flex-grow items-center gap-2">
                        <div>
                          <div className="flex h-6 w-6 items-center justify-center">
                            <img
                              width="50"
                              height="50"
                              alt={key}
                              src={getHsrUrl(`/property/${key}.png`)}
                            />
                          </div>
                        </div>
                        <div className="text-sm font-bold">
                          {propertiesCommon[key]}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-200">
                          {buildSelected.additions[key]
                            ? formatValues(
                                value + buildSelected.additions[key],
                                key
                              )
                            : formatValues(value, key)}
                        </div>
                        <div className="text-xxs">
                          <span className="text-green-500">
                            {formatValues(buildSelected.additions[key], key)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {/* RELICS */}
              {buildSelected.relics.map((relic: any) => (
                <div
                  key={relic.id}
                  className="flex gap-2 rounded bg-black/50 shadow-lg"
                >
                  <div
                    className="relative rounded-l bg-cover"
                    data-tooltip-id="relic_tooltip"
                    data-tooltip-content={relic.name}
                    data-data-tooltip-place="left"
                    style={{
                      backgroundImage: `url(${getUrl(
                        `/bg_${relic.rarity}star.png`
                      )})`,
                    }}
                  >
                    <img
                      src={getHsrUrl(
                        `/profiles/${relic.setId}_${relic.type}.png`,
                        50,
                        50
                      )}
                      alt={relic?.name}
                    />
                    <div className="absolute bottom-1 right-1 z-30 rounded bg-black/60 p-0.5 text-xxs text-white">
                      +{relic?.level}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-11">
                      {Object.entries(relic?.mainStat).map(
                        ([key, value]: any) => (
                          <div
                            key={key + value}
                            className="flex flex-grow cursor-default flex-col items-center justify-center rounded p-1"
                          >
                            <div className="inline-flex h-5 w-5 items-center justify-center gap-1">
                              <img
                                width="60"
                                height="60"
                                alt={key}
                                src={getHsrUrl(`/property/${key}.png`)}
                              />
                            </div>
                            <div className="text-xs font-bold">
                              {formatValues(value, key)}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex w-44 flex-wrap">
                      {Object.entries(relic?.subStats).map(
                        ([key, value]: any) => (
                          <div
                            key={key + value.value}
                            className="flex w-[5.5rem] cursor-default items-center justify-start px-1 py-0.5"
                          >
                            <div>
                              <div className="flex items-center gap-1">
                                <div className="inline-flex h-4 w-4 items-center justify-center rounded-full">
                                  <img
                                    className="object-fit"
                                    width="20"
                                    height="20"
                                    alt={key}
                                    src={getHsrUrl(`/property/${key}.png`)}
                                  />
                                </div>
                                <div className="text-xs">
                                  +{formatValues(value.value, key)}
                                </div>
                              </div>
                              <div className="mt-0.5 flex w-full">
                                <div className="mx-1 -mt-3 inline-flex w-full justify-center text-center text-lg leading-none text-blue-500  ">
                                  {Array.from({ length: value.count }).join(
                                    "."
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Tooltip id="relic_tooltip" />
              <div className="flex flex-col gap-1">
                {/* SETS */}
                {Object.values(buildSelected.sets).map((set: any) => (
                  <div
                    key={set.id}
                    className="flex items-center justify-between rounded-lg bg-black/50 px-3 py-2 text-xs shadow-lg"
                    data-tooltip-id="relics_tooltip"
                    data-tooltip-content={set.name}
                    data-tooltip-effect2={
                      set.count >= 2 ? set.effects["2"] : ""
                    }
                    data-tooltip-effect4={
                      set.count >= 4 ? set.effects["4"] : ""
                    }
                  >
                    <div>{set.name}</div>
                    <div className="relative flex h-6 w-6 items-center justify-center rounded bg-black/60 font-bold text-white">
                      {set.count}
                    </div>
                  </div>
                ))}
                <Tooltip
                  id="relics_tooltip"
                  render={({ content, activeAnchor }) => (
                    <div className="z-40 w-44 text-xs">
                      <div className="pb-1 font-semibold text-hsr-accent">
                        {content}
                      </div>
                      <div className="flex flex-col">
                        {activeAnchor?.getAttribute("data-tooltip-effect2") ? (
                          <div className="flex items-start gap-2">
                            <div className="rounded bg-black px-2 py-1 text-xxs">
                              2
                            </div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  activeAnchor?.getAttribute(
                                    "data-tooltip-effect2"
                                  ) ?? "",
                              }}
                            />
                          </div>
                        ) : null}
                        {activeAnchor?.getAttribute("data-tooltip-effect4") ? (
                          <div className="mt-2 flex items-start gap-2">
                            <div className="rounded bg-black px-2 py-1 text-xxs">
                              4
                            </div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  activeAnchor?.getAttribute(
                                    "data-tooltip-effect4"
                                  ) ?? "",
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <button className="border-color shadow-1 max-desktop:mt-[1px] max-desktop:border-t-0 desktop:mt-1 desktop:rounded-full absolute left-1/2 z-20 flex -translate-x-1/2 transform items-center gap-2.5 rounded-b-xl border-2 bg-white py-2.5 pl-5 pr-6 text-sm font-bold shadow dark:bg-zinc-800">
          Download
        </button> */}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
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

  const res = await getBuild(localeToHSRLang(locale), uid);

  if (res.code !== 200) {
    return {
      redirect: {
        destination: "/hsr/showcase",
        permanent: false,
      },
    };
  }

  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");
  const propertiesCommon = await getData<
    Record<string, Record<string, string>>
  >("hsr", "properties_common");
  const profile = res.data;

  return {
    props: {
      locale,
      lngDict,
      propertiesCommon: propertiesCommon[localeToHSRLang(locale)],
      profile,
      // bgStyle: {
      //   image: getHsrUrlLQ(`/bg/normal-bg.webp`),
      //   gradient: {
      //     background:
      //       "linear-gradient(rgba(26,20,26,.6),rgb(21, 20, 26) 900px)",
      //   },
      // },
    },
  };
};

export default Profile;
