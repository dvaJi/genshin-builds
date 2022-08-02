import { useState } from "react";
import clsx from "clsx";
import { GetStaticProps } from "next";
import GenshinData, { Character } from "genshin-data";
import {
  IoCaretUp,
  IoCaretDown,
  IoRemoveCircle,
  IoAddCircle,
} from "react-icons/io5";

import { getCharacterBuild, getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";

import { Build, BuildWeapon } from "interfaces/build";
import Button from "@components/Button";

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
  const [open, setOpen] = useState<string[]>([]);

  const updateBuild = (id: string, newbuilds: Build[]) => {
    const newBuild: Record<string, Build[]> = { [id]: newbuilds };
    setBuilds({ ...builds, ...newBuild });
  };

  const toggleCard = (charId: string) => {
    if (open.includes(charId)) {
      setOpen((o) => o.filter((a) => a !== charId));
    } else {
      setOpen((o) => [...o, charId]);
    }
  };

  // This page is only available for development env
  if (process.env.NODE_ENV !== "development") {
    return <div>...</div>;
  }

  return (
    <div>
      <div>
        {Object.keys(builds).map((charId) => (
          <div key={charId} className="bg-vulcan-700 m-2 p-2 rounded">
            <div
              className="bg-gray-700 p-2 rounded"
              onClick={() => toggleCard(charId)}
            >
              {charId}
            </div>
            <div>
              {open.includes(charId) && (
                <Builder
                  charId={charId}
                  charBuild={builds[charId]}
                  onUpdate={updateBuild}
                  artifacts={artifacts}
                  weapons={weapons[characters[charId].weapon_type]}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div>
        <Button onClick={() => console.log(JSON.stringify(builds))}>
          EXPORT
        </Button>
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
    const id = `${charId}_${role.toLowerCase().replace(" ", "_")}${name
      .toLowerCase()
      .replace(" ", "_")}`;
    const newBuild: Build = {
      id: id,
      name: name,
      description: "",
      recommended: false,
      role: role,
      sets: [["gladiators_finale"]],
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

  const deleteBuild = (id: string) => {
    onUpdate(
      charId,
      charBuild.filter((cb) => cb.id !== id)
    );
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
          <Button onClick={() => addnewBuild(newBuild)}>Add new build</Button>
        </div>
      </div>
      <div className="col-span-11">
        {charBuild.map((build, i) => (
          <BuildDetail
            key={charId + i}
            build={build}
            index={i}
            onChange={handleOnChange}
            onRemoveBuild={deleteBuild}
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
  onRemoveBuild: (id: string) => void;
  artifacts: string[];
  weapons: string[];
};

const BuildDetail = ({
  build,
  index,
  onChange,
  onRemoveBuild,
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
      sets: [...build.sets, [artifacts[0], artifacts[0]]],
    });
  };

  const removeSet = (i: number) => {
    onChange(index, {
      ...build,
      sets: build.sets.filter((_, ind) => ind !== i),
    });
  };

  const addNewSet = (i: number) => {
    onChange(index, {
      ...build,
      sets: [
        ...build.sets.map((set, ind) => {
          if (ind === i) {
            return [...set, artifacts[0]];
          }
          return set;
        }),
      ],
    });
  };

  const removeArtifactFromSet = (i: number, ai: number) => {
    let newset = [...build.sets[i]];

    updateSet(
      i,
      newset.filter((_, index) => index !== ai)
    );
  };

  const updateSet = (i: number, st: string[]) => {
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

  const moveWeaponPriority = (i: number, newIndex: number) => {
    let newWeapons = [...build.weapons];
    newWeapons.splice(newIndex, 0, ...newWeapons.splice(i, 1));

    onChange(index, {
      ...build,
      weapons: newWeapons,
    });
  };

  const changeName = (newName: string) => {
    onChange(index, {
      ...build,
      name: newName,
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
        <Button
          className="p-2 hover:text-white"
          onClick={() => onRemoveBuild(build.id)}
        >
          <IoRemoveCircle className="cursor-pointer inline-block" /> Remove
        </Button>
        <div>
          <input
            onChange={(e) => changeName(e.target.value)}
            value={build.name}
          />
        </div>
        <div>
          <Button onClick={toggleRecommended}>
            {build.recommended ? "Recommended" : "Not recomended"}
          </Button>
        </div>
      </div>
      <div className="col-span-2">
        <h2>WEAPONS</h2>
        <ol className="list-decimal">
          {build.weapons.map((wId, i) => (
            <li key={i}>
              <select
                className="w-28"
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
              <IoRemoveCircle
                className="cursor-pointer inline-block hover:text-white"
                onClick={() => removeWeapon(i)}
              />
              {i > 0 && (
                <IoCaretUp
                  className="cursor-pointer inline-block hover:text-white"
                  onClick={() => moveWeaponPriority(i, i - 1)}
                />
              )}
              {i + 1 < build.weapons.length && (
                <IoCaretDown
                  className="cursor-pointer inline-block hover:text-white"
                  onClick={() => moveWeaponPriority(i, i + 1)}
                />
              )}
            </li>
          ))}
        </ol>
        <Button className="mt-2" onClick={addWeapon}>
          Add Weapon
        </Button>
      </div>
      <div className="col-span-2">
        <h2>ARTIFACTS</h2>
        <ol className="list-decimal">
          {build.sets.map((set, iset) => (
            <li key={`set${iset}`} className="mb-4">
              {Object.keys(set).map((k, ai) => (
                <span key={`set${iset}${ai}`}>
                  <select
                    className="w-32"
                    value={(set as any)[k]}
                    onChange={(e) => {
                      let newSet = [...set];
                      newSet[k as any] = e.target.value;
                      updateSet(iset, newSet);
                    }}
                  >
                    {artifacts.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>{" "}
                  <IoRemoveCircle
                    className="cursor-pointer inline-block hover:text-white"
                    onClick={() => removeArtifactFromSet(iset, ai)}
                  />
                  <br />
                </span>
              ))}
              <button
                onClick={() => removeSet(iset)}
                className="text-xs hover:text-white"
              >
                Remove
              </button>
              <button
                className="ml-2 text-xs hover:text-white"
                onClick={() => addNewSet(iset)}
              >
                Add
              </button>
            </li>
          ))}
          <Button className="mt-2" onClick={addSet}>
            Add new set
          </Button>
        </ol>
      </div>
      <div className="col-span-2">
        <h2>MAIN STATS</h2>
        <ol className="list-decimal">
          {["sands", "goblet", "circlet"].map((st) => (
            <li key={st}>
              {st}
              <br />
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
                  <IoRemoveCircle
                    className="cursor-pointer inline-block hover:text-white"
                    onClick={() => removeMainstat(st, s)}
                  />
                  <br />
                </span>
              ))}
              <IoAddCircle
                className="cursor-pointer inline-block hover:text-white"
                onClick={() => addMainstat(st)}
              />
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
              <IoRemoveCircle
                className="cursor-pointer inline-block hover:text-white"
                onClick={() => removeSubstat(stat)}
              />
            </li>
          ))}
        </ol>
        <Button className="mt-2" onClick={addSubstat}>
          Add substats
        </Button>
      </div>
      <div className="col-span-2">
        <h2>TALENT PRIORITY</h2>
        <ol className="list-decimal">
          {build.talent_priority.map((talent, i) => (
            <li key={talent}>
              {talent}
              {i > 0 && (
                <IoCaretUp
                  className="cursor-pointer inline-block hover:text-white"
                  onClick={() => moveTalentPriority(i, i - 1)}
                />
              )}
              {i + 1 < build.talent_priority.length && (
                <IoCaretDown
                  className="cursor-pointer inline-block hover:text-white"
                  onClick={() => moveTalentPriority(i, i + 1)}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  if (process.env.NODE_ENV !== "development") {
    return {
      props: {
        characters: {},
        weapons: {},
        artifacts: [],
        currentbuilds: {},
      },
    };
  }

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

  const lngDict = await getLocale(locale);

  return {
    props: {
      characters: charactersMap,
      weapons: weaponsMap,
      artifacts: [
        ...artifacts.map((a) => a.id),
        "18atk_set",
        "20energyrecharge_set",
        "25physicaldmg_set",
      ],
      currentbuilds,
      lngDict,
    },
  };
};

export default BuildsBuilder;
