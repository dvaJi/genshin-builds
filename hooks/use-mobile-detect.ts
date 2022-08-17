import { useEffect, useState } from "react";

export const DEFAULT_BREAKPOINTS = {
  largeDesktop: 1440,
  desktop: 992,
  tablet: 768,
  mobile: 320,
};
export const BREAKPOINT_TYPES = {
  mobile: "MOBILE",
  tablet: "TABLET",
  desktop: "DESKTOP",
  largeDesktop: "LARGE_DESKTOP",
};
export const getCurrentScreenType = (currentScreenType: string) => ({
  isMobile: currentScreenType === BREAKPOINT_TYPES.mobile,
  isTablet: currentScreenType === BREAKPOINT_TYPES.tablet,
  isDesktop: currentScreenType === BREAKPOINT_TYPES.desktop,
  isLargeDesktop: currentScreenType === BREAKPOINT_TYPES.largeDesktop,
  innerWidth: window.innerWidth,
});

export const calculateCurrentScreenType = (
  breakpoints: typeof DEFAULT_BREAKPOINTS
) => ({
  isMobile: window.innerWidth < breakpoints.tablet,
  isTablet:
    window.innerWidth >= breakpoints.tablet &&
    window.innerWidth < breakpoints.desktop,
  isDesktop:
    window.innerWidth >= breakpoints.desktop &&
    window.innerWidth < breakpoints.largeDesktop,
  isLargeDesktop: window.innerWidth >= breakpoints.largeDesktop,
  innerWidth: window.innerWidth,
});

const defaultScreenType = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isLargeDesktop: false,
  innerWidth: 0,
};

export function useMobileDetect(breakpoints = DEFAULT_BREAKPOINTS) {
  const isSSR = typeof window === "undefined";
  const [screenType, setScreenType] = useState(
    isSSR ? defaultScreenType : calculateCurrentScreenType(breakpoints)
  );
  const handleResize = (type: string) => (event: Event) =>
    (event as any).matches && setScreenType(getCurrentScreenType(type));

  useEffect(() => {
    setScreenType(calculateCurrentScreenType(breakpoints));

    const largeDesktopQueryList = matchMedia(
      `(min-width: ${breakpoints.largeDesktop}px)`
    );
    const desktopQueryList = matchMedia(
      `(min-width: ${breakpoints.desktop}px) and (max-width: ${
        breakpoints.largeDesktop - 1
      }px)`
    );
    const tabletQueryList = matchMedia(
      `(min-width: ${breakpoints.tablet}px) and (max-width: ${
        breakpoints.desktop - 1
      }px)`
    );
    const mobileQueryList = matchMedia(`(max-width: ${breakpoints.tablet}px)`);

    mobileQueryList.addEventListener(
      "resize",
      handleResize(BREAKPOINT_TYPES.mobile)
    );
    tabletQueryList.addEventListener(
      "resize",
      handleResize(BREAKPOINT_TYPES.tablet)
    );
    desktopQueryList.addEventListener(
      "resize",
      handleResize(BREAKPOINT_TYPES.desktop)
    );
    largeDesktopQueryList.addEventListener(
      "resize",
      handleResize(BREAKPOINT_TYPES.largeDesktop)
    );

    return () => {
      mobileQueryList.removeEventListener(
        "resize",
        handleResize(BREAKPOINT_TYPES.mobile)
      );
      tabletQueryList.removeEventListener(
        "resize",
        handleResize(BREAKPOINT_TYPES.tablet)
      );
      desktopQueryList.removeEventListener(
        "resize",
        handleResize(BREAKPOINT_TYPES.desktop)
      );
      largeDesktopQueryList.removeEventListener(
        "resize",
        handleResize(BREAKPOINT_TYPES.largeDesktop)
      );
    };
  }, [breakpoints]);
  return screenType;
}
