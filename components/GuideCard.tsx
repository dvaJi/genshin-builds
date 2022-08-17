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
    <Link href={`/guides/${guide.slug}`}>
      <a className="p-2 group">
        <div className="relative overflow-hidden">
          <LazyLoadImage
            src={guide.thumbnail}
            alt={guide.title}
            className="rounded shadow-2xl group-hover:brightness-110 group-hover:scale-105 transition-all object-scale-down"
          />
        </div>
        <div>
          <h5 className="text-lg text-slate-300 my-1 group-hover:text-slate-100 transition-all">
            {guide.title}
          </h5>
          <div className="flex justify-between">
            <div>
              <span className="bg-vulcan-600 rounded mr-2 p-1 px-1.5 text-xs">
                {guide.type}
              </span>
              {guide.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-vulcan-700 text-slate-500 rounded mr-2 p-1 px-1.5 text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="text-xs flex items-baseline">{timeAgo}</div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default memo(GuideCard);
