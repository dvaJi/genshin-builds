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
    <div className="flex flex-col sm:flex-row gap-2 rounded-lg border-2 border-neutral-600 bg-neutral-900 p-3 md:p-4">
      <div className="flex sm:w-[120px] sm:min-w-[120px] flex-row sm:flex-col items-center gap-2 sm:justify-center">
        <Image
          className="h-10 w-10 sm:h-12 sm:w-12"
          src={`/icons/${icon}`}
          alt={name}
          width={48}
          height={48}
        />
        <h3 className="text-center font-semibold">{title}</h3>
      </div>
      <div>
        <div className="flex">
          <h4 className="font-semibold text-sm md:text-base">{name}</h4>
        </div>
        <p
          className="character__skill-description whitespace-pre-line text-sm md:text-base"
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
