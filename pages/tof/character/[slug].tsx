import { useEffect, useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { Character } from "interfaces/tof/character";
import { getLocale } from "@lib/localData";
import { getCharacterById, getCharacters } from "@lib/tofdata";

interface CharacterPageProps {
  character: Character;
}

const CharacterPage = ({ character }: CharacterPageProps) => {
  // const [buildSelected, setBuildSelected] = useState(
  //   builds.findIndex((b) => b.recommended) ?? 0
  // );
  // const { t } = useIntl("character");
  // useEffect(() => {
  //   setBackground({
  //     image: getUrl(
  //       `/regions/${common[character.region] || "Mondstadt"}_d.jpg`
  //     ),
  //     gradient: {
  //       background: "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
  //     },
  //   });
  // }, [character.region, common]);
  return (
    <div>
      {/* <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "{name} Genshin Impact Build Guide",
          values: { name: character.name },
        })}
        pageDescription={character.description}
        jsonLD={generateJsonLd(locale, t)}
      /> */}
      {character.name}
    </div>
  );
};

// const generateJsonLd = (
//   locale: string,
//   t: (props: IntlFormatProps) => string
// ) => {
//   return `{
//     "@context": "http://schema.org",
//     "@type": "BreadcrumbList",
//     "itemListElement": [
//       {
//         "@type": "ListItem",
//         "position": 1,
//         "item": {
//           "@id": "https://genshin-builds.com/${locale}/",
//           "name": "Genshin-Builds.com"
//         }
//       },
//       {
//         "@type": "ListItem",
//         "position": 2,
//         "item": {
//           "@id": "https://genshin-builds.com/${locale}/characters",
//           "name": "${t({
//             id: "characters",
//             defaultMessage: "Characters",
//           })}"
//         }
//       }
//     ]
//   }`;
// };

export const getStaticProps: GetStaticProps = async ({
  params,
  locale = "en",
}) => {
  const lngDict = await getLocale(locale, "genshin");
  const character = getCharacterById(locale, `${params?.slug}`);

  return {
    props: {
      character,
      lngDict,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const characters = getCharacters("en") || [];

  const paths: { params: { slug: string }; locale: string }[] = [];

  for (const locale of locales) {
    characters.forEach((character) => {
      paths.push({ params: { slug: character.id }, locale });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export default CharacterPage;
