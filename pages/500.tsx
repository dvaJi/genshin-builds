import { getLocale } from "@lib/localData";
import { GetStaticProps } from "next";

function ErrorNotFound() {
  return (
    <div className="my-24">
      <h1 className="text-center text-2xl">500 - Internal Server Error</h1>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  return {
    props: { lngDict },
  };
};

export default ErrorNotFound;
