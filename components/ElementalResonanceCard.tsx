import { memo } from "react";
import { ElementalResonance } from "../interfaces/elemental-resonance";
import ElementIcon from "./ElementIcon";
import ReactTooltip from "react-tooltip";

interface ElementalResonanceCardProps {
  elementalResonance: ElementalResonance | undefined;
}

const ElementalResonanceCard = ({
  elementalResonance,
}: ElementalResonanceCardProps) => {
  const styleName = elementalResonance?.name.toLowerCase().replace(/\s/g, "-");
  return (
    <>
      <div
        className={`flex bg-transparent px-3 py-2 mx-2 rounded-md shadow-md max-w-xs border shadow-${styleName} border-${styleName}`}
        data-tip
        data-for={elementalResonance?.name}
      >
        <div className="min-w-min">
          <ElementIcon
            className="w-7 h-7"
            type={elementalResonance?.primary[0] || ""}
          />
        </div>
        <div className="ml-2">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-300">
            {elementalResonance?.name}
          </h1>
        </div>
      </div>
      <ReactTooltip
        id={elementalResonance?.name}
        type="dark"
        effect="solid"
        place="bottom"
      >
        <p className="text-xs max-w-md">{elementalResonance?.effect}</p>
      </ReactTooltip>
    </>
  );
};

export default memo(ElementalResonanceCard);
