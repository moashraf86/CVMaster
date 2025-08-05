import React from "react";
import { DownloadCV } from "../core/DownloadCV";

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-16 p-4 border-b border-border">
      <img
        src="/logo.svg"
        alt="CV Master"
        className="size-6 object-contain dark:invert"
      />
      <div className="flex items-center gap-2">
        <DownloadCV type="button" />
      </div>
    </header>
  );
};
