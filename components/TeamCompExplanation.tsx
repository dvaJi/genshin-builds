import { memo, useState } from "react";
import Button from "./Button";

const TeamCompExplanation = () => {
  const [showExplanation, setShowExplanation] = useState(false);
  return (
    <div>
      <Button
        type="outline"
        color="secondary"
        onClick={() => setShowExplanation(!showExplanation)}
      >
        Show Explanation
      </Button>
      <div
        className="transition-all"
        style={{
          height: showExplanation ? "auto" : 0,
          opacity: showExplanation ? 1 : 0,
        }}
      >
        <p>
          While almost every team can get through most of Genshin Impact's
          content, there are simple team-building rules that will help you
          improve your performance significantly. Source:{" "}
          <a href="https://docs.google.com/spreadsheets/d/1s0G2SDIOp9WB7NRn3ABoRgsS_Qjid46g1-BswFrbTFY">
            Robin's spreadsheet
          </a>
        </p>
        <div>
          <h3 className="my-3 text-xl font-semibold text-gray-200">
            Rule #1 - Elemental Reactions
          </h3>
          <p>
            Understanding how elements combine is an essential part of the game.
            As listed on the Elements page, each element will have a different
            reaction when used together. Superconduct, for instance, deals
            damage and reduces the enemy's Physical RES, making it very powerful
            in physical damage teams. Overload and Electro-charged, on the other
            hand, do not have an added effect but deal significantly more
            damage. These are great to use in elemental damage teams.
          </p>
          <h3 className="my-3 text-xl font-semibold text-gray-200">
            Rule #2 - Energy Generation
          </h3>
          <p>
            Damaging, defeating, and using Elemental Skill (E) abilities on
            enemies will generate orbs that fuel your characters' energy,
            allowing them to use their Elemental Burst (Q) abilities. Some orbs
            will have an element attached to them and will yield higher energy
            to characters of that same element. As a result, it is recommended
            to have 2 characters, one of them being your primary damage dealer,
            of the same elemental type. This, combined with the bonus you'll
            unlock via the Elemental Resonance system, will increase your team's
            strength.
          </p>
          <h3 className="my-3 text-xl font-semibold text-gray-200">
            Rule #3 - Roles
          </h3>
          <p>
            We like to divide roles into 3 categories: Main, Support1, Support2,
            Support3.
            <ul>
              <li>
                Main: Most teams are created and designed around a Main DPS.
                Whichever unit you use as your Main DPS doesn't really matter,
                as long as the element is useful against the content you're
                making the team for. In general, Pyro/Electro DPS are the most
                useful when it comes to clearing end-game content, with
                Cryo/Hydro slightly behind them.
              </li>
              <li>
                Support1: Your first support can be considered as somewhat of a
                pair for your Main DPS. They're there to help generate energy
                faster, create Resonance, and to share the benefits of reducing
                elemental RES (notable with Viridiscent Venerer) Some main DPS
                units (Razor) do not require a unit like this to support them as
                they generate enough energy themselves.
              </li>
              <li>
                Support2: Your second support is usually a flex depending on
                your playstyle and which reactions you need/prefer For example,
                Fischl is viable in almost every comp, but if you're playing her
                with pyro DPS, you might find the Overload knockback annoying.
              </li>
              <li>
                Support3: Your third support is usually your anemo unit, who
                will help increase DPS with Viridescent Venerer. If you need
                survivability then Geo with Archaic Petra is OK, however your
                DPS will likely drop by quite a bit Atm, Geo MC &gt; Ning as a
                Geo Support, however new units like Zhongli/Albedo will likely
                fill in that role as well
              </li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
};
export default memo(TeamCompExplanation);
