import HSRData from "hsr-data";
import type { Messages } from "hsr-data/dist/types/messages";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

import Metadata from "@components/Metadata";

import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHsrUrl, getHsrUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToHSRLang } from "@utils/locale-to-lang";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  messages: Messages[];
};

function HSRLightCones({ messages }: Props) {
  const { t } = useIntl("messages");
  return (
    <div className="bg-hsr-surface1 p-4 shadow-2xl">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Honkai: Star Rail Messages",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "A complete list of all messages in Honkai: Star Rail.",
        })}
      />
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
      <div className="mt-4"></div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <menu className="mx-4 mt-2 grid gap-4 md:grid-cols-2 lg:mx-0 lg:grid-cols-2 xl:grid-cols-3">
        {messages.map((message) => (
          <Link
            key={message.id}
            href={`/hsr/message/${message.id}`}
            className=" flex bg-hsr-surface2 p-3 transition-colors hover:bg-hsr-surface3"
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

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");
  const hsrData = new HSRData({
    language: localeToHSRLang(locale),
  });
  const messages = await hsrData.messages({
    select: ["id", "contacts"],
  });

  return {
    props: {
      messages,
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
