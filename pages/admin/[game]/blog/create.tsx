import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { serialize } from "next-mdx-remote/serialize";
import { useRouter } from "next/router";
import { useState } from "react";
import remarkGfm from "remark-gfm";

import BlogPostForm from "@components/admin/BlogPostForm";
import PostRender from "@components/genshin/PostRender";
import { getLocale } from "@lib/localData";
import { Session } from "@lib/session";
import { authOptions } from "@pages/api/auth/[...nextauth]";

type Props = {
  game: string;
  session: Session;
};

function CreatePost({ game, session }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [compiled, setCompiled] = useState<{ compiledSource: string }>({
    compiledSource: ``,
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          Object.assign(data, {
            game,
            authorName: session.user?.globalName || "GenshinBuilds",
            authorAvatar:
              session.user?.image ||
              "https://genshin-builds.com/icons/android-icon-72x72.png",
            authorLink:
              session.user?.link || "https://twitter.com/genshin_builds",
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
          game={game}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onContentChange={onContentChange}
        />
      </div>
      <div className="relative mx-auto max-w-screen-md">
        <section className="prose prose-invert mt-4 max-w-none">
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

  const lngDict = await getLocale(locale, params?.game as string);

  return {
    props: {
      game: params?.game,
      session,
      lngDict,
    },
  };
};

export default CreatePost;
