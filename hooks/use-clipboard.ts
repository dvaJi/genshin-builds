import { useCallback } from "react";

export function useClipboard() {
  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        console.log("Copying to clipboard was successful!");
        return true;
      } catch (err) {
        console.error("Could not copy text: ", err);
        return false;
      }
    },
    [],
  );

  return { copyToClipboard };
}
