import Link from "next/link";

import { getImg } from "@lib/imgUrl";
import { getRemoteData } from "@lib/localData";

type Timeline = {
  name: string;
  pos: string;
  image: string;
  start: string;
  end: string;
  color: string;
  url?: string;
  timezoneDependent?: boolean;
  description?: string;
};

type Props = {
  lang: string;
};

export async function Banners({ lang }: Props) {
  const timeline = await getRemoteData<Timeline[][]>("genshin", "timeline");

  const now = new Date();
  const banners = timeline.flat().filter((t) => {
    if (t.name.endsWith("Banner")) {
      // Check if the banner is active, eg: 2021-10-20
      if (t.start && t.end) {
        const start = new Date(t.start);
        const end = new Date(t.end);
        return start <= now && end >= now;
      }
    }
    return false;
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4">
      {banners.map((banner) => (
        <Link
          href={`/${lang}/banners/${banner.name.endsWith("Weapon Banner") ? "weapons" : "characters"}`}
          key={banner.name}
          className="group mx-auto max-w-xs overflow-hidden"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded bg-vulcan-900 object-cover">
            <img
              src={getImg("genshin", `/events/${banner.image}`, {
                width: 320,
                height: 180,
              })}
              alt={banner.name}
              className="aspect-video w-full rounded object-cover shadow-2xl transition-all group-hover:scale-105 group-hover:brightness-110"
            />
          </div>
          <div className="text-center">
            <h3 className="mt-1 text-base text-slate-300 transition-all group-hover:text-slate-100">
              {banner.name}
            </h3>
            <p className="text-xs">
              {new Date(banner.start).toDateString()} -{" "}
              {new Date(banner.end).toDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
