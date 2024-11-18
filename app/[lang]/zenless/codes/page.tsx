import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import type { Code } from "@interfaces/zenless/code";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const title =
    "Zenless Zone Zero (ZZZ) Redeem Codes: Latest Working & Expired Codes";
  const description =
    "Zenless Zone Zero (ZZZ) is a popular action RPG developed by HoYoverse. This guide provides the latest ZZZ redeem codes, how to use them, and what rewards you can expect. Stay tuned for regular updates!";

  return genPageMetadata({
    title,
    description,
    path: `/zenless/tierlist`,
    locale: lang,
  });
}

export default async function Page() {
  const codes = await getZenlessData<Code[]>({
    resource: "codes",
  });

  return (
    <div>
      <div className="my-2">
        <h1 className="text-4xl font-semibold">
          Zenless Zone Zero (ZZZ) All Redeem Codes
        </h1>
        <p>
          Zenless Zone Zero (ZZZ) is a popular action RPG developed by
          HoYoverse. This guide provides the latest Zenless Zone Zero (ZZZ)
          redeem codes, how to use them, and what rewards you can expect. Stay
          tuned for regular updates!
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <h2 className="text-2xl font-semibold">
        What Are Zenless Zone Zero Codes?
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-neutral-800 bg-neutral-900 p-4">
        <p>
          Zenless Zone Zero codes are special promotional codes provided by the
          developers. When redeemed, these codes grant players bonus rewards
          such as Polychrome, Investigator Logs, and other in-game items.
        </p>
      </div>
      <h2 className="text-2xl font-semibold">
        Current Active Zenless Zone Zero (ZZZ) Codes
      </h2>
      <p>Here are the latest working codes for Zenless Zone Zero:</p>
      <div className="relative mb-8 flex flex-col justify-center gap-6 rounded border border-neutral-800 bg-neutral-900 p-4">
        {codes
          ?.filter((c) => c.isValid)
          .map((code) => (
            <div
              key={code.id}
              className="flex items-center gap-2 border-b border-neutral-950/50 pb-4 last:border-b-0"
            >
              <a
                href={`https://zenless.hoyoverse.com/redemption?code=${code.id}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-yellow-400"
              >
                {code.id}
              </a>
              - {code.description}
            </div>
          ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <h2 className="text-2xl font-semibold">
        How to Redeem Zenless Zone Zero (ZZZ) Codes
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-neutral-800 bg-neutral-900 p-4">
        <ul>
          <li>Visit the official Zenless Zone Zero code redemption website</li>
          <li>Log in with your HoYoverse account</li>
          <li>Click on &quot;Redeem Code&quot;</li>
          <li>Enter the redemption code in the provided field</li>
          <li>Click &quot;Redeem&quot; to claim your rewards</li>
          <li>Launch the game and check your in-game mail for the items</li>
        </ul>
      </div>
      <h2 className="text-2xl font-semibold">
        Expired Zenless Zone Zero (ZZZ) Codes
      </h2>
      <p>The following codes have expired and are no longer redeemable:</p>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-neutral-800 bg-neutral-900 p-4">
        {codes
          ?.filter((c) => !c.isValid)
          .map((code) => (
            <div
              key={code.id}
              className="flex items-center gap-2 border-b border-neutral-950/50 pb-4 last:border-b-0"
            >
              <a
                href={`https://zenless.hoyoverse.com/redemption?code=${code.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-yellow-500"
              >
                {code.id}
              </a>
              - {code.description}
            </div>
          ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
      <ul>
        <li>
          <b>How often are new codes released?</b>
          <br />
          New codes are typically released during special events, game updates,
          or milestones. Check back regularly for the latest codes.
        </li>
        <li>
          <b>Why isn&apos;t my code working?</b>
          <br />
          If a code isn&apos;t working, it may have expired. Double-check that
          you&apos;ve entered the code correctly, as they are case-sensitive.
        </li>
      </ul>
    </div>
  );
}
