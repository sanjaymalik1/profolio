/**
 * Spacing Design System
 * 
 * Centralized spacing tokens for consistent layout rhythm across editor and public views.
 * Inspired by Framer and Notion's design systems.
 * 
 * Usage:
 * import { spacing } from '@/design/spacing';
 * <section className={spacing.section}>...</section>
 */

export const spacing = {
  // Section padding - Vertical and horizontal padding for major sections
  section: 'py-16 lg:py-24 px-4 lg:px-8',
  sectionTop: 'pt-16 lg:pt-24',
  sectionBottom: 'pb-16 lg:pb-24',
  sectionX: 'px-4 lg:px-8',
  
  // Container max width - Content containers
  container: 'max-w-6xl mx-auto',
  containerNarrow: 'max-w-4xl mx-auto',
  containerWide: 'max-w-7xl mx-auto',
  
  // Block gaps - Space between major blocks/sections
  blockGap: 'space-y-12 lg:space-y-16',
  blockGapLarge: 'space-y-16 lg:space-y-24',
  blockGapSmall: 'space-y-8 lg:space-y-12',
  
  // Content gaps - Space within sections (between related elements)
  contentGap: 'space-y-6 lg:space-y-8',
  contentGapLarge: 'space-y-8 lg:space-y-12',
  contentGapSmall: 'space-y-4 lg:space-y-6',
  
  // Element gaps - Space between small elements
  elementGap: 'space-y-3 lg:space-y-4',
  elementGapSmall: 'space-y-2 lg:space-y-3',
  
  // Inline gaps - Horizontal spacing
  inlineGap: 'gap-4 lg:gap-6',
  inlineGapLarge: 'gap-6 lg:gap-8',
  inlineGapSmall: 'gap-2 lg:gap-3',
  
  // Margins - Specific margin utilities
  marginTop: {
    small: 'mt-4 lg:mt-6',
    medium: 'mt-6 lg:mt-8',
    large: 'mt-8 lg:mt-12',
    xlarge: 'mt-12 lg:mt-16',
  },
  marginBottom: {
    small: 'mb-4 lg:mb-6',
    medium: 'mb-6 lg:mb-8',
    large: 'mb-8 lg:mb-12',
    xlarge: 'mb-12 lg:mb-16',
  },
} as const;

/**
 * Grid system
 */
export const grid = {
  // Responsive grids
  cols2: 'grid grid-cols-1 lg:grid-cols-2',
  cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  
  // Grid gaps
  gap: 'gap-6 lg:gap-8',
  gapLarge: 'gap-8 lg:gap-12',
  gapSmall: 'gap-4 lg:gap-6',
} as const;
