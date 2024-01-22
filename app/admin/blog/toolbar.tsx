"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useState } from "react";

import Button from "@components/admin/Button";
import { GAME } from "@utils/games";
import { languages } from "@utils/locale-to-lang";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Toolbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();
  const [game, setGame] = useState<string>("all");
  const [language, setLanguage] = useState<string>("all");

  const onParamChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    const url = `${pathname}?${params}`;
    router.push(url);
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-4">
        <select
          className="rounded-md border border-zinc-700 bg-zinc-900 text-sm"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            onParamChange("lang", e.target.value);
          }}
        >
          <option value="all">All</option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-zinc-700 bg-zinc-900 text-sm"
          value={game}
          onChange={(e) => {
            setGame(e.target.value);
            onParamChange("game", e.target.value);
          }}
        >
          <option value="all">All</option>
          {Object.entries(GAME).map(([key, game]) => (
            <option key={key} value={key}>
              {game.name}
            </option>
          ))}
        </select>
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button>Create Post</Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="data-[side=top]:animate-slideDownAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md border border-zinc-700 bg-zinc-900 p-[5px] will-change-[opacity,transform] data-[side=right]:animate-slideLeftAndFade"
            sideOffset={5}
            align="center"
          >
            {Object.values(GAME).map((game) => (
              <DropdownMenu.Item
                key={game.slug}
                className="group relative flex h-7 select-none items-center rounded px-[5px] pl-[25px] text-[13px] leading-none text-zinc-200 outline-none data-[highlighted]:bg-white data-[highlighted]:text-black"
                onSelect={() => {
                  window.location.href = `/admin/blog/create?game=${game.slug}`;
                }}
              >
                {game.name}{" "}
                <Image
                  className="ml-auto block rounded"
                  src={`/imgs/games/${game.slug}.webp`}
                  alt={game.name}
                  width={20}
                  height={20}
                />
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
