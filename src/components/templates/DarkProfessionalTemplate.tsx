/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableImage } from '@/components/editor/inline/EditableImage';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Mail, MapPin, ExternalLink,
  Building2, GraduationCap, Calendar, ArrowRight,
  Twitter, Globe, ChevronDown, Menu, X
} from 'lucide-react';
import type { EditorSection } from '@/types/editor';
import { EditorContext } from '@/contexts/EditorContext';
import type {
  TemplateData, ProjectsData, Project,
  ExperienceData, Experience, EducationData, Education,
  NavbarData, FooterData
} from '@/types/portfolio';

// ─── Props ───────────────────────────────────────────────────────────────────

interface DarkProfessionalTemplateProps {
  data?: TemplateData;
  isPreview?: boolean;
  sections?: EditorSection[];
  renderSection?: (section: EditorSection, index: number, content: React.ReactNode) => React.ReactNode;
}

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  }),
};

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-8 h-px bg-indigo-500/60" />
      <span className="text-indigo-400 text-xs font-semibold tracking-widest uppercase">
        {children}
      </span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl md:text-4xl font-bold text-slate-100 leading-tight mb-12">
      {children}
    </h2>
  );
}

// ─── Social icon map ─────────────────────────────────────────────────────────

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  website: <Globe className="w-5 h-5" />,
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
// Two modes:
//   standalone (no `sections` prop) – uses sticky + scroll listeners
//   sections mode (inside editor/canvas) – renders as a static bar (no fixed/sticky)

interface NavbarProps {
  navData: any;
  isPreview: boolean;
  /** When true the navbar is inside the editor canvas – don't use fixed/sticky */
  isInsideCanvas?: boolean;
  /** Hero full name - single source of truth for navbar display name */
  heroName?: string;
}

function NavbarContent({ navData, isPreview, isInsideCanvas = false, heroName }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Correct navbar links order: About, Projects, Experience, Skills (NOT Contact)
  const navLinks: Array<{ label: string; href: string }> =
    navData?.links?.length > 0
      ? navData.links
      : [
          { label: 'About', href: '#about' },
          { label: 'Projects', href: '#projects' },
          { label: 'Experience', href: '#experience' },
          { label: 'Skills', href: '#skills' },
        ];

  const ctaLabel = navData?.cta?.label || 'Hire me';
  // Single source of truth: Hero fullName -> Navbar name (live sync)
  const logoName = heroName || navData?.name || 'Your Name';

  // IntersectionObserver for accurate active section detection
  // Only highlights when section is visible, no highlight in Hero section
  useEffect(() => {
    if (isPreview || isInsideCanvas) return;

    const sections = ['about', 'projects', 'experience', 'skills'];
    const observers: IntersectionObserver[] = [];
    const visibilityMap = new Map<string, number>();

    const updateActiveSection = () => {
      // Find section with highest visibility
      let maxVisibility = 0;
      let mostVisibleSection = '';

      visibilityMap.forEach((ratio, id) => {
        if (ratio > maxVisibility) {
          maxVisibility = ratio;
          mostVisibleSection = id;
        }
      });

      // Only highlight if visibility is significant (> 30%)
      // This prevents flickering and ensures accurate highlighting
      if (maxVisibility > 0.3) {
        setActiveSection(mostVisibleSection);
      } else {
        // Reset when in Hero section or no section is visible enough
        setActiveSection('');
      }
    };

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibilityMap.set(id, entry.intersectionRatio);
            updateActiveSection();
          });
        },
        {
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
          rootMargin: '-64px 0px -50% 0px', // Account for fixed navbar (64px) and highlight when section enters top half
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [isPreview, isInsideCanvas]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isPreview || isInsideCanvas) { e.preventDefault(); return; }
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 64; // Fixed navbar height (h-16 = 4rem = 64px)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileOpen(false);
  };

  const handleCTA = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isPreview || isInsideCanvas) { e.preventDefault(); return; }
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      const navbarHeight = 64; // Fixed navbar height (h-16 = 4rem = 64px)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileOpen(false);
  };

  return (
    <div
      className={`
        w-full z-50 transition-all duration-300
        ${isInsideCanvas
          ? 'sticky top-0 mx-auto max-w-6xl bg-slate-950 border-b border-slate-800/60'
          : 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 shadow-lg shadow-black/20'
        }
      `}
    >
      {/* Navbar is always visible with solid background for immediate visibility on page load */}
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { if (isPreview || isInsideCanvas) e.preventDefault(); }}
          className="font-bold text-slate-100 text-lg tracking-tight hover:text-indigo-400 transition-colors"
        >
          {logoName}
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const id = link.href.replace('#', '');
            const isActive = !isInsideCanvas && activeSection === id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="dp-nav-pill"
                    className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <div className="hidden md:flex">
          <a
            href="#contact"
            onClick={handleCTA}
            className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors duration-200"
          >
            {ctaLabel}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/60 px-6 py-4 space-y-1"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="block px-4 py-3 text-sm font-medium text-slate-300 hover:text-indigo-400 hover:bg-slate-800/50 rounded-lg transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-800">
              <a
                href="#contact"
                onClick={handleCTA}
                className="block mt-2 px-4 py-3 text-center text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
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

