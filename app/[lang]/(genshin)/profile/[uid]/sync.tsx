"use client";

import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { MdSync } from "react-icons/md";

import { submitGenshinUID } from "@app/actions";
import { Button } from "@app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@app/components/ui/tooltip";

const initialState = {
  message: "",
  uid: "",
};

function SubmitButton() {
  const t = useTranslations("Genshin.profile");
  const { pending } = useFormStatus();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            type="submit"
            disabled={pending}
            className="h-9 w-9 rounded-full"
          >
            <MdSync className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />
            <span className="sr-only">{t("sync_profile_data")}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-sm">{t("sync_profile_data")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type Props = {
  uid: string;
  lang: string;
};

export function SyncGenshinProfile({ uid }: Props) {
  const [_, formAction] = useFormState(submitGenshinUID, {
    ...initialState,
    uid,
  });

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}
