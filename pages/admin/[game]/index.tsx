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
    <div className="flex gap-4">
      <Link href={`/admin/${game}/blog`}>Archives</Link>
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
      lngDict,
    },
  };
};

export default ArchivesAdmin;
