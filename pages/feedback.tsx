import Card from "@components/ui/Card";

const WeaponsPage = () => {
  return (
    <div>
      <Card>
        {process.env.NEXT_PUBLIC_FEEDBACK_POLL_QUESTION_URL && (
          <iframe
            src={process.env.NEXT_PUBLIC_FEEDBACK_POLL_QUESTION_URL}
            width="100%"
            height="1000px"
            frameBorder="0"
          />
        )}
      </Card>
    </div>
  );
};

export default WeaponsPage;
