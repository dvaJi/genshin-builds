import clsx from "clsx";
import * as Dialog from "@radix-ui/react-dialog";
import { SkillTreePoint } from "hsr-data/dist/types/characters";
import { getHsrUrl } from "@lib/imgUrl";

type Props = {
  trace: SkillTreePoint;
  characterId: string;
};

function CharacterTrace({ trace, characterId }: Props) {
  return (
    <Dialog.Root>
      <div className="flex flex-col items-center md:my-2 md:flex-row">
        {trace.embedBonusSkill && (
          <>
            <Dialog.Trigger asChild>
              <div className="max-w-[25rem] cursor-pointer rounded bg-hsr-surface3 p-2 pr-3 transition-colors hover:bg-slate-700">
                <div className="flex w-full items-center">
                  <div className="mr-4 flex w-[64px] flex-shrink-0 items-center justify-center">
                    <div className="flex-shrink-0 justify-center rounded-full bg-hsr-surface2 text-center">
                      <img
                        src={getHsrUrl(
                          `/characters/${characterId}/${trace.embedBonusSkill.id}.png`
                        )}
                        alt={trace.embedBonusSkill.name}
                        width={64}
                        height={64}
                      />
                    </div>
                  </div>
                  <div className="relative w-full flex-wrap content-center">
                    <div className="flex flex-col text-start">
                      <div className="flex w-full flex-wrap justify-between">
                        <div className="justify-between self-center font-semibold text-slate-200">
                          {trace.embedBonusSkill.name}
                        </div>
                      </div>
                      <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                          __html: trace.embedBonusSkill.desc,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-50 bg-black/10 backdrop-blur-sm" />
              <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 z-1000 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-800 p-6 text-slate-200 shadow-2xl focus:outline-none">
                <Dialog.Title className="text-mauve12 m-0 font-semibold">
                  {trace.embedBonusSkill.name}
                </Dialog.Title>
                <div className="flex flex-col">
                  {trace.embedBonusSkill.levels.map((level) => (
                    <div key={level.level}>
                      {level.materials?.map((material) => (
                        <div
                          key={material.id}
                          className="flex flex-col items-center justify-center"
                        >
                          <img
                            src={getHsrUrl(`/materials/${material.id}.png`)}
                            alt={material.name}
                            width={48}
                            height={48}
                          />
                          <div className="ml-2 text-sm">
                            {material.name} x{material.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <Dialog.Close asChild>
                  <button
                    className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                    aria-label="Close"
                  >
                    X
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </>
        )}
        {trace.embedBuff && (
          <>
            <Dialog.Trigger asChild>
              <div className="mx-1 flex max-w-[25rem] cursor-pointer items-center rounded bg-hsr-surface3 p-2 transition-colors hover:bg-slate-700 md:mx-0 md:pr-4">
                <div className="flex w-full text-start">
                  <div className="mr-2 flex shrink-0 items-center">
                    <img
                      src={getHsrUrl(
                        `/characters/${characterId}/${trace.embedBuff.id}.png`,
                        48,
                        48
                      )}
                      width={36}
                      height={36}
                      alt={trace.embedBuff.name}
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200">
                      {trace.embedBuff.name}
                    </span>
                    {trace.embedBuff.statusList.map((sl) => (
                      <>
                        <span className="ml-2 font-bold text-yellow-500">
                          +{sl.value * 100}
                        </span>
                      </>
                    ))}
                    {trace.embedBuff.levelReq > 0 ? (
                      <div className="text-sm">
                        Lv{trace.embedBuff.levelReq}
                      </div>
                    ) : null}
                    {trace.embedBuff.promotionReq > 0 ? (
                      <div className="text-sm">
                        A{trace.embedBuff.promotionReq}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-50 bg-black/10 backdrop-blur-sm" />
              <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 z-1000 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-800 p-6 text-slate-200 shadow-2xl focus:outline-none">
                <Dialog.Title className="text-mauve12 m-0 font-semibold">
                  {trace.embedBuff.name}
                </Dialog.Title>
                <div className="flex flex-col">
                  {trace.embedBuff.materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex flex-col items-center justify-center"
                    >
                      <img
                        src={getHsrUrl(`/materials/${material.id}.png`)}
                        alt={material.name}
                        width={48}
                        height={48}
                      />
                      <div className="ml-2 text-sm">
                        {material.name} x{material.amount}
                      </div>
                    </div>
                  ))}
                </div>
                <Dialog.Close asChild>
                  <button
                    className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                    aria-label="Close"
                  >
                    X
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </>
        )}
        {trace.children?.length === 0 ? <div className="my-4" /> : null}
        {trace.children?.length === 1 ? (
          <div className="h-6 w-1 bg-zinc-400 md:h-1 md:w-11 md:rounded" />
        ) : null}
        {trace.children?.length === 2 ? (
          <div className="h-6 w-1 bg-zinc-400 md:h-1 md:w-11 md:rounded-l" />
        ) : null}
        <div className="relative flex flex-col">
          {trace.children?.length === 2 ? (
            <div className="hsr-multiborder bg-zinc-400" />
          ) : null}
          <div
            className={clsx("relative flex flex-row md:flex-col", {
              "mt-4 md:ml-6": trace.children?.length === 2,
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
    </Dialog.Root>
  );
}

export default CharacterTrace;
