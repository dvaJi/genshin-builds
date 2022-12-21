import { GAME, GameProps } from "utils/games";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { getTofUrl } from "@lib/imgUrl";

type Props = {
  currentGame: GameProps;
  className?: string;
};

function GameSelector({ currentGame, className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  // Selector for each GAME and a Link to the game

  return (
    <div className={clsx("relative", className)}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded="true"
        className={clsx(
          "mt-4 flex h-10 w-full lg:w-44 items-center rounded px-2 backdrop-blur-sm md:w-10",
          isOpen ? "bg-tof-700/50" : "bg-tof-700/10"
        )}
        onClick={() => setIsOpen((o) => !o)}
      >
        <img
          className="mr-3 h-6 w-6 rounded"
          src={getTofUrl(`/gameicons/${currentGame.slug}.webp`)}
          alt="Genshin Impact"
        />
        <span className="text-sm md:hidden lg:inline-block">{currentGame.name}</span>
      </button>
      <div
        tabIndex={-1}
        role="menu"
        aria-hidden={!isOpen}
        className={clsx(
          "absolute top-13 w-full rounded-b bg-tof-700/90 shadow-md backdrop-blur-xl",
          isOpen ? "block" : "hidden"
        )}
      >
        {Object.values(GAME).map((game) => (
          <Link key={game.name} href={game.path}>
            <button
              type="button"
              tabIndex={0}
              role="menuitem"
              className="flex h-full w-full items-center py-2 px-2 text-left text-sm hover:bg-tof-600"
            >
              <img
                className="mr-3 h-6 w-6 rounded"
                src={getTofUrl(`/gameicons/${game.slug}.webp`)}
                alt={game.name}
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
