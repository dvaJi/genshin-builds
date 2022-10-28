import Link from "next/link";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Guide } from "@lib/guides_api";
import useIntl from "@hooks/use-intl";
import { getTimeAgo } from "@lib/timeago";

interface Props {
  guide: Guide;
}

const GuideCard = ({ guide }: Props) => {
  const { locale } = useIntl("guides");
  const timeAgo = getTimeAgo(new Date(guide.date).getTime(), locale);
  return (
    <Link href={`/guides/${guide.slug}`} className="group p-2">
      <div className="relative overflow-hidden">
        <LazyLoadImage
          src={guide.thumbnail}
          alt={guide.title}
          className="rounded object-scale-down shadow-2xl transition-all group-hover:scale-105 group-hover:brightness-110"
        />
      </div>
      <div>
        <h5 className="my-1 text-lg text-slate-300 transition-all group-hover:text-slate-100">
          {guide.title}
        </h5>
        <div className="flex justify-between">
          <div>
            <span className="mr-2 rounded bg-vulcan-600 p-1 px-1.5 text-xs">
              {guide.type}
            </span>
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="mr-2 rounded bg-vulcan-700 p-1 px-1.5 text-xs text-slate-500"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-baseline text-xs">{timeAgo}</div>
        </div>
      </div>
    </Link>
  );
};

export default memo(GuideCard);
