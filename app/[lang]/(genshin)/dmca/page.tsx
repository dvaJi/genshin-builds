import Button from "@components/ui/Button";
import { Link } from "@i18n/navigation";

export default function DMCANotice() {
  return (
    <div>
      <div className="mb-4 text-center">
        <h1 className="text-lg font-semibold">DMCA Takedown Notice</h1>
        <p>
          This content has been removed in response to a DMCA Takedown Notice
          from Cognosphere Pte. Ltd..
        </p>
      </div>
      <p className="py-4 italic">
        It&apos;s disappointing to see valuable resources for players being
        removed 😞. We&apos;re exploring ways to bounce back and continue
        supporting our community. Stay tuned!.
      </p>
      <p className="text-center">
        <Link href="/" prefetch={false}>
          <Button>Go to home page.</Button>
        </Link>
      </p>
    </div>
  );
}
