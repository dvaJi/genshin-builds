import clsx from "clsx";
import { memo } from "react";
import type { DropzoneInputProps } from "react-dropzone";
import { BiCloudUpload } from "react-icons/bi";

type Props = {
  isActive: boolean;
  onInputProps: <T extends DropzoneInputProps>(props?: T) => T;
};

function Dropzone({ isActive, onInputProps }: Props) {
  return (
    <div
      className={clsx(
        "relative flex h-full !w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-5 transition-colors sm:h-[220px] sm:w-[338px] sm:gap-10 sm:p-0",
        isActive ? "border-zinc-400 bg-zinc-800" : "border-zinc-600 bg-zinc-900"
      )}
    >
      <input {...onInputProps()} />

      <div className="relative h-[88px] w-[115px]">
        <BiCloudUpload className="h-full w-full fill-zinc-600" />
      </div>

      <p
        className={clsx(
          "text-center text-xs font-medium sm:text-sm",
          isActive ? "text-zinc-100" : "text-zinc-300"
        )}
      >
        Drag & Drop your image here
      </p>
    </div>
  );
}

export default memo(Dropzone);
