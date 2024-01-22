"use client";

import Button from "@components/admin/Button";
import type { BlogPost } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import { GAME } from "@utils/games";
import { useState } from "react";
import { updatePost } from "./actions";

type Props = {
  post: BlogPost;
};

export default function EditPost({ post }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button state="secondary">Edit</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-1000 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-1000 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] border border-zinc-700 bg-zinc-900 p-[25px] text-zinc-100 shadow-black focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="text-lg font-medium text-zinc-100">
            Edit Post
          </Dialog.Title>
          <form
            action={updatePost}
            onSubmit={() => {
              setOpen(false);
            }}
          >
            <fieldset className="mb-[15px] flex items-center gap-5">
              <input name="id" value={post.id} className="hidden" />
              <label
                className="text-violet11 w-[90px] text-right text-[15px]"
                htmlFor="name"
              >
                Slug
              </label>
              <input
                className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-900 shadow-sm focus:border-zinc-200 focus:ring focus:ring-zinc-200 focus:ring-opacity-0"
                name="slug"
                defaultValue={post.slug}
              />
            </fieldset>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="text-violet11 w-[90px] text-right text-[15px]"
                htmlFor="username"
              >
                Username
              </label>
              <select
                name="game"
                defaultValue={post.game}
                className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-900 shadow-sm focus:border-zinc-200 focus:ring focus:ring-zinc-200 focus:ring-opacity-0"
                required
              >
                {Object.values(GAME).map((game) => (
                  <option
                    key={game.slug}
                    value={game.slug}
                    selected={post.game === game.slug}
                  >
                    {game.name}
                  </option>
                ))}
              </select>
            </fieldset>
            <div className="mt-[25px] flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-zinc-300 hover:text-white focus:shadow-[0_0_0_2px] focus:shadow-zinc-300 focus:outline-none"
              aria-label="Close"
            >
              X
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
