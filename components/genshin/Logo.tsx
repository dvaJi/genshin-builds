import { getImg } from "@lib/imgUrl";
import { memo } from "react";

const Logo = () => {
  return (
    <>
      <img
        src={getImg("genshin", "/logo.png")}
        className="fill-current text-white md:w-48"
        alt="GenshinBuilds logo"
        width={90}
        height={38}
      />
      <span className="hidden text-lg font-normal text-gray-100">
        GenshinBuilds
      </span>
    </>
  );
};

export default memo(Logo);
