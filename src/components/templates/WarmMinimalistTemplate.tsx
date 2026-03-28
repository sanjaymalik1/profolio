/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableImage } from '@/components/editor/inline/EditableImage';
import { updateArrayItem, useTemplateInlineEditor } from './inline-edit-utils';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  Github, Linkedin, Mail, MapPin, ExternalLink,
  Building2, GraduationCap, Calendar, ArrowRight,
  Twitter, Globe, Heart
} from 'lucide-react';
import type { EditorSection } from '@/types/editor';
import type {
  TemplateData, ProjectsData, Project,
  ExperienceData, Experience, EducationData, Education,
  NavbarData
} from '@/types/portfolio';

// ─── Props ───────────────────────────────────────────────────────────────────

interface WarmMinimalistTemplateProps {
  data?: TemplateData;
  isPreview?: boolean;
  sections?: EditorSection[];
  renderSection?: (section: EditorSection, index: number, content: React.ReactNode) => React.ReactNode;
}

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const, delay },
  }),
};

// ─── Social icon map ─────────────────────────────────────────────────────────

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  website: <Globe className="w-4 h-4" />,
};

// ─── Navbar ───────────────────────────────────────────────────────────────────

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ heroData, isPreview, sectionId }: { heroData: any; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
  const heroInitial = (heroData.fullName || '').trim().charAt(0).toUpperCase() || '?';

  const handleScroll = (e: React.MouseEvent, targetId: string) => {
    if (isPreview) { e.preventDefault(); return; }
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 64;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#FAF9F6] via-[#F5EFE7] to-[#FAF9F6]">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="order-1 flex justify-center items-center"
          >
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#E8DCC8]/30 to-[#D4C5AD]/20 blur-2xl" />
              <div className="absolute -inset-1 rounded-full border border-[#E8DCC8]" />
              <div
                className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-[#F5EFE7] to-[#E8DCC8] border-2 border-[#D4C5AD]/50 shadow-xl"
              >
                {inlineEditMode ? (
                  <EditableImage
                    value={heroData.profileImage || ''}
                    onChange={(url) => updateSectionData({ profileImage: url })}
                    alt={heroData.fullName || 'Profile'}
                    containerClassName="absolute inset-0 w-full h-full !min-h-0"
                    className="object-cover !min-h-0"
                    emptyStateContent={<span className="text-7xl md:text-8xl font-bold text-[#C5B5A0] select-none uppercase">{heroInitial}</span>}
                    emptyStateClassName="w-full h-full"
                    aspectRatio="square"
                  />
                ) : heroData.profileImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={heroData.profileImage}
                    alt={heroData.fullName || 'Profile'}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '50%', objectFit: 'cover' as const }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F5EFE7] to-[#E8DCC8]">
                    <span className="text-7xl md:text-8xl font-bold text-[#C5B5A0] select-none uppercase">
                      {heroInitial}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <div className="order-2">
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.1}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#6B5437] leading-[1.05] tracking-tight mb-4 max-w-full break-words"
            >
              {inlineEditMode ? (
                <EditableText
                  value={heroData.fullName || ''}
                  onChange={(value) => updateSectionData({ fullName: value })}
                  placeholder="Your Name"
                  className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1 max-w-full break-words"
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
              className="text-xl sm:text-2xl font-medium text-[#8B6F47] mb-6"
            >
              {inlineEditMode ? (
                <EditableText
                  value={heroData.title || ''}
                  onChange={(value) => updateSectionData({ title: value })}
                  placeholder="Your Title"
                  className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
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
              className="text-base md:text-lg text-[#8B7C6A] leading-relaxed max-w-xl mb-8"
            >
              {inlineEditMode ? (
                <EditableText
                  value={heroData.bio || ''}
                  onChange={(value) => updateSectionData({ bio: value })}
                  placeholder="Brief introduction about yourself and what you do."
                  className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                  as="span"
                  multiline
                />
              ) : (
                heroData.bio
              )}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.4}
              className="flex flex-wrap gap-4 mb-8"
            >
              <a
                href="#projects"
                onClick={(e) => handleScroll(e, 'projects')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B6F47] hover:bg-[#6B5437] text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                View Work
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, 'contact')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[#D4C5AD] hover:border-[#8B6F47] text-[#8B6F47] hover:text-[#6B5437] font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Get in Touch
              </a>
            </motion.div>

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
                  className="p-2.5 rounded-lg bg-[#F5EFE7] border border-[#E8DCC8] text-[#8B6F47] hover:text-[#6B5437] hover:border-[#D4C5AD] transition-all duration-200"
                >
                  {SOCIAL_ICONS[link.platform] || <Globe className="w-4 h-4" />}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection({ aboutData, isPreview, sectionId }: { aboutData: any; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
  const highlights = Array.isArray(aboutData?.highlights) ? aboutData.highlights : [];

  return (
    <section id="about" className="py-24 px-6 bg-white" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-[#E8DCC8]" />
            <span className="text-[#A89B88] text-xs font-semibold tracking-widest uppercase">
              About Me
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#6B5437] mb-12">
            {inlineEditMode ? (
              <EditableText
                value={aboutData?.heading || ''}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="My Story"
                className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              aboutData.heading || 'My Story'
            )}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1}>
            <p className="text-[#6B5437] text-lg leading-relaxed mb-6">
              {inlineEditMode ? (
                <EditableText
                  value={aboutData?.description || aboutData?.content || ''}
                  onChange={(value) => updateSectionData({ description: value, content: value })}
                  placeholder="Tell your story."
                  className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                  as="span"
                  multiline
                />
              ) : (
                aboutData.description || aboutData.content
              )}
            </p>
            {highlights.length > 0 && (
              <div className="space-y-3 mt-8">
                {highlights.map((item: string, i: number) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    custom={0.15 + i * 0.05}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#8B6F47] flex-shrink-0" />
                    <span className="text-[#8B7C6A] text-base leading-relaxed">
                      {inlineEditMode ? (
                        <EditableText
                          value={item || ''}
                          onChange={(value) => {
                            const updatedHighlights = updateArrayItem(highlights, i, () => value);
                            updateSectionData({ highlights: updatedHighlights });
                          }}
                          placeholder="Highlight"
                          className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                          as="span"
                        />
                      ) : (
                        item
                      )}
                    </span>
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
              { label: 'Location', value: aboutData.location || 'Remote / Worldwide', icon: <MapPin className="w-4 h-4" /> },
              { label: 'Experience', value: aboutData.experience || '5+ years', icon: <Calendar className="w-4 h-4" /> },
              { label: 'Focus', value: aboutData.focus || 'Design & Development', icon: <Heart className="w-4 h-4" /> },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-[#FAF9F6] border border-[#E8DCC8] hover:border-[#D4C5AD] transition-colors duration-300"
              >
                <div className="flex items-center gap-2 text-[#8B6F47] mb-2">
                  {item.icon}
                  <div className="text-xs font-semibold tracking-widest uppercase">{item.label}</div>
                </div>
                <div className="text-[#6B5437] text-sm font-medium">
                  {inlineEditMode ? (
                    <EditableText
                      value={item.value || ''}
                      onChange={(value) => {
                        if (item.label === 'Location') {
                          updateSectionData({ location: value });
                          return;
                        }
                        if (item.label === 'Experience') {
                          updateSectionData({ experience: value });
                          return;
                        }
                        updateSectionData({ focus: value });
                      }}
                      placeholder={item.label}
                      className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                      as="span"
                    />
                  ) : (
                    item.value
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExperienceSection({ experienceData, isPreview, sectionId }: { experienceData: ExperienceData; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
  const experiences = experienceData?.experiences || [];

  if (!experiences.length) {
    return (
      <section id="experience" className="py-24 px-6 bg-[#FAF9F6]" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-[#E8DCC8]" />
            <span className="text-[#A89B88] text-xs font-semibold tracking-widest uppercase">
              Experience
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#6B5437] mb-12">
            {inlineEditMode ? (
              <EditableText
                value={experienceData.heading || ''}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Work History"
                className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              experienceData.heading || 'Work History'
            )}
          </h2>
          <p className="text-[#8B7C6A] text-center">No experience added yet</p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-24 px-6 bg-[#FAF9F6]" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-[#E8DCC8]" />
            <span className="text-[#A89B88] text-xs font-semibold tracking-widest uppercase">
              Experience
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#6B5437] mb-16">
            {inlineEditMode ? (
              <EditableText
                value={experienceData.heading || ''}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Work History"
                className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              experienceData.heading || 'Work History'
            )}
          </h2>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp: Experience, i: number) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i * 0.1}
              className="relative p-6 rounded-xl bg-white border border-[#E8DCC8] hover:border-[#D4C5AD] transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[#F5EFE7] border border-[#E8DCC8]">
                    <Building2 className="w-5 h-5 text-[#8B6F47]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#6B5437]">
                      {inlineEditMode ? (
                        <EditableText
                          value={exp.position || ''}
                          onChange={(value) => {
                            const updatedExperiences = updateArrayItem(experiences, i, (item) => ({ ...item, position: value }));
                            updateSectionData({ experiences: updatedExperiences });
                          }}
                          placeholder="Position"
                          className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                          as="span"
                        />
                      ) : (
                        exp.position
                      )}
                    </h3>
                    <p className="text-[#8B6F47] font-medium">
                      {inlineEditMode ? (
                        <EditableText
                          value={exp.company || ''}
                          onChange={(value) => {
                            const updatedExperiences = updateArrayItem(experiences, i, (item) => ({ ...item, company: value }));
                            updateSectionData({ experiences: updatedExperiences });
                          }}
                          placeholder="Company"
                          className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                          as="span"
                        />
                      ) : (
                        exp.company
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#A89B88]">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {inlineEditMode ? (
                      <>
                        <EditableText
                          value={exp.startDate || ''}
                          onChange={(value) => {
                            const updatedExperiences = updateArrayItem(experiences, i, (item) => ({ ...item, startDate: value }));
                            updateSectionData({ experiences: updatedExperiences });
                          }}
                          placeholder="Start"
                          className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                          as="span"
                        />
                        <span> - </span>
                        <EditableText
                          value={exp.endDate || ''}
                          onChange={(value) => {
                            const updatedExperiences = updateArrayItem(experiences, i, (item) => ({ ...item, endDate: value || undefined }));
                            updateSectionData({ experiences: updatedExperiences });
                          }}
                          placeholder="Present"
                          className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                          as="span"
                        />
                      </>
                    ) : (
                      (exp as any).period || `${exp.startDate} - ${exp.endDate || 'Present'}`
                    )}
                  </span>
                </div>
              </div>
              <p className="text-[#6B5437] leading-relaxed mb-4">
                {inlineEditMode ? (
                  <EditableText
                    value={exp.description || ''}
                    onChange={(value) => {
                      const updatedExperiences = updateArrayItem(experiences, i, (item) => ({ ...item, description: value }));
                      updateSectionData({ experiences: updatedExperiences });
                    }}
                    placeholder="Role description"
                    className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                    as="span"
                    multiline
                  />
                ) : (
                  exp.description
                )}
              </p>
              {exp.achievements && exp.achievements.length > 0 && (
                <div className="space-y-2 mb-4">
                  {exp.achievements.map((achievement: string, j: number) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#8B6F47] flex-shrink-0" />
                      <span className="text-sm text-[#8B7C6A]">
                        {inlineEditMode ? (
                          <EditableText
                            value={achievement || ''}
                            onChange={(value) => {
                              const nextAchievements = updateArrayItem(exp.achievements || [], j, () => value);
                              const updatedExperiences = updateArrayItem(experiences, i, (item) => ({ ...item, achievements: nextAchievements }));
                              updateSectionData({ experiences: updatedExperiences });
                            }}
                            placeholder="Achievement"
                            className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                            as="span"
                          />
                        ) : (
                          achievement
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech: string, j: number) => (
                    <span
                      key={j}
                      className="px-3 py-1 text-xs font-medium bg-[#F5EFE7] text-[#8B6F47] rounded-full border border-[#E8DCC8]"
                    >
                      {inlineEditMode ? (
                        <EditableText
                          value={tech || ''}
                          onChange={(value) => {
                            const nextTechnologies = updateArrayItem(exp.technologies || [], j, () => value);
                            const updatedExperiences = updateArrayItem(experiences, i, (item) => ({ ...item, technologies: nextTechnologies }));
                            updateSectionData({ experiences: updatedExperiences });
                          }}
                          placeholder="Technology"
                          className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                          as="span"
                        />
                      ) : (
                        tech
                      )}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection({ projectsData, isPreview, sectionId }: { projectsData: ProjectsData; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
  const projects = projectsData?.projects || [];

  const handleProjectImageChange = (projectIndex: number, imageUrl: string) => {
    const updatedProjects = projects.map((project: Project, index: number) => {
      if (index !== projectIndex) return project;
      return {
        ...project,
        images: imageUrl ? [imageUrl] : [],
      };
    });

    updateSectionData({ projects: updatedProjects });
  };

  if (!projects.length) {
    return (
      <section id="projects" className="py-24 px-6 bg-white" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-[#E8DCC8]" />
            <span className="text-[#A89B88] text-xs font-semibold tracking-widest uppercase">
              Projects
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#6B5437] mb-12">
            {inlineEditMode ? (
              <EditableText
                value={projectsData.heading || ''}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="My Work"
                className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              projectsData.heading || 'My Work'
            )}
          </h2>
          <p className="text-[#8B7C6A] text-center">No projects added yet</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 px-6 bg-white" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-[#E8DCC8]" />
            <span className="text-[#A89B88] text-xs font-semibold tracking-widest uppercase">
              Projects
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#6B5437] mb-16">
            {inlineEditMode ? (
              <EditableText
                value={projectsData.heading || ''}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="My Work"
                className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              projectsData.heading || 'My Work'
            )}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Project, i: number) => (
            <motion.div
              key={project.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i * 0.1}
              className="group relative rounded-xl bg-[#FAF9F6] border border-[#E8DCC8] hover:border-[#D4C5AD] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {inlineEditMode ? (
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#F5EFE7] to-[#E8DCC8]">
                  <EditableImage
                    value={project.images?.[0] || ''}
                    onChange={(url) => handleProjectImageChange(i, url)}
                    alt={project.title || `Project ${i + 1}`}
                    containerClassName="absolute inset-0 w-full h-full !min-h-0"
                    className="w-full h-full object-cover !min-h-0"
                    emptyStateContent={
                      <span className="text-4xl font-bold text-[#C5B5A0] select-none uppercase">
                        {(project.title || '').trim().charAt(0).toUpperCase() || '?'}
                      </span>
                    }
                    emptyStateClassName="w-full h-full"
                    aspectRatio="auto"
                  />
                </div>
              ) : project.images && project.images.length > 0 ? (
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#F5EFE7] to-[#E8DCC8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-[#F5EFE7] to-[#E8DCC8] flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#C5B5A0]">
                    {(project.title || '').trim().charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#6B5437] mb-2 group-hover:text-[#8B6F47] transition-colors">
                  {inlineEditMode ? (
                    <EditableText
                      value={project.title || ''}
                      onChange={(value) => {
                        const updatedProjects = updateArrayItem(projects, i, (item) => ({ ...item, title: value }));
                        updateSectionData({ projects: updatedProjects });
                      }}
                      placeholder="Project title"
                      className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                      as="span"
                    />
                  ) : (
                    project.title
                  )}
                </h3>
                <p className="text-[#8B7C6A] text-sm leading-relaxed mb-4 line-clamp-3">
                  {inlineEditMode ? (
                    <EditableText
                      value={project.description || ''}
                      onChange={(value) => {
                        const updatedProjects = updateArrayItem(projects, i, (item) => ({ ...item, description: value }));
                        updateSectionData({ projects: updatedProjects });
                      }}
                      placeholder="Project description"
                      className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                      as="span"
                      multiline
                    />
                  ) : (
                    project.description
                  )}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech: string, j: number) => (
                      <span
                        key={j}
                        className="px-2 py-1 text-xs font-medium bg-white text-[#8B6F47] rounded border border-[#E8DCC8]"
                      >
                        {inlineEditMode ? (
                          <EditableText
                            value={tech || ''}
                            onChange={(value) => {
                              const nextTechnologies = updateArrayItem(project.technologies || [], j, () => value);
                              const updatedProjects = updateArrayItem(projects, i, (item) => ({ ...item, technologies: nextTechnologies }));
                              updateSectionData({ projects: updatedProjects });
                            }}
                            placeholder="Tech"
                            className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                            as="span"
                          />
                        ) : (
                          tech
                        )}
                      </span>
                    ))}
                  </div>
                )}
                {(project.links?.github || project.links?.live) && (
                  <div className="flex gap-2">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        onClick={(e) => isPreview && e.preventDefault()}
                        target={!isPreview ? '_blank' : undefined}
                        rel={!isPreview ? 'noopener noreferrer' : undefined}
                        className="p-2 rounded-lg bg-white border border-[#E8DCC8] text-[#8B6F47] hover:border-[#8B6F47] transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        onClick={(e) => isPreview && e.preventDefault()}
                        target={!isPreview ? '_blank' : undefined}
                        rel={!isPreview ? 'noopener noreferrer' : undefined}
                        className="p-2 rounded-lg bg-white border border-[#E8DCC8] text-[#8B6F47] hover:border-[#8B6F47] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function SkillsSection({ skillsData, isPreview, sectionId }: { skillsData: any; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
  const categories = skillsData?.skillCategories || {};
  const hasSkills = Object.values(categories).some((cat: any) => cat && cat.length > 0);

  if (!hasSkills) {
    return (
      <section id="skills" className="py-24 px-6 bg-[#FAF9F6]" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-[#E8DCC8]" />
            <span className="text-[#A89B88] text-xs font-semibold tracking-widest uppercase">
              Skills
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#6B5437] mb-12">
            {inlineEditMode ? (
              <EditableText
                value={skillsData.heading || ''}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Expertise"
                className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              skillsData.heading || 'Expertise'
            )}
          </h2>
          <p className="text-[#8B7C6A] text-center">No skills added yet</p>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 px-6 bg-[#FAF9F6]" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-[#E8DCC8]" />
            <span className="text-[#A89B88] text-xs font-semibold tracking-widest uppercase">
              Skills
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#6B5437] mb-16">
            {inlineEditMode ? (
              <EditableText
                value={skillsData.heading || ''}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Expertise"
                className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              skillsData.heading || 'Expertise'
            )}
          </h2>
        </motion.div>

        <div className="space-y-12">
          {Object.entries(categories).map(([category, skills]: [string, any], i: number) => {
            if (!skills || skills.length === 0) return null;
            return (
              <motion.div
                key={category}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.1}
              >
                <h3 className="text-sm font-semibold text-[#8B6F47] tracking-widest uppercase mb-6">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill: any, j: number) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 + j * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
                      className="px-5 py-3 bg-white border border-[#E8DCC8] rounded-full hover:border-[#8B6F47] hover:shadow-md transition-all duration-300 cursor-default"
                    >
                      <span className="text-sm font-medium text-[#6B5437]">
                        {inlineEditMode ? (
                          <EditableText
                            value={skill?.name || ''}
                            onChange={(value) => {
                              const updatedCategory = updateArrayItem(skills || [], j, (item: any) => ({ ...item, name: value }));
                              updateSectionData({
                                skillCategories: {
                                  ...categories,
                                  [category]: updatedCategory,
                                },
                              });
                            }}
                            placeholder="Skill"
                            className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                            as="span"
                          />
                        ) : (
                          skill.name
                        )}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────

function EducationSection({ educationData, isPreview, sectionId }: { educationData: EducationData; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
  const education = educationData?.education || [];

  if (!education.length) {
    return (
      <section id="education" className="py-24 px-6 bg-white" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-[#E8DCC8]" />
            <span className="text-[#A89B88] text-xs font-semibold tracking-widest uppercase">
              Education
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#6B5437] mb-12">
            {inlineEditMode ? (
              <EditableText
                value={educationData.heading || ''}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Education"
                className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              educationData.heading || 'Education'
            )}
          </h2>
          <p className="text-[#8B7C6A] text-center">No education added yet</p>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-24 px-6 bg-white" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-[#E8DCC8]" />
            <span className="text-[#A89B88] text-xs font-semibold tracking-widest uppercase">
              Education
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#6B5437] mb-16">
            {inlineEditMode ? (
              <EditableText
                value={educationData.heading || ''}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Education"
                className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              educationData.heading || 'Education'
            )}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu: Education, i: number) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i * 0.1}
              className="p-6 rounded-xl bg-[#FAF9F6] border border-[#E8DCC8] hover:border-[#D4C5AD] transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-white border border-[#E8DCC8]">
                  <GraduationCap className="w-5 h-5 text-[#8B6F47]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#6B5437] mb-1">
                    {inlineEditMode ? (
                      <EditableText
                        value={edu.degree || ''}
                        onChange={(value) => {
                          const updatedEducation = updateArrayItem(education, i, (item) => ({ ...item, degree: value }));
                          updateSectionData({ education: updatedEducation });
                        }}
                        placeholder="Degree"
                        className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                        as="span"
                      />
                    ) : (
                      edu.degree
                    )}
                  </h3>
                  <p className="text-[#8B6F47] font-medium text-sm">
                    {inlineEditMode ? (
                      <EditableText
                        value={edu.institution || ''}
                        onChange={(value) => {
                          const updatedEducation = updateArrayItem(education, i, (item) => ({ ...item, institution: value }));
                          updateSectionData({ education: updatedEducation });
                        }}
                        placeholder="Institution"
                        className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                        as="span"
                      />
                    ) : (
                      edu.institution
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#A89B88]">
                <Calendar className="w-4 h-4" />
                <span>
                  {inlineEditMode ? (
                    <>
                      <EditableText
                        value={edu.startDate || ''}
                        onChange={(value) => {
                          const updatedEducation = updateArrayItem(education, i, (item) => ({ ...item, startDate: value }));
                          updateSectionData({ education: updatedEducation });
                        }}
                        placeholder="Start"
                        className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                        as="span"
                      />
                      <span> - </span>
                      <EditableText
                        value={edu.endDate || ''}
                        onChange={(value) => {
                          const updatedEducation = updateArrayItem(education, i, (item) => ({ ...item, endDate: value || undefined }));
                          updateSectionData({ education: updatedEducation });
                        }}
                        placeholder="Present"
                        className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                        as="span"
                      />
                    </>
                  ) : (
                    (edu as any).year || `${edu.startDate} - ${edu.endDate || 'Present'}`
                  )}
                </span>
              </div>
              {(edu as any).description && (
                <p className="text-[#8B7C6A] text-sm leading-relaxed mt-3">
                  {inlineEditMode ? (
                    <EditableText
                      value={(edu as any).description || ''}
                      onChange={(value) => {
                        const updatedEducation = updateArrayItem(education, i, (item) => ({ ...(item as any), description: value }));
                        updateSectionData({ education: updatedEducation });
                      }}
                      placeholder="Description"
                      className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                      as="span"
                      multiline
                    />
                  ) : (
                    (edu as any).description
                  )}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection({ contactData, isPreview, sectionId }: { contactData: any; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);

  return (
    <section id="contact" className="py-24 px-6 bg-[#FAF9F6]" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-12 h-px bg-[#E8DCC8]" />
            <span className="text-[#A89B88] text-xs font-semibold tracking-widest uppercase">
              Get in Touch
            </span>
            <span className="w-12 h-px bg-[#E8DCC8]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#6B5437] mb-6">
            {inlineEditMode ? (
              <EditableText
                value={contactData.heading || ''}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Let's Work Together"
                className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              contactData.heading || "Let's Work Together"
            )}
          </h2>
          <p className="text-[#8B7C6A] text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            {inlineEditMode ? (
              <EditableText
                value={contactData.description || ''}
                onChange={(value) => updateSectionData({ description: value })}
                placeholder="Have a project in mind or just want to chat?"
                className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                as="span"
                multiline
              />
            ) : (
              contactData.description || "Have a project in mind or just want to chat? I'd love to hear from you."
            )}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0.2}
          className="flex flex-wrap justify-center gap-4"
        >
          {contactData.email && (
            <a
              href={`mailto:${contactData.email}`}
              onClick={(e) => isPreview && e.preventDefault()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B6F47] hover:bg-[#6B5437] text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Mail className="w-4 h-4" />
              {inlineEditMode ? (
                <EditableText
                  value={contactData.email || ''}
                  onChange={(value) => updateSectionData({ email: value })}
                  placeholder="email@example.com"
                  className="outline-none focus:ring-2 focus:ring-[#D4C5AD]/60 rounded px-1 -mx-1"
                  as="span"
                />
              ) : (
                'Send Email'
              )}
            </a>
          )}
          {contactData.phone && (
            <a
              href={`tel:${contactData.phone}`}
              onClick={(e) => isPreview && e.preventDefault()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[#D4C5AD] hover:border-[#8B6F47] text-[#8B6F47] font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              {inlineEditMode ? (
                <EditableText
                  value={contactData.phone || ''}
                  onChange={(value) => updateSectionData({ phone: value })}
                  placeholder="Phone"
                  className="outline-none focus:ring-2 focus:ring-[#8B6F47]/50 rounded px-1 -mx-1"
                  as="span"
                />
              ) : (
                'Call Me'
              )}
            </a>
          )}
        </motion.div>

        {contactData.socialLinks && contactData.socialLinks.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0.3}
            className="flex justify-center gap-3 mt-8"
          >
            {contactData.socialLinks.map((link: { platform: string; url: string }, i: number) => (
              <a
                key={i}
                href={link.url}
                onClick={(e) => isPreview && e.preventDefault()}
                target={!isPreview ? '_blank' : undefined}
                rel={!isPreview ? 'noopener noreferrer' : undefined}
                className="p-3 rounded-lg bg-white border border-[#E8DCC8] text-[#8B6F47] hover:text-[#6B5437] hover:border-[#D4C5AD] transition-all duration-200"
              >
                {SOCIAL_ICONS[link.platform] || <Globe className="w-5 h-5" />}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

// ─── Main Component ───────────────────────────────────────────────────────────

const rootClass = "min-h-screen bg-[#FAF9F6] text-[#6B5437] overflow-x-hidden";
const rootStyle = { fontFamily: 'system-ui, -apple-system, sans-serif' };

function WarmMinimalistTemplateComponent({
  data,
  isPreview = false,
  sections,
  renderSection,
}: WarmMinimalistTemplateProps) {

  // ── Default data ─────────────────────────────────────────────────────────
  const heroData = data?.hero || {
    fullName: 'Sarah Martinez',
    title: 'Creative Designer & Developer',
    bio: 'Crafting beautiful, functional digital experiences with a focus on simplicity and elegance. Passionate about clean design and thoughtful user experiences.',
    profileImage: '',
    location: 'Remote',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/sarahmartinez' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/sarahmartinez' },
      { platform: 'email', url: 'mailto:sarah@example.com' },
    ],
  };

  const aboutData = data?.about || {
    heading: 'About Me',
    description: "I'm a creative professional who believes in the power of simple, elegant design. With a background in both design and development, I create digital experiences that are both beautiful and functional.",
    content: "I'm a creative professional who believes in the power of simple, elegant design. With a background in both design and development, I create digital experiences that are both beautiful and functional.",
    highlights: [
      '5+ years in design & development',
      'Specializing in minimal, clean aesthetics',
      'Focus on user-centered design',
      'Passionate about thoughtful details',
    ],
    location: 'Remote / Worldwide',
    experience: '5+ years',
    focus: 'Design & Development',
  };

  const skillsData = data?.skills || {
    heading: 'Skills',
    skillCategories: {
      technical: [
        { name: 'UI/UX Design', level: 95 },
        { name: 'React / Next.js', level: 90 },
        { name: 'TypeScript', level: 88 },
        { name: 'Figma', level: 92 },
      ],
      tools: [
        { name: 'Adobe Creative Suite', level: 90 },
        { name: 'Tailwind CSS', level: 95 },
        { name: 'Framer Motion', level: 85 },
      ],
    },
    skills: [],
  };

  const projectsData: ProjectsData = data?.projects || {
    heading: 'Featured Work',
    categories: [],
    projects: [
      {
        id: '1',
        title: 'Brand Identity Design',
        description: 'Complete brand identity and visual system for a sustainable fashion startup, including logo, color palette, and design guidelines.',
        technologies: ['Figma', 'Illustrator', 'Brand Design'],
        images: [],
        links: {},
        featured: true,
        category: 'Design',
        status: 'completed',
      },
      {
        id: '2',
        title: 'E-commerce Website',
        description: 'Modern, minimal e-commerce platform with seamless checkout experience and beautiful product presentations.',
        technologies: ['Next.js', 'TypeScript', 'Stripe'],
        images: [],
        links: {},
        featured: true,
        category: 'Development',
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
    heading: "Let's Connect",
    description: "Interested in working together? I'd love to hear about your project.",
    email: 'hello@example.com',
    phone: '',
    socialLinks: [],
  };

  const navbarData: NavbarData = data?.navbar || {
    name: heroData.fullName,
    links: [
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Experience', href: '#experience' },
      { label: 'Skills', href: '#skills' },
    ],
    cta: { label: 'Contact', href: '#contact' },
  };

  // ── Section rendering (editor mode) ──────────────────────────────────────

  if (sections) {
    const heroSection = sections.find(s => s.type === 'hero');
    const liveHeroContent = (heroSection as any)?.content || {};
    const liveHeroData = Object.keys(liveHeroContent).length > 0 ? liveHeroContent : (heroSection?.data || heroData);
    const liveHeroName = (liveHeroData as any)?.fullName || heroData.fullName;

    const navbarSection = sections.find(s => s.type === 'navbar');
    const hasNavbar = !!navbarSection;

    return (
      <div className={rootClass} style={rootStyle}>
        {hasNavbar && !isPreview && (
          <Navbar
            sections={sections}
            navData={navbarSection.data as any}
            isPreview={false}
            isInsideCanvas={false}
            heroName={liveHeroName}
            variant="warm"
          />
        )}

        {sections.map((section, index) => {
          let content: React.ReactNode = null;

          switch (section.type) {
            case 'navbar': {
              if (!isPreview) {
                content = <React.Fragment key={section.id} />;
                break;
              }
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as any;
              content = (
                <Navbar
                  key={section.id}
                  sections={sections}
                  navData={d}
                  isPreview={isPreview}
                  isInsideCanvas={true}
                  heroName={liveHeroName}
                  variant="warm"
                />
              );
              break;
            }
            case 'hero': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as any;
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
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as any;
              content = (
                <React.Fragment key={section.id}>
                  <AboutSection aboutData={d} isPreview={isPreview} sectionId={section.id} />
                </React.Fragment>
              );
              break;
            }
            case 'experience': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as ExperienceData;
              content = (
                <React.Fragment key={section.id}>
                  <ExperienceSection experienceData={d} isPreview={isPreview} sectionId={section.id} />
                </React.Fragment>
              );
              break;
            }
            case 'projects': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as ProjectsData;
              content = (
                <React.Fragment key={section.id}>
                  <ProjectsSection projectsData={d} isPreview={isPreview} sectionId={section.id} />
                </React.Fragment>
              );
              break;
            }
            case 'skills': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as any;
              content = (
                <React.Fragment key={section.id}>
                  <SkillsSection skillsData={d} isPreview={isPreview} sectionId={section.id} />
                </React.Fragment>
              );
              break;
            }
            case 'education': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as EducationData;
              content = (
                <React.Fragment key={section.id}>
                  <EducationSection educationData={d} isPreview={isPreview} sectionId={section.id} />
                </React.Fragment>
              );
              break;
            }
            case 'contact': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as any;
              content = (
                <React.Fragment key={section.id}>
                  <ContactSection contactData={d} isPreview={isPreview} sectionId={section.id} />
                </React.Fragment>
              );
              break;
            }
            case 'footer': {
              content = (
                <Footer
                  key={section.id}
                  sections={sections}
                  heroName={liveHeroName}
                  variant="warm"
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
      <Navbar
        sections={sections}
        navData={navbarData}
        isPreview={isPreview}
        heroName={heroData.fullName}
        variant="warm"
      />
      <HeroSection heroData={heroData} isPreview={isPreview} />
      <AboutSection aboutData={aboutData} isPreview={isPreview} />
      <ExperienceSection experienceData={experienceData} isPreview={isPreview} />
      <ProjectsSection projectsData={projectsData} isPreview={isPreview} />
      <SkillsSection skillsData={skillsData} isPreview={isPreview} />
      <EducationSection educationData={educationData} isPreview={isPreview} />
      <ContactSection contactData={contactData} isPreview={isPreview} />
      <Footer sections={sections} heroName={heroData.fullName} variant="warm" />
    </div>
  );
}

export const WarmMinimalistTemplate = React.memo(WarmMinimalistTemplateComponent);
WarmMinimalistTemplate.displayName = 'WarmMinimalistTemplate';
