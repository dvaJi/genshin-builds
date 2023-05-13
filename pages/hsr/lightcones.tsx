import dynamic from "next/dynamic";
import { GetStaticProps } from "next";
import HSRData, { type LightCone } from "hsr-data";

import Stars from "@components/hsr/Stars";

import { getHsrUrl, getHsrUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { localeToHSRLang } from "@utils/locale-to-lang";
import Metadata from "@components/Metadata";
import useIntl from "@hooks/use-intl";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });

type Props = {
  equipment: LightCone[];
};

function HSRLightCones({ equipment }: Props) {
  const { t } = useIntl("lightcones");
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
        `<span class="text-yellow-600">${value}</span>`
      );
      str = str.replaceAll(
        `#${i + 1}[i]%`,
        `<span class="text-yellow-600">${value}</span>`
      );
      str = str.replaceAll(
        `#${i + 1}[i]`,
        `<span class="text-yellow-600">${value}</span>`
      );
    }

    return str;
  };
  return (
    <div className="bg-hsr-surface1 p-4 shadow-2xl">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Honkai: Star Rail Light Cones Lists",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "A complete list of all Light Cones and their stats in Honkai: Star Rail.",
        })}
      />
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
      <div className="mt-4"></div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <menu className="grid grid-cols-1 md:grid-cols-2">
        {equipment.map((lightcone) => (
          <div
            key={lightcone.id}
            className="mx-4 mb-8 flex flex-col bg-hsr-surface2 p-3"
          >
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
                    src={getHsrUrl(`/${lightcone.pathType.toLowerCase()}.webp`)}
                    className="mr-1 inline-block h-4 w-4"
                    alt={lightcone.pathTypeText}
                  />
                  {lightcone.pathTypeText}
                </div>
                <div className="mt-1 text-sm">
                  <Stars stars={lightcone.rarity} />
                </div>
                <div className="text-xs text-hsr-accent">
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
  const equipment = await hsrData.lightcones({
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

  return {
    props: {
      equipment,
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

export default HSRLightCones;
