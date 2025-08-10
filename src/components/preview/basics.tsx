import { Globe, MapPin, Phone, SendIcon } from "lucide-react";
import { usePdfSettings, useResume } from "../../store/useResume";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { cn } from "../../lib/utils";

export const BasicsPreview: React.FC = () => {
  // get the data from the store
  const {
    resumeData: { basics },
  } = useResume();

  // get the pdf settings from the store
  const {
    pdfSettings: { fontSize },
  } = usePdfSettings();

  const { name, title, location, phone, email, linkedin, website, alignment } =
    basics || {};

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
      <div
        // className="flex flex-wrap items-center gap-x-2 gap-y-0.5"
        style={{ fontSize }}
      >
        {location.value && (
          <span className="inline-flex items-center gap-1 mr-3">
            <MapPin size={12} />
            <span>{location.value}</span>
          </span>
        )}
        {location.breakAfter && <br />}
        {phone.value && (
          <>
            <span className="inline-flex items-center gap-1 mr-3">
              <Phone size={12} />
              <span>{phone.value}</span>
            </span>
            {phone.breakAfter && <br />}
          </>
        )}
        {email && (
          <span className="inline-flex items-center gap-1 mr-3">
            <SendIcon size={12} />
            <a href={`mailto:${email}`} className="underline" target="_blank">
              {email}
            </a>
          </span>
        )}
        {linkedin && (
          <span className="inline-flex items-center gap-1 mr-3">
            <LinkedInLogoIcon fontSize={12} />
            <a href={linkedin} className="underline" target="_blank">
              Linked In
            </a>
          </span>
        )}
        {website && (
          <span className="inline-flex items-center gap-1 mr-3">
            <Globe size={12} />
            <a href={website} className="underline" target="_blank">
              Portfolio
            </a>
          </span>
        )}
      </div>
    </header>
  );
};
