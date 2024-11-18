"use client";

import dynamic from "next/dynamic";

const DynamicFrstAds = dynamic(() => import("@components/ui/IFrstAds"), {
  ssr: false,
});

export default DynamicFrstAds;
