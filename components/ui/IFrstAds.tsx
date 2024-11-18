"use client";

import FreestarAdSlot from "@freestar/pubfig-adslot-react-component";

type Props = {
  placementName: string;
  targeting?: { [key: string]: string };
  slotId?: string;
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
      slotId={slotId}
      targeting={targeting}
      channel={process.env.NODE_ENV === "development" ? "dev" : "prod"}
      classList={[...classList, "min-h-[50px] relative"]}
      //   onNewAdSlotsHook={(placementName) =>
      //     console.log("creating ad", placementName)
      //   }
      //   onDeleteAdSlotsHook={(placementName) =>
      //     console.log("destroying ad", placementName)
      //   }
      //   onAdRefreshHook={(placementName) =>
      //     console.log("refreshing ad", placementName)
      //   }
    />
  );
}

export default FrstAds;
