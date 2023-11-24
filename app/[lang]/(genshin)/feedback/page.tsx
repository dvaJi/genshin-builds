"use client";

import Card from "@components/ui/Card";

export default function Feedback() {
  return (
    <div>
      <Card>
        {process.env.NEXT_PUBLIC_FEEDBACK_POLL_QUESTION_URL && (
          <iframe
            src={process.env.NEXT_PUBLIC_FEEDBACK_POLL_QUESTION_URL}
            width="100%"
            height="1000px"
          />
        )}
      </Card>
    </div>
  );
}
