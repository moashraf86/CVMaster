export const PDF_SETTINGS = {
  SCALE: {
    MIN: 0.4,
    MAX: 2,
    STEP: 0.25,
    INITIAL: 0.65,
  },
  FONTSIZE: {
    MIN: 12,
    MAX: 18,
    INITIAL: 14,
    STEP: 1,
  },
  LINEHEIGHT: {
    MIN: 3,
    MAX: 10,
    INITIAL: 5,
    STEP: 1,
  },
};

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
  "ATS Friendly",
  "sans-serif",
  "serif",
  "display",
  "monospace",
  "handwriting",
];
