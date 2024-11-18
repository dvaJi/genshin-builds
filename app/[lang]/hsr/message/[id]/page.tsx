import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Messages from "@components/hsr/Messages";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
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
  const { t, langData, locale } = await getTranslations(lang, "hsr", "message");

  const messageGroup = await getHSRData<IMessages>({
    resource: "messages",
    language: langData,
    filter: { id },
  });

  if (!messageGroup) {
    return;
  }

  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail {name} Messages",
    values: { name: messageGroup.contacts.name },
  });
  const description = t({
    id: "description",
    defaultMessage: "Discover all messages from {name} - {signature}",
    values: {
      name: messageGroup.contacts.name,
      signature: messageGroup.contacts.signature || "",
    },
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/message/${id}`,
    locale,
  });
}

export default async function CharacterPage({ params }: Props) {
  const { lang, id } = await params;
  const { t, langData } = await getTranslations(lang, "hsr", "message");

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
      <div className="relative bg-hsr-surface1 p-4 shadow-2xl">
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
        {messageGroup.sections.map((section, i) => (
          <div key={section.id} className="mt-4">
            <h2 className="text-3xl font-semibold uppercase text-slate-100">
              {t({
                id: "section",
                defaultMessage: "Section {sectionNumber}",
                values: { sectionNumber: `${i + 1}` },
              })}
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
            {t({
              id: "related_messages",
              defaultMessage: "Related Messages",
            })}
          </h2>
          <menu className="flex flex-col">
            {messageGroup.relatedMessages.map((message, i) => (
              <Link
                href={`/${lang}/hsr/message/${message}`}
                key={message}
                prefetch={false}
                className={
                  message === messageGroup.id
                    ? "m-1 bg-hsr-accent p-2 text-white"
                    : "m-1 bg-hsr-surface3 p-2"
                }
              >
                {t({
                  id: "message",
                  defaultMessage: "Message {messageNumber}",
                  values: { messageNumber: `${i + 1}` },
                })}
              </Link>
            ))}
          </menu>
        </div>
      )}
    </div>
  );
}
