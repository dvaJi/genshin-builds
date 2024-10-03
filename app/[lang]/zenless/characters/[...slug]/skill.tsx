import Image from "@components/zenless/Image";
import type { Skill } from "@interfaces/zenless/characters";

type Props = {
  icon: string;
  name: string;
  title: string;
  description: string;
};

export default function Skill({ icon, name, title, description }: Props) {
  return (
    <div className="flex gap-2 rounded-lg border-2 border-neutral-600 bg-neutral-900 p-2">
      <div className="flex w-[120px] min-w-[120px] flex-col items-center justify-center">
        <Image
          className="mr-2 h-12 w-12"
          src={`/icons/${icon}`}
          alt={name}
          width={48}
          height={48}
        />
        <h3 className="text-center font-semibold">{title}</h3>
      </div>
      <div>
        <div className="flex">
          <h4 className="font-semibold">{name}</h4>
        </div>
        <p
          className="character__skill-description whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: description
              .replaceAll("color: #FFFFFF", "font-weight: bold")
              .replaceAll("color: #98EFF0", "color: #60abac")
              .replaceAll("\\\\n", "<br>"),
          }}
        />
      </div>
    </div>
  );
}
