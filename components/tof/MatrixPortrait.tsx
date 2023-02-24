import { memo } from "react";
import { Matrix } from "tof-builds";
import { getTofUrl } from "@lib/imgUrl";

interface Props {
  matrix: Matrix;
}

const MatrixPortrait = ({ matrix }: Props) => {
  return (
    <div className="flex flex-col items-center rounded-lg p-4 hover:bg-tof-600">
      <img
        className="h-40 w-40"
        src={getTofUrl(
          `/matrices/icon_matrix_${matrix.hash}_256.png`,
          160,
          160
        )}
        alt={matrix.name}
      />
      <div className="text-center">
        <h2 className="text-xl text-tof-50">{matrix.name}</h2>
        <span className="text-sm">{matrix.suitName}</span>
      </div>
    </div>
  );
};

export default memo(MatrixPortrait);
