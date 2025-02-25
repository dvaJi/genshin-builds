import { Star } from "lucide-react";

import Image from "@components/zenless/Image";
import type { TalentsPriority } from "@interfaces/zenless/build";

const PriorityStars = ({ priority }: { priority: number }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < priority) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    } else {
      stars.push(<Star key={i} className="h-4 w-4 text-neutral-600" />);
    }
  }
  return <div className="flex">{stars}</div>;
};

type Props = {
  skillData: TalentsPriority;
  characterName: string;
};

export default function SkillPriority({ characterName, skillData }: Props) {
  const sortedSkills = Object.entries(skillData)
    .filter(([key]) => key !== "notes")
    .sort(([, a], [, b]) => b.priority - a.priority);

  return (
    <>
      <h2 className="text-2xl md:text-3xl font-semibold">{characterName} Skill Priority</h2>
      <div className="flex flex-col gap-2 rounded-lg border-2 border-neutral-600 bg-neutral-900 p-3 md:p-4 mb-4">
        <div
          className="mb-4 text-sm md:text-base"
          dangerouslySetInnerHTML={{ __html: skillData.notes }}
        />
        <div className="overflow-x-auto">
          <div className="min-w-[600px] overflow-hidden rounded-md border-2 border-neutral-700">
            <table className="min-w-full bg-neutral-950">
              <thead>
                <tr className="rounded-md bg-neutral-800">
                  <th className="border-b border-neutral-700 px-3 md:px-4 py-2 text-left text-sm md:text-base">
                    Skill
                  </th>
                  <th className="border-b border-neutral-700 px-3 md:px-4 py-2 text-left text-sm md:text-base">
                    Priority
                  </th>
                  <th className="border-b border-neutral-700 px-3 md:px-4 py-2 text-left text-sm md:text-base">
                    Explanation
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedSkills.map(([skill, data]) => (
                  <tr key={skill} className="hover:bg-neutral-800">
                    <td className="border-b border-neutral-700 px-3 md:px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={`/icons/skill_${skill}.png`}
                          alt={skill}
                          width={24}
                          height={24}
                          className="h-5 w-5 md:h-6 md:w-6"
                        />
                        <span className="capitalize text-sm md:text-base">
                          {skill.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="border-b border-neutral-700 px-3 md:px-4 py-2">
                      <PriorityStars priority={data.priority} />
                    </td>
                    <td className="border-b border-neutral-700 px-3 md:px-4 py-2 text-sm md:text-base">
                      {data.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
