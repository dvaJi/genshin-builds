"use client";

import { useState } from "react";

import { Label } from "@app/components/ui/label";
import { Slider } from "@app/components/ui/slider";
import { LightCone } from "@interfaces/hsr";

type Props = {
  lightcone: LightCone;
};

function LightConeSuperimposition({ lightcone }: Props) {
  const [superimposition, setSuperimposition] = useState(1);

  const formatDesc = (lc: LightCone, level: number) => {
    const params = lc.superImpositions[level].params;
    let str = lc.effectTemplate;

    // Get all superimposition values to show progression
    const allLevelParams = lc.superImpositions.map((si) => si.params);

    params.forEach((_, i) => {
      // Create a progression string showing values from previous levels
      const progression = allLevelParams
        .map((levelParams, levelIndex) => {
          const val = levelParams[i];
          return levelIndex === level
            ? `<span class="text-secondary-foreground font-semibold tooltip" data-tooltip="S${levelIndex + 1}">${val}</span>`
            : `<span class="text-muted-foreground tooltip" data-tooltip="S${levelIndex + 1}">${val}</span>`;
        })
        .join("/");

      // Replace all parameter placeholders with their values showing progression
      str = str.replaceAll(`#${i + 1}[f1]%`, progression + "%");
      str = str.replaceAll(`#${i + 1}[i]%`, progression + "%");
      str = str.replaceAll(`#${i + 1}[i]`, progression);
    });

    return str;
  };

  return (
    <div className="mt-4">
      <div className="mb-4">
        <Label>Superimposition: {superimposition}</Label>
        <Slider
          value={[superimposition]}
          onValueChange={(v) => setSuperimposition(v[0])}
          min={1}
          max={5}
          step={1}
          className="my-2"
        />
      </div>

      <div className="rounded border border-border bg-background p-4">
        <div className="text-base font-semibold text-card-foreground">
          {lightcone.effectName}
        </div>
        <p
          className="mt-2 text-sm"
          dangerouslySetInnerHTML={{
            __html: formatDesc(lightcone, superimposition - 1),
          }}
        />
      </div>
    </div>
  );
}

export default LightConeSuperimposition;
