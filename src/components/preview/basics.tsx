import { Globe, MapPin, Phone, SendIcon } from "lucide-react";
import { useResume } from "../../store/useResume";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";

export const BasicsPreview: React.FC = () => {
  // get the data from the store
  const {
    resumeData: { basics },
  } = useResume();
  const { name, title, location, phone, email, linkedin, website } =
    basics || {};

  return (
    <header className="text-start space-y-1">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-base">{title}</p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
        {location && (
          <div className="flex items-center gap-1.5">
            <MapPin size={12} />
            <span>{location}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-1.5">
            <Phone size={12} />
            <span>{phone}</span>
          </div>
        )}

        {email && (
          <div className="flex items-center gap-1.5">
            <SendIcon size={12} />
            <a href={`mailto:${email}`} className="underline" target="_blank">
              Gmail
            </a>
          </div>
        )}
        {linkedin && (
          <div className="flex items-center gap-1.5">
            <LinkedInLogoIcon fontSize={12} />
            <a href={linkedin} className="underline" target="_blank">
              Linked In
            </a>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-1.5">
            <Globe size={12} />
            <a href={website} className="underline" target="_blank">
              Portfolio
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
