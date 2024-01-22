import { getServerSession } from "next-auth";
import { compileMDX } from "next-mdx-remote/rsc";
import { redirect } from "next/navigation";
import remarkGfm from "remark-gfm";

import { componentsList } from "@components/genshin/PostRender";
import { authOptions } from "@lib/auth";
import { getPostContentById } from "@lib/blog";
import { Session } from "@lib/session";
import BlogEditor from "../../blog-editor";

export default async function BlogEdit({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/admin");
  }

  const post = await getPostContentById(params.id);
  if (!post) {
    return redirect(`/admin/blog`);
  }

  const content = await compileMDX({
    source: post.content,
    components: componentsList.reduce(
      (acc, cur) => {
        acc[cur.name] = cur.component;
        return acc;
      },
      {} as Record<string, any>
    ),
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
