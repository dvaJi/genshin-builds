import { MDXRemote } from "next-mdx-remote";
import dynamic from "next/dynamic";
import Link from "next/link";

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

const components = {
  a: CustomLink,
  table: Table,
  Ads,
  FrstAds,
  CustomMap,
};

type Props = {
  compiledSource?: any;
  frontmatter?: any;
  scope?: any;
};

function PostRender(props: Props) {
  if (props.compiledSource) {
    return (
      <MDXRemote
        compiledSource={props.compiledSource}
        frontmatter={props.frontmatter}
        scope={props.scope}
        components={components}
      />
    );
  }

  return <div></div>;
}

export default PostRender;
