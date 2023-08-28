import { memo, useEffect } from "react";

import { AD_ARTICLE_SLOT, CUSTOM_ADS_ID, GAD_ID } from "@lib/constants";

type AdsProps = {
  className: string;
  adSlot: string;
};

const Ads = ({ className, adSlot = AD_ARTICLE_SLOT }: AdsProps) => {
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
  }, [adSlot]);

  if (CUSTOM_ADS_ID) {
    const images = CUSTOM_ADS_ID.split(",");
    const random = Math.floor(Math.random() * images.length);
    const [imgUrl, url] = images[random].split("|");
    return (
      <a
        href={url + "?ref=GenshinBuilds"}
        target="_blank"
        className="text-center"
      >
        <img src={imgUrl} alt="Ad" className="mx-auto" />
      </a>
    );
  }

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

export default memo(Ads);
