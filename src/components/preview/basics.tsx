import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { usePdfSettings, useResume } from "../../store/useResume";
import { CustomIcon } from "../core/CustomIcon";
import { cn } from "../../lib/utils";
import { z } from "zod";
import { LinkedInIcon } from "../core/icons/LinkedInIcon";

export const BasicsPreview: React.FC = () => {
  // get the data from the store
  const {
    resumeData: { basics },
  } = useResume();

  // get the pdf settings from the store
  const {
    pdfSettings: { fontSize },
  } = usePdfSettings();

  const {
    name,
    title,
    location,
    phone,
    email,
    linkedin,
    website,
    alignment,
    customFields,
  } = basics || {};

  return (
    <header
      className={cn("space-y-1", {
        "text-start": alignment === "start",
        "text-center": alignment === "center",
        "text-end": alignment === "end",
      })}
      id="basics"
      aria-labelledby="basics-title"
    >
      <h1
        className={cn("font-bold", fontSize > 16 ? "text-3xl" : "text-2xl")}
        id="basics-title"
      >
        {name}
      </h1>
      <p style={{ fontSize: fontSize + 2 }}>{title}</p>
      <div style={{ fontSize }}>
        {location.value && (
          <span className="inline-flex items-center gap-1 mr-3">
            <MapPin size={14} />
            <span>{location.value}</span>
          </span>
        )}
        {location.breakAfter && <br />}
        {phone.value && (
          <>
            <span className="inline-flex items-center gap-1 mr-3">
              <Phone size={14} />
              <a
                href={`tel:${phone.value}`}
                className="underline"
                target="_blank"
              >
                {phone.value}
              </a>
            </span>
            {phone.breakAfter && <br />}
          </>
        )}
        {email && (
          <span className="inline-flex items-center gap-1 mr-3">
            <Mail size={14} />
            <a href={`mailto:${email}`} className="underline" target="_blank">
              {email}
            </a>
          </span>
        )}
        {linkedin && (
          <span className="inline-flex items-center gap-1 mr-3">
            <LinkedInIcon size={14} />
            <a href={linkedin} className="underline" target="_blank">
              Linked In
            </a>
          </span>
        )}
        {website && (
          <span className="inline-flex items-center gap-1 mr-3">
            <Globe size={14} />
            <a href={website} className="underline" target="_blank">
              Portfolio
            </a>
          </span>
        )}
        {customFields?.map((field) => {
          const isValidUrl = z.string().url().safeParse(field.value).success;
          return (
            <span
              key={field.id}
              className="inline-flex items-center gap-1 mr-3"
            >
              {isValidUrl && field.name ? (
                <>
                  {field.iconName === "linkedin" ? (
                    <LinkedInIcon size={14} />
                  ) : (
                    <CustomIcon iconName={field.iconName} size={14} />
                  )}
                  <a
                    href={field.value}
                    className="underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {field.name}
                  </a>
                </>
              ) : (
                <>
                  {field.iconName === "linkedin" ? (
                    <LinkedInIcon size={14} />
                  ) : (
                    <CustomIcon iconName={field.iconName} size={14} />
                  )}
                  {field.name && <span>{field.name}:</span>}
                  <span>{field.value}</span>
                </>
              )}
            </span>
          );
        })}
      </div>
    </header>
  );
};
