import type { BlogContent, BlogPost } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import { AiOutlineClose } from "react-icons/ai";
import { PiSparkleBold } from "react-icons/pi";

import { GAME, type GamesAvailable } from "@utils/games";
import { localeToLang } from "@utils/locale-to-lang";
import { useState } from "react";
import Button from "./Button";

type Props = {
  postId: string;
  language: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setContent: (content: string) => void;
};

function ComponentPromptTL({
  postId,
  language,
  setContent,
  setDescription,
  setTitle,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [chatResponse, setChatResponse] = useState<string>("");
  const copyPrompt = async () => {
    const template = process.env.NEXT_PUBLIC_BLOG_CONTENT_TL_PROMPT;

    const post: BlogPost & { contents: BlogContent[] } = await fetch(
      `/api/blog?id=${postId}&language=en`
    ).then((res) => res.json());
    const postContent = post.contents[0];

    const gameKey = post.game.toUpperCase() as GamesAvailable;

    const final = template
      .replaceAll("{source_language}", "english")
      .replaceAll("{target_language}", localeToLang(language))
      .replaceAll("{game}", GAME[gameKey].name)
      .replaceAll("{title}", postContent.title)
      .replaceAll("{description}", postContent.description)
      .replace("{content}", postContent.content);
    console.log(final);
  };

  const parseChatResponse = () => {
    const data = JSON.parse(chatResponse) as {
      title: string;
      description: string;
      content: string;
    };

    setTitle(data.title);
    setDescription(data.description);
    setContent(data.content);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button state="secondary" className="w-full">
          <PiSparkleBold className="mr-1 h-5 w-5" /> Prompt TL
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-1000 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-1000 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] border border-zinc-700 bg-zinc-900 p-[25px] text-zinc-100 shadow-black focus:outline-none data-[state=open]:animate-contentShow">
          <div className="relative mb-5 mt-[10px] text-[15px] leading-normal">
            <button onClick={copyPrompt}>Load prompt</button>

            <textarea
              className="mt-[10px] h-[250px] w-full rounded-[4px] border border-zinc-700 bg-zinc-900 p-[10px] text-zinc-100"
              placeholder="Paste JSON chat response here"
              value={chatResponse}
              onChange={(e) => setChatResponse(e.target.value)}
            ></textarea>
            <Button
              disabled={!chatResponse}
              onClick={() => {
                parseChatResponse();
                setOpen(false);
                setChatResponse("");
              }}
            >
              Apply
            </Button>
          </div>
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

export default ComponentPromptTL;
