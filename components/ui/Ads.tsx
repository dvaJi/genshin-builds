"use client";

import dynamic from "next/dynamic";

const DynamicAds = dynamic(() => import("@components/ui/IAds"), {
  ssr: false,
});

export default DynamicAds;
