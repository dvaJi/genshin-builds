import * as Dialog from "@radix-ui/react-dialog";
import { AiOutlineClose, AiOutlineCopy } from "react-icons/ai";
import { BiCloudUpload } from "react-icons/bi";

import { useUpload } from "@hooks/use-upload";
import { getImg } from "@lib/imgUrl";
import Button from "./Button";
import Dropzone from "./Dropzone";
import ProgressBar from "./ProgressBar";

type Props = {
  game: string;
};

function FileUploader({ game }: Props) {
  const u = useUpload(game);
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button state="secondary" className="w-full">
          <BiCloudUpload className="mr-1 h-5 w-5" /> Upload image
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/50" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] border border-zinc-700 bg-zinc-900 p-[25px] text-zinc-100 shadow-black focus:outline-none">
          {/* <Dialog.Title className="m-0 text-sm font-medium text-zinc-300">
            Upload File
          </Dialog.Title> */}
          <div className="relative mb-5 mt-[10px] text-[15px] leading-normal">
            {u.image ? (
              <div>
                <img src={getImg(game as any, u.image)} alt="image" />
                <div className="relative mt-4 w-full">
                  <input
                    className="w-full rounded border border-zinc-500 bg-zinc-900 text-sm text-zinc-300"
                    type="text"
                    value={getImg(game as any, u.image)}
                    readOnly
                  />
                  <button
                    className="absolute right-0 top-0 my-2 mr-1 rounded border border-zinc-600 bg-zinc-900 p-1 hover:border-zinc-400"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        getImg(game as any, u.image!)
                      )
                    }
                    title="Copy to clipboard"
                  >
                    <AiOutlineCopy />
                  </button>
                </div>
              </div>
            ) : (
              <div {...u.getRootProps({ className: "dropzone w-full" })}>
                <Dropzone
                  isActive={u.isDragActive}
                  onInputProps={u.getInputProps}
                />
              </div>
            )}
            {!u.error && (
              <p className="text-center text-xs font-medium text-red-700 sm:text-sm">
                {u.error}
              </p>
            )}
            {/* <ProgressBar progressStatus={50} /> */}
            {u.isFetching && <ProgressBar progressStatus={u.progressStatus} />}
          </div>

          {/* <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                Save changes
              </button>
            </Dialog.Close>
          </div> */}
          <Dialog.Close asChild>
            <button
              className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-zinc-300 hover:text-white focus:shadow-[0_0_0_2px] focus:shadow-zinc-300 focus:outline-none"
              aria-label="Close"
            >
              <AiOutlineClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default FileUploader;
