/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { EditableImage } from '@/components/editor/inline/EditableImage';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import {
  Github, Linkedin, Mail, MapPin, ExternalLink, ArrowRight,
  Twitter, Globe, Building2, Calendar, GraduationCap, Sparkles
} from 'lucide-react';
import type { EditorSection } from '@/types/editor';
import { EditorContext } from '@/contexts/EditorContext';
import type { TemplateData } from '@/types/portfolio';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & PROPS
// ═══════════════════════════════════════════════════════════════════════════

interface EliteProTemplateProps {
  data?: TemplateData;
  isPreview?: boolean;
  sections?: EditorSection[];
  renderSection?: (section: EditorSection, index: number, content: React.ReactNode) => React.ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED GRADIENT BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[40%] -right-[20%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute -bottom-[40%] -left-[20%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-transparent blur-3xl"
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[length:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GLASS NAVBAR (Premium)
// ═══════════════════════════════════════════════════════════════════════════

interface NavProps {
  heroName?: string;
  navData?: any;
  isInsideCanvas?: boolean;
  isPreview?: boolean;
}

function GlassNavbar({ heroName, navData, isInsideCanvas = false, isPreview = false }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
  ];

  const logoName = heroName || navData?.name || 'Your Name';

  useEffect(() => {
    if (isPreview || isInsideCanvas) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPreview, isInsideCanvas]);

  useEffect(() => {
    if (isPreview || isInsideCanvas) return;

    const sections = ['about', 'projects', 'experience', 'skills'];
    const observers: IntersectionObserver[] = [];
    const visibilityMap = new Map<string, number>();

    const updateActiveSection = () => {
      let maxVisibility = 0;
      let mostVisibleSection = '';

      visibilityMap.forEach((ratio, id) => {
        if (ratio > maxVisibility) {
          maxVisibility = ratio;
          mostVisibleSection = id;
        }
      });

      const nextActive = maxVisibility > 0.3 ? mostVisibleSection : '';
      setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
    };

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibilityMap.set(id, entry.intersectionRatio);
          });
          updateActiveSection();
        },
        {
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
          rootMargin: '-80px 0px -45% 0px',
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isPreview, isInsideCanvas]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isPreview || isInsideCanvas) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = 80;
      const offset = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`
        transition-all duration-500
        ${isInsideCanvas
          ? 'sticky top-0 z-10 w-full max-w-full'
          : 'fixed top-0 left-0 right-0 z-50'
        }
      `}
    >
      <div
        className={`
          transition-all duration-500
          ${scrolled && !isInsideCanvas
            ? 'mt-4 mx-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-black/20'
            : 'backdrop-blur-md bg-white/5 border-b border-white/10'
          }
          ${isInsideCanvas ? 'w-full max-w-full mx-0 rounded-none border-x-0' : 'max-w-7xl mx-auto'}
        `}
      >
        <div className="flex items-center justify-between h-20 px-6 lg:px-8">
          {/* Logo */}
          <div className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            {logoName}
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link: any) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className={`
                    relative px-4 py-2 text-sm font-medium transition-all duration-300
                    ${isActive
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white'
                    }
                  `}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 rounded-lg bg-white/10 -z-10"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* CTA */}
          <a
            href="#contact"
            onClick={(e) => handleNav(e, '#contact')}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
          >
            Hire Me
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FADE-IN ON SCROLL WRAPPER (Premium Animations)
// ═══════════════════════════════════════════════════════════════════════════

