import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";

import Button from "@components/ui/Button";
import { getLocale } from "@lib/localData";
import { Session } from "@lib/session";
import { authOptions } from "@pages/api/auth/[...nextauth]";

type Props = {
  session: Session;
};

const ArchivesAdmin = ({ session }: Props) => {
  const games = ["genshin", "hsr", "tof"];

  if (!session) {
    return (
      <div className="m-8 flex items-start justify-start gap-4">
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="m-8 flex items-start justify-start gap-4">
      {games.map((game) => (
        <Link
          key={game}
          href={`/admin/${game}`}
          className="rounded border border-zinc-600 bg-zinc-800 px-12 py-6 transition-colors hover:border-zinc-400"
        >
          {game} blog
        </Link>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = "en",
  ...ctx
}) => {
  const lngDict = await getLocale(locale, "genshin");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  return {
    props: {
      session,
      lngDict,
    },
  };
};

export default ArchivesAdmin;
