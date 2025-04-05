import { usePdfSettings, useResume } from "../../store/useResume";
import { Language } from "../../types/types";

export const LanguagesPreview: React.FC = () => {
  const {
    resumeData: { languages, sectionTitles },
  } = useResume();

  const {
    pdfSettings: { fontSize },
  } = usePdfSettings();

  // IF there are no languages, return null
  if (!languages || languages.length === 0) {
    return null;
  }

  return (
    <section>
      <h3
        className="font-bold border-b border-primary dark:border-primary-foreground mb-1"
        style={{ fontSize: fontSize + 4 }}
      >
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
