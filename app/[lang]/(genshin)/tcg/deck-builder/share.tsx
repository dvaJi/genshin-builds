"use client";

import { useStore } from "@nanostores/react";
import importDynamic from "next/dynamic";
import { memo } from "react";
import { FaFacebookSquare, FaLink, FaTwitterSquare } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { toast } from "sonner";

import CopyToClipboard from "@components/CopyToClipboard";
import useIntl from "@hooks/use-intl";
import { $deckBuilder, DECK_SETTINGS } from "@state/deck-builder";
import { encodeDeckCode } from "@utils/gcg-share-code";

const QRCode = importDynamic(() => import("@components/QRCode"), {
  ssr: false,
  loading: () => (
    <div className="h-32 w-32 animate-pulse rounded bg-vulcan-600"></div>
  ),
});

type Props = {
  ENCODE_ID_BY_CARD: Record<string, number>;
};

function Share({ ENCODE_ID_BY_CARD }: Props) {
  const deck = useStore($deckBuilder);
  const { t } = useIntl("tcg_deck_builder");

  function encode() {
    if (deck.characterCards.length < DECK_SETTINGS.MAX_CHARACTER_CARDS) {
      toast.error(t("min_character_cards_error"));
      return;
    }
    const totalActions = Object.entries(deck.actionCards).reduce(
      (acc, [key, amount]) => (key === "undefined" ? acc : acc + amount),
      0
    );
    if (totalActions < DECK_SETTINGS.MAX_ACTION_CARDS) {
      toast.error(t("min_non_character_cards_error"));
      return;
    }
    const newCode = encodeDeckCode(
      deck.characterCards,
      Object.entries(deck.actionCards),
      ENCODE_ID_BY_CARD
    );
    $deckBuilder.set({ ...deck, code: newCode });
  }

  if (!deck.code) {
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={encode}
          className="rounded bg-vulcan-700 p-2 text-sm font-semibold"
        >
          {t("generate_code")}
        </button>
      </div>
    );
  }

  const code = deck.code;
  const baseDomain = "https://genshin-builds.com";
  const url = `${baseDomain}/tcg/deck-builder?code=${encodeURI(code)}`;
  const title = t("share_title") + "\n";

  const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(url)}`;
  const twitterShareLink = `https://twitter.com/intent/tweet?url=${encodeURI(url)}&text=${encodeURI(title)}`;

  return (
    <>
      <div className="mr-2 flex w-full flex-col">
        <div className="flex flex-col">
          <label htmlFor="deck-code" className="pb-1 text-sm">
            {t("deck_code")}
          </label>
          <input id="deck-code" value={code} readOnly className="rounded" />
        </div>
        <div className="mt-4 flex gap-2">
          <CopyToClipboard
            content={code}
            className="rounded bg-vulcan-700 p-2 text-sm font-semibold"
          >
            {t("copy_code")}
          </CopyToClipboard>
          <a
            href={twitterShareLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-vulcan-700 p-2 text-sm font-semibold"
            data-tooltip-id="share_tooltip"
            data-tooltip-content={t("share_on", { platform: "X (Twitter)" })}
          >
            <FaTwitterSquare className="inline" />
          </a>
          <a
            href={facebookShareLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-vulcan-700 p-2 text-sm font-semibold"
            data-tooltip-id="share_tooltip"
            data-tooltip-content={t("share_on", { platform: "Facebook" })}
          >
            <FaFacebookSquare className="inline" />
          </a>
          <CopyToClipboard
            content={url}
            className="rounded bg-vulcan-700 p-2 text-sm font-semibold"
            data-tooltip-id="share_tooltip"
            data-tooltip-content={t("copy_link")}
          >
            <FaLink className="inline" />
          </CopyToClipboard>
        </div>
        <p className="mt-2 text-xs italic">{t("limitation_awareness")}</p>
      </div>
      <div className="ml-2">
        <QRCode value={code} />
        <p className="mt-2 text-center text-xs">{t("scan_qr")}</p>
      </div>
      <Tooltip id="share_tooltip" className="z-40" />
    </>
  );
}

export default memo(Share);
