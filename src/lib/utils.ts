import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This helps manage CSS classes for your big A11y buttons
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
