"use client";

import clsx from "clsx";
// import { revalidatePath } from "next/cache";
import { useFormState, useFormStatus } from "react-dom";
import { MdSync } from "react-icons/md";

import { submitGenshinUID } from "@app/actions";

const initialState = {
  message: "",
  uid: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="mx-px cursor-pointer rounded-lg bg-gray-700/40 px-2 py-1 text-xs font-semibold text-slate-50 hover:bg-gray-700/90 md:mx-1 md:text-base"
      title="Sync Data"
    >
      <MdSync
        className={clsx("-mt-1 inline-block", {
          "animate-spin": pending,
        })}
      />
    </button>
  );
}

type Props = {
  uid: string;
  lang: string;
};

export function SyncGenshinProfile({ uid }: Props) {
  const [state, formAction] = useFormState(submitGenshinUID, {
    ...initialState,
    uid,
  });

  if (state?.message === "Success") {
    // revalidatePath(`/${lang}/profile/${uid}`);
  }

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}
