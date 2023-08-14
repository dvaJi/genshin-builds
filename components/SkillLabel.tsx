import useIntl from "@hooks/use-intl";
import Badge from "./ui/Badge";

interface CollapsibleProps {
  skill: string;
}

const SkillLabel = ({ skill }: CollapsibleProps) => {
  const { t } = useIntl("character");

  switch (skill) {
    case "normal attack":
    case "na":
    case "normal_attack":
      return (
        <>
          <Badge textSize="xxs">NA</Badge>
          {t({ id: "normal_attack", defaultMessage: "Normal Attack" })}
        </>
      );
    case "skill":
      return (
        <>
          <Badge textSize="xxs">E</Badge>
          {t({ id: "skill", defaultMessage: "Skill" })}
        </>
      );

    case "burst":
      return (
        <>
          <Badge textSize="xxs">Q</Badge>
          {t({ id: "burst", defaultMessage: "Burst" })}
        </>
      );

    default:
      console.log(
        'Error in SkillLabel: skill prop is not "normal attack", "skill" or "burst"',
        skill
      );
      return null;
  }
};

export default SkillLabel;
