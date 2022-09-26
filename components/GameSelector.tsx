import { GAME, GameProps } from "utils/games";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { TOF_IMGS_CDN } from "@lib/constants";

type Props = {
  currentGame: GameProps;
};

function GameSelector({ currentGame }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  // Selector for each GAME and a Link to the game

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded="true"
        className={clsx(
          "mt-1 flex h-10 w-60 items-center rounded border border-tof-900 border-opacity-70 px-2",
          isOpen ? "bg-tof-700 bg-opacity-20" : "bg-transparent"
        )}
        onClick={() => setIsOpen((o) => !o)}
      >
        <img
          className="mr-3 h-6 w-6 rounded"
          src={`${TOF_IMGS_CDN}/gameicons/${currentGame.slug}.webp`}
          alt="Genshin Impact"
        />
        <span className="text-sm">{currentGame.name}</span>
      </button>
      <div
        tabIndex={-1}
        role="menu"
        aria-hidden={!isOpen}
        className={clsx(
          "absolute top-11 w-full rounded-b bg-tof-700 bg-opacity-90 shadow-lg",
          isOpen ? "block" : "hidden"
        )}
      >
        {Object.values(GAME).map((game) => (
          <Link key={game.name} href={game.path}>
            <a>
              <button
                type="button"
                tabIndex={0}
                role="menuitem"
                className="flex h-full w-full items-center py-2 px-2 text-left text-sm hover:bg-tof-600"
              >
                <img
                  className="mr-3 h-6 w-6 rounded"
                  src={`${TOF_IMGS_CDN}/gameicons/${game.slug}.webp`}
                  alt="Genshin Impact"
                />
                <span>{game.name}</span>
              </button>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GameSelector;
