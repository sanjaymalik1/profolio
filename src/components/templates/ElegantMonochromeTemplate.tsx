/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableImage } from '@/components/editor/inline/EditableImage';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Mail, MapPin, ExternalLink,
  Building2, GraduationCap, Calendar,
  Twitter, Globe, Menu, X, Award
} from 'lucide-react';
import type { EditorSection } from '@/types/editor';
import { EditorContext } from '@/contexts/EditorContext';
import type {
  TemplateData, ProjectsData, Project,
  ExperienceData, Experience, EducationData, Education,
  NavbarData, FooterData
} from '@/types/portfolio';

// ─── Props ───────────────────────────────────────────────────────────────────

interface ElegantMonochromeTemplateProps {
  data?: TemplateData;
  isPreview?: boolean;
  sections?: EditorSection[];
  renderSection?: (section: EditorSection, index: number, content: React.ReactNode) => React.ReactNode;
}

const NAVBAR_SECTION_ORDER: Array<{ type: string; label: string; href: string }> = [
  { type: 'about', label: 'About', href: '#about' },
  { type: 'projects', label: 'Projects', href: '#projects' },
  { type: 'experience', label: 'Experience', href: '#experience' },
  { type: 'skills', label: 'Skills', href: '#skills' },
];

type SkillGroup = { category: string; items: string[] };

function normalizeSkills(skillsData: any): SkillGroup[] {
  const skillCategories = skillsData?.skillCategories;
  if (skillCategories && typeof skillCategories === 'object') {
    const categoryGroups = Object.entries(skillCategories)
      .map(([category, value]) => {
        const itemsSource = Array.isArray(value) ? value : [];
        const items = itemsSource
          .map((item: unknown) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object' && typeof (item as { name?: unknown }).name === 'string') {
              return (item as { name: string }).name;
            }
            return '';
          })
          .filter((item): item is string => item.trim().length > 0);

        if (items.length === 0) return null;

        const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        return { category: normalizedCategory, items };
      })
      .filter((group): group is SkillGroup => !!group);

    if (categoryGroups.length > 0) return categoryGroups;
  }

  const rawSkills = skillsData?.content?.skills ?? skillsData?.skills ?? [];

  if (Array.isArray(rawSkills)) {
    if (rawSkills.every((skill) => typeof skill === 'string')) {
      const items = rawSkills.filter((skill): skill is string => typeof skill === 'string' && skill.trim().length > 0);
      return items.length > 0 ? [{ category: 'Skills', items }] : [];
    }

    if (rawSkills.every((skill) => skill && typeof skill === 'object' && typeof (skill as { name?: unknown }).name === 'string')) {
      const grouped = rawSkills.reduce<Record<string, string[]>>((acc, skill) => {
        const typedSkill = skill as { name: string; category?: string };
        const key = typedSkill.category && typedSkill.category.trim().length > 0 ? typedSkill.category : 'Skills';
        if (!acc[key]) acc[key] = [];
        if (typedSkill.name.trim().length > 0) acc[key].push(typedSkill.name);
        return acc;
      }, {});

      return Object.entries(grouped)
        .map(([category, items]) => ({ category, items }))
        .filter((group) => group.items.length > 0);
    }

    const groups = rawSkills
      .map((group: any) => {
        const category = typeof group?.category === 'string' && group.category.trim().length > 0
          ? group.category
          : 'Skills';
        const itemsSource = Array.isArray(group?.items)
          ? group.items
          : Array.isArray(group?.skills)
            ? group.skills
            : [];
        const items = itemsSource.filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0);
        return items.length > 0 ? { category, items } : null;
      })
      .filter((group): group is SkillGroup => !!group);

    return groups;
  }

  if (rawSkills && typeof rawSkills === 'object') {
    const groups = Object.entries(rawSkills)
      .map(([category, value]) => {
        const itemsSource = Array.isArray(value) ? value : [];
        const items = itemsSource.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
        return items.length > 0 ? { category, items } : null;
      })
      .filter((group): group is SkillGroup => !!group);

    return groups;
  }

  return [];
}

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
  }),
};

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-12 h-px bg-black" />
      <span className="text-sm font-medium tracking-[0.2em] uppercase text-black">
        {children}
      </span>
      <span className="w-12 h-px bg-black" />
    </div>
  );
}

