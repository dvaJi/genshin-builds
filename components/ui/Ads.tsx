"use client";

import { memo, useEffect } from "react";
import { usePathname } from "next/navigation";

import { AD_ARTICLE_SLOT, CUSTOM_ADS_ID, GAD_ID } from "@lib/constants";

type CustomAds = {
  i: string; // image url
  u: string; // url
  l?: string[]; // langs
  g?: string; // game
};

type AdsProps = {
  className: string;
  adSlot: string;
};

const Ads = ({ className, adSlot = AD_ARTICLE_SLOT }: AdsProps) => {
  const pathname = usePathname();
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
    const showAd = Math.random() < 0.5;

    if (!showAd) {
      return <div />;
    }

    const images = JSON.parse(CUSTOM_ADS_ID) as CustomAds[];

    const [_, lang, _game] = pathname.split("/");

    let game = "genshin";

    if (_game === 'hsr') {
      game = 'hsr';
    } else if (_game === 'zenless') {
      game = 'zenless';
    }

    const ads = images.filter((ad) => {
      return (
        (!ad.l || ad.l.includes(lang)) && (!ad.g || ad.g === game) && ad.i && ad.u
      );
    });

    if (ads.length === 0) {
      return <div />;
    }

    // Select random ad
    const ad = ads[Math.floor(Math.random() * ads.length)];
    
    return (
      <a
        href={ad.u + "?ref=GenshinBuilds"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center"
      >
        <img src={ad.i} alt="Ad" className="mx-auto" />
      </a>
    );
  }

  if (!GAD_ID || !adSlot) {
    return <div />;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle block"
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
