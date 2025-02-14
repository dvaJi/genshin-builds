import { memo } from "react";

import { cn } from "@lib/utils";

import Image from "./Image";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src={"/logo.png"}
        className="md:min-w-26 fill-current text-white md:max-w-28"
        alt="GenshinBuilds logo"
        width={90}
        height={38}
      />
    </div>
  );
};

export default memo(Logo);
