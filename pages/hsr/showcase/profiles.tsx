import { GetStaticProps } from "next";

import { getHsrUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToHSRLang } from "@utils/locale-to-lang";

function Profiles() {
  return <div>profiles</div>;
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");

  return {
    props: {
      lngDict,
      bgStyle: {
        image: getHsrUrlLQ(`/bg/normal-bg.webp`),
      },
    },
  };
};

export default Profiles;
