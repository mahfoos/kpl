"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  variant?: "gold" | "electric";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  variant = "gold",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      <Badge variant={variant}>{eyebrow}</Badge>
      <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
