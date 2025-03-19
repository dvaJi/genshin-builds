import { Link } from "@i18n/navigation";

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" prefetch={false}>
        Return Home
      </Link>
    </div>
  );
}
