import React from "react";

import { ICONS } from "../../lib/constants";
import { LinkedInIcon } from "./icons/LinkedIn";
import { DribbleIcon } from "./icons/DribbleIcon";
import { FacebookIcon } from "./icons/FacebookIcon";
import { GithubIcon } from "./icons/GithubIcon";
import { YoutubeIcon } from "./icons/YoutubeIcon";
import { BehanceIcon } from "./icons/BehanceIcon";
import { XIcon } from "./icons/XIcon";

export type IconName = keyof typeof ICONS;

export const CustomIcon: React.FC<{
  iconName?: string;
  size?: number;
}> = ({ iconName, size = 14 }) => {
  if (!iconName) return null;

  const key = iconName.toLowerCase() as IconName;

  const IconComponent = ICONS[key] as React.ElementType;

  switch (key) {
    case "linkedin":
      return <LinkedInIcon size={size} />;
    case "dribbble":
      return <DribbleIcon size={size} />;
    case "facebook":
      return <FacebookIcon size={size} />;
    case "github":
      return <GithubIcon size={size} />;
    case "youtube":
      return <YoutubeIcon size={size} />;
    case "behance":
      return <BehanceIcon size={size} />;
    case "x":
      return <XIcon size={size} />;
    default:
      return <IconComponent size={size} />;
  }
};
