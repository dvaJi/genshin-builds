import { getHsrUrl } from "@lib/imgUrl";
import clsx from "clsx";
import { SkillTreePoint } from "hsr-builds/dist/types/character";

type Props = {
  trace: SkillTreePoint;
  characterId: string;
};

function CharacterTrace({ trace, characterId }: Props) {
  return (
    <div key={trace.id} className="flex items-center">
      {trace.embedBonusSkill && (
        <div className="max-w-[25rem]">
          <div className="flex w-full">
            <div className="m-0 flex h-20 w-20 flex-col content-center p-0">
              <img
                src={getHsrUrl(
                  `/characters/${characterId}/${trace.embedBonusSkill.id}.png`
                )}
                alt={trace.embedBonusSkill.name}
              />
            </div>
            <div className="relative w-full flex-wrap content-center">
              <div className="flex flex-col text-start">
                <div className="flex w-full flex-wrap justify-between">
                  <div className="justify-between self-center">
                    {trace.embedBonusSkill.name}
                  </div>
                </div>
                <div
                  class="a4417"
                  dangerouslySetInnerHTML={{
                    __html: trace.embedBonusSkill.desc,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {trace.embedBuff && (
        <div className="max-w-[25rem]">
          <div className="flex w-full text-start">
            <img
              src={getHsrUrl(
                `/characters/${characterId}/${trace.embedBuff.id}.png`
              )}
              alt={trace.embedBuff.name}
            />
            <div>
              {trace.embedBuff.statusList.map((sl) => (
                <>
                  {sl.key}{" "}
                  <span className="text-yellow-500">+{sl.value * 100}</span>
                </>
              ))}
              {trace.embedBuff.levelReq > 0 ? (
                <div>Lv{trace.embedBuff.levelReq}</div>
              ) : null}
              {trace.embedBuff.promotionReq > 0 ? (
                <div>A{trace.embedBuff.promotionReq}</div>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {trace.children?.length === 1 ? (
        <div className="mx-2 h-1 w-11 rounded bg-white" />
      ) : null}
      {trace.children?.length === 2 ? (
        <div className="ml-2 h-1 w-11 rounded-l bg-white" />
      ) : null}
      <div className="relative flex flex-col">
        {trace.children?.length === 2 ? (
          <div className="hsr-multiborder" />
        ) : null}
        <div
          className={clsx("relative flex flex-col", {
            "ml-8": trace.children?.length === 2,
          })}
        >
          {trace.children?.map((child) => (
            <CharacterTrace
              key={child.id}
              trace={child}
              characterId={characterId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CharacterTrace;
