import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";

import { getLocale } from "@lib/localData";
import { authOptions } from "@pages/api/auth/[...nextauth]";

type Props = {
  game: string;
};

const ArchivesAdmin = ({ game }: Props) => {
  return (
    <div className="m-8 flex items-start justify-start gap-4">
      <Link
        href={`/admin/${game}/blog`}
        className="rounded border border-zinc-600 bg-zinc-800 px-12 py-6 transition-colors hover:border-zinc-400"
      >
        Blog
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale = "en",
  ...ctx
}) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const lngDict = await getLocale(locale, "genshin");

  if (!session) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      game: params?.game,
      session,
      lngDict,
    },
  };
};

export default ArchivesAdmin;
