import type { Messages as IMessages } from "hsr-data/dist/types/messages";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

import Messages from "@components/hsr/Messages";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

interface Props {
  params: {
    id: string;
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, langData, locale } = await useTranslations(
    params.lang,
    "hsr",
    "message"
  );

  const messageGroup = await getHSRData<IMessages>({
    resource: "messages",
    language: langData,
    filter: {
      id: params.id,
    },
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
    path: `/hsr/message/${params.id}`,
    locale,
  });
}

export default async function CharacterPage({ params }: Props) {
  const { t, langData } = await useTranslations(params.lang, "hsr", "message");

  const messageGroup = await getHSRData<IMessages>({
    resource: "messages",
    language: langData,
    filter: {
      id: params.id,
    },
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
                href={`/hsr/message/${message}`}
                key={message}
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
