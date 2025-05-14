"use client";

import React, { FC, useEffect, useRef } from "react";

declare global {
  interface Window {
    __VM: any[];
  }
}

type AdProps = {
  placementName: string;
  alias?: string;
};

const VMAd: FC<AdProps> = ({ placementName, alias }) => {
  const elRef = useRef(null);

  const isHSorVideoSlider = () => {
    const validPlacements = [
      "horizontal_sticky",
      "mobile_horizontal_sticky",
      "video_slider",
    ];
    return validPlacements.includes(placementName);
  };

  useEffect(() => {
    let placement: any;
    console.log("[PROSPER] add", placementName);

    const handleAdManagerPush = (admanager: any, scope: any) => {
      console.log("[PROSPER] added", admanager, placementName);
      if (placementName === "vertical_sticky") {
        scope.Config.verticalSticky().display();
      } else {
        placement = scope.Config.get(placementName, alias).display(
          isHSorVideoSlider() ? { body: true } : elRef.current,
        );
      }
    };

    const handleUnmount = (admanager: any, scope: any) => {
      console.log("[PROSPER] removed", admanager, placementName);

      if (placementName === "vertical_sticky") {
        scope.Config.verticalSticky().destroy();
      } else {
        admanager.removePlacement(placement.instance());
      }
    };

    self.__VM.push(handleAdManagerPush);

    return () => {
      self.__VM.push(handleUnmount);
    };
  }, []);
  return <div ref={elRef}></div>;
};

export default VMAd;
