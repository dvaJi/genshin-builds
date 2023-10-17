import { memo } from "react";

type Props = {
  progressStatus: number;
};

function ProgressBar({ progressStatus }: Props) {
  const width = progressStatus.toString().concat("%");

  return (
    <div className="absolute top-0 m-0 flex h-full w-full flex-col items-center justify-center gap-8 rounded-xl bg-zinc-900 px-8">
      <h2 className="w-full text-left text-xl font-semibold capitalize text-zinc-200">
        Uploading...
      </h2>
      <div className="relative h-2 w-full rounded bg-red-50">
        <div
          className="absolute inset-y-0 h-full rounded bg-blue-500 transition-[width]"
          style={{ width }}
        />
      </div>
    </div>
  );
}

export default memo(ProgressBar);
