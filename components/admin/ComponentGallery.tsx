import * as Dialog from "@radix-ui/react-dialog";
import { AiOutlineClose, AiOutlineCopy } from "react-icons/ai";
import { PiBrowsersBold } from "react-icons/pi";

import { componentsList } from "@components/genshin/PostRender";
import Button from "./Button";

type Props = {
  game: string;
};

function ComponentGallery({}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button state="secondary" className="w-full">
          <PiBrowsersBold className="mr-1 h-5 w-5" /> Components
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/50" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] border border-zinc-700 bg-zinc-900 p-[25px] text-zinc-100 shadow-black focus:outline-none">
          <div className="relative mb-5 mt-[10px] text-[15px] leading-normal">
            {componentsList
              .filter((c) => c.custom)
              .map((component) => (
                <div
                  key={component.name}
                  className="mb-2 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {/* <img
                    src={getImg("genshin", `/icons/${component.name}.png`)}
                    alt={component.name}
                    className="rounded-full border-2 border-vulcan-900/80 p-px"
                    width="40"
                    height="40"
                  /> */}
                    <div className="ml-2">
                      <div className="text-sm font-medium text-zinc-300">
                        {component.name}
                      </div>
                      <div className="text-xs text-slate-200">
                        {component.custom ? "Custom" : "Default"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Dialog.Close asChild>
                      <Button
                        state="secondary"
                        className="mr-2 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            "\n" + component.example + "\n\n"
                          );
                        }}
                      >
                        <AiOutlineCopy className="mr-1 h-3 w-3" /> Copy
                      </Button>
                    </Dialog.Close>
                  </div>
                </div>
              ))}
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

export default ComponentGallery;
