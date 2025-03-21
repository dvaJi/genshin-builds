import type { Discharge } from "@interfaces/tof/weapons";

type Props = {
  title: string;
  skills: Discharge[];
};
export default function Skills({ title, skills }: Props) {
  function getOperations(_op: string[]) {
    const operations = [];

    if (_op.length > 0) {
      let currentAction = _op[0];
      let count = 1;

      for (let i = 1; i < _op.length; i++) {
        if (_op[i] === currentAction) {
          count++;
        } else {
          operations.push(
            count > 1 ? `${currentAction} x${count}` : currentAction,
          );

          currentAction = _op[i];
          count = 1;
        }
      }

      operations.push(count > 1 ? `${currentAction} x${count}` : currentAction);
    }

    return operations;
  }

  function interpolateString(
    string: string,
    values: number[][],
    skillLevel: number,
  ) {
    const valueIndex = skillLevel > 0 ? skillLevel - 1 : 0;
    if (values.length === 0) return string.replace(/\{(\d+)\}/g, "0");
    return string.replace(/\{(\d+)\}/g, (match, index) =>
      (values[index][valueIndex] || match).toString(),
    );
  }

  return (
    <div className="mb-8 block">
      <h2 className="text-2xl font-bold uppercase text-tof-50">{title}</h2>
      <div className="flex flex-col rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
        {skills.map((skill) => (
          <div key={skill.name} className="mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-tof-50">{skill.name}</h3>
              {getOperations(skill.operations).map((type) => (
                <span
                  key={type}
                  className="rounded bg-vulcan-900 px-2 py-1 text-xs text-tof-200"
                >
                  {type}
                </span>
              ))}
            </div>
            <div className="my-2 flex gap-2">
              {skill.tags.map((type) => (
                <span
                  key={type}
                  className="rounded bg-tof-900 px-2 py-1 text-xs text-tof-200"
                >
                  {type}
                </span>
              ))}
            </div>
            <p
              className="text text-tof-300"
              dangerouslySetInnerHTML={{
                __html: interpolateString(skill.description, skill.values, 21),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
