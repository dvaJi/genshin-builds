import { i18n } from "i18n-config";
import type { Metadata } from "next";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import getTranslations from "@hooks/use-translations";
import type { Echoes } from "@interfaces/wuthering-waves/echoes";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

type Props = {
  params: Promise<{ lang: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "wuthering-waves",
    "echoes"
  );

  return genPageMetadata({
    title: t("title"),
    description: t("description"),
    path: `/wuthering-waves/echoes`,
    locale: langData,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "wuthering-waves",
    "echoes"
  );
  const echoes = await getWWData<Echoes[]>({
    resource: "echoes",
    language: langData,
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">{t("main_title")}</h2>
        <p>{t("main_description")}</p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <div className="flex flex-wrap justify-center gap-10 rounded border border-zinc-800 bg-zinc-900 p-4">
        {echoes?.map((item) => (
          <Link
            key={item.id}
            href={`/${langData}/wuthering-waves/echoes/${item.id}`}
            className="flex h-24 w-24 flex-col items-center transition-all hover:brightness-125"
          >
            <div className="flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden rounded border border-ww-900 bg-ww-950">
              <Image
                className=""
                src={`/echoes/${item.icon.split("/").pop()}.webp`}
                alt={item.name ?? ""}
                width={96}
                height={96}
              />
            </div>
            <h3 className="text-center text-sm leading-5">{item.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
