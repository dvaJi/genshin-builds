"use client";

import { DependencyList, useEffect, useRef } from "react";

const noop = () => {};

export const useClickOutside = <E extends HTMLElement>(
  handler: (e: MouseEvent) => void = noop,
  dependencies: DependencyList,
) => {
  const callbackRef = useRef(handler);
  const ref = useRef<E>(null);
  const outsideClickHandler = (e: MouseEvent) => {
    if (
      callbackRef.current !== null &&
      ref.current &&
      !ref.current.contains(e.target as Node)
    ) {
      callbackRef.current(e);
    }
  };

  // useEffect wrapper to be safe for concurrent mode
  useEffect(() => {
    callbackRef.current = handler;
  }, [handler, dependencies]);

  useEffect(() => {
    document?.addEventListener("click", outsideClickHandler, true);
    return () =>
      document?.removeEventListener("click", outsideClickHandler, true);
  }, [dependencies]);

  return ref;
};

export const useEscapeHandler = (
  handler = noop,
  dependencies: DependencyList = [],
) => {
  useEffect(() => {
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        handler();
      }
    };
    document?.addEventListener("keyup", escapeHandler);
    return () => document?.removeEventListener("keyup", escapeHandler);
  }, [dependencies, handler]);
};
