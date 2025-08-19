import {
  Github,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Link as LinkIcon,
} from "lucide-react";
import React from "react";

// Map of allowed icons
const ICONS = {
  github: Github,
  mail: Mail,
  email: Mail,
  phone: Phone,
  location: MapPin,
  map: MapPin,
  website: Globe,
  portfolio: Globe,
  user: User,
  link: LinkIcon,
} as const;

export type IconName = keyof typeof ICONS;

export const CustomIcon: React.FC<{
  iconName?: string;
  size?: number;
}> = ({ iconName, size = 14 }) => {
  if (!iconName) return null;

  const key = iconName.toLowerCase() as IconName;
  const IconComponent = ICONS[key] ?? LinkIcon;

  if (!IconComponent) return null;

  return <IconComponent size={size} />;
};
