"use client";

import { redirect } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";

import { submitGenshinUID } from "@app/actions";
import { Alert, AlertDescription } from "@app/components/ui/alert";
import { Button } from "@app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card";
import { Input } from "@app/components/ui/input";
import { Label } from "@app/components/ui/label";
import useIntl from "@hooks/use-intl";

const initialState = {
  message: "",
  uid: "",
};

function SubmitButton() {
  const { t } = useIntl("profile");
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
      {t({
        id: "submit",
        defaultMessage: "Submit",
      })}
    </Button>
  );
}

export function SubmitGenshinUidForm() {
  const [state, formAction] = useActionState(submitGenshinUID, initialState);
  const { t } = useIntl("profile");

  if (state?.message === "Success") {
    redirect(`/profile/${state.uid}`);
  }

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Enter Your UID</CardTitle>
          <CardDescription>
            Your UID can be found in the game&apos;s profile section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="uid">
                {t({ id: "uid", defaultMessage: "UID" })}
              </Label>
              <Input
                id="uid"
                name="uid"
                type="text"
                placeholder="Enter your UID"
                required
                className="w-full"
              />
            </div>
            <SubmitButton />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
