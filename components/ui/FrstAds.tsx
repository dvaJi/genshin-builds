"use client";

import FreestarAdSlot from "@freestar/pubfig-adslot-react-component";

type Props = {
  placementName: string;
  targeting?: { [key: string]: string };
  slotId?: string; // The default element ID of an ad slot's parent container is placementName. Use the `slotId` prop to change it. This is useful when you reuse the placement on the same page.
  classList?: string[];
};

function FrstAds({ placementName, slotId, targeting, classList = [] }: Props) {
  const publisher = process.env.NEXT_PUBLIC_FRST_PUBLISHER_NAME || "";

  if (!publisher) {
    return null;
  }

  return (
    <FreestarAdSlot
      publisher={publisher}
      placementName={placementName}
      slotId={slotId ?? placementName}
      targeting={targeting}
      classList={[...classList, "relative"]}
      onNewAdSlotsHook={(placementName) =>
        console.log("creating ad", placementName)
      }
      onDeleteAdSlotsHook={(placementName) =>
        console.log("destroying ad", placementName)
      }
      onAdRefreshHook={(placementName) =>
        console.log("refreshing ad", placementName)
      }
    />
  );
}

export default FrstAds;
