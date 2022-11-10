import { GetStaticProps } from "next";

import { getLocale } from "@lib/localData";
import { getUrlLQ } from "@lib/imgUrl";
import Card from "@components/ui/Card";

const WeaponsPage = () => {
  return (
    <div>
      <Card>
        {process.env.NEXT_PUBLIC_FEEDBACK_POLL_QUESTION_URL && (
          <iframe
            src={process.env.NEXT_PUBLIC_FEEDBACK_POLL_QUESTION_URL}
            width="100%"
            height="1000px"
            frameBorder="0"
          />
        )}
      </Card>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");

  return {
    props: {
      lngDict,
      bgStyle: {
        image: getUrlLQ(`/regions/Sumeru_n.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default WeaponsPage;
