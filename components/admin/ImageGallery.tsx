import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { AiOutlineClose, AiOutlineCopy } from "react-icons/ai";
import { BiImages } from "react-icons/bi";
import { LuLoader2 } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import useSWR, { useSWRConfig } from "swr";

import { getImg } from "@lib/imgUrl";
import { BlogImages } from "@prisma/client";
import Button from "./Button";

type Props = {
  game: string;
  render?: JSX.Element;
  onSelect?: (filename: string) => void;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ImageGallery({ game, render, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const { data, isLoading } = useSWR<{ data: BlogImages[] }>(
    `/api/blog/images?game=${game}&limit=${pagination.pageSize}&page=${pagination.pageIndex}`,
    fetcher
  );

  function handleDelete(id: string) {
    mutate(
      `/api/blog/images?game=${game}&limit=${pagination.pageSize}&page=${pagination.pageIndex}`,
      async (data: any) => {
        const newData = data.data.filter((d: any) => d.id !== id);
        return { data: newData };
      },
      false
    );
    fetch(`/api/blog/images?id=${id}`, {
      method: "DELETE",
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {render ? (
          render
        ) : (
          <Button state="secondary" className="w-full">
            <BiImages className="mr-1 h-5 w-5" /> Gallery
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-1000 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-1000 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] border border-zinc-700 bg-zinc-900 p-[25px] text-zinc-100 shadow-black focus:outline-none data-[state=open]:animate-contentShow">
          {/* <Dialog.Title className="m-0 text-sm font-medium text-zinc-300">
            Upload File
          </Dialog.Title> */}
          <div className="relative mb-5 mt-[10px] text-[15px] leading-normal">
            {data?.data.map((image) => (
              <div
                key={image.id}
                className="mb-2 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img
                    src={getImg(image.game as any, image.url, {
                      quality: 50,
                      height: 90,
                      width: 90,
                    })}
                    alt={"Image"}
                    className="h-[50px] w-[50px] rounded-[4px] object-cover"
                  />
                  <div className="ml-2">
                    <div className="text-sm font-medium text-zinc-300">
                      {image.filename}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {image.createdAt.toString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {onSelect ? (
                    <Button
                      onClick={() => {
                        onSelect(image.url);
                        setOpen(false);
                      }}
                    >
                      Select
                    </Button>
                  ) : null}
                  <Button
                    state="secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        getImg(game as any, image.url)
                      );
                      setOpen(false);
                    }}
                  >
                    Copy{"  "}
                    <AiOutlineCopy />
                  </Button>
                  <Button state="error" onClick={() => handleDelete(image.id)}>
                    <MdDelete />
                  </Button>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center bg-zinc-900/80 text-zinc-400">
                <LuLoader2 className="h-14 w-14 animate-spin" />
                Loading...
              </div>
            )}
          </div>
          <div className="my-4 flex justify-center gap-4">
            <Button
              state="secondary"
              disabled={pagination.pageIndex === 1}
              onClick={() =>
                setPagination({
                  pageIndex: pagination.pageIndex - 1,
                  pageSize: pagination.pageSize,
                })
              }
            >
              Previous
            </Button>
            <Button
              state="secondary"
              disabled={(data?.data?.length ?? 0) < pagination.pageSize}
              onClick={() =>
                setPagination({
                  pageIndex: pagination.pageIndex + 1,
                  pageSize: pagination.pageSize,
                })
              }
            >
              Next
            </Button>
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

export default ImageGallery;
