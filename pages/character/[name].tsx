import { useRouter } from "next/router";

const Character = () => {
  const router = useRouter();
  return <div>{router.query.name}</div>;
};

export default Character;
