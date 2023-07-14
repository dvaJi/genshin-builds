import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";

import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHsrUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToHSRLang } from "@utils/locale-to-lang";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

function ShowCase() {
  const [uid, setUid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = () => {
    setIsLoading(true);
    setError(null);

    fetch("/api/hsr/submit_uid?uid=" + uid, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.uuid) {
          router.push(`/hsr/showcase/profile/${uid}`);
        } else {
          setError(json.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-hsr-surface1 p-4 shadow-2xl">
      <h2 className="text-3xl font-semibold uppercase text-slate-100">
        Character Showcase
      </h2>
      <p className="px-4 text-sm">Enter UID to view your showcase</p>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div className="flex min-h-[200px] lg:min-h-[500px] flex-col items-center justify-center gap-4">
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="relative mx-auto h-14 w-60">
          <input
            className="absolute left-1 top-1 z-10 h-[48px] w-[232px] border-0 border-b border-hsr-accent bg-hsr-surface3 text-center focus:border focus:ring-hsr-accent disabled:cursor-not-allowed disabled:opacity-50"
            required
            type="text"
            placeholder="Enter UID..."
            onChange={(e) => setUid(e.target.value)}
            value={uid}
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-center pt-5">
          <button
            onClick={onSubmit}
            disabled={isLoading || !uid}
            className="border border-hsr-accent bg-hsr-surface2 px-3 py-1 text-hsr-accent hover:border-zinc-400 hover:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");

  return {
    props: {
      lngDict,
      bgStyle: {
        image: getHsrUrlLQ(`/bg/normal-bg.webp`),
      },
    },
  };
};

export default ShowCase;
