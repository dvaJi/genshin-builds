"use client";

import { submitGenshinUID } from "@app/actions";
import Button from "@components/ui/Button";
import useIntl from "@hooks/use-intl";
import { redirect } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";

const initialState = {
  message: "",
  uid: "",
};

function SubmitButton() {
  const { t } = useIntl("profile");
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      className="disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <div className="flex justify-center py-4">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : (
        t({
          id: "submit",
          defaultMessage: "Submit",
        })
      )}
    </Button>
  );
}

export function SubmitGenshinUidForm() {
  const [state, formAction] = useFormState(submitGenshinUID, initialState);

  if (state?.message === "Success") {
    redirect(`/profile/${state.uid}`);
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
          type="text"
          placeholder="Your UUID"
          className="mb-4 w-full max-w-xl rounded border border-vulcan-600 bg-vulcan-900 p-2"
          id="uid"
          name="uid"
          required
        />
      </div>
      <div className="flex items-center justify-center pt-5">
        <SubmitButton />
      </div>
    </form>
  );
}
