"use client";

import { submitHSRUID } from "@app/actions";
import useIntl from "@hooks/use-intl";
import { redirect } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
  message: "",
  uid: "",
};

function SubmitButton() {
  const { t } = useIntl("showcase");
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="border border-hsr-accent bg-hsr-surface2 px-3 py-1 text-hsr-accent hover:border-zinc-400 hover:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending
        ? t({
            id: "loading",
            defaultMessage: "Loading...",
          })
        : t({
            id: "submit",
            defaultMessage: "Submit",
          })}
    </button>
  );
}

export function SubmitUidForm() {
  const { t } = useIntl("showcase");
  const [state, formAction] = useFormState(submitHSRUID, initialState);

  if (state?.message === 'Success') {
    redirect(`/hsr/showcase/profile/${state.uid}`);
  }

  return (
    <form action={formAction}>
      {state?.message && (
        <div
          aria-live="polite"
          role="status"
          className="text-center text-red-500"
        >
          {state.message}
        </div>
      )}
      <div className="relative mx-auto h-14 w-60">
        <input
          className="absolute left-1 top-1 z-10 h-[48px] w-[232px] border-0 border-b border-hsr-accent bg-hsr-surface3 text-center focus:border focus:ring-hsr-accent disabled:cursor-not-allowed disabled:opacity-50"
          type="text"
          id="uid"
          name="uid"
          placeholder={t({
            id: "enter_uid_input",
            defaultMessage: "Enter UID",
          })}
          required
        />
      </div>
      <div className="flex items-center justify-center pt-5">
        <SubmitButton />
      </div>
    </form>
  );
}
