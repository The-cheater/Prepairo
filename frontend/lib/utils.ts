import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatExamType(type: string): string {
  switch (type.toLowerCase()) {
    case 'mid-sem':
      return 'Mid-Semester';
    case 'end-sem':
      return 'End-Semester';
    case 'quiz':
      return 'Quiz / Minor';
    case 'supplementary':
      return 'Supplementary';
    default:
      return type;
  }
}

export function getExamTypeColor(type: string): { bg: string; text: string; border: string } {
  switch (type.toLowerCase()) {
    case 'mid-sem':
      return { bg: 'bg-zinc-100', text: 'text-zinc-900', border: 'border-zinc-200' };
    case 'end-sem':
      return { bg: 'bg-zinc-900', text: 'text-white', border: 'border-zinc-900' };
    case 'quiz':
      return { bg: 'bg-zinc-50', text: 'text-zinc-700', border: 'border-zinc-200' };
    case 'supplementary':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    default:
      return { bg: 'bg-zinc-100', text: 'text-zinc-800', border: 'border-zinc-200' };
  }
}
