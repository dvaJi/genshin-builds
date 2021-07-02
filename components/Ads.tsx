import { useEffect } from "react";

import { GAD_ID } from "@lib/constants";

type AdsProps = {
  className: string;
  adSlot: string;
};

const Ads = ({ className, adSlot }: AdsProps) => {
  useEffect(() => {
    if (GAD_ID && adSlot && typeof window !== "undefined") {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  if (!GAD_ID || !adSlot) {
    return <div />;
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
