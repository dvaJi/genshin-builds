"use client";

import { Fragment, useEffect, useState } from "react";

import FrstAds from "@components/ui/FrstAds";
import { useStore } from "@nanostores/react";

import BuildCard, { type BuildCardMessages } from "./build-card";
import { $filters } from "./state";

type Props = {
  builds: any[];
  locale: string;
  messages: BuildCardMessages;
};

function List({ builds, locale, messages }: Props) {
  const [allBuilds, setBuilds] = useState(builds);
  const ad = useStore($filters);

  useEffect(() => {
    setBuilds(
      builds.filter((build) => {
        if (
          ad.elements.length > 0 &&
          !ad.elements.includes(build.character.element)
        ) {
          return false;
        }
        if (
          ad.search &&
          !build.character.name.toLowerCase().includes(ad.search.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
    );
  }, [ad.elements, ad.search, builds]);

  return (
    <div className="grid grid-cols-4 gap-3 px-2">
      {allBuilds.map((build, i) => (
        <Fragment key={build?.character.id}>
          <BuildCard messages={messages as any} build={build} locale={locale} />
          {(i + 1) % 5 === 0 && i / 4 < 5 ? (
            <div className="col-span-4">
              <FrstAds
                placementName={`genshinbuilds_incontent_${Math.floor(i / 4) + 1}`}
                classList={["flex", "justify-center"]}
              />
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

export default List;
