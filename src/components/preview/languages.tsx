import { useResume } from "../../store/useResume";
import { Language } from "../../types/types";

export const LanguagesPreview: React.FC = () => {
  const {
    resumeData: { languages, sectionTitles },
  } = useResume();

  // IF there are no languages, return null
  if (!languages || languages.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-1">
        {sectionTitles.languages}
      </h3>
      <div className="space-y-1">
        {languages.map((lang: Language) => (
          <div key={lang.id}>
            <span className="font-bold">{lang.name}</span>: {lang.level}
          </div>
        ))}
      </div>
    </section>
  );
};
