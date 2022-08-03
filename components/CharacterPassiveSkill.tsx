import { memo } from "react";
import { Passive } from "genshin-data/dist/types/character";
import Card from "./ui/Card";

type Props = {
  characterId: string;
  passive: Passive;
};

const PassiveSkill = ({ passive }: Props) => {
  return (
    <div className="flex justify-center lg:block">
      <Card className="flex flex-col relative justify-start overflow-hidden w-11/12 lg:w-full">
        <div className="flex items-center text-center p-5">
          <div className="flex flex-col flex-grow">
            <div className="font-bold text-lg text-white">{passive.name}</div>
            {passive.level > 0 && (
              <div className="text-sm">Ascension Phase {passive.level}</div>
            )}
          </div>
        </div>
        <div
          className="px-5 text-sm skill-description mb-5"
          dangerouslySetInnerHTML={{ __html: passive.description }}
        />
      </Card>
    </div>
  );
};

export default memo(PassiveSkill);
