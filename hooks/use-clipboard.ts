import { useCallback } from "react";

export function useClipboard() {
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Copying to clipboard was successful!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  }, []);

  return { copyToClipboard };
}
