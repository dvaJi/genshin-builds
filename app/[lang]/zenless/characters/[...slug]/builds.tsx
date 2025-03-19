import { useTranslations } from "next-intl";
import Link from "next/link";

import Image from "@components/zenless/Image";
import type { Build, Builds } from "@interfaces/zenless/build";
import type { Commons } from "@interfaces/zenless/commons";
import type { DiskDrives } from "@interfaces/zenless/diskDrives";
import type { WEngines } from "@interfaces/zenless/wEngines";

type Props = {
  lang: string;
  characterName: string;
  builds: Build[];
  wEnginesMap: Record<string, WEngines>;
  diskDrivesMap: Record<string, DiskDrives>;
  commons: Commons;
};

export default function Builds({
  lang,
  characterName,
  builds,
  commons,
  diskDrivesMap,
  wEnginesMap,
}: Props) {
  const t = useTranslations("zenless.character");
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold md:text-3xl">
        {t("builds", {
          character_name: characterName,
        })}
      </h2>
      {builds.map((b) => (
        <div
          key={b.name}
          className="mb-4 flex flex-col gap-4 rounded-lg border-2 border-neutral-600 bg-neutral-900 p-3 md:p-4"
        >
          <h3 className="text-xl font-semibold">{b.name}</h3>
          <p
            className="text-neutral-200"
            dangerouslySetInnerHTML={{ __html: b.overview ?? "" }}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-2 text-lg font-medium">{t("best_wengines")}</h4>
              <div className="flex flex-col gap-2">
                {b["w-engines"].map((w) => (
                  <Link
                    key={w}
                    href={`/${lang}/zenless/w-engines/${w}`}
                    className="group rounded-md p-1 ring-neutral-600 hover:ring-2"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={`/w-engines/${wEnginesMap[w].icon}.webp`}
                        width={48}
                        height={48}
                        alt={wEnginesMap[w].name}
                      />
                      <div className="flex flex-col">
                        <h5 className="font-medium group-hover:text-yellow-400">
                          {wEnginesMap[w].name}
                        </h5>
                        <div className="flex">
                          {Array.from({ length: wEnginesMap[w].rarity }).map(
                            (_, i) => (
                              <Image
                                key={i}
                                src="/icons/start.png"
                                width={14}
                                height={14}
                                alt="Star"
                              />
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-lg font-medium">
                {t("best_disk_drives")}
              </h4>
              <div className="flex flex-col gap-2">
                {b["drive-disc"].map((d) => (
                  <Link
                    key={d.name}
                    href={`/${lang}/zenless/disk-drives/${d.name}`}
                    className="group rounded-md p-1 ring-neutral-600 hover:ring-2"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={`/disk-drives/${diskDrivesMap[d.name]?.icon}.webp`}
                        width={46}
                        height={46}
                        alt={diskDrivesMap[d.name]?.name ?? d.name}
                      />
                      <div className="flex flex-col">
                        <h5 className="font-medium group-hover:text-yellow-400">
                          {diskDrivesMap[d.name]?.name ?? d.name}
                        </h5>
                        <p className="text-sm text-neutral-300">
                          {d.pieces} PC
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-lg font-medium">
                {t("best_main_stats")}
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="rounded-md bg-neutral-600 px-2 py-1 text-sm font-medium">
                    6
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {b["main-stats"]["6"].map((sarr) => (
                      <div key={sarr.join()} className="text-sm">
                        {sarr
                          .map((s) => commons[s as keyof Commons])
                          .join(" - ")}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-md bg-neutral-600 px-2 py-1 text-sm font-medium">
                    5
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {b["main-stats"]["5"].map((sarr) => (
                      <div key={sarr.join()} className="text-sm">
                        {sarr
                          .map((s) => commons[s as keyof Commons])
                          .join(" - ")}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-md bg-neutral-600 px-2 py-1 text-sm font-medium">
                    4
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {b["main-stats"]["4"].map((sarr) => (
                      <div key={sarr.join()} className="text-sm">
                        {sarr
                          .map((s) => commons[s as keyof Commons])
                          .join(" - ")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-lg font-medium">
                {t("best_sub_stats")}
              </h4>
              <div className="flex flex-col gap-2">
                {b["sub-stats"].map((sarr) => (
                  <div key={sarr.join()} className="text-sm">
                    {sarr.map((s) => commons[s as keyof Commons]).join(" - ")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
