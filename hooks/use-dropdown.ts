"use client";

import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const ESC_KEY = 27;

const onEscapeKeyPress =
  (fn: () => void) =>
  ({ keyCode }: KeyboardEvent) =>
    keyCode === ESC_KEY ? fn() : null;

const useDropdown = (): [
  MutableRefObject<any>,
  boolean,
  () => void,
  () => void,
] => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<any>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleGlobalMouseDown = ({ target }: MouseEvent) => {
      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      close();
    };

    const handleGlobalKeydown = onEscapeKeyPress(close);

    document.addEventListener("mousedown", handleGlobalMouseDown);
    document.addEventListener("keydown", handleGlobalKeydown);

    return () => {
      document.removeEventListener("mousedown", handleGlobalMouseDown);
      document.removeEventListener("keydown", handleGlobalKeydown);
    };
  }, [close]);

  return [ref, isOpen, open, close];
};

export default useDropdown;
