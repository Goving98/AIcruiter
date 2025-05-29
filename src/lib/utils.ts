import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merges Tailwind classes correctly and prevents duplication
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
