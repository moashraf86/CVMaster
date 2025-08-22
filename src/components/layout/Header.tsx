import React, { useState } from "react";
import { DownloadCV } from "../core/DownloadCV";
import { ImportCV } from "../core/ImportCV";
import { ThemeToggler } from "../core/ThemeToggler";
import { ReviewBtn } from "../core/ReviewBtn";
import { Link, useLocation } from "react-router";
import { Separator } from "../ui/separator";
import { useWindowSize } from "@uidotdev/usehooks";
import { Button } from "../ui/button";
import { MenuIcon, SlidersVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ControlsSheet } from "../core/ControlsSheet";

export const Header: React.FC = () => {
  const location = useLocation();
  const isReviewPage = location.pathname === "/review";
  const windowSize = useWindowSize();
  const isMobile = windowSize.width && windowSize.width < 1024;
  const [isOpen, setIsOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  return (
    <>
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
        <div className="flex items-center gap-2">
          <ThemeToggler className="lg:hidden" />
          <Button
            title="Controls"
            variant="ghost"
            size="icon"
            className="rounded-full sm:hidden"
            onClick={() => setIsControlsOpen(true)}
          >
            <SlidersVertical className="size-4" />
          </Button>
          {isMobile ? (
            <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-foreground">
                  <MenuIcon className="size-4" />
                  <span>Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="bottom"
                className="grid p-4 gap-2 min-w-56"
              >
                <DownloadCV />
                <ImportCV />
                <Separator className="my-2" />
                <ReviewBtn />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="flex items-center gap-3">
                {isReviewPage && <ThemeToggler />}
                {!isReviewPage && <ReviewBtn />}
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <ImportCV />
                <DownloadCV type="button" />
              </div>
            </>
          )}
        </div>
      </header>
      <ControlsSheet
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
      />
    </>
  );
};
