import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Messages from "@components/hsr/Messages";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { Messages as IMessages } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{
    id: string;
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, id } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "HSR.message",
  });
  const langData = getLangData(lang, "hsr");

  const messageGroup = await getHSRData<IMessages>({
    resource: "messages",
    language: langData,
    filter: { id },
  });

  if (!messageGroup) {
    return;
  }

  const title = t("title", { name: messageGroup.contacts.name });
  const description = t("description", {
    name: messageGroup.contacts.name,
    signature: messageGroup.contacts.signature || "",
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/message/${id}`,
    locale: lang,
  });
}

export default async function CharacterPage({ params }: Props) {
  const { lang, id } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("HSR.message");
  const langData = getLangData(lang, "hsr");

  const messageGroup = await getHSRData<IMessages>({
    resource: "messages",
    language: langData,
    filter: { id },
  });

  if (!messageGroup) {
    return notFound();
  }

  return (
    <div>
      <div className="card relative">
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
        {messageGroup.sections.map((section, i) => (
          <div key={section.id} className="mt-4">
            <h2 className="text-3xl font-semibold uppercase text-slate-100">
              {t("section", { sectionNumber: `${i + 1}` })}
            </h2>
            <menu className="mt-4 flex flex-col gap-4">
              <Messages
                startingMessageId={section.startingMessageId}
                messages={section.messages}
              />
            </menu>
          </div>
        ))}
      </div>
      {messageGroup.relatedMessages && (
        <div className="mt-4">
          <h2 className="text-3xl font-semibold uppercase text-slate-100">
            {t("related_messages")}
          </h2>
          <menu className="flex flex-col">
            {messageGroup.relatedMessages.map((message, i) => (
              <Link
                href={`/hsr/message/${message}`}
                key={message}
                className={
                  message === messageGroup.id
                    ? "m-1 bg-accent p-2 text-accent-foreground"
                    : "m-1 bg-card p-2"
                }
              >
                {t("message", { messageNumber: `${i + 1}` })}
              </Link>
            ))}
          </menu>
        </div>
      )}
    </div>
  );
}
