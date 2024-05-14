export default function Stats({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <li className="flex flex-col rounded bg-vulcan-800 p-2">
      <span className="text-xs">{label}</span>
      <span className="text-slate-300">{value || "?"}</span>
    </li>
  );
}
