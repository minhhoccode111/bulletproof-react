import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// take a variable number of arguments (...inputs) and return a merged string of class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
