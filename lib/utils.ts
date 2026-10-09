import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Role } from '@prisma/client'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a Batch record into the display string used across the UI.
 * e.g. { branch: 'COE', year: 2, group: '2C12' } → "COE-2-2C12"
 */
export function formatBatch(batch: { branch: string; year: number; group: string }): string {
  return `${batch.branch}-${batch.year}-${batch.group}`
}

/** Human-readable label for each role */
export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: 'Student',
  CONTRIBUTOR: 'Contributor',
  MODERATOR: 'Moderator',
  CR: 'Class Representative',
}

/** Badge colour variant per role */
export const ROLE_VARIANTS: Record<Role, string> = {
  STUDENT: 'default',
  CONTRIBUTOR: 'secondary',
  MODERATOR: 'destructive',
  CR: 'outline',
}

/** Department abbreviations used in compact display */
export function shortDept(dept: string): string {
  const map: Record<string, string> = {
    'Computer Science & Engineering': 'CSE',
    'Electronics & Communication Engineering': 'ECE',
    Mathematics: 'MATH',
    Physics: 'PHY',
    Chemistry: 'CHEM',
    'Mechanical Engineering': 'ME',
    'Civil Engineering': 'CE',
  }
  return map[dept] ?? dept.slice(0, 4).toUpperCase()
}

/** Return a greeting based on current hour */
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
