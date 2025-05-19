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
  className?: string; // Changed from minHeight to className
  id?: string;
};

const VMAd: FC<AdProps> = ({ placementName, alias, className, id }) => {
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
  }, []); // Removed placementName from dependency array as it's not used in a way that requires re-running the effect on change. If specific re-initialization logic is needed per placementName change, it should be added carefully.

  return <div ref={elRef} className={className} id={id}></div>; // Apply className and id
};

export default VMAd;