// ─── Social Links ─────────────────────────────────────────────────────────────

function SocialLinks({ socialLinks }: { socialLinks?: Array<{ platform: string; url: string }> }) {
  const getIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p === 'github') return Github;
    if (p === 'linkedin') return Linkedin;
    if (p === 'twitter' || p === 'x') return Twitter;
    if (p === 'email') return Mail;
    return Globe;
  };

  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((link, idx) => {
        const Icon = getIcon(link.platform);
        return (
          <motion.a
            key={idx}
            href={link.url}
            target={link.platform === 'email' ? undefined : '_blank'}
            rel={link.platform === 'email' ? undefined : 'noopener noreferrer'}
            className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
          </motion.a>
        );
      })}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function NavbarContent({
  navData,
  isPreview,
  isInsideCanvas,
  heroName,
}: {
  navData: NavbarData;
  isPreview: boolean;
  isInsideCanvas: boolean;
  heroName?: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const configuredHrefs = new Set((navData?.links || []).map((link) => link.href));
  const links = NAVBAR_SECTION_ORDER
    .filter(({ href }) => configuredHrefs.size === 0 || configuredHrefs.has(href))
    .map(({ label, href }) => ({ label, href }));

  const ctaLabel = navData?.cta?.label || 'Contact';
  const ctaHref = navData?.cta?.href || '#contact';
  const logoName = heroName || 'Portfolio';

  useEffect(() => {
    if (isPreview || isInsideCanvas) return;

    const sections = ['about', 'projects', 'experience', 'skills'];
    const visibilityMap = new Map<string, number>();

    const updateActiveSection = () => {
      let maxVisibility = 0;
      let mostVisibleSection = '';

      visibilityMap.forEach((visibility, sectionId) => {
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleSection = sectionId;
        }
      });

      if (maxVisibility > 0.3) {
        setActiveSection(mostVisibleSection);
      } else {
        setActiveSection('');
      }
    };

    const observers: IntersectionObserver[] = [];

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
          threshold: Array.from({ length: 11 }, (_, i) => i * 0.1),
          rootMargin: '-64px 0px -50% 0px',
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [isPreview, isInsideCanvas]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isPreview || isInsideCanvas) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    setMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div className="w-full border-b border-black/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-light tracking-wider">{logoName}</div>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link, idx) => {
              const isActive = !isInsideCanvas && activeSection === link.href.replace('#', '');
              return (
                <a
                  key={idx}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm tracking-wide transition-colors duration-200 relative ${
                    isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[17px] left-0 right-0 h-px bg-black"
                      initial={false}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  )}
                </a>
              );
            })}
            {navData?.cta && (
              <a
                href={ctaHref}
                onClick={(e) => handleNavClick(e, ctaHref)}
                className="px-5 py-2 border border-black text-sm tracking-wide hover:bg-black hover:text-white transition-colors duration-200"
              >
                {ctaLabel}
              </a>
            )}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center border border-black/20"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-black/10 bg-white overflow-hidden"
          >
            <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3">
              {links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm tracking-wide text-gray-600 hover:text-black transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              {navData?.cta && (
                <a
                  href={ctaHref}
                  onClick={(e) => handleNavClick(e, ctaHref)}
                  className="px-5 py-2 border border-black text-sm tracking-wide hover:bg-black hover:text-white transition-colors text-center"
                >
                  {ctaLabel}
                </a>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StickyNavbar({
  navData,
  isPreview,
  heroName,
}: {
  navData: NavbarData;
  isPreview: boolean;
  heroName?: string;
}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <NavbarContent navData={navData} isPreview={isPreview} isInsideCanvas={false} heroName={heroName} />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({
  heroData,
  isPreview,
  sectionId,
}: {
  heroData: any;
  isPreview: boolean;
  sectionId?: string;
}) {
  const editorContext = React.useContext(EditorContext);
  const inlineEditMode = isPreview && !!editorContext && !!sectionId;

  const fullName = heroData?.fullName || 'Victoria Sterling';
  const title = heroData?.title || 'Business Consultant & Strategy Expert';
  const bio = heroData?.bio || 'Transforming businesses through strategic consulting.';
  const location = heroData?.location || 'London, UK';
  const socialLinks = heroData?.socialLinks || [];
  const profileImage = heroData?.profileImage || '';
  const heroInitial = (fullName || '').trim().charAt(0).toUpperCase() || '?';

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex flex-col items-center text-center space-y-8"
        >
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 border-2 border-black overflow-hidden">
              {inlineEditMode ? (
                <EditableImage
                  value={profileImage}
                  onChange={(url) => {
                    editorContext.dispatch({
                      type: 'UPDATE_SECTION_DATA',
                      payload: { sectionId, data: { profileImage: url } },
                    });
                  }}
                  alt={fullName}
                  emptyStateContent={<span className="text-4xl font-light text-gray-600">{heroInitial}</span>}
                  emptyStateClassName="w-full h-full"
                  aspectRatio="square"
                />
              ) : profileImage ? (
                <img
                  src={profileImage}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-4xl font-light text-gray-600">
                    {heroInitial}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4">
              {inlineEditMode ? (
                <EditableText
                  value={fullName}
                  onChange={(value) =>
                    editorContext.dispatch({
                      type: 'UPDATE_SECTION_DATA',
                      payload: { sectionId, data: { fullName: value } },
                    })
                  }
                  placeholder="Your Name"
                  className="outline-none focus:ring-2 focus:ring-black/20 rounded px-2 -mx-2"
                  as="span"
                />
              ) : (
                fullName
              )}
            </h1>
            <p className="text-xl text-gray-600 tracking-wide mb-2">
              {inlineEditMode ? (
                <EditableText
                  value={title}
                  onChange={(value) =>
                    editorContext.dispatch({
                      type: 'UPDATE_SECTION_DATA',
                      payload: { sectionId, data: { title: value } },
                    })
                  }
                  placeholder="Your Title"
                  className="outline-none focus:ring-2 focus:ring-black/20 rounded px-2 -mx-2"
                  as="span"
                />
              ) : (
                title
              )}
            </p>
            {location && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="max-w-2xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              {inlineEditMode ? (
                <EditableText
                  value={bio}
                  onChange={(value) =>
                    editorContext.dispatch({
                      type: 'UPDATE_SECTION_DATA',
                      payload: { sectionId, data: { bio: value } },
                    })
                  }
                  placeholder="Your bio"
                  className="outline-none focus:ring-2 focus:ring-black/20 rounded px-2 -mx-2"
                  as="span"
                  multiline={true}
                />
              ) : (
                bio
              )}
            </p>
          </div>

          {/* Social Links */}
          <SocialLinks socialLinks={socialLinks} />
        </motion.div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection({ aboutData, isPreview }: { aboutData: any; isPreview: boolean }) {
  const heading = aboutData?.heading || 'About Me';
  const content = aboutData?.content || 'Professional background and expertise.';
  const highlights = aboutData?.highlights || [];

  return (
    <section id="about" className="py-20 bg-gray-50" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <SectionLabel>{heading}</SectionLabel>

          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">{content}</p>

            {highlights && highlights.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                {highlights.map((highlight: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-black mt-3 flex-shrink-0" />
                    <p className="text-gray-700">{highlight}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExperienceSection({ experienceData, isPreview }: { experienceData: ExperienceData; isPreview: boolean }) {
  const heading = experienceData?.heading || 'Experience';
  const experiences = experienceData?.experiences || [];

  if (experiences.length === 0) {
    return (
      <section id="experience" className="py-20 bg-white" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionLabel>{heading}</SectionLabel>
          <p className="text-center text-gray-500">No experience added yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-white" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <SectionLabel>{heading}</SectionLabel>

          <div className="space-y-12">
            {experiences.map((exp: Experience, idx: number) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={idx * 0.1}
                className="border-l-2 border-black/20 pl-6 relative"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 border-2 border-black bg-white" />

                <div className="space-y-2">
                  <h3 className="text-xl font-medium tracking-wide">{exp.position}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
                    </div>
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>
                  )}
                  <p className="text-gray-700 mt-3">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection({ projectsData, isPreview, sectionId }: { projectsData: ProjectsData; isPreview: boolean; sectionId?: string }) {
  const editorContext = React.useContext(EditorContext);
  const inlineEditMode = isPreview && !!editorContext && !!sectionId;
  const heading = projectsData?.heading || 'Projects';
  const projects = projectsData?.projects || [];

  const handleProjectImageChange = (projectIndex: number, imageUrl: string) => {
    if (!editorContext || !sectionId) return;

    const updatedProjects = projects.map((project: Project, index: number) => {
      if (index !== projectIndex) return project;
      return {
        ...project,
        images: imageUrl ? [imageUrl] : [],
      };
    });

    editorContext.dispatch({
      type: 'UPDATE_SECTION_DATA',
      payload: {
        sectionId,
        data: { projects: updatedProjects },
      },
    });
  };

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-20 bg-gray-50" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>{heading}</SectionLabel>
          <p className="text-center text-gray-500">No projects added yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gray-50" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <SectionLabel>{heading}</SectionLabel>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project: Project, idx: number) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={idx * 0.1}
                className="border border-black/10 bg-white overflow-hidden hover:border-black/30 transition-colors duration-200"
              >
                {inlineEditMode ? (
                  <div className="relative h-48 overflow-hidden bg-gray-100 border-b border-black/10">
                    <EditableImage
                      value={project.images?.[0] || ''}
                      onChange={(url) => handleProjectImageChange(idx, url)}
                      alt={project.title || `Project ${idx + 1}`}
                      containerClassName="absolute inset-0 w-full h-full !min-h-0"
                      className="w-full h-full object-cover !min-h-0"
                      emptyStateContent={
                        <span className="text-4xl font-light text-gray-600 select-none uppercase">
                          {(project.title || '').trim().charAt(0).toUpperCase() || '?'}
                        </span>
                      }
                      emptyStateClassName="w-full h-full"
                      aspectRatio="auto"
                    />
                  </div>
                ) : project.images?.[0] ? (
                  <div className="relative h-48 overflow-hidden bg-gray-100 border-b border-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.images[0]}
                      alt={project.title || 'Project'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 border-b border-black/10 flex items-center justify-center">
                    <span className="text-4xl font-light text-gray-600 select-none uppercase">
                      {(project.title || '').trim().charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}

                <div className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium tracking-wide">{project.title}</h3>
                  <p className="text-gray-700">{project.description}</p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="px-3 py-1 text-xs border border-black/20 tracking-wide"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 pt-2">
                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:text-gray-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:text-gray-600 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function SkillsSection({ skillsData, isPreview }: { skillsData: any; isPreview: boolean }) {
  const heading = skillsData?.heading || 'Skills';
  const skills = normalizeSkills(skillsData);

  if (skills.length === 0) {
    return (
      <section id="skills" className="py-20 bg-white" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionLabel>{heading}</SectionLabel>
          <p className="text-center text-gray-500">No skills added yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-white" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <SectionLabel>{heading}</SectionLabel>

          <div className="space-y-8">
            {skills.map((skillGroup: any, idx: number) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-lg font-medium tracking-wide flex items-center gap-3">
                  <Award className="w-5 h-5" />
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-3 pl-8">
                  {skillGroup.items?.map((skill: string, skillIdx: number) => (
                    <span
                      key={skillIdx}
                      className="px-4 py-2 border border-black/20 text-sm tracking-wide"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────

function EducationSection({ educationData, isPreview }: { educationData: EducationData; isPreview: boolean }) {
  const heading = educationData?.heading || 'Education';
  const education = educationData?.education || [];

  if (education.length === 0) {
    return (
      <section id="education" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <SectionLabel>{heading}</SectionLabel>
          <p className="text-center text-gray-500">No education added yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <SectionLabel>{heading}</SectionLabel>

          <div className="space-y-8">
            {education.map((edu: Education, idx: number) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={idx * 0.1}
                className="border border-black/10 bg-white p-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-medium tracking-wide">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>{edu.institution}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.startDate} - {edu.endDate || 'Present'}</span>
                    </div>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 mt-2">GPA: {edu.gpa}</p>
                  )}
                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {edu.coursework.map((course, courseIdx) => (
                        <span
                          key={courseIdx}
                          className="px-3 py-1 text-xs border border-black/20 tracking-wide"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection({ contactData, isPreview }: { contactData: any; isPreview: boolean }) {
  const heading = contactData?.heading || 'Get In Touch';
  const content = contactData?.content || "Let's connect and discuss how we can work together.";
  const email = contactData?.email || '';
  const socialLinks = contactData?.socialLinks || [];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center space-y-8"
        >
          <SectionLabel>{heading}</SectionLabel>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto">{content}</p>

          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors duration-200 text-lg"
            >
              <Mail className="w-5 h-5" />
              <span>{email}</span>
            </a>
          )}

          {socialLinks && socialLinks.length > 0 && (
            <div className="flex justify-center">
              <SocialLinks socialLinks={socialLinks} />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function FooterContent({ footerData, heroName }: { footerData: FooterData; heroName?: string }) {
  const displayName = heroName || 'Portfolio';
  const copyrightText = (footerData?.copyrightText || '').trim() || `© ${new Date().getFullYear()} All rights reserved.`;

  return (
    <footer className="border-t border-black/10 bg-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm tracking-wide text-gray-700">{displayName}</p>
          <p className="text-sm text-gray-600">{copyrightText}</p>
          {footerData?.links && footerData.links.length > 0 && (
            <div className="flex items-center gap-6">
              {footerData.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

// ─── Main Template ────────────────────────────────────────────────────────────

export function ElegantMonochromeTemplate({
  data,
  isPreview = false,
  sections,
  renderSection,
}: ElegantMonochromeTemplateProps) {
  const heroData = data?.hero || {
    fullName: 'Victoria Sterling',
    title: 'Business Consultant & Strategy Expert',
    bio: 'Transforming businesses through strategic consulting and innovative solutions.',
    profileImage: '',
    location: 'London, UK',
    socialLinks: [],
  };

  const aboutData = data?.about || {
    heading: 'About Me',
    content: 'Professional background and expertise.',
    highlights: [],
  };

  const experienceData = (data?.experience || {
    heading: 'Experience',
    experiences: [],
  }) as ExperienceData;

  const projectsData = (data?.projects || {
    heading: 'Projects',
    projects: [],
  }) as ProjectsData;

  const skillsData = data?.skills || {
    heading: 'Skills',
    skills: [],
  };

  const educationData = (data?.education || {
    heading: 'Education',
    education: [],
  }) as EducationData;

  const contactData = data?.contact || {
    heading: 'Get In Touch',
    content: "Let's connect.",
    email: '',
    socialLinks: [],
  };

  const navData = (data?.navbar || {
    name: 'Portfolio',
    links: NAVBAR_SECTION_ORDER.map(({ label, href }) => ({ label, href })),
    cta: { label: 'Contact', href: '#contact' },
  }) as NavbarData;

  const footerData = (data?.footer || {
    name: 'Portfolio',
    links: [],
  }) as FooterData;

  // Extract live hero name from sections
  let liveHeroName = heroData.fullName;
  if (sections) {
    const heroSection = sections.find((s) => s.type === 'hero');
    if (heroSection?.data) {
      liveHeroName = (heroSection.data as any).fullName || heroData.fullName;
    }
  }

  // ─── Section-based rendering (for editor) ────────────────────────────────────

  if (sections) {
    const existingSectionTypes = new Set(sections.map((section) => section.type));
    const syncedNavbarLinks = NAVBAR_SECTION_ORDER
      .filter(({ type }) => existingSectionTypes.has(type))
      .map(({ label, href }) => ({ label, href }));
    const navbarSection = sections.find((section) => section.type === 'navbar');
    const hasNavbar = !!navbarSection;

    return (
      <div className="bg-white text-black min-h-screen">
        {hasNavbar && !isPreview && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <NavbarContent
              navData={{ ...(navbarSection.data as NavbarData), links: syncedNavbarLinks }}
              isPreview={false}
              isInsideCanvas={false}
              heroName={liveHeroName}
            />
          </div>
        )}

        {sections.map((section, index) => {
          let content: React.ReactNode = null;

          switch (section.type) {
            case 'navbar': {
              if (!isPreview) {
                content = <React.Fragment key={section.id} />;
                break;
              }

              const d = section.data as NavbarData;
              const syncedNavData: NavbarData = {
                ...d,
                links: syncedNavbarLinks,
              };
              content = (
                <div key={section.id} className="sticky top-0 z-50">
                  <NavbarContent
                    navData={syncedNavData}
                    isPreview={isPreview}
                    isInsideCanvas={true}
                    heroName={liveHeroName}
                  />
                </div>
              );
              break;
            }

            case 'hero': {
              const d = section.data as any;
              content = (
                <HeroSection
                  key={`hero-${section.id}-${d?.profileImage || 'no-img'}`}
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
                <AboutSection key={section.id} aboutData={d} isPreview={isPreview} />
              );
              break;
            }

            case 'experience': {
              const d = section.data as ExperienceData;
              content = (
                <ExperienceSection key={section.id} experienceData={d} isPreview={isPreview} />
              );
              break;
            }

            case 'projects': {
              const d = section.data as ProjectsData;
              content = (
                <ProjectsSection key={section.id} projectsData={d} isPreview={isPreview} sectionId={section.id} />
              );
              break;
            }

            case 'skills': {
              const d = section.data as any;
              content = (
                <SkillsSection key={section.id} skillsData={d} isPreview={isPreview} />
              );
              break;
            }

            case 'education': {
              const d = section.data as EducationData;
              content = (
                <EducationSection key={section.id} educationData={d} isPreview={isPreview} />
              );
              break;
            }

            case 'contact': {
              const d = section.data as any;
              content = (
                <ContactSection key={section.id} contactData={d} isPreview={isPreview} />
              );
              break;
            }

            case 'footer': {
              const d = section.data as FooterData;
              content = (
                <FooterContent key={section.id} footerData={d} heroName={liveHeroName} />
              );
              break;
            }

            default:
              content = null;
          }

          if (!content) return null;

          return renderSection ? renderSection(section, index, content) : content;
        })}
      </div>
    );
  }

  // ─── Standalone rendering (for public page) ──────────────────────────────────

  return (
    <div className="bg-white text-black min-h-screen">
      <StickyNavbar navData={navData} isPreview={isPreview} heroName={heroData.fullName} />
      <HeroSection heroData={heroData} isPreview={isPreview} />
      <AboutSection aboutData={aboutData} isPreview={isPreview} />
      <ExperienceSection experienceData={experienceData} isPreview={isPreview} />
      <ProjectsSection projectsData={projectsData} isPreview={isPreview} />
      <SkillsSection skillsData={skillsData} isPreview={isPreview} />
      <EducationSection educationData={educationData} isPreview={isPreview} />
      <ContactSection contactData={contactData} isPreview={isPreview} />
      <FooterContent footerData={footerData} heroName={heroData.fullName} />
    </div>
  );
}
