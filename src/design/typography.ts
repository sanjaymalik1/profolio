/**
 * Typography Design System
 * 
 * Centralized typography tokens for consistent text hierarchy across editor and public views.
 * Inspired by Framer and Notion's design systems.
 * 
 * Usage:
 * import { typography } from '@/design/typography';
 * <h1 className={typography.heroTitle}>...</h1>
 */

export const typography = {
  // Hero/Display text - Main headline, largest text
  heroTitle: 'text-4xl lg:text-6xl font-bold leading-tight tracking-tight',
  
  // Section titles - Major section headings
  sectionTitle: 'text-3xl lg:text-4xl font-bold leading-tight tracking-tight',
  
  // Subsection titles - Secondary headings
  subsectionTitle: 'text-xl lg:text-2xl font-semibold leading-snug',
  
  // Subtitle/Tagline - Supporting text for titles
  subtitle: 'text-lg lg:text-xl font-medium leading-relaxed',
  
  // Body text - Primary content text
  body: 'text-base lg:text-lg leading-relaxed',
  
  // Body small - Secondary content text
  bodySmall: 'text-sm lg:text-base leading-relaxed',
  
  // Muted text - De-emphasized text, metadata, captions
  muted: 'text-sm lg:text-base text-current/70 leading-relaxed',
  
  // Label - Form labels, small headings
  label: 'text-sm font-medium leading-normal',
  
  // Caption - Very small text, fine print
  caption: 'text-xs lg:text-sm text-current/60 leading-normal',
} as const;

/**
 * Text color utilities
 */
export const textColors = {
  primary: 'text-current',
  secondary: 'text-current/80',
  muted: 'text-current/70',
  subtle: 'text-current/60',
} as const;

/**
 * Font weight utilities
 */
export const fontWeights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;
