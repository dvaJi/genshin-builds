"use client";

export default function Feedback() {
  return (
    <div>
      <div className="card">
        {process.env.NEXT_PUBLIC_FEEDBACK_POLL_QUESTION_URL && (
          <iframe
            src={process.env.NEXT_PUBLIC_FEEDBACK_POLL_QUESTION_URL}
            width="100%"
            height="1000px"
          />
        )}
      </div>
    </div>
  );
}
