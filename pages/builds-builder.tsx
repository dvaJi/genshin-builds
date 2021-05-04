import { useState } from "react";
import clsx from "clsx";
import { GetStaticProps } from "next";
import GenshinData, { Character } from "genshin-data";

import { getCharacterBuild } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";

import { Build, BuildSet, BuildWeapon } from "interfaces/build";

type Props = {
  characters: Record<string, Character>;
  weapons: Record<string, string[]>;
  artifacts: string[];
  currentbuilds: Record<string, Build[]>;
};

const BuildsBuilder = ({
  characters,
  weapons,
  artifacts,
  currentbuilds,
}: Props) => {
  const [builds, setBuilds] = useState(currentbuilds);

  const updateBuild = (id: string, newbuilds: Build[]) => {
    const newBuild: Record<string, Build[]> = { [id]: newbuilds };
    setBuilds({ ...builds, ...newBuild });
  };

  return (
    <div>
      <div>
        {Object.keys(builds).map((charId) => (
          <Builder
            key={charId}
            charId={charId}
            charBuild={builds[charId]}
            onUpdate={updateBuild}
            artifacts={artifacts}
            weapons={weapons[characters[charId].weapon_type]}
          />
        ))}
      </div>
      <div>
        <button onClick={() => console.log(JSON.stringify(builds))}>
          EXPORT
        </button>
      </div>
    </div>
  );
};

type BuilderProps = {
  charId: string;
  charBuild: Build[];
  onUpdate: (id: string, newbuilds: Build[]) => void;
  artifacts: string[];
  weapons: string[];
};

const Builder = ({
  charId,
  charBuild,
  onUpdate,
  artifacts,
  weapons,
}: BuilderProps) => {
  const [newBuild, setNewBuild] = useState({ name: "", role: "Main DPS" });
  const handleOnChange = (index: number, build: Build) => {
    let tmp = [...charBuild];
    tmp[index] = build;
    onUpdate(charId, tmp);
  };

  const addnewBuild = ({ name, role }: { name: string; role: string }) => {
    const id = `${charId}_${role
      .toLowerCase()
      .replace(" ", "_")}${name.toLowerCase().replace(" ", "_")}`;
    const newBuild: Build = {
      id: id,
      name: id,
      description: "",
      recommended: false,
      role: role,
      sets: [],
      stats: {
        flower: ["HP"],
        plume: ["ATK"],
        sands: ["DEF%"],
        goblet: ["Geo DMG"],
        circlet: ["CRIT Rate", "CRIT DMG"],
      },
      stats_priority: ["CRIT Rate", "CRIT DMG"],
      talent_priority: ["Normal Attack", "Skill", "Burst"],
      weapons: [],
    };
    onUpdate(charId, [...charBuild, newBuild]);
    setNewBuild({ name: "", role: "Main DPS" });
  };

  return (
    <div className="grid grid-cols-12 border-b border-gray-900 bg-vulcan-700 text-sm overflow-auto">
      <div>
        {charId}
        <div>
          <h2>new build</h2>
          <input
            value={newBuild.name}
            onChange={(e) => setNewBuild({ ...newBuild, name: e.target.value })}
          />
          <select
            value={newBuild.role}
            onChange={(e) => setNewBuild({ ...newBuild, role: e.target.value })}
          >
            <option value="Main DPS">Main DPS</option>
            <option value="Sub DPS">Sub DPS</option>
            <option value="Support">Support</option>
          </select>
          <button onClick={() => addnewBuild(newBuild)}>Add new build</button>
        </div>
      </div>
      <div className="col-span-11">
        {charBuild.map((build, i) => (
          <BuildDetail
            key={charId + i}
            build={build}
            index={i}
            onChange={handleOnChange}
            artifacts={artifacts}
            weapons={weapons}
          />
        ))}
      </div>
    </div>
  );
};

type BuildDetailProps = {
  index: number;
  build: Build;
  onChange: (index: number, build: Build) => void;
  artifacts: string[];
  weapons: string[];
};

