/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from 'react';
import type { EditorSection } from '@/types/editor';

type FooterVariant = 'warm' | 'dark' | 'mono' | 'elite';

interface FooterProps {
  sections?: EditorSection[];
  heroName?: string;
  variant?: FooterVariant;
}

const variantStyles: Record<FooterVariant, { shell: string; text: string }> = {
  warm: {
    shell: 'py-12 px-6 bg-white border-t border-[#E8DCC8]',
    text: 'text-[#6B5437] text-sm',
  },
  dark: {
    shell: 'py-8 px-6 bg-slate-950 border-t border-slate-800/50',
    text: 'text-slate-500 text-xs',
  },
  mono: {
    shell: 'border-t border-black/10 bg-white py-8 px-6',
    text: 'text-sm text-gray-700',
  },
  elite: {
    shell: 'relative py-12 px-6 border-t border-white/10',
    text: 'text-slate-400',
  },
};

function FooterComponent({ sections, heroName, variant = 'dark' }: FooterProps) {
  const styles = variantStyles[variant];

  const resolvedHeroName = useMemo(() => {
    const heroSection = sections?.find((section) => section.type === 'hero');
    const contentData = (heroSection as any)?.content || {};
    const sectionData = Object.keys(contentData).length > 0 ? contentData : heroSection?.data;
    return heroName || (sectionData as any)?.fullName || 'Your Name';
  }, [heroName, sections]);

  return (
    <footer className={styles.shell}>
      <div className="max-w-6xl mx-auto text-center">
        <p className={styles.text}>© 2026 {resolvedHeroName} All rights reserved</p>
      </div>
    </footer>
  );
}

export const Footer = React.memo(FooterComponent);
Footer.displayName = 'Footer';
