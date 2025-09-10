import React from "react";
import { Link } from "react-router";

export const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src="/logo.svg"
        alt="CV Master Logo"
        className="size-6 object-contain"
      />
      <h1 className="text-lg font-bold text-primary hidden sm:block">
        CV Master
      </h1>
    </Link>
  );
};
