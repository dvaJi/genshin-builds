import { MDXRemote } from "next-mdx-remote/rsc";
import dynamic from "next/dynamic";
import Link from "next/link";
import remarkGfm from "remark-gfm";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });
const CustomMap = dynamic(() => import("@components/CustomMap"), {
  ssr: false,
});

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
    name: "a",
    component: CustomLink,
    custom: false,
  },
  {
    name: "table",
    component: Table,
    custom: false,
  },
  {
    name: "Ads",
    component: Ads,
    custom: true,
    example: `<Ads placementName="genshinbuilds_billboard_atf" />`,
  },
  {
    name: "FrstAds",
    component: FrstAds,
    custom: true,
    example: `<FrstAds placementName="genshinbuilds_billboard_atf" />`,
  },
  {
    name: "CustomMap",
    component: CustomMap,
    custom: true,
    example: `<CustomMap data={{imageOverlay: "/imgs/map/anemoculus_map.jpg", markIcon: "/images/anemoculus_icon.png", marks: []}} />`,
  },
];

const components = componentsList.reduce(
  (acc, cur) => {
    acc[cur.name] = cur.component;
    return acc;
  },
  {} as Record<string, any>
);

type Props = {
  compiledSource?: any;
  frontmatter?: any;
  scope?: any;
};

function PostRender(props: Props) {
  if (props.compiledSource) {
    return (
      <MDXRemote
        source={props.compiledSource}
        components={components}
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
