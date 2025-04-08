import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Hàm này giúp hợp nhất className và tránh trùng lặp.
 */
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}
