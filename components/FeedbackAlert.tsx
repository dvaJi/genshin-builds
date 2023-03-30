import { useLocalStorage } from "@hooks/use-local-storage";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";

const LS_KEY = `feedback-alert_${process.env.NEXT_PUBLIC_FEEDBACK_POLL_QUESTION_URL}`;

const FeedbackAlert = () => {
  const [showAlert, setShowAlert] = useLocalStorage(LS_KEY, true);
  const router = useRouter();
  if (!process.env.NEXT_PUBLIC_FEEDBACK_POLL_QUESTION_URL || !showAlert) {
    return null;
  }

  return (
    <div
      className={clsx(
        "absolute top-12 left-0 z-40 flex h-10 w-full items-center justify-center bg-slate-600 bg-opacity-80 px-4 text-xs backdrop-blur md:h-12 lg:text-sm",
        { hidden: !showAlert }
      )}
    >
      <div className="text-center text-slate-50">
        <Link
          href={{ pathname: "/feedback", query: { prev: router.asPath } }}
          className="p-2"
        >
          {process.env.NEXT_PUBLIC_FEEDBACK_POLL_QUESTION_TEXT}
        </Link>
        <div className="absolute right-0 top-0 p-4">
          <button onClick={() => setShowAlert(false)}>X</button>
        </div>
      </div>
    </div>
  );
};

export default memo(FeedbackAlert);
