import { Character } from "genshin-data";
import { useState } from "react";

type Props = {
  characters: Character[];
};

type Result = {
  img: string;
  name: string;
  amount: number;
};

const CharacterCalculator = ({ characters }: Props) => {
  const [result, setResult] = useState<Result[]>([]);
  const [character, setCharacter] = useState<Character>();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [expectedLevel, setExpectedLevel] = useState(1);
  const [items, setItems] = useState<string[]>([]);
  const [currentTalent1Lvl, setCurrentTalent1Lvl] = useState(1);
  const [currentTalent2Lvl, setCurrentTalent2Lvl] = useState(1);
  const [currentTalent3Lvl, setCurrentTalent3Lvl] = useState(1);
  const [expectedTalent1Lvl, setExpectedTalent1Lvl] = useState(1);
  const [expectedTalent2Lvl, setExpectedTalent2Lvl] = useState(1);
  const [expectedTalent3Lvl, setExpectedTalent3Lvl] = useState(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div>
        <div>Calculate Ascnesion materials?</div>
        <div>
          <select>
            {characters.map((character) => (
              <option key={character.id}>{character.name}</option>
            ))}
          </select>
        </div>
        <div>
          <span>Current character Level, Exp, and ascension</span>
          <div>
            <input
              type="number"
              value={currentLevel}
              onChange={(e) => setCurrentLevel(Number(e.target.value))}
              min="1"
              max="90"
            />
          </div>
        </div>
        <div>
          <span>Expected level</span>
          <div>
            <input
              type="number"
              value={expectedLevel}
              onChange={(e) => setExpectedLevel(Number(e.target.value))}
              min="1"
              max="90"
            />
          </div>
        </div>
      </div>
      <div>
        <span>Itms</span>
        <div>Hero`s Wit</div>
        <div>Adventurer`s Experience</div>
        <div>Wanderer`s Advice</div>
        <div>Calculate talent ascension materials</div>
        <div className="grid grid-cols-3">
          <input type="number" />
          <input type="number" />
          <input type="number" />
        </div>
        <div className="grid grid-cols-3">
          <input type="number" />
          <input type="number" />
          <input type="number" />
        </div>
      </div>
      <div>
        <div>
          <button>Calculate</button>
        </div>
        <div>
          <div className="bg-background rounded-xl p-4 mt-2 block md:inline-block">
            <table>
              {result.map((res) => (
                <tr key={res.name}>
                  <td className="text-right border-b border-gray-700 py-1">
                    <span className="text-white mr-2 whitespace-no-wrap">
                      {res.amount} X
                    </span>
                  </td>
                  <td className="border-b border-gray-700 py-1">
                    <span className="text-white">
                      <span className="w-6 inline-block">
                        <img
                          className="h-6 inline-block mr-1"
                          src={res.img}
                          alt={res.name}
                        />
                      </span>
                      {res.name}
                    </span>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCalculator;
