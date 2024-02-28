import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkGfm from "remark-gfm";

import { useDynamicComponents } from "@hooks/use-dynamic-components";

const CustomLink = (props: any) => {
  const href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

const Table = (props: any) => {
  return (
    <table
      {...props}
      className="w-auto rounded border border-vulcan-800 bg-vulcan-700 [&>tbody>tr>td]:p-2 [&>thead>tr>th]:p-2"
    />
  );
};

export const componentsList = [
  {
    publicName: "Ads",
    componentName: "Ads",
    importPath: () => import("../ui/Ads"),
    example: `<Ads placementName="genshinbuilds_billboard_atf" />`,
  },
  {
    publicName: "FrstAds",
    componentName: "FrstAds",
    importPath: () => import("../ui/FrstAds"),
    example: `<FrstAds placementName="genshinbuilds_billboard_atf" />`,
  },
  {
    publicName: "GenshinMap Embed",
    componentName: "GenshinMapEmbed",
    importPath: () => import("./GIMapEmbed"),
    example: `\n<GenshinMapEmbed ids={["anemoculus", "geoculus"]} />\nMore information here: https://genshin-impact-map.appsample.com/help/embed\n`,
  },
  {
    publicName: "Youtube Embed",
    componentName: "YoutubeEmbed",
    importPath: () => import("../YoutubeEmbed"),
    example: `\n<YoutubeEmbed id="dQw4w9WgXcQ" />\n`,
  },
  {
    publicName: "X (Tweet) Embed",
    componentName: "XEmbed",
    importPath: () => import("../XEmbed"),
    example: `\n<XEmbed url="https://twitter.com/PlayStation/status/1438205340000000000" />\n`,
  },
  {
    publicName: "Countdown To Date",
    componentName: "CountdownToDate",
    importPath: () => import("../CountdownToDate"),
    example: `\n<CountdownToDate targetDate="2024-02-28T21:18:04.180Z" customEndText="The end has already finished!" countdownRefreshInterval={1000} />\n`,
  },
];

type Props = {
  compiledSource?: any;
  frontmatter?: any;
  scope?: any;
};

function PostRender(props: Props) {
  const components = useDynamicComponents(props.compiledSource, componentsList);

  if (props.compiledSource) {
    return (
      <MDXRemote
        source={props.compiledSource}
        components={{ ...components, a: CustomLink, table: Table }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    );
  }

  return <div></div>;
}

export default PostRender;
