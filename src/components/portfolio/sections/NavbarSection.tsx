"use client";

import React, { useState, useEffect } from 'react';
import { NavbarData, SectionStyling } from '@/types/portfolio';

interface NavbarSectionProps {
  data: NavbarData;
  styling?: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<NavbarData>) => void;
  onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

const container = 'max-w-5xl mx-auto px-6';

export default function NavbarSection({
  data,
  isPublicView = false
}: NavbarSectionProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const isPreview = !isPublicView;

  useEffect(() => {
    let ticking = false;

    // Scroll listener for sticky styling
    const scrollHandler = (e?: Event) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          let scrollPos = window.scrollY;
          if (e && e.target instanceof Element) {
            scrollPos = e.target.scrollTop;
          } else if (e && e.target instanceof Document) {
            scrollPos = e.target.documentElement.scrollTop || window.scrollY;
          }
          setScrolled(scrollPos > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true, capture: true });
    scrollHandler();

    // Intersection Observer for active section highlighting
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });

        let maxRatio = 0;
        let visibleSection = '';

        ratios.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            visibleSection = id;
          }
        });

        if (maxRatio >= 0.3) {
          setActiveSection(visibleSection);
        } else {
          setActiveSection('');
        }
      },
      {
        threshold: [0.3, 0.5, 0.7]
      }
    );

    const sections = ['about', 'experience', 'projects', 'skills'];
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });
    
    return () => {
      window.removeEventListener('scroll', scrollHandler, { capture: true });
      observer.disconnect();
    };
  }, []);

  // Ensure 'contact' is removed and fallback strictly includes 'Skills'
  let navLinks = data.links ? data.links.filter(link => link.href !== '#contact' && link.label.toLowerCase() !== 'contact') : [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
  ];

  // Make sure 'skills' exists if we filtered out contact but skills isn't there yet (for backward compatibility)
  if (data.links && !navLinks.some(link => link.href === '#skills')) {
    navLinks.push({ label: 'Skills', href: '#skills' });
  }

  // Force strict ordering as requested: About, Projects, Experience, Skills
  const orderArray = ['#about', '#projects', '#experience', '#skills'];
  navLinks = [...navLinks].sort((a, b) => {
    const aIndex = orderArray.indexOf(a.href);
    const bIndex = orderArray.indexOf(b.href);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  console.log('Navbar links rendered:', navLinks);

  const cta = data.cta || { label: 'Hire me', href: '#contact' };

  // Handle smooth scroll for anchor links
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle anchor links
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm border-b border-slate-150 shadow-sm'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className={`${container} flex items-center justify-between h-16`}>
        {/* Logo / Name */}
        <a
          href={isPreview ? undefined : '#'}
          onClick={(e) => isPreview && e.preventDefault()}
          className="text-sm font-semibold text-slate-900 tracking-tight hover:text-slate-700 transition-colors"
        >
          {data.name}
        </a>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-7">
          {navLinks.map(({ label, href }) => {
            const sectionId = href.replace('#', '');
            const isActive = activeSection === sectionId;
            
            return (
              <a
                key={label}
                href={isPreview ? undefined : href}
                onClick={(e) => handleLinkClick(e, href)}
                className={`text-sm transition-colors duration-200 ${
                  isActive 
                    ? 'text-slate-900 font-semibold' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </a>
            );
          })}
          <a
            href={isPreview ? undefined : cta.href}
            onClick={(e) => handleLinkClick(e, cta.href)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
          >
            {cta.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