function FadeInView({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO SECTION (High Impact, Premium)
// ═══════════════════════════════════════════════════════════════════════════

interface HeroProps {
  section: EditorSection;
  isEditing: boolean;
}

function HeroSection({ section, isEditing }: HeroProps) {
  const editorContext = React.useContext(EditorContext);
  const inlineEditMode = isEditing && !!editorContext && !!section?.id;

  // Safe data access - prevent crashes
  const data = ((section as any)?.content || (section as any)?.data || {}) as any;
  const socialLinks = Array.isArray(data?.socialLinks) ? data?.socialLinks : [];
  const profileImage = (section as any)?.content?.profileImage || (section as any)?.data?.profileImage || '';
  const fullName = data?.fullName || (section as any)?.data?.fullName || 'Your Name';

  const handleAvatarUpdate = (url: string) => {
    if (!editorContext || !section?.id) return;

    editorContext.dispatch({
      type: 'UPDATE_SECTION_DATA',
      payload: {
        sectionId: section.id,
        data: {
          profileImage: url,
          content: {
            ...((section as any)?.content || {}),
            profileImage: url,
          },
        },
      },
    });
  };

  const socialIcons: Record<string, any> = {
    github: <Github className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    email: <Mail className="w-5 h-5" />,
    website: <Globe className="w-5 h-5" />,
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-24 overflow-hidden">
      {/* Spotlight effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Avatar with glow ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-xl opacity-75 scale-110" />

            {/* Avatar */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 bg-slate-800/50 backdrop-blur-sm group">
              {inlineEditMode ? (
                <EditableImage
                  value={profileImage}
                  onChange={handleAvatarUpdate}
                  alt={fullName}
                  containerClassName="absolute inset-0 w-full h-full !min-h-0"
                  className="object-cover !min-h-0 rounded-full"
                  aspectRatio="square"
                />
              ) : profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImage}
                  alt={fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900">
                  <span className="text-5xl font-bold text-slate-500 uppercase">
                    {(fullName || 'Y').charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">Available for opportunities</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              {data?.fullName || 'Your Name'}
            </span>
          </h1>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-2xl md:text-3xl font-medium text-slate-300 mb-6">
            {data?.title || 'Your Title'}
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <p className="text-lg text-slate-400 leading-relaxed">
            {data?.bio || 'Your bio...'}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <a
            href="#projects"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            View My Work
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#contact"
            className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            Get In Touch
          </a>
        </motion.div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center justify-center gap-3"
          >
            {socialLinks.map((link: any, idx: number) => {
              const icon = socialIcons[link?.platform];
              if (!icon || !link?.url) return null;
              return (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                >
                  {icon}
                </a>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ABOUT SECTION (Split Layout, Highlight Cards)
// ═══════════════════════════════════════════════════════════════════════════

function AboutSection({ section }: any) {
  // Safe data access - prevent crashes
  const data = ((section as any)?.content || (section as any)?.data || {}) as any;
  const highlights = Array.isArray(data?.highlights) ? data?.highlights : [];
  const personalInfo = data?.personalInfo || {};
  const languages = Array.isArray(personalInfo?.languages) ? personalInfo.languages : [];

  return (
    <section id="about" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInView>
          {/* Section Label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-blue-600 to-purple-600" />
            <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase">About Me</span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-16">
            {data?.heading || 'About Me'}
          </h2>
        </FadeInView>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left - Content */}
          <FadeInView delay={0.1}>
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                {data?.content || 'Tell your story...'}
              </p>

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="space-y-3 pt-4">
                  {highlights.map((highlight: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <p className="text-slate-300">{highlight}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FadeInView>

          {/* Right - Info Cards */}
          <FadeInView delay={0.2}>
            <div className="space-y-4">
              {personalInfo?.location && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Location</div>
                      <div className="text-white font-semibold">{personalInfo?.location}</div>
                    </div>
                  </div>
                </div>
              )}

              {languages.length > 0 && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Languages</div>
                      <div className="text-white font-semibold">{languages.join(', ')}</div>
                    </div>
                  </div>
                </div>
              )}

              {data?.contactEmail && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-sm text-slate-400 mb-1">Email</div>
                      <div className="text-white font-semibold truncate">{data?.contactEmail}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECTS SECTION (Modern Cards, Hover Effects)
// ═══════════════════════════════════════════════════════════════════════════

function ProjectsSection({ section }: any) {
  // Safe data access - prevent crashes
  const data = ((section as any)?.content || (section as any)?.data || {}) as any;
  const projects = Array.isArray(data?.projects) ? data?.projects : [];

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInView>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-blue-600 to-purple-600" />
            <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase">Portfolio</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-16">
            {data?.heading || 'Featured Projects'}
          </h2>
        </FadeInView>

        {/* Empty state */}
        {projects.length === 0 && (
          <FadeInView>
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">No projects added yet</p>
            </div>
          </FadeInView>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project: any, idx: number) => (
            <FadeInView key={project?.id || idx} delay={idx * 0.1}>
              <div className="group relative rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm hover:bg-white/[0.07] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10">
                {/* Project Image */}
                {Array.isArray(project?.images) && project?.images?.length > 0 && (
                  <div className="relative h-56 overflow-hidden bg-slate-800/50">
                    <Image
                      src={project?.images?.[0] || ''}
                      alt={project?.title || 'Project'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    {project?.title || 'Untitled Project'}
                  </h3>

                  <p className="text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                    {project?.description || ''}
                  </p>

                  {/* Tech Stack */}
                  {Array.isArray(project?.technologies) && project?.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project?.technologies?.map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    {project?.links?.live && (
                      <a
                        href={project?.links?.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300"
                      >
                        View Project
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project?.links?.github && (
                      <a
                        href={project?.links?.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPERIENCE SECTION (Modern Timeline/Cards)
// ═══════════════════════════════════════════════════════════════════════════

function ExperienceSection({ section }: any) {
  const data = ((section as any)?.content || (section as any)?.data || {}) as any;
  const experiences = Array.isArray(data.experiences)
    ? data.experiences
    : [];

  return (
    <section id="experience" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInView>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-blue-600 to-purple-600" />
            <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase">Experience</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-16">
            {data?.heading || 'Professional Experience'}
          </h2>
        </FadeInView>

        {/* Empty state */}
        {experiences.length === 0 && (
          <FadeInView>
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">No experience added yet</p>
            </div>
          </FadeInView>
        )}

        <div className="space-y-8">
          {experiences.map((exp: any, idx: number) => (
            <FadeInView key={exp?.id || idx} delay={idx * 0.1}>
              <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all duration-300 group">
                {/* Left accent line */}
                <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {exp?.position || 'Position'}
                    </h3>
                    <div className="flex items-center gap-3 text-slate-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{exp?.company || 'Company'}</span>
                      </div>
                      {(exp?.startDate || exp?.endDate) && (
                        <>
                          <span className="text-slate-600">•</span>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{exp?.startDate || ''} - {exp?.endDate || 'Present'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 mb-4 leading-relaxed">
                  {exp?.description || ''}
                </p>

                {/* Responsibilities */}
                {Array.isArray(exp?.responsibilities) && exp?.responsibilities?.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {exp?.responsibilities?.map((resp: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Technologies */}
                {Array.isArray(exp?.technologies) && exp?.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp?.technologies?.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SKILLS SECTION (Pills/Tags, Visually Structured)
// ═══════════════════════════════════════════════════════════════════════════

function SkillsSection({ section }: any) {
  // Safe data access - prevent crashes
  const data = ((section as any)?.content || (section as any)?.data || {}) as any;
  const skills = Array.isArray(data?.skills) ? data?.skills : [];

  return (
    <section id="skills" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInView>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-blue-600 to-purple-600" />
            <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase">Skills</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-16">
            {data?.heading || 'Skills & Expertise'}
          </h2>
        </FadeInView>

        {/* Empty state */}
        {skills.length === 0 && (
          <FadeInView>
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">No skills added yet</p>
            </div>
          </FadeInView>
        )}

        <FadeInView delay={0.1}>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill: string, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-slate-200 font-medium hover:bg-white/10 hover:border-white/20 hover:text-white hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
              >
                {skill || ''}
              </motion.div>
            ))}
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EDUCATION SECTION
// ═══════════════════════════════════════════════════════════════════════════

function EducationSection({ section }: any) {
  // Safe data access - prevent crashes
  const data = ((section as any)?.content || (section as any)?.data || {}) as any;
  const education = Array.isArray(data.education)
    ? data.education
    : [];

  return (
    <section id="education" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInView>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-blue-600 to-purple-600" />
            <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase">Education</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-16">
            {data?.heading || 'Education'}
          </h2>
        </FadeInView>

        {education.length === 0 && (
          <FadeInView>
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">No education added yet</p>
            </div>
          </FadeInView>
        )}

        <div className="space-y-6">
          {education.map((edu: any, idx: number) => (
            <FadeInView key={edu?.id || idx} delay={idx * 0.1}>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-7 h-7 text-blue-400" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {edu?.degree || 'Degree'} {edu?.field && `in ${edu?.field}`}
                    </h3>
                    <div className="flex items-center gap-3 text-slate-400 mb-3">
                      <span className="font-medium">{edu?.institution || 'Institution'}</span>
                      {(edu?.startDate || edu?.endDate) && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span>{edu?.startDate || ''} - {edu?.endDate || 'Present'}</span>
                        </>
                      )}
                    </div>

                    {Array.isArray(edu?.coursework) && edu?.coursework?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {edu?.coursework?.map((course: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT SECTION (Clean CTA)
// ═══════════════════════════════════════════════════════════════════════════

function ContactSection({ section }: any) {
  // Safe data access - prevent crashes
  const data = ((section as any)?.content || (section as any)?.data || {}) as any;
  const socialLinks = Array.isArray(data?.socialLinks) ? data?.socialLinks : [];

  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <FadeInView>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-blue-600 to-purple-600" />
            <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase">Get In Touch</span>
            <div className="w-12 h-px bg-gradient-to-l from-blue-600 to-purple-600" />
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {data?.heading || "Let's Work Together"}
          </h2>

          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            {data?.availability || 'Available for freelance projects, collaborations, and full-time opportunities.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {data?.email && (
              <a
                href={`mailto:${data?.email}`}
                className="px-10 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-3"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </a>
            )}

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((link: any, idx: number) => {
                  const icons: Record<string, any> = {
                    github: <Github className="w-5 h-5" />,
                    linkedin: <Linkedin className="w-5 h-5" />,
                    twitter: <Twitter className="w-5 h-5" />,
                  };
                  const icon = link?.platform ? icons[link.platform] : null;
                  if (!icon || !link?.url) return null;
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    >
                      {icon}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════

function Footer({ heroName }: { heroName?: string }) {
  return (
    <footer className="relative py-12 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-slate-400">
          © {new Date().getFullYear()} {heroName || 'Your Name'}. All rights reserved.
        </p>
        <p className="text-slate-500 text-sm mt-2">
          Built with passion and precision
        </p>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN TEMPLATE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function EliteProTemplate({
  data,
  isPreview = false,
  sections: editorSections,
  renderSection,
}: EliteProTemplateProps) {
  const editorContext = React.useContext(EditorContext);
  const isEditing = !!editorContext;
  const [isEditorRoute, setIsEditorRoute] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsEditorRoute(window.location.pathname.startsWith('/editor-v2'));
  }, []);

  // Create mock sections from data for preview mode
  const createMockSections = (): EditorSection[] => {
    if (!data) return [];
    const mockSections: EditorSection[] = [];
    let order = 0;

    // Helper to create a mock section
    const createSection = (type: string, sectionData: any): EditorSection => ({
      id: `${type}-preview`,
      type: type as any,
      order: order++,
      data: sectionData,
      styling: {
        backgroundColor: 'transparent',
        textColor: '#FFFFFF',
        padding: { top: '4rem', right: '2rem', bottom: '4rem', left: '2rem' },
        margin: { top: '0', bottom: '0' },
        alignment: 'left',
        layout: 'default',
        animation: { type: 'fade', duration: 600, delay: 200 }
      },
      isEditable: false,
    });

    // Always create all required sections in strict order
    mockSections.push(createSection('hero', data?.hero || {}));
    mockSections.push(createSection('about', data?.about || {}));
    mockSections.push(createSection('experience', data?.experience || {}));
    mockSections.push(createSection('projects', data?.projects || {}));
    mockSections.push(createSection('skills', data?.skills || {}));
    mockSections.push(createSection('education', data?.education || {}));
    mockSections.push(createSection('contact', data?.contact || {}));

    return mockSections;
  };

  // Use editor sections, or create mock sections from data for preview
  const sections = editorSections?.length ? editorSections : createMockSections();

  // Ensure all required sections exist and preserve strict order
  const sectionDefaults: Record<string, any> = {
    hero: data?.hero || {},
    about: data?.about || {},
    experience: data?.experience || {},
    projects: data?.projects || {},
    skills: data?.skills || {},
    education: data?.education || {},
    contact: data?.contact || {},
  };

  const makeFallbackSection = (type: string, order: number): EditorSection => ({
    id: `${type}-fallback`,
    type: type as any,
    order,
    data: sectionDefaults[type] || {},
    styling: {
      backgroundColor: 'transparent',
      textColor: '#FFFFFF',
      padding: { top: '4rem', right: '2rem', bottom: '4rem', left: '2rem' },
      margin: { top: '0', bottom: '0' },
      alignment: 'left',
      layout: 'default',
      animation: { type: 'fade', duration: 600, delay: 200 }
    },
    isEditable: false,
  });

  const getRequiredSection = (type: string, order: number): EditorSection => {
    return sections.find(s => s.type === type) || makeFallbackSection(type, order);
  };

  const heroSection = getRequiredSection('hero', 0);
  const aboutSection = getRequiredSection('about', 1);
  const experienceSection = getRequiredSection('experience', 2);
  const projectsSection = getRequiredSection('projects', 3);
  const skillsSection = getRequiredSection('skills', 4);
  const educationSection = getRequiredSection('education', 5);
  const contactSection = getRequiredSection('contact', 6);
  const navSection = sections.find(s => s.type === 'navbar');

  const heroName = (heroSection?.data as any)?.fullName;
  const isInsideCanvas = isEditing || isEditorRoute;

  const renderSectionContent = (section: EditorSection | undefined, Component: any) => {
    if (!section) return null;

    const content = (
      <Component
        section={section}
        isEditing={isEditing}
      />
    );

    if (renderSection && section) {
      const idx = Math.max(0, sections.indexOf(section));
      return renderSection(section, idx, content);
    }

    return content;
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Glass Navbar */}
      <GlassNavbar
        heroName={heroName}
        navData={navSection?.data}
        isInsideCanvas={isInsideCanvas}
        isPreview={isPreview}
      />

      {/* Sections - Order: Hero → About → Experience → Projects → Skills → Education → Contact */}
      {renderSectionContent(heroSection, HeroSection)}
      {renderSectionContent(aboutSection, AboutSection)}
      {renderSectionContent(experienceSection, ExperienceSection)}
      {renderSectionContent(projectsSection, ProjectsSection)}
      {renderSectionContent(skillsSection, SkillsSection)}
      {renderSectionContent(educationSection, EducationSection)}
      {renderSectionContent(contactSection, ContactSection)}

      {/* Footer */}
      <Footer heroName={heroName} />
    </div>
  );
}
