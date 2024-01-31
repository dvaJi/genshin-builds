"use client";

import Button from "@components/ui/Button";
import { useFormState, useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";
import { invalidateAction } from "./actions";

const initialState = {
  message: "",
};

function SubmitButton() {
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
        "Submit"
      )}
    </Button>
  );
}

export function InvalidateForm() {
  const [state, formAction] = useFormState(invalidateAction, initialState);

  return (
    <form action={formAction}>
      {state?.error && (
        <div
          aria-live="polite"
          role="status"
          className="text-center text-red-500"
        >
          {state.error}
        </div>
      )}
      {state?.message && (
        <div
          aria-live="polite"
          role="status"
          className="text-center text-green-500"
        >
          {state.message}
        </div>
      )}
      <div className="relative mx-auto h-14 w-60">
        <select name="type">
          <option value="path">Path</option>
          <option value="tag">Tag</option>
        </select>
        <input
          type="text"
          placeholder="Path or Tag value"
          className="mb-4 w-full max-w-xl rounded border border-vulcan-600 bg-vulcan-900 p-2"
          name="value"
          required
        />
      </div>
      <div className="flex items-center justify-center pt-5">
        <SubmitButton />
      </div>
    </form>
  );
}
