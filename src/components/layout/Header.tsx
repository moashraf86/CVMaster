import React from "react";
import { DownloadCV } from "../core/DownloadCV";
import { ImportCV } from "../core/ImportCV";
import { ThemeToggler } from "../core/ThemeToggler";
import { ReviewBtn } from "../core/ReviewBtn";
import { Link, useLocation } from "react-router";
import { Separator } from "../ui/separator";

export const Header: React.FC = () => {
  const location = useLocation();
  const isReviewPage = location.pathname === "/review";

  return (
    <header className="flex items-center justify-between h-16 p-4 border-b border-border">
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/logo.svg"
          alt="CV Master"
          className="size-6 object-contain"
        />
        <h1 className="text-lg font-bold text-primary hidden sm:block">
          CV Master
        </h1>
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {isReviewPage && <ThemeToggler />}
          {!isReviewPage && <ReviewBtn />}
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <ImportCV />
          <DownloadCV type="button" />
        </div>
      </div>
    </header>
  );
};
