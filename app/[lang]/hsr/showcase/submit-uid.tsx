"use client";

import { redirect } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";

import { submitHSRUID } from "@app/actions";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import useIntl from "@hooks/use-intl";

const initialState = {
  message: "",
  uid: "",
};

function SubmitButton() {
  const { t } = useIntl("showcase");
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? t({
            id: "loading",
            defaultMessage: "Loading...",
          })
        : t({
            id: "submit",
            defaultMessage: "Submit",
          })}
    </Button>
  );
}

export function SubmitUidForm() {
  const { t } = useIntl("showcase");
  const [state, formAction] = useFormState(submitHSRUID, initialState);

  if (state?.message === "Success") {
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
        <Input
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
