"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";

import useIntl from "@hooks/use-intl";
import { profilesFavAtom } from "@state/profiles-fav";

function ProfileFavorites() {
  const profilesFav = useStore(profilesFavAtom);
  const { t, locale } = useIntl("profile");
  return (
    <>
      {profilesFav.map((profile) => (
        <Link
          key={profile.uuid}
          href={`/${locale}/profile/${profile.uuid}`}
          className="mr-1 rounded bg-vulcan-600 bg-cover px-4 py-2 text-sm hover:bg-vulcan-400 hover:text-slate-100"
        >
          <span>{profile.nickname}</span>
          <span
            className="ml-2 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              profilesFavAtom.set(profilesFav.filter((p) => p !== profile));
            }}
            title={t({
              id: "remove_from_favorites",
              defaultMessage: "Remove from favorites",
            })}
          >
            <AiOutlineClose className="inline-block" />
          </span>
        </Link>
      ))}
    </>
  );
}

export default ProfileFavorites;
