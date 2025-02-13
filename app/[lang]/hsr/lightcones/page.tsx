import { i18n } from "i18n-config";
import type { Metadata } from "next";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import Stars from "@components/hsr/Stars";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { LightCone } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getHsrUrl } from "@lib/imgUrl";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "hsr", "lightcones");
  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail Light Cones Lists",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "A complete list of all Light Cones and their stats in Honkai: Star Rail.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/lightcones`,
    locale,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(lang, "hsr", "lightcones");

  const equipment = await getHSRData<LightCone[]>({
    resource: "lightcones",
    language: langData,
    select: [
      "id",
      "name",
      "pathType",
      "pathTypeText",
      "rarity",
      "effectName",
      "effectTemplate",
      "superImpositions",
    ],
  });

  const formatDesc = (lc: LightCone) => {
    const params = lc.superImpositions.reduce<string[]>((acc, si) => {
      acc = si.params
        .filter((a) => a)
        .map<string>((a, i) => (!acc[i] ? a : acc[i] + "/" + a));
      return acc;
    }, []);

    let str = lc.effectTemplate;
    for (let i = 0; i < params.length; i++) {
      const value = params[i];
      str = str.replaceAll(
        `#${i + 1}[f1]%`,
        `<span class="text-secondary-foreground">${value}</span>`,
      );
      str = str.replaceAll(
        `#${i + 1}[i]%`,
        `<span class="text-secondary-foreground">${value}</span>`,
      );
      str = str.replaceAll(
        `#${i + 1}[i]`,
        `<span class="text-secondary-foreground">${value}</span>`,
      );
    }

    return str;
  };

  return (
    <div>
      <div className="my-2">
        <h2 className="text-3xl font-semibold uppercase text-slate-100">
          {t({
            id: "lightcones",
            defaultMessage: "Light Cones",
          })}
        </h2>
        <p className="px-4 text-sm">
          {t({
            id: "lightcones_desc",
            defaultMessage:
              "Light Cones are items equippable by characters to boost their Base HP, Base ATK, and Base DEF and grant a passive ability to characters whose path match that of the Light Cone.",
          })}
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <menu className="grid grid-cols-1 md:grid-cols-2">
        {equipment.map((lightcone) => (
          <Link
            key={lightcone.id}
            href={`/${lang}/hsr/lightcones/${lightcone.id}`}
            className="transition-transform hover:scale-[1.02]"
          >
            <div className="card mx-4 mb-8 flex flex-col">
              <div className="flex">
                <div className="shrink-0">
                  <img
                    src={getHsrUrl(`/lightcones/${lightcone.id}.png`, 100, 100)}
                    width={88}
                    height={88}
                    alt={lightcone.name}
                  />
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-slate-100">
                    {lightcone.name}
                  </div>
                  <div className="text-sm">
                    <img
                      src={getHsrUrl(
                        `/${lightcone.pathType.toLowerCase()}.webp`,
                      )}
                      className="mr-1 inline-block h-4 w-4"
                      alt={lightcone.pathTypeText}
                    />
                    {lightcone.pathTypeText}
                  </div>
                  <div className="mt-1 text-sm">
                    <Stars stars={lightcone.rarity} />
                  </div>
                  <div className="text-xs text-accent">
                    {lightcone.effectName}
                  </div>
                  <div className="flex">
                    <p
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: formatDesc(lightcone),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </menu>
    </div>
  );
}
