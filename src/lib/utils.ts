import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in XOF (Franc CFA)
export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-FR')} XOF`;
}