const BuildDetail = ({
  build,
  index,
  onChange,
  artifacts,
  weapons,
}: BuildDetailProps) => {
  const allstats = [
    "ATK",
    "HP",
    "DEF",
    "HP%",
    "ATK%",
    "DEF%",
    "Elemental Mastery",
    "Energy Recharge",
    "CRIT Rate",
    "CRIT DMG",
    "Elemental DMG Bonus",
    "Healing Bonus",
    "Physical DMG Bonus",
    "Pyro DMG",
    "Hydro DMG",
    "Cryo DMG",
    "Electro DMG",
    "Geo DMG",
    "Anemo DMG",
  ];
  const toggleRecommended = () => {
    onChange(index, { ...build, recommended: !build.recommended });
  };

  const addWeapon = () => {
    onChange(index, {
      ...build,
      weapons: [...build.weapons, { id: weapons[0], r: 0 }],
    });
  };

  const removeWeapon = (i: number) => {
    onChange(index, {
      ...build,
      weapons: build.weapons.filter((_, ind) => ind !== i),
    });
  };

  const updateWeapon = (i: number, weapon: BuildWeapon) => {
    let allweapons = [...build.weapons];
    allweapons[i] = weapon;

    onChange(index, {
      ...build,
      weapons: allweapons,
    });
  };

  const addSet = () => {
    onChange(index, {
      ...build,
      sets: [...build.sets, { set_1: artifacts[0], set_2: artifacts[0] }],
    });
  };

  const removeSet = (i: number) => {
    onChange(index, {
      ...build,
      sets: build.sets.filter((_, ind) => ind !== i),
    });
  };

  const removeArtifactFromSet = (i: number, ai: number) => {
    let newset = { ...build.sets[i] };
    if (ai !== 0) {
      newset = { set_1: build.sets[i].set_1 };
    } else {
      newset = { set_1: build.sets[i].set_2 || "" };
    }
    updateSet(i, newset);
  };

  const updateSet = (i: number, st: BuildSet) => {
    let allsets: any = [...build.sets];
    allsets[i] = st;

    onChange(index, {
      ...build,
      sets: allsets,
    });
  };

  const addMainstat = (art: string) => {
    onChange(index, {
      ...build,
      stats: {
        ...build.stats,
        [art]: [...(build.stats as any)[art], allstats[0]],
      },
    });
  };

  const removeMainstat = (art: string, stat: string) => {
    onChange(index, {
      ...build,
      stats: {
        ...build.stats,
        [art]: (build.stats as any)[art].filter((s: string) => s !== stat),
      },
    });
  };

  const updateMainstat = (art: string, i: number, stat: string) => {
    let mainStats: any = { ...build.stats };
    mainStats[art][i] = stat;

    onChange(index, {
      ...build,
      stats: mainStats,
    });
  };

  const addSubstat = () => {
    onChange(index, {
      ...build,
      stats_priority: [...build.stats_priority, allstats[0]],
    });
  };

  const removeSubstat = (stat: string) => {
    onChange(index, {
      ...build,
      stats_priority: build.stats_priority.filter((sp) => sp !== stat),
    });
  };

  const updateSubstat = (i: number, stat: string) => {
    let stats_priority = [...build.stats_priority];
    stats_priority[i] = stat;

    onChange(index, {
      ...build,
      stats_priority,
    });
  };

  const moveTalentPriority = (i: number, newIndex: number) => {
    let newTalents = [...build.talent_priority];
    newTalents.splice(newIndex, 0, ...newTalents.splice(i, 1));

    onChange(index, {
      ...build,
      talent_priority: newTalents,
    });
  };

  return (
    <div
      className={clsx(
        "grid grid-cols-12 py-2",
        index % 2 === 0 ? "bg-vulcan-900" : "bg-vulcan-800"
      )}
    >
      <div className="col-span-2">
        <h2>ROLE</h2>
        <div>{build.role}</div>
        <div>
          <button onClick={toggleRecommended}>
            {build.recommended ? "Recommended" : "Not recomended"}
          </button>
        </div>
      </div>
      <div className="col-span-2">
        <h2>WEAPONS</h2>
        <ol className="list-decimal">
          {build.weapons.map((wId, i) => (
            <li key={i}>
              <select
                className="w-32"
                value={wId.id}
                onChange={(e) =>
                  updateWeapon(i, { ...wId, id: e.target.value })
                }
              >
                {weapons.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>{" "}
              <select
                className="w-10"
                value={wId.r}
                onChange={(e) =>
                  updateWeapon(i, { ...wId, r: Number(e.target.value) })
                }
              >
                {[0, 1, 2, 3, 4, 5].map((w) => (
                  <option key={w} value={w}>
                    R{w}
                  </option>
                ))}
              </select>
              <button onClick={() => removeWeapon(i)}>(x)</button>
            </li>
          ))}
        </ol>
        <button onClick={addWeapon}>Add Weapon</button>
      </div>
      <div className="col-span-2">
        <h2>ARTIFACTS</h2>
        <ol className="list-decimal">
          {build.sets.map((set, iset) => (
            <li key={`set${iset}`}>
              {Object.keys(set).map((k, ai) => (
                <span key={`set${iset}${ai}`}>
                  <select
                    className="w-32"
                    value={(set as any)[k]}
                    onChange={(e) =>
                      updateSet(iset, { ...set, [k]: e.target.value })
                    }
                  >
                    {artifacts.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>{" "}
                  <button onClick={() => removeArtifactFromSet(iset, ai)}>
                    (-)
                  </button>
                  <br />
                </span>
              ))}
              <button onClick={() => removeSet(iset)}>(-)</button>
            </li>
          ))}
          <button onClick={addSet}>add new set</button>
        </ol>
      </div>
      <div className="col-span-2">
        <h2>MAIN STATS</h2>
        <ol className="list-decimal">
          {["sands", "goblet", "circlet"].map((st) => (
            <li key={st}>
              {st} <button onClick={() => addMainstat(st)}>(+)</button> - <br />
              {(build.stats as any)[st].map((s: string, i: number) => (
                <span key={s + i}>
                  <select
                    className="w-32"
                    value={s}
                    onChange={(e) => updateMainstat(st, i, e.target.value)}
                  >
                    {allstats.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>{" "}
                  <button onClick={() => removeMainstat(st, s)}>(-)</button>
                  <br />
                </span>
              ))}
            </li>
          ))}
        </ol>
      </div>
      <div className="col-span-2">
        <h2>SUB STATS</h2>
        <ol className="list-decimal">
          {build.stats_priority.map((stat, i) => (
            <li key={stat + i}>
              <select
                className="w-32"
                value={stat}
                onChange={(e) => updateSubstat(i, e.target.value)}
              >
                {allstats.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <button onClick={() => removeSubstat(stat)}>(x)</button>
            </li>
          ))}
        </ol>
        <button onClick={addSubstat}>Add substats</button>
      </div>
      <div className="col-span-2">
        <h2>TALENT PRIORITY</h2>
        <ol className="list-decimal">
          {build.talent_priority.map((talent, i) => (
            <li key={talent}>
              {talent}{" "}
              {i > 0 && (
                <button onClick={() => moveTalentPriority(i, i - 1)}>
                  (ᐱ)
                </button>
              )}
              {i < 2 && (
                <button onClick={() => moveTalentPriority(i, i + 1)}>
                  (ᐯ)
                </button>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const genshinData = new GenshinData({ language: localeToLang("en") });
  const characters = await genshinData.characters({
    select: ["id", "name", "rarity", "weapon_type"],
  });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity", "type"],
  });
  const artifacts = await genshinData.artifacts();
  const charactersMap = characters.reduce<Record<string, Character>>(
    (map, value) => {
      map[value.id] = value;
      return map;
    },
    {}
  );

  const weaponsMap = weapons.reduce<Record<string, string[]>>((map, value) => {
    if (map[value.type]) {
      map[value.type].push(value.id);
    } else {
      map[value.type] = [value.id];
    }
    return map;
  }, {});

  const currentbuilds: Record<string, Build[]> = await getCharacterBuild();

  return {
    props: {
      characters: charactersMap,
      weapons: weaponsMap,
      artifacts: artifacts.map((a) => a.id),
      currentbuilds,
    },
    revalidate: 1,
  };
};

export default BuildsBuilder;
