import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isMobile =
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

export const BREAKPOINTS = { tablet: 768, desktop: 1024 } as const;

export function formatDate(
  value: string | Date,
  month: "long" | "short" = "long",
) {
  return new Date(value).toLocaleDateString("en-GB", {
    year: "numeric",
    month,
    day: "numeric",
  });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}