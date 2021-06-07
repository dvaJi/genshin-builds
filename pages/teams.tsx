import { GetStaticProps } from "next";
import GenshinData, { Character } from "genshin-data";

import TeamCard from "@components/TeamCard";
import Metadata from "@components/Metadata";

import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { getLocale } from "@lib/localData";
import { Team, TeamFull } from "interfaces/teams";

type CharactersProps = {
  teams: TeamFull[];
  common: Record<string, string>;
};

const CharactersPage = ({ teams }: CharactersProps) => {
  const { t } = useIntl();
  return (
    <div>
      <Metadata
        fn={t}
        pageTitle={t({
          id: "title.teams",
          defaultMessage: "Best Team Comp | Party Building Guide",
        })}
        pageDescription={t({
          id: "title.teams.description",
          defaultMessage:
            "This is a guide to making the best party in Genshin Impact. Learn how to make the best party! We introduce the best party composition for each task including exploring areas, slaying field bosses, and more!",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "best_team_comp", defaultMessage: "Best Team Comp" })}
      </h2>
      <div className="">
        {teams.map((team, i) => (
          <TeamCard key={team.primary[0].character.id + i} team={team} />
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const teams = require(`../_content/data/teams.json`) as Team[];

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = (
    await genshinData.characters({
      select: ["id", "name", "element"],
    })
  ).reduce<Record<string, Character>>((map, val) => {
    map[val.id] = val;
    return map;
  }, {});

  let teamsf: TeamFull[] = teams.map((team) => {
    return {
      primary: team.primary.map((prim) => ({
        character: characters[prim.characterId],
        role: prim.role,
      })),
      alternatives: team.alternatives.map((alt) => ({
        characters: alt.characters.map((c) => characters[c]),
        substitutes: alt.substitutes.map((c) => characters[c]),
      })),
    };
  });

  return {
    props: { teams: teamsf, lngDict },
    revalidate: 1,
  };
};

export default CharactersPage;
