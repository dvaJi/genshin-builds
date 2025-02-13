"use client";

import clsx from "clsx";
import { Fragment } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@app/components/ui/dialog";
import type { SkillTreePoint } from "@interfaces/hsr";
import { getHsrUrl } from "@lib/imgUrl";

type Props = {
  trace: SkillTreePoint;
  characterId: string;
};

function CharacterTrace({ trace, characterId }: Props) {
  return (
    <Dialog>
      <div className="flex flex-col items-center md:my-2 md:flex-row">
        {trace.embedBonusSkill && (
          <Fragment key={trace.embedBonusSkill.id}>
            <DialogTrigger asChild>
              <div className="max-w-[25rem] cursor-pointer rounded bg-background p-2 pr-3 transition-colors hover:bg-muted">
                <div className="flex w-full items-center">
                  <div className="mr-4 flex w-[64px] flex-shrink-0 items-center justify-center">
                    <div className="flex-shrink-0 justify-center rounded-full bg-background text-center">
                      <img
                        src={getHsrUrl(
                          `/characters/${characterId}/${trace.embedBonusSkill.id}.png`,
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
                        <div className="justify-between self-center font-semibold text-card-foreground">
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
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{trace.embedBonusSkill.name}</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col">
                    {trace.embedBonusSkill.levels.map((level) => (
                      <div key={level.level}>
                        {level.materials?.map((material) => (
                          <div
                            key={material.id}
                            className="flex flex-col items-center justify-center"
                          >
                            <img
                              src={getHsrUrl(`/items/${material.id}.png`)}
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
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Fragment>
        )}
        {trace.embedBuff && (
          <Fragment key={trace.embedBuff.id}>
            <DialogTrigger asChild>
              <div className="mx-1 flex max-w-[25rem] cursor-pointer items-center rounded bg-background p-2 transition-colors hover:bg-muted md:mx-0 md:pr-4">
                <div className="flex w-full text-start">
                  <div className="mr-2 flex shrink-0 items-center">
                    <img
                      src={getHsrUrl(
                        `/characters/${characterId}/${trace.embedBuff.id}.png`,
                        48,
                        48,
                      )}
                      width={36}
                      height={36}
                      alt={trace.embedBuff.name}
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-card-foreground">
                      {trace.embedBuff.name}
                    </span>
                    {trace.embedBuff.statusList.map((sl) => (
                      <span
                        key={sl.value}
                        className="ml-2 font-bold text-yellow-500"
                      >
                        +{sl.value * 100}
                      </span>
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
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{trace.embedBuff.name}</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col">
                    {trace.embedBuff.materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex flex-col items-center justify-center"
                      >
                        <img
                          src={getHsrUrl(`/items/${material.id}.png`)}
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
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Fragment>
        )}
        {trace.children?.length === 0 ? <div className="my-4" /> : null}
        {trace.children?.length === 1 ? (
          <div className="h-6 w-1 bg-accent md:h-1 md:w-11 md:rounded" />
        ) : null}
        {trace.children?.length === 2 ? (
          <div className="h-6 w-1 bg-accent md:h-1 md:w-11 md:rounded-l" />
        ) : null}
        <div className="relative flex flex-col">
          {trace.children?.length === 2 ? (
            <div className="hsr-multiborder bg-accent" />
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
    </Dialog>
  );
}

export default CharacterTrace;
