import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import type { Relic } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getHsrUrl } from "@lib/imgUrl";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "HSR.relics",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/hsr/relics`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("HSR.relics");
  const langData = getLangData(lang, "hsr");

  const relics = await getHSRData<Relic[]>({
    resource: "relics",
    language: langData,
    select: ["id", "name", "effects", "pieces"],
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-3xl font-semibold uppercase text-slate-100">
          {t("relics")}
        </h2>
        <p className="px-4 text-sm">{t("relics_desc")}</p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <menu className="grid grid-cols-1 md:grid-cols-2">
        {relics.map((relic) => (
          <Link
            key={relic.id}
            href={`/hsr/relics/${relic.id}`}
            className="transition-transform hover:scale-[1.02]"
          >
            <div className="card mx-4 mb-8 flex flex-col">
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
                  <div className="text-sm">{t("set")}</div>
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
                    <span className="mr-2 text-primary">{pcs}</span>
                    <span dangerouslySetInnerHTML={{ __html: effect }}></span>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </menu>
      {/* <Tooltip id="item_tooltip" /> */}
    </div>
  );
}
