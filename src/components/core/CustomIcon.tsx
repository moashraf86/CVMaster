import * as LucideIcons from "lucide-react";

export const CustomIcon: React.FC<{
  iconName?: string;
  size?: number;
}> = ({ iconName, size = 14 }) => {
  if (!iconName) return null;

  const iconKey = Object.keys(LucideIcons).find(
    (key) => key.toLowerCase() === iconName.toLowerCase()
  ) as keyof typeof LucideIcons;

  const IconComponent = LucideIcons[iconKey] as React.ComponentType<{
    size?: number;
  }>;

  if (!IconComponent) return null;

  return <IconComponent size={size} />;
};
