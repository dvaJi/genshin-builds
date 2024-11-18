"use client";

import { type ButtonHTMLAttributes, useEffect, useState } from "react";

import { useClipboard } from "@hooks/use-clipboard";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  content: string;
  children: React.ReactNode;
  copiedText?: string;
  timeoutDuration?: number; // Added prop for timeout duration
};

export default function CopyToClipboard({
  content,
  children,
  copiedText = "Copied!",
  timeoutDuration = 2000, // Default timeout
  ...props
}: Props) {
  const { copyToClipboard } = useClipboard();
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
    } else {
      // Handle copy failure if necessary
    }
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, timeoutDuration);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copied, timeoutDuration]);

  return (
    <button
      onClick={handleClick}
      {...props}
      data-copied={copied}
      aria-live="polite"
    >
      {copied ? copiedText : children}
    </button>
  );
}
