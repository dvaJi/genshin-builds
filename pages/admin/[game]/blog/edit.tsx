import { BlogPost } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { serialize } from "next-mdx-remote/serialize";
import { useRouter } from "next/router";
import { useState } from "react";
import remarkGfm from "remark-gfm";

import BlogPostForm from "@components/BlogPostForm";
import PostRender from "@components/genshin/PostRender";
import { getLocale } from "@lib/localData";
import { getPostById } from "@pages/api/blog";
import { authOptions } from "@pages/api/auth/[...nextauth]";

type Props = {
  game: string;
  post: BlogPost;
  originalCompiled: string;
};

function BlogEdit({ game, post, originalCompiled }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [compiled, setCompiled] = useState<{ compiledSource: string }>({
    compiledSource: originalCompiled,
  });
  const router = useRouter();

  const onContentChange = (content: string) => {
    serialize(content, {
      mdxOptions: {
        development: process.env.NEXT_PUBLIC_VERCEL_ENV !== "production",
        remarkPlugins: [remarkGfm],
      },
    }).then((result) => {
      setCompiled(result);
    });
  };

  async function onSubmit(data: any) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/blog", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          Object.assign(data, {
            id: post.id,
            game,
          })
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }

      // Redirect to the blog page
      router.push(`/admin/${game}/blog`);
    } catch (error: any) {
      // Handle error if necessary
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false when the request completes
    }
  }

  return (
    <div className="flex">
      <div className="mr-6 w-[600px]">
        {error && <div style={{ color: "red" }}>{error}</div>}
        <BlogPostForm
          isLoading={isLoading}
          onSubmit={onSubmit}
          onContentChange={onContentChange}
          initialData={post}
        />
      </div>
      <div className="relative mx-auto max-w-screen-md">
        <section className="prose prose-invert card mt-0 max-w-none">
          {/* <img
            alt={fm.title}
            src={getImg("gi", `/blog/${fm.image}`)}
            className="mx-auto rounded-lg text-center"
          /> */}
          <PostRender
            compiledSource={compiled.compiledSource}
            frontmatter={{}}
            scope={{}}
          />
          {/* {compiled.compiledSource} */}
        </section>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
  locale = "en",
  ...ctx
}) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const post = await getPostById(query?.id as string);
  const lngDict = await getLocale(locale, params?.game as string);

  if (!post) {
    return {
      redirect: {
        destination: `/admin/${params?.game}/blog`,
        permanent: false,
      },
    };
  }

  const compiled = await serialize(post.content, {
    mdxOptions: {
      development: process.env.NEXT_PUBLIC_VERCEL_ENV !== "production",
      remarkPlugins: [remarkGfm],
    },
  });

  return {
    props: {
      post,
      game: params?.game,
      originalCompiled: compiled.compiledSource,
      lngDict,
    },
  };
};

export default BlogEdit;
