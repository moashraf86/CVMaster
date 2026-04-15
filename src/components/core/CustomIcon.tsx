import React from "react";

import { ICONS } from "../../lib/constants";

export type IconName = keyof typeof ICONS;

export const CustomIcon: React.FC<{
  iconName?: string;
  size?: number;
}> = ({ iconName, size = 14 }) => {
  if (!iconName) return null;

  const key = iconName.toLowerCase() as IconName;

  const IconComponent = ICONS[key] as React.ElementType;

  return <IconComponent size={size} />;
};
