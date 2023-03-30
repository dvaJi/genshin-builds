import Link from "next/link";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";
import { AiOutlineClose } from "react-icons/ai";

import { profilesFavAtom } from "@state/profiles-fav";
import useIntl from "@hooks/use-intl";

function ProfileFavorites() {
  const profilesFav = useStore(profilesFavAtom);
  const router = useRouter();
  const { t } = useIntl("profile");
  return (
    <>
      {profilesFav.map((profile) => (
        <Link
          key={profile.uuid}
          href={`/profile/${profile.uuid}`}
          className="mr-1 rounded-b-lg bg-vulcan-600 bg-cover py-2 px-4 text-sm hover:bg-vulcan-400 hover:text-slate-100 data-[active=true]:bg-vulcan-500 data-[active=true]:text-white"
          data-active={router.query.uid === profile.uuid}
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
