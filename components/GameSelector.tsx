"use client";

import { GAME, GameProps } from "utils/games";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@app/components/ui/select";
import { cn } from "@app/lib/utils";
import { useRouter } from "@i18n/navigation";

import Image from "./genshin/Image";

type Props = {
  currentGame: GameProps;
  className?: string;
  buttonClassName?: string;
};

function GameSelector({ currentGame, buttonClassName }: Props) {
  const router = useRouter();

  return (
    <Select
      defaultValue={currentGame.slug}
      onValueChange={(value) => {
        const game = Object.values(GAME).find((g) => g.slug === value);
        if (game) {
          router.push(game.path);
        }
      }}
    >
      <SelectTrigger
        className={cn(
          "flex h-8 w-full items-center rounded-md bg-card hover:bg-accent hover:text-accent-foreground md:w-10 lg:w-44 xl:w-48",
          "border-none focus:ring-0 focus:ring-offset-0",
          buttonClassName,
        )}
      >
        <Image
          className="h-6 w-6 rounded"
          src={`/games/${currentGame.slug}.webp`}
          alt={currentGame.name}
          width={32}
          height={32}
        />
        <span className="ml-3 hidden lg:inline-block">{currentGame.name}</span>
      </SelectTrigger>
      <SelectContent
        className="z-[100] border border-border bg-card"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        {Object.values(GAME).map((game) => (
          <SelectItem
            key={game.slug}
            value={game.slug}
            className="focus:bg-accent focus:text-accent-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <Image
                className="h-6 w-6 rounded"
                src={`/games/${game.slug}.webp`}
                alt={game.name}
                width={32}
                height={32}
              />
              <span>{game.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default GameSelector;
