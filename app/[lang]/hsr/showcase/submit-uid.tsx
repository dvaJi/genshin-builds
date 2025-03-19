"use client";

import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitHSRUID } from "@app/actions";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";

const initialState = {
  message: "",
  uid: "",
};

function SubmitButton() {
  const t = useTranslations("HSR.showcase");
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? t("loading") : t("submit")}
    </Button>
  );
}

export function SubmitUidForm() {
  const t = useTranslations("HSR.showcase");
  const [state, formAction] = useActionState(submitHSRUID, initialState);

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
          placeholder={t("enter_uid_input")}
          required
        />
      </div>
      <div className="flex items-center justify-center pt-5">
        <SubmitButton />
      </div>
    </form>
  );
}
