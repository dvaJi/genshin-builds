import { memo } from "react";
import { getHsrUrl } from "@lib/imgUrl";

type Props = {
  label: string;
  value: number;
  max: number;
};

function CharacterInfoStat({ label, max, value }: Props) {
  return (
    <div className="flex w-full items-center">
      <div className="flex w-[90px] items-center md:w-[140px]">
        <img
          src={getHsrUrl(`/${label}.png`)}
          alt={label}
          className="mr-1 h-6 w-6 md:mr-4"
        />
        {label.toUpperCase()}
      </div>
      <div className="h-2 flex-grow rounded bg-hsr-surface3">
        <span
          className="block h-full min-w-[8px] rounded bg-hsr-accent/50"
          style={{ width: (value / max) * 100 + "%" }}
        ></span>
      </div>
      <div className="w-[45px] text-right md:w-[80px]">{Math.round(value)}</div>
    </div>
  );
}

export default memo(CharacterInfoStat);
