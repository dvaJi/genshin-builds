import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import type { Messages } from "@interfaces/hsr";
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
    namespace: "HSR.messages",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/hsr/message`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("HSR.messages");
  const langData = getLangData(lang, "hsr");

  const messages = await getHSRData<Messages[]>({
    resource: "messages",
    language: langData,
    select: ["id", "contacts"],
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-3xl font-semibold uppercase text-slate-100">
          {t("messages")}
        </h2>
        <p className="px-4 text-sm">{t("messages_desc")}</p>

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
            href={`/hsr/message/${message.id}`}
            className="card flex text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <img
              className="mr-4 h-14 w-14 rounded-full border-2 border-secondary bg-secondary object-contain"
              src={getHsrUrl(
                `/avatar/round/${message.contacts.icon || "8002"}.png`,
              )}
              alt={message.contacts.name}
            />
            <div className="mr-auto flex flex-col">
              <h3 className="text-left font-semibold leading-tight">
                {message.contacts.name}
              </h3>
              <span className="text-left text-sm leading-snug">
                {message.contacts.signature}
              </span>
            </div>
          </Link>
        ))}
      </menu>
    </div>
  );
}
