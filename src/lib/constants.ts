import {
  Briefcase,
  Globe,
  LinkIcon,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
// Custom icons
import { WhatsAppIcon } from "../components/core/icons/WhatsAppIcon";
import { LinkedInIcon } from "../components/core/icons/LinkedIn";
import { GithubIcon } from "../components/core/icons/GithubIcon";
import { BehanceIcon } from "../components/core/icons/BehanceIcon";
import { DribbleIcon } from "../components/core/icons/DribbleIcon";
import { FacebookIcon } from "../components/core/icons/FacebookIcon";
import { XIcon } from "../components/core/icons/XIcon";
import { YoutubeIcon } from "../components/core/icons/YoutubeIcon";

export const PDF_SETTINGS = {
  SCALE: {
    MIN: 0.4,
    MAX: 2,
    INITIAL: 0.65,
    SMALL: 0.4,
    MEDIUM: 0.5,
    LARGE: 0.75,
    STEP: 0.25,
  },
  FONTSIZE: {
    MIN: 12,
    MAX: 18,
    INITIAL: 14,
    STEP: 1,
  },
  LINEHEIGHT: {
    MIN: 4,
    MAX: 10,
    INITIAL: 5,
    STEP: 1,
  },
  VERTICALSPACING: {
    MIN: 1,
    MAX: 10,
    INITIAL: 2,
    STEP: 1,
  },
  MARGIN: {
    MIN: 10,
    MAX: 50,
    INITIAL: 20,
    VALUE: 20,
    STEP: 1,
  },
};

// Paper size constants
export const PAPER_SIZES = {
  width: 210, // 210mm
  height: 297, // 297mm
};

// MM to PX conversion
export const MM_TO_PX = 3.78;

export const GOOGLE_FONTS_API_KEY = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;

export const ATS_FRIENDLY_FONTS = [
  // Sans-Serif Fonts (7)
  {
    family: "IBM Plex Sans",
    category: "sans-serif",
  },
  {
    family: "Inter",
    category: "sans-serif",
  },
  {
    family: "Roboto",
    category: "sans-serif",
  },
  {
    family: "Source Sans Pro",
    category: "sans-serif",
  },
  {
    family: "Noto Sans",
    category: "sans-serif",
  },
  {
    family: "Lato",
    category: "sans-serif",
  },
  {
    family: "Work Sans",
    category: "sans-serif",
  },

  // Serif Fonts (6)
  {
    family: "IBM Plex Serif",
    category: "serif",
  },
  {
    family: "Merriweather",
    category: "serif",
  },
  {
    family: "Source Serif Pro",
    category: "serif",
  },
  {
    family: "Crimson Text",
    category: "serif",
  },
  {
    family: "Cormorant Garamond",
    category: "serif",
  },
  {
    family: "Libre Baskerville",
    category: "serif",
  },

  // Monospace Fonts (4)
  {
    family: "IBM Plex Mono",
    category: "monospace",
  },
  {
    family: "JetBrains Mono",
    category: "monospace",
  },
  {
    family: "Space Mono",
    category: "monospace",
  },
  {
    family: "Courier Prime",
    category: "monospace",
  },
  {
    family: "Fira Code",
    category: "monospace",
  },

  // Display Fonts (3)
  {
    family: "Playfair Display",
    category: "display",
  },
  {
    family: "Poppins",
    category: "display",
  },
  {
    family: "Montserrat",
    category: "display",
  },
];

export const FONT_CATEGORIES = [
  "ATS-Friendly",
  "sans-serif",
  "serif",
  "display",
  "monospace",
  "handwriting",
];

export const ICONS = {
  email: Mail,
  phone: Phone,
  whatsapp: WhatsAppIcon,
  location: MapPin,
  link: LinkIcon,
  website: Globe,
  user: User,
  briefcase: Briefcase,
  linkedin: LinkedInIcon,
  github: GithubIcon,
  behance: BehanceIcon,
  dribbble: DribbleIcon,
  facebook: FacebookIcon,
  x: XIcon,
  youtube: YoutubeIcon,
} as const;
