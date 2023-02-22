interface CollapsibleProps {
  skillId: string;
  skill: string;
}

const SkillLabel = ({ skill, skillId }: CollapsibleProps) => {
  let badge = "NA";

  switch (skillId) {
    case "normal attack":
    case "normal_attack":
      badge = "NA";
      break;
    case "skill":
      badge = "E";
      break;
    case "burst":
      badge = "Q";
      break;
    default:
      console.log(skill);
  }

  return (
    <>
      <span className="badge">{badge}</span>
      {skill}
    </>
  );
};

export default SkillLabel;
