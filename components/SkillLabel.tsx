import Badge from "./ui/Badge";
import useIntl from "@hooks/use-intl";

interface CollapsibleProps {
  skill: string;
}

const SkillLabel = ({ skill }: CollapsibleProps) => {
  const { t } = useIntl("character");

  switch (skill) {
    case "normal attack":
    case "normal_attack":
      return (
        <>
          <Badge>NA</Badge>
          {t({ id: "normal_attack", defaultMessage: "Normal Attack" })}
        </>
      );
    case "skill":
      return (
        <>
          <Badge>E</Badge>
          {t({ id: "skill", defaultMessage: "Skill" })}
        </>
      );

    case "burst":
      return (
        <>
          <Badge>Q</Badge>
          {t({ id: "burst", defaultMessage: "Burst" })}
        </>
      );

    default:
      console.log(skill);
      return null;
  }
};

export default SkillLabel;
