"use client";

import importDynamic from "next/dynamic";
import { memo } from "react";
import { FaFacebookSquare, FaLink, FaTwitterSquare } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { toast } from "sonner";

import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import CopyToClipboard from "@components/CopyToClipboard";
import useIntl from "@hooks/use-intl";
import { useStore } from "@nanostores/react";
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
        <Button onClick={encode} variant="secondary">
          {t("generate_code")}
        </Button>
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
      <div className="mr-4 flex-1 space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="deck-code"
            className="text-sm font-medium text-card-foreground"
          >
            {t("deck_code")}
          </label>
          <Input id="deck-code" value={code} readOnly />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="default" size="sm" asChild>
            <CopyToClipboard content={code}>{t("copy_code")}</CopyToClipboard>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <a
              href={twitterShareLink}
              target="_blank"
              rel="noopener noreferrer"
              data-tooltip-id="share_tooltip"
              data-tooltip-content={t("share_on", { platform: "X (Twitter)" })}
            >
              <FaTwitterSquare className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <a
              href={facebookShareLink}
              target="_blank"
              rel="noopener noreferrer"
              data-tooltip-id="share_tooltip"
              data-tooltip-content={t("share_on", { platform: "Facebook" })}
            >
              <FaFacebookSquare className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <CopyToClipboard
              content={url}
              data-tooltip-id="share_tooltip"
              data-tooltip-content={t("copy_link")}
            >
              <FaLink className="h-4 w-4" />
            </CopyToClipboard>
          </Button>
        </div>
        <p className="text-xs italic text-muted-foreground">
          {t("limitation_awareness")}
        </p>
      </div>
      <div className="mt-4 flex flex-col items-center justify-center">
        <QRCode value={code} size={128} />
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {t("scan_qr")}
        </p>
      </div>
      <Tooltip id="share_tooltip" className="z-40" />
    </>
  );
}

export default memo(Share);
