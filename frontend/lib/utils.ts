import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatExamType(type?: string): string {
  if (!type) return 'Exam Paper';
  switch (type.toLowerCase()) {
    case 'mid-sem':
      return 'Mid-Semester';
    case 'end-sem':
      return 'End-Semester';
    default:
      return type;
  }
}

export function getExamTypeColor(type?: string): { bg: string; text: string; border: string } {
  if (!type) return { bg: 'bg-zinc-100', text: 'text-zinc-800', border: 'border-zinc-200' };
  switch (type.toLowerCase()) {
    case 'mid-sem':
      return { bg: 'bg-zinc-100', text: 'text-zinc-900', border: 'border-zinc-200' };
    case 'end-sem':
      return { bg: 'bg-zinc-900', text: 'text-white', border: 'border-zinc-900' };
    default:
      return { bg: 'bg-zinc-100', text: 'text-zinc-800', border: 'border-zinc-200' };
  }
}
