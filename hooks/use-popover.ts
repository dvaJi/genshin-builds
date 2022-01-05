import {
  useRef,
  useState,
  CSSProperties,
  useLayoutEffect,
  useEffect,
  useCallback,
  DependencyList,
  AriaAttributes,
  Ref,
} from "react";

const noop = () => {};

const useEscapeHandler = (
  handler = noop,
  dependencies: DependencyList = []
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

const useClickOutside = <E extends HTMLElement>(
  handler: (e: MouseEvent) => void = noop,
  dependencies: DependencyList
) => {
  const callbackRef = useRef(handler);
  const ref = useRef<E>(null);
  const outsideClickHandler = (e: MouseEvent) => {
    if (
      callbackRef.current &&
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
    document?.addEventListener("click", outsideClickHandler);
    return () => document?.removeEventListener("click", outsideClickHandler);
  }, [dependencies]);

  return ref;
};

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
