import React from "react";
import { DownloadCV } from "../core/DownloadCV";
import { ImportCV } from "../core/ImportCV";

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-16 p-4 border-b border-border">
      <span className="flex items-center gap-2">
        <img
          src="/logo.svg"
          alt="CV Master"
          className="size-6 object-contain"
        />
        <h1 className="text-lg font-bold text-primary hidden sm:block">
          CV Master
        </h1>
      </span>
      <div className="flex items-center gap-2">
        <ImportCV />
        <DownloadCV type="button" />
      </div>
    </header>
  );
};
