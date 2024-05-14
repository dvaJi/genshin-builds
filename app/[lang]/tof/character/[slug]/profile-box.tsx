export default function ProfileBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <li className="flex flex-col rounded bg-vulcan-900 p-4">
      <span className="text-sm">{label}</span>
      <span className="text-slate-300">{value || "?"}</span>
    </li>
  );
}
