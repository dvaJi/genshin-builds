"use client";

import { Profile } from "interfaces/profile";
import { MdStar } from "react-icons/md";

import { Button } from "@app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@app/components/ui/tooltip";
import { isProfileFav, updateFavorites } from "@state/profiles-fav";

type Props = {
  profile: Profile;
};

export function FavoriteGenshinProfile({ profile }: Props) {
  const isFavorite = isProfileFav(profile.uuid);

  const onFavorite = () => {
    updateFavorites({
      uuid: profile.uuid,
      nameCardId: profile.namecardId,
      nickname: profile.nickname,
      profilePictureId: profile.profilePictureId,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isFavorite ? "default" : "ghost"}
            size="icon"
            onClick={onFavorite}
            className={`h-8 w-8 ${isFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
          >
            <MdStar
              className={isFavorite ? "text-background" : "text-yellow-500"}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
