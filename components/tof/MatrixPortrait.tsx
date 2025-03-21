import { memo } from "react";

import type { Matrices } from "@interfaces/tof/matrices";

import Image from "./Image";

interface Props {
  matrix: Matrices;
}

const MatrixPortrait = ({ matrix }: Props) => {
  return (
    <div className="flex flex-col items-center rounded-lg p-4 hover:bg-tof-600">
      <Image
        className="h-40 w-40"
        src={`/matrices/iconLarge_${matrix.id}.png`}
        alt={matrix.name}
        width={160}
        height={160}
      />
      <div className="text-center">
        <h2 className="text-xl text-tof-50">{matrix.name}</h2>
        <span className="text-sm">{matrix.name}</span>
      </div>
    </div>
  );
};

export default memo(MatrixPortrait);
