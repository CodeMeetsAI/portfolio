"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "#" },
];

export default function Header17() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl rounded-full border border-border/40 bg-background/60 backdrop-blur-xl px-6 shadow-xl">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/logo.svg";
            }}
            alt="Logo"
            className="size-7 object-contain rounded-md"
          />
          Muhammad Umar
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions with white button & wave/shimmer hover animation ("lhron wali animation") */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="group relative overflow-hidden rounded-full text-sm px-5 bg-white text-neutral-950 hover:bg-white/90 shadow-sm transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <a href="mailto:contact@muhammadumar.ai">
              <span className="relative z-10">Get in touch</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </a>
          </Button>
        </div>

        {/* Mobile sheet trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="grid size-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted md:hidden"
            >
              <Menu className="size-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-72 flex-col p-6 bg-background/95 backdrop-blur-xl border-border/40 rounded-l-3xl shadow-2xl">
            <SheetHeader className="mb-6 text-left">
              <SheetTitle asChild>
                <a
                  href="#"
                  className="flex items-center gap-2 font-semibold tracking-tight text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/logo.svg";
                    }}
                    alt="Logo"
                    className="size-7 object-contain rounded-md"
                  />
                  Muhammad Umar
                </a>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2 border-t border-border/40 pt-6">
              <Button
                asChild
                className="group relative overflow-hidden w-full rounded-full bg-white text-neutral-950 hover:bg-white/90 shadow-sm transition-all duration-300"
              >
                <a href="mailto:contact@muhammadumar.ai" onClick={() => setOpen(false)}>
                  <span className="relative z-10">Get in touch</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
