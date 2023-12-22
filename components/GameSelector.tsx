"use client";

import clsx from "clsx";
import Link from "next/link";
import { useCallback, useState } from "react";

import { useClickOutside } from "@hooks/use-clickoutside";
import useIntl from "@hooks/use-intl";
import { getImg } from "@lib/imgUrl";
import { GAME, GameProps } from "utils/games";

type Props = {
  currentGame: GameProps;
  className?: string;
  buttonClassName?: string;
};

function GameSelector({ currentGame, className, buttonClassName }: Props) {
  const { locale } = useIntl("layout");
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);
  const contentRef = useClickOutside<HTMLDivElement>(
    isOpen ? close : undefined,
    []
  );

  return (
    <div className={clsx("relative", className)} ref={contentRef}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded="true"
        data-is-open={isOpen}
        className={clsx(
          "flex h-8 w-full items-center rounded px-2 backdrop-blur-sm md:w-10 lg:w-44 xl:w-48",
          isOpen ? "bg-zinc-700/50" : "bg-zinc-700/30",
          buttonClassName
        )}
        onClick={() => setIsOpen((o) => !o)}
      >
        <img
          className="mr-3 h-6 w-6 rounded"
          src={getImg("genshin", `/games/${currentGame.slug}.webp`, {
            height: 32,
            width: 32,
          })}
          alt={currentGame.name}
          width={32}
          height={32}
        />
        <span className="text-sm md:hidden lg:inline-block">
          {currentGame.name}
        </span>
      </button>
      <div
        tabIndex={-1}
        role="menu"
        aria-hidden={!isOpen}
        className={clsx(
          "top-13 absolute w-full rounded-b bg-zinc-700/90 shadow-md backdrop-blur-xl",
          isOpen ? "block" : "hidden"
        )}
      >
        {Object.values(GAME).map((game) => (
          <Link key={game.name} href={`/${locale}${game.path}`}>
            <button
              type="button"
              tabIndex={0}
              role="menuitem"
              className="flex h-full w-full items-center px-2 py-2 text-left text-sm hover:bg-zinc-500"
            >
              <img
                className="mr-3 h-6 w-6 rounded"
                src={getImg("genshin", `/games/${game.slug}.webp`, {
                  height: 32,
                  width: 32,
                })}
                alt={game.name}
                width={32}
                height={32}
              />
              <span className="md:hidden lg:block">{game.name}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GameSelector;
