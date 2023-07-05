import dynamic from "next/dynamic";
import { GetStaticProps } from "next";
import HSRData, { type Relic } from "hsr-data";

import Metadata from "@components/Metadata";

import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHsrUrl, getHsrUrlLQ } from "@lib/imgUrl";
import { localeToHSRLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  relics: Relic[];
};

function HSRRelics({ relics }: Props) {
  const { t } = useIntl("relics");
  return (
    <div className="bg-hsr-surface1 p-4 shadow-2xl">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Honkai: Star Rail Relics List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "A complete list of all Relics and their stats in Honkai: Star Rail.",
        })}
      />
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
      <div className="mt-4"></div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
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
                    <div key={piece.id} className="mx-1 flex">
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
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");
  const hsrData = new HSRData({
    language: localeToHSRLang(locale),
  });
  const relics = await hsrData.relics({
    select: ["id", "name", "effects", "pieces"],
  });

  return {
    props: {
      relics,
      lngDict,
      bgStyle: {
        image: getHsrUrlLQ(`/bg/normal-bg.webp`),
        gradient: {
          background:
            "linear-gradient(rgba(26,20,26,.6),rgb(21, 20, 26) 900px)",
        },
      },
    },
  };
};

export default HSRRelics;
