/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableImage } from '@/components/editor/inline/EditableImage';
import { updateArrayItem, useTemplateInlineEditor } from './inline-edit-utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  Github, Linkedin, Mail, MapPin, ExternalLink,
  Building2, GraduationCap, Calendar,
  Twitter, Globe, Award
} from 'lucide-react';
import type { EditorSection } from '@/types/editor';
import type {
  TemplateData, ProjectsData, Project,
  ExperienceData, Experience, EducationData, Education,
  NavbarData
} from '@/types/portfolio';

// ─── Props ───────────────────────────────────────────────────────────────────

interface ElegantMonochromeTemplateProps {
  data?: TemplateData;
  isPreview?: boolean;
  sections?: EditorSection[];
  renderSection?: (section: EditorSection, index: number, content: React.ReactNode) => React.ReactNode;
}

const NAVBAR_SECTION_ORDER: Array<{ type: EditorSection['type']; label: string; href: string }> = [
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
    <div className="flex items-center justify-center gap-3.5">
      {socialLinks.map((link, idx) => {
        const Icon = getIcon(link.platform);
        return (
          <motion.a
            key={idx}
            href={link.url}
            target={link.platform === 'email' ? undefined : '_blank'}
            rel={link.platform === 'email' ? undefined : 'noopener noreferrer'}
            className="w-11 h-11 rounded-full border border-black/15 bg-white text-black/70 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)] flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:border-black/30 hover:text-black hover:shadow-[0_14px_26px_-18px_rgba(0,0,0,0.75)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-[18px] h-[18px]" />
          </motion.a>
        );
      })}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

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
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);

  const fullName = heroData?.fullName || 'Victoria Sterling';
  const title = heroData?.title || 'Business Consultant & Strategy Expert';
  const bio = heroData?.bio || 'Transforming businesses through strategic consulting.';
  const location = heroData?.location || 'London, UK';
  const socialLinks = heroData?.socialLinks || [];
  const profileImage = heroData?.profileImage || '';
  const heroInitial = (fullName || '').trim().charAt(0).toUpperCase() || '?';

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-white py-24 md:py-28">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex flex-col items-center text-center space-y-7 md:space-y-9"
        >
          {/* Avatar */}
          <div className="relative">
            <div
              className="relative w-36 h-36 md:w-40 md:h-40 border border-black/15 overflow-hidden bg-white shadow-[0_20px_36px_-28px_rgba(0,0,0,0.85)]"
              style={{ borderRadius: '9999px' }}
            >
              {inlineEditMode ? (
                <EditableImage
                  value={profileImage}
                  onChange={(url) => updateSectionData({ profileImage: url })}
                  alt={fullName}
                  containerClassName="absolute inset-0 w-full h-full !min-h-0"
                  className="w-full h-full !min-h-0 object-cover rounded-[9999px]"
                  emptyStateContent={<span className="text-4xl font-light text-gray-600">{heroInitial}</span>}
                  emptyStateClassName="w-full h-full rounded-[9999px]"
                  aspectRatio="square"
                />
              ) : profileImage ? (
                <Image
                  src={profileImage}
                  alt={fullName}
                  width={128}
                  height={128}
                  unoptimized
                  className="w-full h-full"
                  style={{ borderRadius: '9999px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="w-full h-full bg-gray-100 flex items-center justify-center"
                  style={{ borderRadius: '9999px' }}
                >
                  <span className="text-4xl font-light text-gray-600">
                    {heroInitial}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2.5 md:space-y-3">
            <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.02em] leading-[1.04] text-black mb-0">
              {inlineEditMode ? (
                <EditableText
                  value={fullName}
                  onChange={(value) => updateSectionData({ fullName: value })}
                  placeholder="Your Name"
                  className="outline-none focus:ring-2 focus:ring-black/20 rounded px-2 -mx-2"
                  as="span"
                />
              ) : (
                fullName
              )}
            </h1>
            <p className="text-base md:text-lg text-gray-600 tracking-[0.08em] mb-1">
              {inlineEditMode ? (
                <EditableText
                  value={title}
                  onChange={(value) => updateSectionData({ title: value })}
                  placeholder="Your Title"
                  className="outline-none focus:ring-2 focus:ring-black/20 rounded px-2 -mx-2"
                  as="span"
                />
              ) : (
                title
              )}
            </p>
            {location && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-0.5">
                <MapPin className="w-4 h-4 text-gray-500/90" />
                <span>
                  {inlineEditMode ? (
                    <EditableText
                      value={location}
                      onChange={(value) => updateSectionData({ location: value })}
                      placeholder="Location"
                      className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                      as="span"
                    />
                  ) : (
                    location
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="max-w-[44rem] px-2 pt-1">
            <p className="text-base md:text-lg text-gray-700 leading-8 md:leading-9">
              {inlineEditMode ? (
                <EditableText
                  value={bio}
                  onChange={(value) => updateSectionData({ bio: value })}
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
          <div className="pt-1 md:pt-2">
            <SocialLinks socialLinks={socialLinks} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection({ aboutData, isPreview, sectionId }: { aboutData: any; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
  const heading = aboutData?.heading || 'About Me';
  const content = aboutData?.description || aboutData?.content || 'Professional background and expertise.';
  const highlights = Array.isArray(aboutData?.highlights) ? aboutData.highlights : [];

  return (
    <section id="about" className="py-20 bg-gray-50" style={{ scrollMarginTop: '64px' }}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <SectionLabel>
            {inlineEditMode ? (
              <EditableText
                value={heading}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="About Me"
                className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              heading
            )}
          </SectionLabel>

          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {inlineEditMode ? (
                <EditableText
                  value={content}
                  onChange={(value) => updateSectionData({ description: value, content: value })}
                  placeholder="Professional background and expertise."
                  className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                  as="span"
                  multiline
                />
              ) : (
                content
              )}
            </p>

            {highlights && highlights.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                {highlights.map((highlight: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-black mt-3 flex-shrink-0" />
                    <p className="text-gray-700">
                      {inlineEditMode ? (
                        <EditableText
                          value={highlight || ''}
                          onChange={(value) => {
                            const updatedHighlights = updateArrayItem(highlights, idx, () => value);
                            updateSectionData({ highlights: updatedHighlights });
                          }}
                          placeholder="Highlight"
                          className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                          as="span"
                        />
                      ) : (
                        highlight
                      )}
                    </p>
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

function ExperienceSection({ experienceData, isPreview, sectionId }: { experienceData: ExperienceData; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
  const heading = experienceData?.heading || 'Experience';
  const experiences = experienceData?.experiences || [];

  if (experiences.length === 0) {
    return (
      <section id="experience" className="py-20 bg-white" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionLabel>
            {inlineEditMode ? (
              <EditableText
                value={heading}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Experience"
                className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              heading
            )}
          </SectionLabel>
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
          <SectionLabel>
            {inlineEditMode ? (
              <EditableText
                value={heading}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Experience"
                className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              heading
            )}
          </SectionLabel>

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
                  <h3 className="text-xl font-medium tracking-wide">
                    {inlineEditMode ? (
                      <EditableText
                        value={exp.position || ''}
                        onChange={(value) => {
                          const updatedExperiences = updateArrayItem(experiences, idx, (item) => ({ ...item, position: value }));
                          updateSectionData({ experiences: updatedExperiences });
                        }}
                        placeholder="Position"
                        className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                        as="span"
                      />
                    ) : (
                      exp.position
                    )}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>
                        {inlineEditMode ? (
                          <EditableText
                            value={exp.company || ''}
                            onChange={(value) => {
                              const updatedExperiences = updateArrayItem(experiences, idx, (item) => ({ ...item, company: value }));
                              updateSectionData({ experiences: updatedExperiences });
                            }}
                            placeholder="Company"
                            className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                            as="span"
                          />
                        ) : (
                          exp.company
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {inlineEditMode ? (
                          <>
                            <EditableText
                              value={exp.startDate || ''}
                              onChange={(value) => {
                                const updatedExperiences = updateArrayItem(experiences, idx, (item) => ({ ...item, startDate: value }));
                                updateSectionData({ experiences: updatedExperiences });
                              }}
                              placeholder="Start"
                              className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                              as="span"
                            />
                            <span> - </span>
                            <EditableText
                              value={exp.endDate || ''}
                              onChange={(value) => {
                                const updatedExperiences = updateArrayItem(experiences, idx, (item) => ({ ...item, endDate: value || undefined }));
                                updateSectionData({ experiences: updatedExperiences });
                              }}
                              placeholder="Present"
                              className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                              as="span"
                            />
                          </>
                        ) : (
                          <>{exp.startDate} - {exp.endDate || 'Present'}</>
                        )}
                      </span>
                    </div>
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {inlineEditMode ? (
                          <EditableText
                            value={exp.location || ''}
                            onChange={(value) => {
                              const updatedExperiences = updateArrayItem(experiences, idx, (item) => ({ ...item, location: value }));
                              updateSectionData({ experiences: updatedExperiences });
                            }}
                            placeholder="Location"
                            className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                            as="span"
                          />
                        ) : (
                          exp.location
                        )}
                      </span>
                    </div>
                  )}
                  <p className="text-gray-700 mt-3">
                    {inlineEditMode ? (
                      <EditableText
                        value={exp.description || ''}
                        onChange={(value) => {
                          const updatedExperiences = updateArrayItem(experiences, idx, (item) => ({ ...item, description: value }));
                          updateSectionData({ experiences: updatedExperiences });
                        }}
                        placeholder="Role description"
                        className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                        as="span"
                        multiline
                      />
                    ) : (
                      exp.description
                    )}
                  </p>
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
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
  const heading = projectsData?.heading || 'Projects';
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

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-20 bg-gray-50" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>
            {inlineEditMode ? (
              <EditableText
                value={heading}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Projects"
                className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              heading
            )}
          </SectionLabel>
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
                  <h3 className="text-xl font-medium tracking-wide">
                    {inlineEditMode ? (
                      <EditableText
                        value={project.title || ''}
                        onChange={(value) => {
                          const updatedProjects = updateArrayItem(projects, idx, (item) => ({ ...item, title: value }));
                          updateSectionData({ projects: updatedProjects });
                        }}
                        placeholder="Project title"
                        className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                        as="span"
                      />
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p className="text-gray-700">
                    {inlineEditMode ? (
                      <EditableText
                        value={project.description || ''}
                        onChange={(value) => {
                          const updatedProjects = updateArrayItem(projects, idx, (item) => ({ ...item, description: value }));
                          updateSectionData({ projects: updatedProjects });
                        }}
                        placeholder="Project description"
                        className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                        as="span"
                        multiline
                      />
                    ) : (
                      project.description
                    )}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="px-3 py-1 text-xs border border-black/20 tracking-wide"
                        >
                          {inlineEditMode ? (
                            <EditableText
                              value={tech || ''}
                              onChange={(value) => {
                                const nextTechnologies = updateArrayItem(project.technologies || [], techIdx, () => value);
                                const updatedProjects = updateArrayItem(projects, idx, (item) => ({ ...item, technologies: nextTechnologies }));
                                updateSectionData({ projects: updatedProjects });
                              }}
                              placeholder="Tech"
                              className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                              as="span"
                            />
                          ) : (
                            tech
                          )}
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

function SkillsSection({ skillsData, isPreview, sectionId }: { skillsData: any; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
  const heading = skillsData?.heading || 'Skills';
  const skills = normalizeSkills(skillsData);

  const updateSkillLabel = (group: SkillGroup, skillIdx: number, value: string) => {
    const skillCategories = skillsData?.skillCategories;
    if (skillCategories && typeof skillCategories === 'object') {
      const rawKey = group.category.toLowerCase();
      const currentGroup = (skillCategories as Record<string, unknown>)[rawKey];
      if (Array.isArray(currentGroup)) {
        const nextGroup = updateArrayItem(currentGroup, skillIdx, (item: unknown) => {
          if (typeof item === 'string') return value;
          if (item && typeof item === 'object') return { ...(item as Record<string, unknown>), name: value };
          return value;
        });
        updateSectionData({
          skillCategories: {
            ...(skillCategories as Record<string, unknown>),
            [rawKey]: nextGroup,
          },
        });
        return;
      }
    }

    if (Array.isArray(skillsData?.skills)) {
      const nextSkills = updateArrayItem(skillsData.skills, skillIdx, (item: unknown) => {
        if (typeof item === 'string') return value;
        if (item && typeof item === 'object') return { ...(item as Record<string, unknown>), name: value };
        return value;
      });
      updateSectionData({ skills: nextSkills });
    }
  };

  if (skills.length === 0) {
    return (
      <section id="skills" className="py-20 bg-white" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionLabel>
            {inlineEditMode ? (
              <EditableText
                value={heading}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Skills"
                className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              heading
            )}
          </SectionLabel>
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
          <SectionLabel>
            {inlineEditMode ? (
              <EditableText
                value={heading}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Skills"
                className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              heading
            )}
          </SectionLabel>

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
                      {inlineEditMode ? (
                        <EditableText
                          value={skill || ''}
                          onChange={(value) => updateSkillLabel(skillGroup, skillIdx, value)}
                          placeholder="Skill"
                          className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                          as="span"
                        />
                      ) : (
                        skill
                      )}
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

function EducationSection({ educationData, isPreview, sectionId }: { educationData: EducationData; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
  const heading = educationData?.heading || 'Education';
  const education = educationData?.education || [];

  if (education.length === 0) {
    return (
      <section id="education" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <SectionLabel>
            {inlineEditMode ? (
              <EditableText
                value={heading}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Education"
                className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              heading
            )}
          </SectionLabel>
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
          <SectionLabel>
            {inlineEditMode ? (
              <EditableText
                value={heading}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Education"
                className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              heading
            )}
          </SectionLabel>

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
                    {inlineEditMode ? (
                      <>
                        <EditableText
                          value={edu.degree || ''}
                          onChange={(value) => {
                            const updatedEducation = updateArrayItem(education, idx, (item) => ({ ...item, degree: value }));
                            updateSectionData({ education: updatedEducation });
                          }}
                          placeholder="Degree"
                          className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                          as="span"
                        />
                        {edu.field ? (
                          <>
                            <span> in </span>
                            <EditableText
                              value={edu.field || ''}
                              onChange={(value) => {
                                const updatedEducation = updateArrayItem(education, idx, (item) => ({ ...item, field: value }));
                                updateSectionData({ education: updatedEducation });
                              }}
                              placeholder="Field"
                              className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                              as="span"
                            />
                          </>
                        ) : null}
                      </>
                    ) : (
                      <>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>
                        {inlineEditMode ? (
                          <EditableText
                            value={edu.institution || ''}
                            onChange={(value) => {
                              const updatedEducation = updateArrayItem(education, idx, (item) => ({ ...item, institution: value }));
                              updateSectionData({ education: updatedEducation });
                            }}
                            placeholder="Institution"
                            className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                            as="span"
                          />
                        ) : (
                          edu.institution
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {inlineEditMode ? (
                          <>
                            <EditableText
                              value={edu.startDate || ''}
                              onChange={(value) => {
                                const updatedEducation = updateArrayItem(education, idx, (item) => ({ ...item, startDate: value }));
                                updateSectionData({ education: updatedEducation });
                              }}
                              placeholder="Start"
                              className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                              as="span"
                            />
                            <span> - </span>
                            <EditableText
                              value={edu.endDate || ''}
                              onChange={(value) => {
                                const updatedEducation = updateArrayItem(education, idx, (item) => ({ ...item, endDate: value || undefined }));
                                updateSectionData({ education: updatedEducation });
                              }}
                              placeholder="Present"
                              className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                              as="span"
                            />
                          </>
                        ) : (
                          <>{edu.startDate} - {edu.endDate || 'Present'}</>
                        )}
                      </span>
                    </div>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 mt-2">
                      {inlineEditMode ? (
                        <>
                          GPA:{' '}
                          <EditableText
                            value={String(edu.gpa)}
                            onChange={(value) => {
                              const numericValue = Number(value);
                              const updatedEducation = updateArrayItem(education, idx, (item) => ({
                                ...item,
                                gpa: Number.isFinite(numericValue) ? numericValue : item.gpa,
                              }));
                              updateSectionData({ education: updatedEducation });
                            }}
                            placeholder="4.0"
                            className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                            as="span"
                          />
                        </>
                      ) : (
                        <>GPA: {edu.gpa}</>
                      )}
                    </p>
                  )}
                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {edu.coursework.map((course, courseIdx) => (
                        <span
                          key={courseIdx}
                          className="px-3 py-1 text-xs border border-black/20 tracking-wide"
                        >
                          {inlineEditMode ? (
                            <EditableText
                              value={course || ''}
                              onChange={(value) => {
                                const nextCoursework = updateArrayItem(edu.coursework || [], courseIdx, () => value);
                                const updatedEducation = updateArrayItem(education, idx, (item) => ({ ...item, coursework: nextCoursework }));
                                updateSectionData({ education: updatedEducation });
                              }}
                              placeholder="Course"
                              className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                              as="span"
                            />
                          ) : (
                            course
                          )}
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

function ContactSection({ contactData, isPreview, sectionId }: { contactData: any; isPreview: boolean; sectionId?: string }) {
  const { inlineEditMode, updateSectionData } = useTemplateInlineEditor(isPreview, sectionId);
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
          <SectionLabel>
            {inlineEditMode ? (
              <EditableText
                value={heading}
                onChange={(value) => updateSectionData({ heading: value })}
                placeholder="Get In Touch"
                className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              heading
            )}
          </SectionLabel>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {inlineEditMode ? (
              <EditableText
                value={content}
                onChange={(value) => updateSectionData({ content: value })}
                placeholder="Let's connect and discuss how we can work together."
                className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                as="span"
                multiline
              />
            ) : (
              content
            )}
          </p>

          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors duration-200 text-lg"
            >
              <Mail className="w-5 h-5" />
              <span>
                {inlineEditMode ? (
                  <EditableText
                    value={email}
                    onChange={(value) => updateSectionData({ email: value })}
                    placeholder="email@example.com"
                    className="outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
                    as="span"
                  />
                ) : (
                  email
                )}
              </span>
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

// ─── Main Template ────────────────────────────────────────────────────────────

function ElegantMonochromeTemplateComponent({
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
    description: 'Professional background and expertise.',
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

  // Extract live hero name from sections
  let liveHeroName = heroData.fullName;
  if (sections) {
    const heroSection = sections.find((s) => s.type === 'hero');
    const data = (heroSection as any)?.content || {};
    const heroSectionData = Object.keys(data).length > 0 ? data : heroSection?.data;
    if (heroSectionData) {
      liveHeroName = (heroSectionData as any).fullName || heroData.fullName;
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
      <div className="bg-white text-black min-h-screen overflow-x-hidden">
        {hasNavbar && !isPreview && (
          <Navbar
            sections={sections}
            navData={{ ...(navbarSection.data as NavbarData), links: syncedNavbarLinks }}
            isPreview={false}
            isInsideCanvas={false}
            heroName={liveHeroName}
            variant="mono"
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
              const d = (Object.keys(data).length > 0 ? data : section.data) as NavbarData;
              const syncedNavData: NavbarData = {
                ...d,
                links: syncedNavbarLinks,
              };
              content = (
                <Navbar
                  key={section.id}
                  sections={sections}
                  navData={syncedNavData}
                  isPreview={isPreview}
                  isInsideCanvas={true}
                  heroName={liveHeroName}
                  variant="mono"
                />
              );
              break;
            }

            case 'hero': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as any;
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
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as any;
              content = (
                <AboutSection key={section.id} aboutData={d} isPreview={isPreview} sectionId={section.id} />
              );
              break;
            }

            case 'experience': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as ExperienceData;
              content = (
                <ExperienceSection key={section.id} experienceData={d} isPreview={isPreview} sectionId={section.id} />
              );
              break;
            }

            case 'projects': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as ProjectsData;
              content = (
                <ProjectsSection key={section.id} projectsData={d} isPreview={isPreview} sectionId={section.id} />
              );
              break;
            }

            case 'skills': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as any;
              content = (
                <SkillsSection key={section.id} skillsData={d} isPreview={isPreview} sectionId={section.id} />
              );
              break;
            }

            case 'education': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as EducationData;
              content = (
                <EducationSection key={section.id} educationData={d} isPreview={isPreview} sectionId={section.id} />
              );
              break;
            }

            case 'contact': {
              const data = (section as any)?.content || {};
              const d = (Object.keys(data).length > 0 ? data : section.data) as any;
              content = (
                <ContactSection key={section.id} contactData={d} isPreview={isPreview} sectionId={section.id} />
              );
              break;
            }

            case 'footer': {
              content = (
                <Footer key={section.id} sections={sections} heroName={liveHeroName} variant="mono" />
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
    <div className="bg-white text-black min-h-screen overflow-x-hidden">
      <Navbar
        sections={sections}
        navData={navData}
        isPreview={isPreview}
        heroName={heroData.fullName}
        variant="mono"
      />
      <HeroSection heroData={heroData} isPreview={isPreview} />
      <AboutSection aboutData={aboutData} isPreview={isPreview} />
      <ExperienceSection experienceData={experienceData} isPreview={isPreview} />
      <ProjectsSection projectsData={projectsData} isPreview={isPreview} />
      <SkillsSection skillsData={skillsData} isPreview={isPreview} />
      <EducationSection educationData={educationData} isPreview={isPreview} />
      <ContactSection contactData={contactData} isPreview={isPreview} />
      <Footer sections={sections} heroName={heroData.fullName} variant="mono" />
    </div>
  );
}

export const ElegantMonochromeTemplate = React.memo(ElegantMonochromeTemplateComponent);
ElegantMonochromeTemplate.displayName = 'ElegantMonochromeTemplate';
