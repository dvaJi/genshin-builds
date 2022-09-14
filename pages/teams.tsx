import { GetStaticProps } from "next";
import GenshinData, { Character } from "genshin-data";

import Ads from "@components/Ads";
import TeamCard from "@components/TeamCard";
import Metadata from "@components/Metadata";

import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { getLocale } from "@lib/localData";
import { TeamData, Teams, CharacterTeam } from "interfaces/teams";
import { AD_ARTICLE_SLOT } from "@lib/constants";

type TeamsProps = {
  teamsByName: Record<
    string,
    (TeamData & { characters: (CharacterTeam & { name: string })[] })[]
  >;
  common: Record<string, string>;
};

const TeamsPage = ({ teamsByName }: TeamsProps) => {
  const { t } = useIntl("teams");
  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Best Team Comp | Party Building Guide",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "This is a guide to making the best party in Genshin Impact. Learn how to make the best party! We introduce the best party composition for each task including exploring areas, slaying field bosses, and more!",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "best_team_comp", defaultMessage: "Best Team Comp" })}
      </h2>
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <div className="">
        {Object.entries(teamsByName).map(([mainName, teams]) => (
          <div key={mainName}>
            {teams.map((team) => (
              <TeamCard key={team.name} team={team} mainName={mainName} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const teams = require(`../_content/genshin/data/teams.json`) as Teams;

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = (
    await genshinData.characters({
      select: ["id", "name", "element"],
    })
  ).reduce<Record<string, Character>>((map, val) => {
    map[val.id] = val;
    return map;
  }, {});

  let teamsf: any = {};

  Object.entries(teams).forEach(([id, tims]) => {
    if (!teamsf[characters[id].name]) {
      teamsf[characters[id].name] = [];
    }

    teamsf[characters[id].name].push({
      ...tims[0],
      characters: tims[0].characters.map((c) => {
        return {
          ...c,
          name: characters[c.id]?.name || "",
        };
      }),
    });
  });

  return {
    props: { teamsByName: teamsf, lngDict },
  };
};

export default TeamsPage;
