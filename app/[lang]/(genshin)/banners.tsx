import Link from "next/link";
import Image from "next/image";
import { getGenshinData } from "@lib/dataApi";
import { getImg } from "@lib/imgUrl";

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
  const { data } = await getGenshinData<{ data: Timeline[][] }>({
    resource: "timelines",
    language: lang,
    filter: {
      id: "timeline",
    },
  });

  const now = new Date();
  const banners = data.flat().filter((t) => {
    if (t.name.endsWith("Banner")) {
      if (t.start && t.end) {
        const start = new Date(t.start);
        const end = new Date(t.end);
        return start <= now && end >= now;
      }
    }
    return false;
  });

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {banners.map((banner) => {
        const daysLeft = Math.ceil(
          (new Date(banner.end).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return (
          <div
            key={banner.name}
            className="group transform transition-all duration-300 hover:-translate-y-2"
          >
            <Link
              href={`/${lang}/banners/${banner.name.endsWith("Weapon Banner") ? "weapons" : "characters"}`}
              className="block overflow-hidden rounded-xl bg-gradient-to-br from-vulcan-800/90 to-vulcan-900/90 shadow-lg transition-all duration-300 hover:shadow-vulcan-500/10"
              prefetch={false}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* Banner image */}
                <Image
                  src={getImg("genshin", `/events/${banner.image}`, {
                    width: 400,
                    height: 225,
                  })}
                  alt={banner.name}
                  width={400}
                  height={225}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-vulcan-900 via-vulcan-900/20 to-transparent opacity-60" />

                {/* Days left badge */}
                <div className="absolute bottom-3 right-3">
                  <span className="rounded-full bg-vulcan-800/90 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm">
                    {daysLeft} days left
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium text-slate-200 transition-colors group-hover:text-white">
                  {banner.name}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {new Date(banner.start).toLocaleDateString()} -{" "}
                  {new Date(banner.end).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
