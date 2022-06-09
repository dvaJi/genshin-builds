import {
  useRef,
  useState,
  CSSProperties,
  useLayoutEffect,
  useCallback,
  AriaAttributes,
  Ref,
} from "react";
import { useClickOutside, useEscapeHandler } from "./use-clickoutside";

const style: CSSProperties = {
  position: "absolute",
  top: "auto",
  bottom: "auto",
  left: "auto",
  right: "auto",
};

const role: AriaAttributes["aria-haspopup"] = "dialog";

interface TriggerProps<T> {
  ref: Ref<T>;
  onClick(): void;
  "aria-haspopup": AriaAttributes["aria-haspopup"];
  "aria-expanded": boolean;
}

interface ContentProps<C> {
  ref: Ref<C>;
}

const usePopover = <T extends HTMLElement, C extends HTMLElement>(
  defaultOpen = false
): [boolean, TriggerProps<T>, ContentProps<C>] => {
  const triggerRef = useRef<T>(null);
  const [position, setPosition] = useState<CSSProperties>({
    top: "auto",
    left: "auto",
  });

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setPosition({
        top: triggerRef.current.clientHeight + triggerRef.current.offsetTop,
        left: triggerRef.current.offsetLeft,
      } as CSSProperties);
    }
  }, []);

  const [open, setOpen] = useState(defaultOpen);
  const toggle = useCallback(() => setOpen(!open), [open]);
  const close = useCallback(() => setOpen(false), []);

  useEscapeHandler(close, []);

  const contentRef = useClickOutside<C>(open ? close : undefined, []);

  const trigger = {
    ref: triggerRef,
    onClick: toggle,
    "aria-haspopup": role,
    "aria-expanded": open,
  };
  const content = {
    ref: contentRef,
    role,
    style: { ...style, ...position },
  };
  return [open, trigger, content];
};

export { usePopover };
