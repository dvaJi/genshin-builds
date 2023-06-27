declare module "@freestar/pubfig-adslot-react-component" {
  import React from "react";

  interface FreestarAdSlotProps {
    // A required string of the publisher, which will be provided by Freestar.
    publisher: string;

    // A required string of the ad unit placement, which will be provided by Freestar.
    placementName: string;

    // An optional string to specific the element id of the containing div around the adslot. Defaults to the placement.
    slotId?: string;

    // An optional object of key/value pairs for targeting.
    targeting?: { [key: string]: string };

    // An optional string of a custom channel to use.
    channel?: string;

    // An optional array of strings representing any additional classes that should be applied to the wrapper dom element of the ad slot.
    classList?: string[];

    // An optional number bound to the ad refresh. Increment this value to trigger a refresh of the ad slot.
    adRefresh?: number;

    // An optional event hook that returns the placementName when the component mounts and an ad is requested.
    onNewAdSlotsHook?: (placementName: string) => void;

    // An optional event hook that returns the placementName when the component unmounts.
    onDeleteAdSlotsHook?: (placementName: string) => void;

    // An optional event hook that returns the placementName when the component refreshes an ad.
    onAdRefreshHook?: (placementName: string) => void;

    // An optional attribute that when passed enables SRI for our pubfig library. The component will use this value for the integrity attribute when loading pubfig
    integrity?: string;
  }

  const FreestarAdSlot: React.FC<FreestarAdSlotProps> & {
    // Proxy for the GPT setTargeting call to set page level targeting.
    setPageTargeting: (targeting: { [key: string]: string }) => void;

    // Proxy for the GRP clearTargeting call to clear page level targeting.
    clearPageTargeting: () => void;

    // Proxy for the freestar.trackPageview() method.
    trackPageView: () => void;
  };

  export default FreestarAdSlot;
}
