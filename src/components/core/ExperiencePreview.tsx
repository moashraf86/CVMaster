import { useFormStore } from "../../store/useFormStore";

export const ExperiencePreview: React.FC = () => {
  const { formData } = useFormStore();
  const experience = formData.experience || [];

  // helper function to extract moth and year from date string
  const extractMonthYear = (date: Date) => {
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  // remove bullets from the description
  const removeBulletPoints = (description: string) => {
    return description.replace(/• /g, "");
  };

  // process experience data to display in the component
  const processedExperience = experience.map((exp: any) => ({
    ...exp,
    description: removeBulletPoints(exp.description),
    startDate: extractMonthYear(new Date(exp.startDate)),
    endDate:
      exp.endDate && !exp.currentlyWorking
        ? extractMonthYear(exp.endDate)
        : "Present",
  }));

  return (
    <section className="mb-4 font-roboto">
      <h3 className="text-[12px] font-normal border-b border-primary mb-2">
        Experience
      </h3>
      {/* // !Error frequently comes from here */}
      {experience &&
        processedExperience.map((exp: any, index: number) => (
          <div key={index} className="mb-2">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold">{exp.title}</h4>
              <p className="text-sm">
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
            <span className="text-sm">
              {exp.companyName} - {exp.employmentType}
            </span>
            <br />
            <span className="text-sm">
              {exp.location} - {exp.locationType}
            </span>
            <ul className="text-sm whitespace-pre-line list-disc ps-4 ms-4">
              {exp.description
                .split("\n")
                .map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
            </ul>
          </div>
        ))}
    </section>
  );
};