"use client";

import { useActionState } from "react";
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
            <span className="sr-only">Sync profile data</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-sm">Sync profile data</p>
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
  const [_, formAction] = useActionState(submitGenshinUID, {
    ...initialState,
    uid,
  });

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}
