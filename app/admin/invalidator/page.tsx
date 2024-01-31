import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import { authOptions } from "@lib/auth";
import { InvalidateForm } from "./form";

export default async function BlogAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return notFound();
  }

  return (
    <div className="w-full">
      <InvalidateForm />
    </div>
  );
}
