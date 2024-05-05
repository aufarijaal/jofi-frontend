const ApplicantDetailsSkillItem: React.FC<{ skillName: string }> = ({
  skillName,
}) => (
  <div className="skill-item text-xs badge badge-neutral whitespace-nowrap">
    {skillName}
  </div>
)

export default ApplicantDetailsSkillItem
