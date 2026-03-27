/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import type { EditorSection } from '@/types/editor';

const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Skills', id: 'skills' },
] as const;

type NavbarVariant = 'warm' | 'dark' | 'mono' | 'elite';

interface NavbarProps {
  sections?: EditorSection[];
  isPreview?: boolean;
  isInsideCanvas?: boolean;
  heroName?: string;
  navData?: any;
  variant?: NavbarVariant;
}

const variantStyles: Record<NavbarVariant, Record<string, string>> = {
  warm: {
    shell: 'bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E8DCC8]',
    shellInside: 'bg-[#FAF9F6] border-b border-[#E8DCC8] max-w-6xl mx-auto',
    brand: 'font-semibold text-[#8B6F47] text-base tracking-tight hover:text-[#6B5437]',
    link: 'text-[#A89B88] hover:text-[#8B6F47]',
    linkActive: 'text-[#8B6F47]',
    activeBg: 'bg-[#F5EFE7] border border-[#E8DCC8]',
    cta: 'bg-[#8B6F47] hover:bg-[#6B5437] text-white',
    mobile: 'bg-[#FAF9F6]/98 backdrop-blur-sm border-b border-[#E8DCC8]',
  },
  dark: {
    shell: 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 shadow-lg shadow-black/20',
    shellInside: 'bg-slate-950 border-b border-slate-800/60 max-w-6xl mx-auto',
    brand: 'font-bold text-slate-100 text-lg tracking-tight hover:text-indigo-400',
    link: 'text-slate-400 hover:text-slate-100',
    linkActive: 'text-indigo-400',
    activeBg: 'bg-indigo-500/10 border border-indigo-500/20',
    cta: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    mobile: 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/60',
  },
  mono: {
    shell: 'border-b border-black/8 bg-white/95 backdrop-blur-sm',
    shellInside: 'border-b border-black/8 bg-white max-w-6xl mx-auto',
    brand: 'text-xl font-light tracking-[0.08em] text-black',
    link: 'text-gray-600 hover:text-black hover:bg-black/[0.03]',
    linkActive: 'text-black font-medium',
    activeBg: 'bg-black/[0.04] border border-black/[0.08]',
    cta: 'border border-black text-black hover:bg-black hover:text-white',
    mobile: 'border-b border-black/8 bg-white',
  },
  elite: {
    shell: 'backdrop-blur-md bg-white/5 border-b border-white/10',
    shellInside: 'w-full max-w-full mx-0 rounded-none border-x-0 backdrop-blur-md bg-white/5 border-b border-white/10',
    brand: 'text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent',
    link: 'text-slate-300 hover:text-white',
    linkActive: 'text-white',
    activeBg: 'bg-white/10',
    cta: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25',
    mobile: 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/60',
  },
};

function NavbarComponent({
  sections,
  isPreview = false,
  isInsideCanvas = false,
  heroName,
  navData,
  variant = 'dark',
}: NavbarProps) {
  const styles = variantStyles[variant];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const resolvedHeroName = useMemo(() => {
    const heroSection = sections?.find((section) => section.type === 'hero');
    const contentData = (heroSection as any)?.content || {};
    const sectionData = Object.keys(contentData).length > 0 ? contentData : heroSection?.data;
    return heroName || (sectionData as any)?.fullName || navData?.name || 'Your Name';
  }, [heroName, navData?.name, sections]);

  useEffect(() => {
    if (isPreview || isInsideCanvas) return;

    const observerSections = ['about', 'projects', 'experience', 'skills'];
    const visibilityMap = new Map<string, number>();
    const observers: IntersectionObserver[] = [];

    const updateActiveSection = () => {
      let maxVisibility = 0;
      let mostVisibleSection = '';

      visibilityMap.forEach((ratio, id) => {
        if (ratio > maxVisibility) {
          maxVisibility = ratio;
          mostVisibleSection = id;
        }
      });

      const next = maxVisibility > 0.3 ? mostVisibleSection : '';
      setActiveSection((prev) => (prev === next ? prev : next));
    };

    observerSections.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => visibilityMap.set(id, entry.intersectionRatio));
          updateActiveSection();
        },
        {
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
          rootMargin: '-64px 0px -50% 0px',
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [isPreview, isInsideCanvas]);

  const handleNav = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (isPreview || isInsideCanvas) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  }, [isPreview, isInsideCanvas]);

  const handleBrandClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isPreview || isInsideCanvas) {
      e.preventDefault();
    }
  }, [isPreview, isInsideCanvas]);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const shellClassName = isInsideCanvas
    ? `sticky top-0 z-50 ${styles.shellInside}`
    : `fixed top-0 left-0 right-0 z-50 ${styles.shell}`;

  const ctaLabel = navData?.cta?.label || 'Contact';

  return (
    <div className={shellClassName}>
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 md:h-[4.25rem] flex items-center justify-between">
        <a
          href="#"
          onClick={handleBrandClick}
          className={`${styles.brand} transition-colors`}
        >
          {resolvedHeroName}
        </a>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = !isInsideCanvas && activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNav(e, item.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? styles.linkActive : styles.link}`}
              >
                {isActive && (
                  <motion.span
                    layoutId={`common-nav-pill-${variant}`}
                    className={`absolute inset-0 rounded-lg ${styles.activeBg}`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </a>
            );
          })}
        </div>

        <div className="hidden md:flex">
          <a
            href="#contact"
            onClick={(e) => handleNav(e, 'contact')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 inline-flex items-center gap-2 ${styles.cta}`}
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className={`md:hidden px-6 py-4 space-y-1 ${styles.mobile}`}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNav(e, item.id)}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${styles.link}`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-current/20">
              <a
                href="#contact"
                onClick={(e) => handleNav(e, 'contact')}
                className={`block mt-2 px-4 py-3 text-center text-sm font-semibold rounded-lg transition-colors ${styles.cta}`}
              >
                {ctaLabel}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Navbar = React.memo(NavbarComponent);
Navbar.displayName = 'Navbar';
