import clsx from "clsx";
import { memo } from "react";

interface CharacterBuildSekeletonProps {
  isActive: boolean;
}

const CharacterBuildSekeleton = ({
  isActive,
}: CharacterBuildSekeletonProps) => {
  return (
    <div
      className={clsx(
        `md:h-500px h-24 mx-1 border-gray-200 dark:border-gray-800 border-4 p-3 relative transition-all transform`,
        isActive
          ? "shadow-2xl bg-gray-400 dark:bg-gray-800 scale-105"
          : "bg-white dark:bg-vulcan-800 scale-100"
      )}
    >
      <div
        className={clsx(
          `border-4 border-dashed border-gray-300 dark:border-gray-700 h-full w-full transform transition-all rounded-lg relative`,
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      >
        <div className="text-xl text-center absolute top-2/4 right-0 h-full w-full">
          DROP CHARACTER HERE
        </div>
      </div>
    </div>
  );
};

export default memo(CharacterBuildSekeleton);
