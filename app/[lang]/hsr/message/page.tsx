import { i18n } from "i18n-config";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import type { Messages } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getHsrUrl } from "@lib/imgUrl";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "hsr", "messages");
  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail Messages",
  });
  const description = t({
    id: "description",
    defaultMessage: "A complete list of all messages in Honkai: Star Rail.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/message`,
    locale,
  });
}

export default async function Page({ params }: Props) {
  const { t, langData } = await useTranslations(params.lang, "hsr", "messages");

  const messages = await getHSRData<Messages[]>({
    resource: "messages",
    language: langData,
    select: ["id", "contacts"],
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-3xl font-semibold uppercase text-slate-100">
          {t({
            id: "messages",
            defaultMessage: "Messages",
          })}
        </h2>
        <p className="px-4 text-sm">
          {t({
            id: "messages_desc",
            defaultMessage:
              "Messages are text communications that the Trailblazer receives from other Characters and NPCs.",
          })}
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <menu className="mx-4 mt-2 grid gap-4 md:grid-cols-2 lg:mx-0 lg:grid-cols-2 xl:grid-cols-3">
        {messages.map((message) => (
          <Link
            key={message.id}
            href={`/${params.lang}/hsr/message/${message.id}`}
            className=" flex bg-hsr-surface2 p-3 transition-colors hover:bg-hsr-surface3"
            prefetch={false}
          >
            <img
              className="mr-4 h-14 w-14 rounded-full border-2 border-slate-600 bg-slate-800 object-contain"
              src={getHsrUrl(
                `/avatar/round/${message.contacts.icon || "8002"}.png`
              )}
              alt={message.contacts.name}
            />
            <div className="mr-auto flex flex-col">
              <h3 className="text-left font-semibold leading-tight text-white">
                {message.contacts.name}
              </h3>
              <span className="text-left text-sm leading-snug text-white">
                {message.contacts.signature}
              </span>
            </div>
          </Link>
        ))}
      </menu>
    </div>
  );
}
