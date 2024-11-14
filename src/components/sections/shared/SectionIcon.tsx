import {
  Award,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  Rocket,
  Sparkle,
  UserRound,
  Text,
  Languages,
  HandHeart,
} from "lucide-react";
import { SectionName } from "../../../types/types";

export const SectionIcon = ({ section }: { section: SectionName }) => {
  switch (section) {
    case "basics":
      return <UserRound />;
    case "summary":
      return <Text />;
    case "experience":
      return <Briefcase />;
    case "projects":
      return <Rocket />;
    case "skills":
      return <Sparkle />;
    case "education":
      return <GraduationCap />;
    case "languages":
      return <Languages />;
    case "certifications":
      return <BadgeCheck />;
    case "awards":
      return <Award />;
    case "volunteering":
      return <HandHeart />;
    default:
      return <Briefcase />;
  }
};
