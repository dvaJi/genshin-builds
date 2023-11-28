"use client";

import clsx from "clsx";
import { Profile } from "interfaces/profile";
import { MdStar } from "react-icons/md";

import { isProfileFav, updateFavorites } from "@state/profiles-fav";

type Props = {
  profile: Profile;
};

export function FavoriteGenshinProfile({ profile }: Props) {
  const onFavorite = () => {
    console.log("onFavorite", profile);
    updateFavorites({
      uuid: profile.uuid,
      nameCardId: profile.namecardId,
      nickname: profile.nickname,
      profilePictureId: profile.profilePictureId,
    });
  };

  return (
    <div
      className={clsx(
        "mx-px cursor-pointer rounded-lg bg-gray-700/40 px-2 py-1 text-xs font-semibold text-slate-50 transition-colors hover:bg-gray-700/90 md:mx-1 md:text-base",
        {
          "bg-yellow-500 hover:bg-yellow-700": isProfileFav(profile.uuid),
        }
      )}
      title="Favorite profile"
      onClick={onFavorite}
    >
      <MdStar className="-mt-1 inline-block" />
    </div>
  );
}
