/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  ExternalLink,
  ArrowRight,
  Calendar,
  Building2,
  GraduationCap,
  Globe,
  Twitter,
  ChevronRight,
} from 'lucide-react';
import type { EditorSection } from '@/types/editor';
import type {
  TemplateData,
  ProjectsData,
  Project,
  ExperienceData,
  Experience,
  EducationData,
  Education,
} from '@/types/portfolio';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ExecutiveProTemplateProps {
  data?: TemplateData;
  isPreview?: boolean;
  sections?: EditorSection[];
  renderSection?: (section: EditorSection, index: number, content: React.ReactNode) => React.ReactNode;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const container = 'max-w-5xl mx-auto px-6';
const sectionPy = 'py-24';

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-14">
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">{title}</h2>
      {subtitle && <p className="text-slate-500 text-base max-w-xl">{subtitle}</p>}
      <div className="mt-4 w-10 h-0.5 bg-slate-900" />
    </div>
  );
}

function TechBadge({ label }: { label: string }) {
  return (
    <span className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full border border-slate-200">
      {label}
    </span>
  );
}

function SocialLink({ platform, url, isPreview }: { platform: string; url: string; isPreview: boolean }) {
  const icons: Record<string, React.ReactNode> = {
    github: <Github className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    website: <Globe className="w-4 h-4" />,
  };
  const icon = icons[platform];
  if (!icon) return null;
  return (
    <a
      href={isPreview ? undefined : url}
      onClick={(e) => isPreview && e.preventDefault()}
      target={!isPreview ? '_blank' : undefined}
      rel={!isPreview ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
    >
      {icon}
    </a>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ name, isPreview }: { name: string; isPreview: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isPreview) return;
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [isPreview]);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
  ];

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
          {name}
        </a>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-7">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={isPreview ? undefined : href}
              onClick={(e) => isPreview && e.preventDefault()}
              className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors duration-200"
            >
              {label}
            </a>
          ))}
          <a
            href={isPreview ? undefined : '#contact'}
            onClick={(e) => isPreview && e.preventDefault()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
          >
            Hire me
          </a>
        </nav>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ heroData, isPreview }: { heroData: any; isPreview: boolean }) {
  return (
    <section className="bg-white pt-16 pb-24 px-6">
      <div className={container}>
        <div className="max-w-3xl">
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open to new opportunities
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-none mb-5"
          >
            {heroData.fullName}
          </motion.h1>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-500 font-medium mb-6"
          >
            {heroData.title}
          </motion.p>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base text-slate-600 leading-relaxed max-w-xl mb-4"
          >
            {heroData.bio}
          </motion.p>

          {/* Location */}
          {heroData.location && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-1.5 text-sm text-slate-400 mb-10"
            >
              <MapPin className="w-4 h-4" />
              <span>{heroData.location}</span>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="flex flex-wrap items-center gap-3 mb-12"
          >
            <a
              href={isPreview ? undefined : '#projects'}
              onClick={(e) => isPreview && e.preventDefault()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
              View Projects
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={isPreview ? undefined : '#contact'}
              onClick={(e) => isPreview && e.preventDefault()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 text-sm font-semibold rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
            >
              Contact me
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="flex items-center gap-2"
          >
            {(heroData.socialLinks || []).map((link: { platform: string; url: string }, i: number) => (
              <SocialLink key={i} platform={link.platform} url={link.url} isPreview={isPreview} />
            ))}
          </motion.div>
        </div>

        {/* Decorative grid */}
        <div
          className="absolute right-0 inset-y-0 -z-0 w-1/2 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(226 232 240) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to right, transparent 0%, white 40%, white 60%, transparent 100%)',
          }}
        />
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection({ aboutData }: { aboutData: any }) {
  return (
    <section id="about" className={`${sectionPy} px-6 bg-slate-50`}>
      <div className={container}>
        <SectionHeading title={aboutData.heading || 'About Me'} />
        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Text */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              {aboutData.content}
            </p>

            {(aboutData.highlights || []).length > 0 && (
              <ul className="space-y-3">
                {(aboutData.highlights || []).map((h: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex items-start gap-3 text-slate-700 text-sm"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    {h}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Quick facts panel */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
                Quick Facts
              </h3>
              <div className="space-y-4 text-sm">
                {(aboutData.personalInfo?.location || aboutData.location) && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {aboutData.personalInfo?.location || aboutData.location}
                  </div>
                )}
                {(aboutData.personalInfo?.languages || []).length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1.5">Languages</p>
                    <div className="flex flex-wrap gap-1.5">
                      {aboutData.personalInfo.languages.map((l: string, i: number) => (
                        <TechBadge key={i} label={l} />
                      ))}
                    </div>
                  </div>
                )}
                {(aboutData.personalInfo?.interests || []).length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1.5">Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {aboutData.personalInfo.interests.map((l: string, i: number) => (
                        <TechBadge key={i} label={l} />
                      ))}
                    </div>
                  </div>
                )}
                {aboutData.quote && (
                  <blockquote className="border-l-2 border-slate-300 pl-4 text-slate-500 italic text-xs leading-relaxed mt-4">
                    {aboutData.quote}
                  </blockquote>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExperienceSection({ experienceData }: { experienceData: ExperienceData }) {
  if (!experienceData.experiences || experienceData.experiences.length === 0) return null;
  return (
    <section id="experience" className={`${sectionPy} px-6 bg-white`}>
      <div className={container}>
        <SectionHeading title={experienceData.heading || 'Experience'} />
        <div className="relative">
          {/* Timeline track */}
          <div className="absolute top-0 bottom-0 left-[7px] w-px bg-slate-200 hidden sm:block" />

          <div className="space-y-10">
            {experienceData.experiences.map((exp: Experience, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="sm:pl-8 relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-5 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-400 hidden sm:block" />

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{exp.position}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {exp.company}
                        {exp.location && <span className="text-slate-400">· {exp.location}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.startDate} — {exp.endDate || 'Present'}
                    </div>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{exp.description}</p>
                  )}

                  {/* Responsibilities */}
                  {(exp.responsibilities || []).length > 0 && (
                    <ul className="space-y-1.5 mb-4">
                      {exp.responsibilities.map((r, ri) => (
                        <li key={ri} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-slate-300 mt-1.5">▸</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  {(exp.technologies || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                      {exp.technologies!.map((t, ti) => (
                        <TechBadge key={ti} label={t} />
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

// ─── Skills ───────────────────────────────────────────────────────────────────

function SkillsSection({ skillsData }: { skillsData: any }) {
  const technical = skillsData.skillCategories?.technical || [];
  const tools = skillsData.skillCategories?.tools || [];
  const soft = skillsData.skillCategories?.soft || [];
  const languages = skillsData.skillCategories?.languages || [];

  const groups = [
    { label: 'Core Technologies', items: technical },
    { label: 'Tools & Infrastructure', items: tools },
    { label: 'Soft Skills', items: soft },
    { label: 'Languages', items: languages },
  ].filter((g) => g.items.length > 0);

  return (
    <section id="skills" className={`${sectionPy} px-6 bg-slate-50`}>
      <div className={container}>
        <SectionHeading title={skillsData.heading || 'Skills'} />
        <div className="grid sm:grid-cols-2 gap-8">
          {groups.map((group) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill: { name: string }, si: number) => (
                  <motion.span
                    key={si}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: si * 0.04 }}
                    className="inline-flex items-center px-3.5 py-1.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors duration-150 cursor-default"
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection({ projectsData, isPreview }: { projectsData: ProjectsData; isPreview: boolean }) {
  return (
    <section id="projects" className={`${sectionPy} px-6 bg-white`}>
      <div className={container}>
        <SectionHeading title={projectsData.heading || 'Projects'} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(projectsData.projects || []).map((project: Project, i: number) => (
            <motion.article
              key={project.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300"
            >
              {/* Card image placeholder */}
              <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                {/* Abstract geometric pattern */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(203 213 225) 1px, transparent 0)',
                  backgroundSize: '18px 18px',
                }}/>
                <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <span className="text-base font-bold text-slate-700">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Category badge */}
                {project.category && (
                  <span className="absolute top-3 right-3 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                    {project.category}
                  </span>
                )}
              </div>

              <div className="flex flex-col flex-1 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tech stack */}
                {(project.technologies || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((t, ti) => (
                      <TechBadge key={ti} label={t} />
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-xs text-slate-400 self-center">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  {(project.links?.github || project.github) && (
                    <a
                      href={isPreview ? undefined : (project.links?.github || project.github)}
                      onClick={(e) => isPreview && e.preventDefault()}
                      target={!isPreview ? '_blank' : undefined}
                      rel={!isPreview ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Code
                    </a>
                  )}
                  {(project.links?.live || project.link) && (
                    <a
                      href={isPreview ? undefined : (project.links?.live || project.link)}
                      onClick={(e) => isPreview && e.preventDefault()}
                      target={!isPreview ? '_blank' : undefined}
                      rel={!isPreview ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors ml-auto"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────

function EducationSection({ educationData }: { educationData: EducationData }) {
  if (!educationData.education || educationData.education.length === 0) return null;
  return (
    <section id="education" className={`${sectionPy} px-6 bg-slate-50`}>
      <div className={container}>
        <SectionHeading title={educationData.heading || 'Education'} />
        <div className="grid sm:grid-cols-2 gap-5">
          {educationData.education.map((edu: Education, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-100 rounded-xl">
                  <GraduationCap className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <p className="text-sm text-slate-600 mt-0.5">{edu.institution}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {edu.startDate} — {edu.endDate || 'Present'}
                    {edu.gpa && <span className="ml-2">· GPA: {edu.gpa}</span>}
                  </div>
                  {(edu.coursework || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {edu.coursework!.map((c, ci) => <TechBadge key={ci} label={c} />)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection({ contactData, isPreview }: { contactData: any; isPreview: boolean }) {
  return (
    <section id="contact" className={`${sectionPy} px-6 bg-white`}>
      <div className={container}>
        <div className="max-w-xl">
          <SectionHeading title={contactData.heading || "Let's Connect"} />
          <p className="text-base text-slate-500 leading-relaxed mb-10">
            {contactData.availability || "I'm always open to new opportunities, collaborations, and interesting conversations. Feel free to reach out."}
          </p>

          {/* Email CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <a
              href={isPreview ? undefined : `mailto:${contactData.email}`}
              onClick={(e) => isPreview && e.preventDefault()}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              {contactData.email}
            </a>
          </div>

          {/* Location */}
          {contactData.location && (
            <p className="flex items-center gap-1.5 text-sm text-slate-400">
              <MapPin className="w-4 h-4" />
              {contactData.location}
            </p>
          )}

          {/* Social links */}
          {(contactData.socialLinks || []).length > 0 && (
            <div className="flex items-center gap-2 mt-6">
              {contactData.socialLinks.map((link: { platform: string; url: string }, i: number) => (
                <SocialLink key={i} platform={link.platform} url={link.url} isPreview={isPreview} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ name }: { name: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-100 py-8 px-6 bg-white">
      <div className={`${container} flex flex-col sm:flex-row items-center justify-between gap-3`}>
        <p className="text-xs text-slate-400">
          © {year} {name}. All rights reserved.
        </p>
        <p className="text-xs text-slate-300">Built with Profolio</p>
      </div>
    </footer>
  );
}

// ─── Main Template ────────────────────────────────────────────────────────────

export function ExecutiveProTemplate({
  data,
  isPreview = false,
  sections,
  renderSection,
}: ExecutiveProTemplateProps) {

  // Default data for static/preview mode
  const heroData = data?.hero || {
    fullName: 'Alex Morgan',
    title: 'Full-Stack Engineer & Technical Lead',
    bio: 'I build robust, scalable software and lead engineering teams to deliver products users love. Passionate about clean architecture, developer experience, and shipping fast.',
    profileImage: '',
    location: 'San Francisco, CA',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/alexmorgan' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/alexmorgan' },
      { platform: 'email', url: 'mailto:alex@example.com' },
    ],
  };

  const aboutData = data?.about || {
    heading: 'About Me',
    content:
      "I'm a full-stack engineer with 7+ years of experience building production-grade web applications. I specialize in TypeScript, React, and Node.js, and I thrive at the intersection of clean engineering and great product thinking. I've led teams, designed systems, and shipped products used by tens of thousands of people.",
    highlights: [
      '7+ years of production software experience',
      'Led engineering teams of up to 12 people',
      'Built and scaled systems to millions of users',
      'Open source contributor and technical writer',
    ],
  };

  const skillsData = data?.skills || {
    heading: 'Skills',
    skillCategories: {
      technical: [
        { name: 'TypeScript', level: 95 },
        { name: 'React / Next.js', level: 95 },
        { name: 'Node.js', level: 90 },
        { name: 'PostgreSQL', level: 85 },
        { name: 'Python', level: 80 },
        { name: 'GraphQL', level: 82 },
      ],
      tools: [
        { name: 'Docker', level: 88 },
        { name: 'AWS', level: 85 },
        { name: 'Kubernetes', level: 78 },
        { name: 'Terraform', level: 72 },
        { name: 'Redis', level: 80 },
        { name: 'Git / CI/CD', level: 92 },
      ],
      soft: [],
      languages: [],
    },
    skills: [],
  };

  const projectsData: ProjectsData = data?.projects || {
    heading: 'Projects',
    categories: ['Backend', 'Full-Stack', 'Open Source'],
    projects: [
      {
        id: '1',
        title: 'SaaS Analytics Platform',
        description:
          'End-to-end analytics dashboard for SaaS products. Real-time event ingestion, custom funnels, retention charts, and team-level reporting.',
        technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Kafka'],
        images: [],
        links: { github: 'https://github.com', live: 'https://example.com' },
        featured: true,
        category: 'Full-Stack',
        status: 'completed' as const,
      },
      {
        id: '2',
        title: 'Open Source CLI Framework',
        description:
          'A TypeScript-first CLI building framework with plugin architecture, auto-completion, and built-in testing utilities. 2k+ GitHub stars.',
        technologies: ['TypeScript', 'Node.js', 'Oclif'],
        images: [],
        links: { github: 'https://github.com' },
        featured: true,
        category: 'Open Source',
        status: 'completed' as const,
      },
      {
        id: '3',
        title: 'Distributed Task Queue',
        description:
          'High-throughput task queue supporting millions of jobs per day with priority lanes, dead-letter queues, and live monitoring.',
        technologies: ['Go', 'Redis', 'Docker', 'Prometheus'],
        images: [],
        links: { github: 'https://github.com' },
        featured: true,
        category: 'Backend',
        status: 'completed' as const,
      },
    ] as Project[],
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
    heading: "Let's Connect",
    email: 'alex@example.com',
    location: 'San Francisco, CA',
    availability:
      "I'm always open to new opportunities, collaborations, and interesting conversations. Feel free to reach out.",
    socialLinks: [
      { platform: 'github', url: 'https://github.com/alexmorgan' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/alexmorgan' },
    ],
    contactForm: { enabled: false, fields: [] },
  };

  // ── Editor / sections mode ────────────────────────────────────────────────

  if (sections) {
    return (
      <div className={`min-h-screen bg-white text-slate-900 font-sans ${isPreview ? 'pointer-events-none' : ''}`}>
        <Navbar name={heroData.fullName} isPreview={isPreview} />
        {sections.map((section, index) => {
          let content: React.ReactNode = null;

          switch (section.type) {
            case 'hero': {
              content = (
                <React.Fragment key={section.id || index}>
                  <HeroSection heroData={section.data as any} isPreview={isPreview} />
                </React.Fragment>
              );
              break;
            }
            case 'about': {
              content = (
                <React.Fragment key={section.id || index}>
                  <AboutSection aboutData={section.data as any} />
                </React.Fragment>
              );
              break;
            }
            case 'skills': {
              content = (
                <React.Fragment key={section.id || index}>
                  <SkillsSection skillsData={section.data as any} />
                </React.Fragment>
              );
              break;
            }
            case 'experience': {
              content = (
                <React.Fragment key={section.id || index}>
                  <ExperienceSection experienceData={section.data as ExperienceData} />
                </React.Fragment>
              );
              break;
            }
            case 'projects': {
              content = (
                <React.Fragment key={section.id || index}>
                  <ProjectsSection projectsData={section.data as ProjectsData} isPreview={isPreview} />
                </React.Fragment>
              );
              break;
            }
            case 'education': {
              content = (
                <React.Fragment key={section.id || index}>
                  <EducationSection educationData={section.data as EducationData} />
                </React.Fragment>
              );
              break;
            }
            case 'contact': {
              content = (
                <React.Fragment key={section.id || index}>
                  <ContactSection contactData={section.data as any} isPreview={isPreview} />
                </React.Fragment>
              );
              break;
            }
            default:
              return null;
          }

          return renderSection ? renderSection(section, index, content) : content;
        })}
        <Footer name={heroData.fullName} />
      </div>
    );
  }

  // ── Static / preview mode ─────────────────────────────────────────────────

  return (
    <div className={`min-h-screen bg-white text-slate-900 font-sans ${isPreview ? 'pointer-events-none' : ''}`}>
      <Navbar name={heroData.fullName} isPreview={isPreview} />
      <HeroSection heroData={heroData} isPreview={isPreview} />
      <AboutSection aboutData={aboutData} />
      <ExperienceSection experienceData={experienceData} />
      <SkillsSection skillsData={skillsData} />
      <ProjectsSection projectsData={projectsData} isPreview={isPreview} />
      <EducationSection educationData={educationData} />
      <ContactSection contactData={contactData} isPreview={isPreview} />
      <Footer name={heroData.fullName} />
    </div>
  );
}
