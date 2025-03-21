import Badge from "./ui/Badge";

interface CollapsibleProps {
  skill: string;
  messages: {
    normal_attack: string;
    skill: string;
    burst: string;
  };
}

const SkillLabel = ({ skill, messages }: CollapsibleProps) => {
  switch (skill) {
    case "normal attack":
    case "na":
    case "normal_attack":
      return (
        <>
          <Badge textSize="xxs">NA</Badge>
          {messages.normal_attack}
        </>
      );
    case "skill":
      return (
        <>
          <Badge textSize="xxs">E</Badge>
          {messages.skill}
        </>
      );

    case "burst":
      return (
        <>
          <Badge textSize="xxs">Q</Badge>
          {messages.burst}
        </>
      );

    default:
      console.log(
        'Error in SkillLabel: skill prop is not "normal attack", "skill" or "burst"',
        skill,
      );
      return null;
  }
};

export default SkillLabel;
