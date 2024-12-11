import { useEffect } from "react";
import { useResume } from "../../store/useResume";
import { Language } from "../../types/types";

export const LanguagesPreview: React.FC = () => {
  const {
    resumeData: { languages },
  } = useResume();

  useEffect(() => {
    console.log(languages);
  }, [languages]);
  // IF there are no languages, return null
  if (!languages || languages.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-2">
        Languages
      </h3>
      <div className="space-y-2">
        {languages.map((lang: Language, index: number) => (
          <div key={index}>
            <span className="font-bold">{lang.name}</span>: {lang.level}
          </div>
        ))}
      </div>
    </section>
  );
};
