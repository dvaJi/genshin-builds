import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import { getLangData } from "@i18n/langData";
import type { Echoes } from "@interfaces/wuthering-waves/echoes";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";
import { getImg } from "@lib/imgUrl";
import { formatSimpleDesc } from "@utils/template-replacement";

type Props = {
  params: Promise<{ lang: string; id: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 43200;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, id } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "WW.echo",
  });
  const langData = getLangData(lang, "wuthering-waves");

  const item = await getWWData<Echoes>({
    resource: "echoes",
    language: langData,
    filter: {
      id,
    },
  });

  if (!item) {
    return;
  }

  return genPageMetadata({
    title: t("title", {
      echoName: item.name,
    }),
    description: t("description", {
      echoName: item.name,
    }),
    path: `/wuthering-waves/echoes/${id}`,
    image: getImg("wuthering", `/echoes/${item.icon.split("/").pop()}.webp`),
    locale: langData,
  });
}

export default async function Page({ params }: Props) {
  const { lang, id } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("WW.echo");
  const langData = getLangData(lang, "wuthering-waves");

  const item = await getWWData<Echoes>({
    resource: "echoes",
    language: langData,
    filter: {
      id,
    },
  });

  if (!item) {
    return notFound();
  }

  return (
    <div className="my-2">
      <div className="flex gap-4 px-2 lg:px-0">
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className={`flex-shrink-0 flex-grow-0 rarity-${item.intensityCode + 1} h-[140px] w-[140px] overflow-hidden rounded-lg`}
          >
            <Image
              src={`/echoes/${item.icon.split("/").pop()}.webp`}
              alt={item.name}
              width={140}
              height={140}
            />
          </div>
        </div>
        <div className="">
          <h1 className="mb-2 text-3xl text-white">
            {t("main_title", {
              echoName: item.name,
            })}
          </h1>
          <div className="flex flex-col items-baseline gap-2">
            <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
              <span className="text-xs">{t("code")}:</span>
              {item.code}
            </div>

            <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
              <span className="text-xs">{t("type")}:</span>
              {item.type}
            </div>

            <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
              <span className="text-xs">{t("rarity")}:</span>
              {item.intensity} ({t("cost")} {item.intensityCode + 1})
            </div>

            <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
              <span className="text-xs">{t("birthplace")}:</span>
              {item.place}
            </div>
          </div>
          <p className="mt-2 max-w-3xl rounded bg-ww-900 p-2 text-sm leading-relaxed text-ww-50 md:bg-transparent md:p-0">
            {item.skill.simpleDesc}
          </p>
        </div>
      </div>

      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="text-xl text-ww-100">
        {t("echo_skill", {
          echoName: item.name,
        })}
      </h2>
      <div className="relative z-20 mx-2 mb-2 flex rounded border border-zinc-800 bg-zinc-900 p-2 py-4 text-ww-50 lg:mx-0">
        <Image
          src={`/echoes_skills/${item.skill.icon.split("/").pop()}.webp`}
          className="mx-2 my-auto h-24 w-24 rounded-full border-2 border-ww-500"
          width={96}
          height={96}
          alt={item.skill.icon}
        />
        <div
          className="mx-2 my-auto text-sm font-normal"
          dangerouslySetInnerHTML={{
            __html: formatSimpleDesc(item.skill.desc, item.skill.param[0]),
          }}
        />
      </div>

      <h2 className="text-xl text-ww-100">
        {t("sonata_effect", {
          echoName: item.name,
        })}
      </h2>
      <div className="relative z-20 mx-2 mb-2 flex flex-col rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0">
        {item.group.map((group) => (
          <div key={group.id} className="flex py-2 text-lg font-bold">
            <Image
              src={`/commons/${group.icon.split("/").pop()}.webp`}
              className="mx-2 my-auto h-12 w-12 rounded-full border-2"
              width={48}
              height={48}
              alt={group.name}
              style={{ borderColor: `#${group.color}` }}
            />
            <div className="mx-2 flex flex-col">
              <div className="my-auto">{group.name}</div>
              {group.set.map((s) => (
                <div key={group.id + s.key} className="text-xs font-normal">
                  {t("num_pieces", {
                    n: s.key.toString(),
                  })}
                  : {formatSimpleDesc(s.desc, s.param)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
