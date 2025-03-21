// Code modified from https://github.com/gjfLeo/summoners-summit/blob/main/utils/decks/share-code.ts

// List of words to block in the encoding process
const blockWords = ["64", "89", "c4", "cag", "gay", "ntr", "pcp", "rbq"];

// Function to encode a deck into a deck code
export function encodeDeckCode(
  characterCards: string[],
  actionCards: [string, number][],
  ENCODE_ID_BY_CARD: any,
) {
  // Calculate encoding IDs for the cards in the deck
  const cardEncodingIds = [
    ...characterCards.map((card) => ENCODE_ID_BY_CARD[card]),
    ...actionCards.flatMap(([card, count]) =>
      Array.from({ length: count }, () => ENCODE_ID_BY_CARD[card]),
    ),
  ];
  cardEncodingIds.push(0); // Pad to 34 items of 12-bit numbers

  // Regroup into 51 items of 8-bit numbers
  const byteArray = Array.from({ length: 17 }).flatMap((_, i) => [
    cardEncodingIds[i * 2] >> 4,
    ((cardEncodingIds[i * 2] & 0xf) << 4) | (cardEncodingIds[i * 2 + 1] >> 8),
    cardEncodingIds[i * 2 + 1] & 0xff,
  ]);

  // Try all possible last bytes to find the first code not containing blocked words
  for (let lastByte = 0; lastByte < 256; lastByte++) {
    const original = Array.from({ length: 25 })
      .fill(0)
      .flatMap((_, i) => [
        (byteArray[i] + lastByte) & 0xff,
        (byteArray[i + 25] + lastByte) & 0xff,
      ]);
    const shareCode = btoa(String.fromCodePoint(...original, lastByte));

    // Check if the share code contains any blocked words
    if (
      !blockWords.some((blockWord) =>
        shareCode.match(new RegExp(blockWord.split("").join("\\+*"), "i")),
      )
    ) {
      return shareCode;
    }
  }

  throw new Error("Unable to generate a valid share code");
}

// Function to decode a deck code back into a deck
export function decodeDeckCode(shareCode: string, CARD_BY_ENCODE_ID: any) {
  const byteArray = Array.from(atob(shareCode), (c) => c.codePointAt(0));
  if (byteArray.length !== 51) {
    // throw new Error("Invalid share code");
    return {
      characterCards: ["undefined", "undefined", "undefined"],
      actionCards: { ["undefined"]: 30 },
    };
  }

  const lastByte = byteArray.pop();
  // Subtract the mask and reorder even and odd
  const reordered = [
    ...Array.from({ length: 25 }).map(
      (_, i) => ((byteArray[2 * i] ?? 0) - (lastByte ?? 0)) & 0xff,
    ),
    ...Array.from({ length: 25 }).map(
      (_, i) => ((byteArray[2 * i + 1] ?? 0) - (lastByte ?? 0)) & 0xff,
    ),
    0,
  ];

  // Regroup into 34 items of 12-bit numbers
  const cardEncodingIds = Array.from({ length: 17 })
    .fill(0)
    .flatMap((_, i) => [
      (reordered[i * 3] << 4) | (reordered[i * 3 + 1] >> 4),
      ((reordered[i * 3 + 1] & 0xf) << 8) | reordered[i * 3 + 2],
    ]);
  cardEncodingIds.pop(); // Remove the last item, leaving 3 character cards and 30 action cards

  const characterIds = cardEncodingIds.splice(0, 3);
  const characterCards = characterIds.map((id) => CARD_BY_ENCODE_ID[id]);
  const actionCards: { [key: string]: number } = {};
  for (const id of cardEncodingIds) {
    const card = CARD_BY_ENCODE_ID[id];
    actionCards[card] = (actionCards[card] ?? 0) + 1;
  }

  return { characterCards, actionCards };
}
