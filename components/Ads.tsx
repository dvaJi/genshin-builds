import { useEffect } from "react";

import { GAD_ID } from "@lib/constants";

type AdsProps = {
  className: string;
  adSlot: string;
};

const Ads = ({ className, adSlot }: AdsProps) => {
  useEffect(() => {
    if (GAD_ID && typeof window !== "undefined") {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    }
  }, []);

  if (!GAD_ID || !adSlot) {
    return null;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={GAD_ID}
        data-adtest={process.env.NODE_ENV === "development" ? "on" : "off"}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default Ads;
