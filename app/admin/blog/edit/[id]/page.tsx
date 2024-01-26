import { getServerSession } from "next-auth";
import { compileMDX } from "next-mdx-remote/rsc";
import { redirect } from "next/navigation";
import remarkGfm from "remark-gfm";

import { componentsList as genshinComps } from "@components/genshin/PostRender";
import { componentsList as hsrComps } from "@components/hsr/PostRender";
import { componentsList as zenlessComps } from "@components/zenless/PostRender";
import { authOptions } from "@lib/auth";
import { getPostContentById } from "@lib/blog";
import { Session } from "@lib/session";
import BlogEditor from "../../blog-editor";
import { useDynamicComponents } from "@hooks/use-dynamic-components";

export default async function BlogEdit({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/admin");
  }

  const post = await getPostContentById(params.id);
  if (!post) {
    return redirect(`/admin/blog`);
  }

  let comps: any = genshinComps;

  if (post.post.game === "hsr") {
    comps = hsrComps;
  } else if (post.post.game === "zenless") {
    comps = zenlessComps;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const components = useDynamicComponents(post.content, comps);

  const content = await compileMDX({
    source: post.content,
    components: components,
    options: {
      mdxOptions: {
        development: process.env.NEXT_PUBLIC_VERCEL_ENV !== "production",
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return (
    <BlogEditor
      post={post.post}
      postContent={post}
      session={session as Session}
      content={content.content}
    />
  );
}
