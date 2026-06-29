"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "#home" },
  { label: "Teams", href: "#teams" },
  { label: "Road to KPL", href: "#roadmap" },
  { label: "Players", href: "#players" },
  { label: "Auction", href: "#auction" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-3">
      <nav
        className={cn(
          "mx-3 flex h-16 max-w-7xl items-center justify-between gap-4 rounded-full border border-transparent px-4 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 sm:mx-6 sm:px-6 lg:mx-auto",
          scrolled
            ? "glass-strong shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)]"
            : "bg-transparent"
        )}
      >
        <a href="#home" className="flex items-center" aria-label="Kinniya Premier League home">
          <Image
            src="/kpl-logo.png"
            alt="Kinniya Premier League"
            width={1599}
            height={984}
            priority
            className="h-10 w-auto sm:h-11"
          />
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button asChild size="sm" className="h-10 px-5">
            <a href="#auction">
              <Gavel className="size-4" />
              Mega Auction
            </a>
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="glass-strong mx-3 mt-2 rounded-3xl p-4 lg:hidden"
          >
            <div className="flex flex-col">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <Button asChild className="mt-3 w-full">
                <a href="#auction" onClick={() => setOpen(false)}>
                  <Gavel className="size-4" />
                  Mega Auction
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
