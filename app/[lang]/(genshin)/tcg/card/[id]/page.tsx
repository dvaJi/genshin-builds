import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Image from "@components/genshin/Image";
import Ads from "@components/ui/Ads";
import Badge from "@components/ui/Badge";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { TCGCard } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ lang: string; id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, id } = await params;
  const { t, locale, langData } = await getTranslations(
    lang,
    "genshin",
    "tcg_card"
  );
  const card = await getGenshinData<TCGCard>({
    resource: "tcgCards",
    language: langData,
    filter: { id },
  });

  if (!card) return undefined;

  const title = t({
    id: "title",
    defaultMessage: "{name} Genshin Impact Build Guide",
    values: { name: card.name },
  });
  const description = card.desc;

  return genPageMetadata({
    title,
    description,
    path: `/tcg/card/${id}`,
    image: getUrl(`/tcg/${id}.png`, 160, 160),
    locale,
  });
}

export default async function GenshinCard({ params }: Props) {
  const { lang, id } = await params;
  const { t, langData } = await getTranslations(lang, "genshin", "tcg_card");

  const card = await getGenshinData<TCGCard>({
    resource: "tcgCards",
    language: langData,
    filter: { id },
  });

  if (!card) {
    return notFound();
  }

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Link
        href={`/${lang}/tcg`}
        className="mt-4 p-4 hover:text-slate-200"
        prefetch={false}
      >
        {t({ id: "back", defaultMessage: "Back" })}
      </Link>
      <div className="my-4 flex">
        <Image
          src={`/tcg/${card.id}.png`}
          alt={card.name}
          title={card.name}
          width={160}
          height={274}
          className="aspect-square h-[274px] w-[160px] shrink"
        />
        <div className="ml-4">
          <h2 className="text-4xl font-semibold text-gray-200">{card.name}</h2>
          <div className="my-2 flex flex-wrap">
            {["hp", "energy", "weapon", "cost", "cost_type", "card_type"]
              .filter(
                (key) =>
                  (card.attributes as any)[key] &&
                  !Array.isArray((card.attributes as any)[key])
              )
              .map((key) => (
                <Badge key={key} className="my-0.5">
                  <span className="text-white">
                    {t({ id: key, defaultMessage: key })}:
                  </span>{" "}
                  {(card.attributes as any)[key]}
                </Badge>
              ))}
            {typeof card.attributes.energy !== "number" &&
              (card.attributes.energy as any[]).map((energy) => (
                <Badge key={energy._id} className="my-0.5">
                  <span className="text-white">{energy.type}:</span>{" "}
                  {energy.count}
                </Badge>
              ))}
          </div>
          <div className="ml-1 mt-2">
            <p
              className="text-lg text-white"
              dangerouslySetInnerHTML={{ __html: card.title }}
            />
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: card.desc }}
            />
          </div>
          {card.attributes.source && (
            <div className="mt-6 text-sm">
              <span className="text-slate-200">
                {t({ id: "source", defaultMessage: "Source" })}:
              </span>{" "}
              <span className="text-slate-400">{card.attributes.source}</span>
            </div>
          )}
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <h2 className="text-3xl font-semibold text-gray-200">
        {t({ id: "card_effects", defaultMessage: "Card Effects" })}
      </h2>
      <div className="card">
        {card.skills
          .filter((s) => s)
          .map((skill) => (
            <div
              key={skill.name}
              className="my-2 flex justify-between border-b border-vulcan-900 py-4 first:mt-0 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div>
                <h3 className="py-2 text-xl font-semibold text-gray-200">
                  {skill.name}
                </h3>
                <p dangerouslySetInnerHTML={{ __html: skill.desc }} />
              </div>
              {skill?.points?.length > 0 && (
                <div className="flex h-full flex-shrink-0 flex-col content-center items-center justify-center">
                  {skill.points.map((point) => (
                    <div key={point.id} className="flex whitespace-nowrap">
                      <span className="text-lg">{point.count}</span>
                      <Image
                        alt={point.id}
                        src={`/tcg/${point.id}.png`}
                        className="mx-1 h-8 align-middle"
                        title={point.type}
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
