import Image from "next/image";
import { memo } from "react";

const Logo = () => {
  return (
    <>
      <Image
        src="/logo.png"
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
