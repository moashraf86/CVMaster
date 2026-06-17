import { usePdfSettings, useResume } from "../../store/useResume";
import { Language } from "../../types/types";

export const LanguagesPreview: React.FC = () => {
  const {
    resumeData: { languages, sectionTitles },
    hiddenItemIds,
  } = useResume();

  const {
    pdfSettings: { fontSize, lineHeight },
  } = usePdfSettings();

  const visibleLanguages = languages.filter(
    (lang) => !hiddenItemIds.includes(lang.id)
  );

  // IF there are no languages, return null
  if (!visibleLanguages || visibleLanguages.length === 0) {
    return null;
  }

  return (
    <section>
      <h3
        className="font-bold border-b border-neutral-400 mb-1"
        style={{ fontSize: fontSize + 4 }}
      >
        {sectionTitles.languages}
      </h3>
      <div style={{ lineHeight: `${lineHeight * 0.25}rem` }}>
        {visibleLanguages.map((lang: Language) => (
          <div key={lang.id}>
            <span className="font-bold">{lang.name}</span>: {lang.level}
          </div>
        ))}
      </div>
    </section>
  );
};