// Standalone sticky wrapper (public page only)
function StickyNavbar(props: NavbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <NavbarContent {...props} />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ heroData, isPreview, sectionId }: { heroData: any; isPreview: boolean; sectionId?: string }) {
  const editorContext = React.useContext(EditorContext);

  // Determine if we're in inline edit mode (editor context + preview mode)
  const inlineEditMode = isPreview && !!editorContext && !!sectionId;

  // DEBUG: Track when heroData.profileImage changes
  useEffect(() => {
    console.log('[DarkProfessional Hero] profileImage:', heroData.profileImage);
    console.log('[DarkProfessional Hero] inlineEditMode:', inlineEditMode);
  }, [heroData.profileImage, inlineEditMode]);

  const handleScroll = (e: React.MouseEvent, targetId: string) => {
    if (isPreview) { e.preventDefault(); return; }
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 64; // Fixed navbar height (h-16 = 4rem = 64px)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-slate-950"
    >
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glows - contained within section bounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,100%)] h-[min(600px,100%)] bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 translate-x-1/2 w-[min(400px,80%)] h-[min(400px,80%)] bg-indigo-800/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide mb-6 sm:mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                {heroData.location || 'Available for Work'}
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-[64px] font-extrabold text-slate-100 leading-[1.05] tracking-tight mb-4 sm:mb-6"
            >
              {isPreview && editorContext && sectionId ? (
                <EditableText
                  value={heroData.fullName || ''}
                  onChange={(value) => editorContext.dispatch({
                    type: 'UPDATE_SECTION_DATA',
                    payload: { sectionId, data: { fullName: value } }
                  })}
                  placeholder="Your Name"
                  className="outline-none focus:ring-2 focus:ring-indigo-500/50 rounded px-1 -mx-1"
                  as="span"
                />
              ) : (
                heroData.fullName
              )}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.2}
              className="text-lg sm:text-xl md:text-2xl font-medium text-indigo-400 mb-4 sm:mb-6"
            >
              {isPreview && editorContext && sectionId ? (
                <EditableText
                  value={heroData.title || ''}
                  onChange={(value) => editorContext.dispatch({
                    type: 'UPDATE_SECTION_DATA',
                    payload: { sectionId, data: { title: value } }
                  })}
                  placeholder="Your Title"
                  className="outline-none focus:ring-2 focus:ring-indigo-500/50 rounded px-1 -mx-1"
                  as="span"
                />
              ) : (
                heroData.title
              )}
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.3}
              className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mb-8 sm:mb-10"
            >
              {isPreview && editorContext && sectionId ? (
                <EditableText
                  value={heroData.bio || ''}
                  onChange={(value) => editorContext.dispatch({
                    type: 'UPDATE_SECTION_DATA',
                    payload: { sectionId, data: { bio: value } }
                  })}
                  placeholder="Brief introduction about yourself and what you do."
                  className="outline-none focus:ring-2 focus:ring-indigo-500/50 rounded px-1 -mx-1"
                  as="span"
                  multiline
                />
              ) : (
                heroData.bio
              )}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.4}
              className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10"
            >
              <a
                href="#projects"
                onClick={(e) => handleScroll(e, 'projects')}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                View Projects
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, 'contact')}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Contact
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.5}
              className="flex items-center gap-3"
            >
              {(heroData.socialLinks || []).map((link: { platform: string; url: string }, i: number) => (
                <a
                  key={i}
                  href={link.url}
                  onClick={(e) => isPreview && e.preventDefault()}
                  target={!isPreview ? '_blank' : undefined}
                  rel={!isPreview ? 'noopener noreferrer' : undefined}
                  className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:border-indigo-500/40 hover:bg-slate-800 transition-all duration-200"
                >
                  {SOCIAL_ICONS[link.platform] || <Globe className="w-5 h-5" />}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right: Avatar - Responsive sizing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 flex justify-center items-center"
          >
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-56 lg:h-56 xl:w-72 xl:h-72">
              {/* Glow effect - contained within relative parent */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-indigo-600/30 via-transparent to-indigo-800/20 blur-xl" />
              {/* Decorative borders */}
              <div className="absolute -inset-1 rounded-full border-2 border-indigo-500/20" />
              <div className="absolute -inset-2 rounded-full border border-indigo-500/10" />
              {/* Avatar container */}
              <div
                className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700/50 shadow-2xl shadow-indigo-950/60"
              >
                {/* AVATAR LOGIC: Match Blank Canvas implementation exactly */}
                {inlineEditMode ? (
                  /* EDITOR MODE: Use EditableImage component */
                  <EditableImage
                    value={heroData.profileImage || ''}
                    onChange={(url) => {
                      console.log('[DarkProfessional Hero] EditableImage onChange, url:', url);
                      if (editorContext && sectionId) {
                        editorContext.dispatch({
                          type: 'UPDATE_SECTION_DATA',
                          payload: {
                            sectionId,
                            data: { profileImage: url }
                          }
                        });
                      }
                    }}
                    alt={heroData.fullName || 'Profile'}
                    containerClassName="absolute inset-0 w-full h-full !min-h-0"
                    className="object-cover !min-h-0"
                    aspectRatio="square"
                  />
                ) : heroData.profileImage ? (
                  /* PREVIEW/PUBLIC MODE: Show uploaded image */
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={heroData.profileImage}
                    alt={heroData.fullName || 'Profile'}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '50%', objectFit: 'cover' as const }}
                  />
                ) : (
                  /* FALLBACK: Show initial when no image exists */
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <span className="text-6xl sm:text-7xl md:text-8xl lg:text-7xl xl:text-8xl font-bold text-slate-600 select-none uppercase">
                      {(heroData.fullName || '?')[0]}
                    </span>
                  </div>
                )}
              </div>
              {/* Title badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900 border border-slate-700/80 rounded-full shadow-xl whitespace-nowrap max-w-[90%] truncate"
              >
                <span className="text-[10px] sm:text-xs font-semibold text-slate-300">{heroData.title}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator (standalone only) */}
        {!isPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
            onClick={(e) => handleScroll(e as any, 'about')}
          >
            <span className="text-xs text-slate-500 font-medium tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-5 h-5 text-slate-500" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection({ aboutData }: { aboutData: any }) {
  return (
    <section id="about" className="py-24 px-6 bg-slate-900/60" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionLabel>About Me</SectionLabel>
          <SectionHeading>{aboutData.heading || 'About'}</SectionHeading>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1}>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">{aboutData.content}</p>
            {(aboutData.highlights || []).length > 0 && (
              <div className="space-y-3">
                {(aboutData.highlights || []).map((item: string, i: number) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    custom={0.15 + i * 0.07}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0.2}
            className="space-y-4"
          >
            {[
              { label: 'Focus', value: 'Building scalable, production-ready systems' },
              { label: 'Philosophy', value: 'Clean code, thoughtful architecture, team empowerment' },
              { label: 'Status', value: 'Open to senior & lead opportunities' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-colors duration-300"
              >
                <div className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-1.5">{item.label}</div>
                <div className="text-slate-300 text-sm">{item.value}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExperienceSection({ experienceData }: { experienceData: ExperienceData }) {
  if (!experienceData?.experiences?.length) {
    return (
      <section id="experience" className="py-24 px-6 bg-slate-950" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Work History</SectionLabel>
          <SectionHeading>{experienceData?.heading || 'Experience'}</SectionHeading>
          <p className="text-slate-500 text-sm">No experience entries yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-24 px-6 bg-slate-950" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionLabel>Work History</SectionLabel>
          <SectionHeading>{experienceData.heading || 'Experience'}</SectionHeading>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-slate-700/60 to-transparent" />

          <div className="space-y-10">
            {experienceData.experiences.map((exp: Experience, i: number) => (
              <motion.div
                key={exp.id || i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="relative pl-8 md:pl-16"
              >
                {/* Dot */}
                <div className="absolute left-[-5px] md:left-[11px] top-6 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-slate-950 shadow-md shadow-indigo-500/30" />

                <div className="group p-6 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-950/30 hover:-translate-y-0.5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="w-4 h-4 text-indigo-400/70" />
                        <span className="text-indigo-400 font-medium text-sm">{exp.company}</span>
                        {exp.location && (
                          <>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-500 text-sm">{exp.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.startDate} — {exp.endDate || 'Present'}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{exp.description}</p>
                  )}

                  {exp.responsibilities?.length > 0 && (
                    <ul className="space-y-1.5 mb-4">
                      {exp.responsibilities.map((r, ri) => (
                        <li key={ri} className="flex items-start gap-2.5 text-sm text-slate-400">
                          <span className="text-indigo-500 mt-1 text-xs">▸</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  {(exp.technologies?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800/60">
                      {exp.technologies!.map((t, ti) => (
                        <span
                          key={ti}
                          className="px-2.5 py-1 text-xs rounded-md bg-indigo-950/50 text-indigo-300 border border-indigo-900/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection({ projectsData, isPreview }: { projectsData: ProjectsData; isPreview: boolean }) {
  const projects = projectsData?.projects || [];

  return (
    <section id="projects" className="py-24 px-6 bg-slate-900/60" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionLabel>Selected Work</SectionLabel>
          <SectionHeading>{projectsData?.heading || 'Projects'}</SectionHeading>
        </motion.div>

        {projects.length === 0 ? (
          <p className="text-slate-500 text-sm">No projects added yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: Project, i: number) => (
              <motion.div
                key={project.id || i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.08}
                className="group relative flex flex-col rounded-xl bg-slate-900 border border-slate-800/80 overflow-hidden hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/40 transition-all duration-300"
              >
                {/* Top accent on hover */}
                <div className="h-0.5 w-full bg-gradient-to-r from-indigo-600/0 via-indigo-500/60 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <div className="flex gap-2 ml-3 shrink-0">
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          onClick={(e) => isPreview && e.preventDefault()}
                          target={!isPreview ? '_blank' : undefined}
                          rel={!isPreview ? 'noopener noreferrer' : undefined}
                          className="p-1.5 text-slate-500 hover:text-slate-200 transition-colors"
                          title="GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.links?.live && (
                        <a
                          href={project.links.live}
                          onClick={(e) => isPreview && e.preventDefault()}
                          target={!isPreview ? '_blank' : undefined}
                          rel={!isPreview ? 'noopener noreferrer' : undefined}
                          className="p-1.5 text-slate-500 hover:text-slate-200 transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">
                    {project.description}
                  </p>

                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.technologies.map((tech: string, ti: number) => (
                        <span
                          key={ti}
                          className="px-2 py-0.5 text-xs rounded-md bg-slate-800 text-slate-400 border border-slate-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function SkillsSection({ skillsData }: { skillsData: any }) {
  const categories = skillsData?.skillCategories || {};
  const technical: Array<{ name: string }> = categories.technical || [];
  const tools: Array<{ name: string }> = categories.tools || [];
  const soft: Array<{ name: string }> = categories.soft || [];
  const languages: Array<{ name: string }> = categories.languages || [];

  const groups = [
    { label: 'Languages & Frameworks', items: technical, style: 'bg-indigo-950/60 text-indigo-300 border-indigo-900/50 hover:border-indigo-500/50' },
    { label: 'Tools & Infrastructure', items: tools, style: 'bg-slate-800/60 text-slate-300 border-slate-700/50 hover:border-slate-500/50' },
    { label: 'Soft Skills', items: soft, style: 'bg-emerald-950/40 text-emerald-300 border-emerald-900/50 hover:border-emerald-500/50' },
    { label: 'Languages', items: languages, style: 'bg-amber-950/40 text-amber-300 border-amber-900/50 hover:border-amber-500/50' },
  ].filter((g) => g.items.length > 0);

  return (
    <section id="skills" className="py-24 px-6 bg-slate-950" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionLabel>What I Know</SectionLabel>
          <SectionHeading>{skillsData?.heading || 'Skills'}</SectionHeading>
        </motion.div>

        {groups.length === 0 ? (
          <p className="text-slate-500 text-sm">No skills added yet.</p>
        ) : (
          <div className="space-y-10">
            {groups.map((group, gi) => (
              <motion.div
                key={gi}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={gi * 0.1}
              >
                <h3 className="text-xs font-semibold text-slate-500 tracking-widest uppercase mb-4">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((skill, si) => (
                    <motion.span
                      key={si}
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: si * 0.04 }}
                      whileHover={{ scale: 1.05 }}
                      className={`px-3.5 py-1.5 text-sm font-medium rounded-lg border cursor-default transition-all duration-200 ${group.style}`}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────

function EducationSection({ educationData }: { educationData: EducationData }) {
  const items = educationData?.education || [];

  return (
    <section id="education" className="py-24 px-6 bg-slate-900/60" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionLabel>Academic Background</SectionLabel>
          <SectionHeading>{educationData?.heading || 'Education'}</SectionHeading>
        </motion.div>

        {items.length === 0 ? (
          <p className="text-slate-500 text-sm">No education entries yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {items.map((edu: Education, i: number) => (
              <motion.div
                key={edu.id || i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="p-6 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-indigo-950/50 border border-indigo-900/50 shrink-0">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-indigo-300 transition-colors">
                      {edu.degree}{edu.field ? ` — ${edu.field}` : ''}
                    </h3>
                    <div className="text-indigo-400 text-sm font-medium mt-0.5">{edu.institution}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pb-4 mb-4 border-b border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {edu.startDate} — {edu.endDate || 'Present'}
                  </div>
                  {edu.gpa && <span className="text-slate-400">GPA: {edu.gpa}</span>}
                </div>

                {edu.coursework && edu.coursework.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {edu.coursework.map((c, ci) => (
                      <span key={ci} className="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection({ contactData, isPreview }: { contactData: any; isPreview: boolean }) {
  return (
    <section id="contact" className="py-24 px-6 bg-slate-950 relative overflow-hidden" style={{ scrollMarginTop: '64px' }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center"
        >
          <SectionLabel>Get In Touch</SectionLabel>
          <SectionHeading>{contactData?.heading || "Let's Work Together"}</SectionHeading>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0.15}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            {contactData?.availability || "I'm currently open to new opportunities. Whether you have a project in mind or just want to say hello, my inbox is always open."}
          </p>

          <a
            href={`mailto:${contactData?.email}`}
            onClick={(e) => isPreview && e.preventDefault()}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 mb-10"
          >
            <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
            {contactData?.email || 'Send me an email'}
          </a>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 text-sm text-slate-500">
            {contactData?.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span>{contactData.email}</span>
              </div>
            )}
            {contactData?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>{contactData.location}</span>
              </div>
            )}
          </div>

          {(contactData?.socialLinks || []).length > 0 && (
            <div className="flex justify-center gap-3">
              {(contactData.socialLinks || []).map((link: { platform: string; url: string }, i: number) => (
                <a
                  key={i}
                  href={link.url}
                  onClick={(e) => isPreview && e.preventDefault()}
                  target={!isPreview ? '_blank' : undefined}
                  rel={!isPreview ? 'noopener noreferrer' : undefined}
                  className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:border-indigo-500/40 hover:bg-slate-800 transition-all duration-200"
                >
                  {SOCIAL_ICONS[link.platform] || <Globe className="w-5 h-5" />}
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function FooterContent({ footerData, heroName }: { footerData: any; heroName?: string }) {
  const year = new Date().getFullYear();
  // Single source of truth: Hero fullName -> Footer name (live sync)
  const name = heroName || footerData?.name || 'Your Name';

  return (
    <footer className="py-8 px-6 bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-bold text-slate-400 text-sm">{name}</span>
        <p className="text-slate-600 text-xs text-center">
          {footerData?.copyrightText || `© ${year} ${name}. All rights reserved.`}
        </p>
        {footerData?.links?.length > 0 && (
          <div className="flex items-center gap-4">
            {(footerData.links as Array<{ label: string; href: string }>).map((link, i) => (
              <a key={i} href={link.href} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DarkProfessionalTemplate({
  data,
  isPreview = false,
  sections,
  renderSection,
}: DarkProfessionalTemplateProps) {

  // ── Default data ─────────────────────────────────────────────────────────
  const heroData = data?.hero || {
    fullName: 'Jordan Smith',
    title: 'Senior Software Engineer',
    bio: 'Building scalable systems and leading development teams. Passionate about clean code, system architecture, and emerging technologies.',
    profileImage: '',
    location: 'Seattle, WA',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/jordansmith' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/jordansmith' },
      { platform: 'email', url: 'mailto:jordan@example.com' },
    ],
  };

  const aboutData = data?.about || {
    heading: 'About',
    content: "I'm a senior software engineer passionate about building robust, scalable systems. My expertise spans full-stack development, cloud architecture, and team leadership.",
    highlights: [
      '8+ years in software development',
      'Led teams of 5–15 engineers',
      'Architected systems serving millions of users',
      'Open source contributor with 500+ GitHub stars',
    ],
  };

  const skillsData = data?.skills || {
    heading: 'Skills',
    skillCategories: {
      technical: [
        { name: 'TypeScript', level: 95 },
        { name: 'Python', level: 90 },
        { name: 'Go', level: 85 },
        { name: 'React / Next.js', level: 95 },
        { name: 'Node.js', level: 90 },
        { name: 'PostgreSQL', level: 88 },
        { name: 'GraphQL', level: 82 },
      ],
      tools: [
        { name: 'Docker', level: 92 },
        { name: 'Kubernetes', level: 88 },
        { name: 'AWS', level: 88 },
        { name: 'Redis', level: 85 },
        { name: 'Terraform', level: 78 },
      ],
      soft: [],
      languages: [],
    },
    skills: [],
  };

  const projectsData: ProjectsData = data?.projects || {
    heading: 'Projects',
    categories: [],
    projects: [
      {
        id: '1',
        title: 'Microservices Platform',
        description: 'Scalable microservices architecture serving 10M+ requests/day with automated deployment pipelines.',
        technologies: ['Go', 'Docker', 'Kubernetes', 'PostgreSQL'],
        images: [],
        links: { github: 'https://github.com/jordansmith/microservices' },
        featured: true,
        category: 'Backend',
        status: 'completed',
      },
      {
        id: '2',
        title: 'Real-time Analytics Engine',
        description: 'High-performance analytics processing millions of events/second with sub-second latency.',
        technologies: ['Python', 'Kafka', 'ClickHouse', 'React'],
        images: [],
        links: { github: 'https://github.com/jordansmith/analytics' },
        featured: true,
        category: 'Data',
        status: 'completed',
      },
      {
        id: '3',
        title: 'Developer Tools Suite',
        description: 'CLI tools and libraries improving developer productivity for 5,000+ engineers.',
        technologies: ['TypeScript', 'Node.js', 'CLI', 'NPM'],
        images: [],
        links: { github: 'https://github.com/jordansmith/devtools' },
        featured: true,
        category: 'Tools',
        status: 'completed',
      },
    ],
  };

  const experienceData: ExperienceData = data?.experience || {
    heading: 'Experience',
    experiences: [],
  };

  const educationData: EducationData = data?.education || {
    heading: 'Education',
    education: [],
  };

  const contactData = data?.contact || {
    heading: "Let's Work Together",
    email: 'jordan@example.com',
    location: 'Seattle, WA',
    availability: "I'm currently open to new opportunities. Whether you have a project in mind or just want to say hello, my inbox is always open.",
    socialLinks: [],
    contactForm: { enabled: false, fields: [] },
  };

  const navbarData: NavbarData = data?.navbar || {
    name: heroData.fullName,
    links: [
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Experience', href: '#experience' },
      { label: 'Skills', href: '#skills' },
    ],
    cta: { label: 'Hire me', href: '#contact' },
  };

  const footerData: FooterData = data?.footer || {
    name: heroData.fullName,
  };

  const rootClass = "min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden";
  const rootStyle = { fontFamily: "'Inter', system-ui, sans-serif" };

  // ── SECTION-BASED MODE (editor / preview with sections prop) ───────────────
  if (sections) {
    // Extract live hero data from sections for name synchronization
    const heroSection = sections.find(s => s.type === 'hero');
    const liveHeroData = heroSection?.data || heroData;
    const liveHeroName = (liveHeroData as any)?.fullName || heroData.fullName;

    // Find navbar section for special handling on public pages
    const navbarSection = sections.find(s => s.type === 'navbar');
    const hasNavbar = !!navbarSection;

    return (
      <div className={rootClass} style={rootStyle}>
        {/* Render fixed navbar for public pages (when isPreview=false) */}
        {hasNavbar && !isPreview && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <NavbarContent
              navData={navbarSection.data as any}
              isPreview={false}
              isInsideCanvas={false}
              heroName={liveHeroName}
            />
          </div>
        )}

        {sections.map((section, index) => {
          // Build section content via the switch
          let content: React.ReactNode = null;

          switch (section.type) {
            case 'navbar': {
              // Skip navbar in section loop if we're on public page (already rendered as fixed above)
              // Return empty fragment (not null) so renderSection doesn't fall back to generic NavbarSection
              if (!isPreview) {
                content = <React.Fragment key={section.id} />;
                break;
              }
              // In editor/preview: use a static non-sticky bar so it doesn't float over editor UI
              const d = section.data as any;
              content = (
                <NavbarContent
                  key={section.id}
                  navData={d}
                  isPreview={isPreview}
                  isInsideCanvas={true}
                  heroName={liveHeroName}
                />
              );
              break;
            }
            case 'hero': {
              const d = section.data as any;
              content = (
                <HeroSection
                  key={`hero-${section.id}-${d.profileImage || 'no-img'}`}
                  heroData={d}
                  isPreview={isPreview}
                  sectionId={section.id}
                />
              );
              break;
            }
            case 'about': {
              const d = section.data as any;
              content = (
                <React.Fragment key={section.id}>
                  <AboutSection aboutData={d} />
                </React.Fragment>
              );
              break;
            }
            case 'experience': {
              const d = section.data as ExperienceData;
              content = (
                <React.Fragment key={section.id}>
                  <ExperienceSection experienceData={d} />
                </React.Fragment>
              );
              break;
            }
            case 'projects': {
              const d = section.data as ProjectsData;
              content = (
                <React.Fragment key={section.id}>
                  <ProjectsSection projectsData={d} isPreview={isPreview} />
                </React.Fragment>
              );
              break;
            }
            case 'skills': {
              const d = section.data as any;
              content = (
                <React.Fragment key={section.id}>
                  <SkillsSection skillsData={d} />
                </React.Fragment>
              );
              break;
            }
            case 'education': {
              const d = section.data as EducationData;
              content = (
                <React.Fragment key={section.id}>
                  <EducationSection educationData={d} />
                </React.Fragment>
              );
              break;
            }
            case 'contact': {
              const d = section.data as any;
              content = (
                <React.Fragment key={section.id}>
                  <ContactSection contactData={d} isPreview={isPreview} />
                </React.Fragment>
              );
              break;
            }
            case 'footer': {
              const d = section.data as FooterData;
              content = (
                <FooterContent
                  key={section.id}
                  footerData={d}
                  heroName={liveHeroName}
                />
              );
              break;
            }
            default:
              content = null;
          }

          return renderSection ? renderSection(section, index, content) : content;
        })}
      </div>
    );
  }

  // ── STANDALONE MODE (public portfolio page) ────────────────────────────────
  return (
    <div className={rootClass} style={rootStyle}>
      <StickyNavbar navData={navbarData} isPreview={isPreview} heroName={heroData.fullName} />
      <HeroSection heroData={heroData} isPreview={isPreview} />
      <AboutSection aboutData={aboutData} />
      <ExperienceSection experienceData={experienceData} />
      <ProjectsSection projectsData={projectsData} isPreview={isPreview} />
      <SkillsSection skillsData={skillsData} />
      <EducationSection educationData={educationData} />
      <ContactSection contactData={contactData} isPreview={isPreview} />
      <FooterContent footerData={footerData} heroName={heroData.fullName} />
    </div>
  );
}