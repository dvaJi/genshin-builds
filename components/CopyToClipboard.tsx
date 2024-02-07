"use client";

import { useClipboard } from "@hooks/use-clipboard";
import { useEffect, useState, type ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  content: string;
  children: React.ReactNode;
  copiedText?: string;
};

export default function CopyToClipboard({
  content,
  children,
  copiedText = "Copied!",
  ...props
}: Props) {
  const { copyToClipboard } = useClipboard();
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    copyToClipboard(content);
    setCopied(true);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <button onClick={handleClick} {...props} data-copied={copied}>
      {copied ? copiedText : children}
    </button>
  );
}
