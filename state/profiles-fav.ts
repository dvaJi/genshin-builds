import { persistentAtom } from "@nanostores/persistent";

export type Profile = {
  uuid: string;
  nickname: string;
  profilePictureId: number;
  nameCardId: number;
};

export const profilesFavAtom = persistentAtom<Profile[]>("profilesFav", [], {
  encode(value) {
    return JSON.stringify(value);
  },
  decode(value) {
    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    }
  },
});

export const updateFavorites = (profile: Profile) => {
  // Check if the profile is already in the favorites
  const _profilesFav = profilesFavAtom.get();
  const profileIndex = _profilesFav.findIndex(
    (favProfile) => favProfile.uuid === profile.uuid
  );

  // if is not in the favorites, add it
  if (profileIndex === -1) {
    // if the favorites are full, remove the last one
    _profilesFav.push(profile);
  }

  profilesFavAtom.set(_profilesFav);
};
