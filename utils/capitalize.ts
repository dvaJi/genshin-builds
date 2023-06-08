/**
 * Capitalize all words in a string
 * @param text
 */
export function capitalize(text: string): string {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
