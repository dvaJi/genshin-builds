import { i18n } from "i18n-config";
import type { Metadata } from "next";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
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
  const title = "Wuthering Waves (WuWa) Echoes List";
  const description =
    "A complete list of all Echoes in Wuthering Waves (WuWa). This page offer most updated Echoes information including skills.";

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves/echoes`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const echoes = await getWWData<Echoes[]>({
    resource: "echoes",
    language: lang,
    revalidate: 0,
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">Wuthering Waves Echoes</h2>
        <p>
          A list of all Echoes and their skills in Wuthering Waves. This page
          offer most updated Echoes information.
        </p>

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
            href={`/${lang}/wuthering-waves/echoes/${item.id}`}
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
