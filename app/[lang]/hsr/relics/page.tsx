import type { Relic } from "hsr-data";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
// import { Tooltip } from "react-tooltip";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getHsrUrl } from "@lib/imgUrl";
import { i18n } from "i18n-config";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "hsr", "relics");
  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail Relics List",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "A complete list of all Relics and their stats in Honkai: Star Rail.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/relics`,
    locale,
  });
}

export default async function Page({ params }: Props) {
  const { t, langData } = await useTranslations(params.lang, "hsr", "relics");

  const relics = await getHSRData<Relic[]>({
    resource: "relics",
    language: langData,
    select: ["id", "name", "effects", "pieces"],
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-3xl font-semibold uppercase text-slate-100">
          {t({
            id: "relics",
            defaultMessage: "Relics",
          })}
        </h2>
        <p className="px-4 text-sm">
          {t({
            id: "relics_desc",
            defaultMessage:
              'Relics are items that can be equipped onto characters. Relics provide additional stats, but not limited to, HP, Speed, Attack, and Defense to the equipped character. All Relics give extra boosts when paired with their counterparts, called a "set". Relics can be upgraded with EXP material to increase stats.',
          })}
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <menu className="grid grid-cols-1 md:grid-cols-2">
        {relics.map((relic) => (
          <div
            key={relic.id}
            className="mx-4 mb-8 flex flex-col bg-hsr-surface2 p-3"
          >
            <div className="flex">
              <div>
                <img
                  src={getHsrUrl(`/relics/${relic.id}.png`, 100, 100)}
                  width={88}
                  height={88}
                  alt={relic.name}
                />
              </div>
              <div className="ml-4">
                <div>{relic.name}</div>
                <div className="text-sm">
                  {t({
                    id: "set",
                    defaultMessage: "Set",
                  })}
                </div>
                <div className="flex">
                  {relic.pieces.map((piece) => (
                    <div
                      key={piece.id}
                      className="mx-1 flex"
                      data-tooltip-id="item_tooltip"
                      data-tooltip-content={piece.name}
                      data-tooltip-place="bottom"
                    >
                      <img
                        src={getHsrUrl(`/pieces/${piece.id}.png`, 48, 48)}
                        width={36}
                        height={36}
                        alt={piece.name}
                      />
                      <span className="hidden">{piece.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              {Object.entries(relic.effects).map(([pcs, effect]) => (
                <div key={pcs} className="my-1 text-xs">
                  <span className="mr-2 text-hsr-accent">{pcs}</span>
                  <span dangerouslySetInnerHTML={{ __html: effect }}></span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </menu>
      {/* <Tooltip id="item_tooltip" /> */}
    </div>
  );
}
