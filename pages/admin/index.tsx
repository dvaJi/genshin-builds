import Button from "@components/ui/Button";
import { getLocale } from "@lib/localData";
import { GetServerSideProps } from "next";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";

const ArchivesAdmin = () => {
  const { data: session } = useSession();
  const games = ["genshin", "hsr", "tof"];

  if (!session) {
    return (
      <div>
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {games.map((game) => (
        <Link key={game} href={`/admin/${game}`}>
          {game} blog
        </Link>
      ))}
      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = "en",
}) => {
  const lngDict = await getLocale(locale, "genshin");

  return {
    props: {
      lngDict,
    },
  };
};

export default ArchivesAdmin;
