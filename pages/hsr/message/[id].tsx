import HSRData from "hsr-data";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

import useIntl, { IntlFormatProps } from "@hooks/use-intl";

import Metadata from "@components/Metadata";
import Messages from "@components/hsr/Messages";

import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHsrUrlLQ } from "@lib/imgUrl";
import { getCommon, getLocale } from "@lib/localData";
import { localeToHSRLang } from "@utils/locale-to-lang";
import { Messages as MessagesType } from "hsr-data/dist/types/messages";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

interface Props {
  messageGroup: MessagesType;
  locale: string;
}

const MessagePage = ({ messageGroup, locale }: Props) => {
  const { t } = useIntl("message");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Honkai: Star Rail {name} Messages",
          values: { name: messageGroup.contacts.name },
        })}
        pageDescription={t({
          id: "description",
          defaultMessage: "Discover all messages from {name} - {signature}",
          values: {
            name: messageGroup.contacts.name,
            signature: messageGroup.contacts.signature || "",
          },
        })}
        jsonLD={generateJsonLd(locale, t)}
      />
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
};

const generateJsonLd = (
  locale: string,
  t: (props: IntlFormatProps) => string
) => {
  return `{
    "@context": "http://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/hsr/",
          "name": "Genshin-Builds.com"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/hsr/message",
          "name": "${t({
            id: "messages",
            defaultMessage: "Messages",
          })}"
        }
      }
    ]
  }`;
};

export const getStaticProps: GetStaticProps = async ({
  params,
  locale = "en",
}) => {
  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");
  const hsrData = new HSRData({ language: localeToHSRLang(locale) });
  const messages = await hsrData.messages();
  const messageGroup = messages.find((c) => c.id === Number(params?.id));

  if (!messageGroup) {
    return {
      notFound: true,
    };
  }
  const common = await getCommon(localeToHSRLang(locale), "hsr");

  return {
    props: {
      messageGroup,
      lngDict,
      common,
      locale,
      bgStyle: {
        image: getHsrUrlLQ(`/bg/normal-bg.webp`),
        gradient: {
          background:
            "linear-gradient(rgba(26,20,26,.6),rgb(21, 20, 26) 900px)",
        },
      },
    },
    revalidate: 60 * 60 * 24,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default MessagePage;
