import clsx from "clsx";
import { useState } from "react";
import CharacterBuildCard from "./CharacterBuildCard";
import CharacterCommonBuildCard from "./CharacterCommonBuildCard";

interface Props {
  builds: any[];
  mubuild: any;
  officialbuild: any;
  artifacts: any;
  weapons: any;
  dict: Record<string, string>;
}

function CharacterBuilds({
  builds,
  mubuild,
  officialbuild,
  artifacts,
  weapons,
  dict,
}: Props) {
  const [buildSelected, setBuildSelected] = useState(
    builds.findIndex((b) => b.recommended) ?? 0
  );

  return (
    <>
      {builds.length > 0 && (
        <div className="relative z-50 mx-4 mb-8 lg:mx-0">
          <h2 className="mb-3 text-3xl text-white">{dict["builds"]}</h2>
          <div>
            {mubuild && (
              <button
                className={clsx(
                  "my-1 mr-2 rounded bg-opacity-80 p-3 px-5 text-lg backdrop-blur",
                  {
                    "bg-vulcan-700 text-white": buildSelected === -1,
                    "bg-vulcan-800": buildSelected !== -1,
                  }
                )}
                onClick={() => setBuildSelected(-1)}
              >
                <div className="inline-block w-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </div>
                {dict["most_used"]}
              </button>
            )}
            {officialbuild && (
              <button
                className={clsx(
                  "my-1 mr-2 rounded bg-opacity-80 p-3 px-5 text-lg backdrop-blur",
                  {
                    "bg-vulcan-700 text-white": buildSelected === -2,
                    "bg-vulcan-800": buildSelected !== -2,
                  }
                )}
                onClick={() => setBuildSelected(-2)}
              >
                <div className="inline-block w-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </div>
                {dict["official_build"]}
              </button>
            )}
            {builds.map((build, index) => (
              <button
                key={build.id}
                className={clsx(
                  "my-1 mr-2 rounded bg-opacity-80 p-3 px-5 text-lg backdrop-blur",
                  {
                    "bg-vulcan-700 text-white": buildSelected === index,
                    "bg-vulcan-800": buildSelected !== index,
                  }
                )}
                onClick={() => setBuildSelected(index)}
              >
                {build.recommended && (
                  <div className="inline-block w-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </div>
                )}
                {build.role} {build.name}
              </button>
            ))}
          </div>
          <div className="card">
            {buildSelected < 0 ? (
              <CharacterCommonBuildCard
                dict={dict}
                build={buildSelected === -1 ? mubuild : officialbuild!}
                artifacts={artifacts}
                weapons={weapons}
              />
            ) : (
              <CharacterBuildCard
                dict={dict}
                build={builds[buildSelected]}
                artifacts={artifacts}
                weapons={weapons}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CharacterBuilds;
