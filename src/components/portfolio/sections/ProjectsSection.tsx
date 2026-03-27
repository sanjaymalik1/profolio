"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ProjectsData, SectionStyling, Project } from '@/types/portfolio';
import { Github, ExternalLink, Plus } from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableImage } from '@/components/editor/inline/EditableImage';

interface ProjectsSectionProps {
  data: ProjectsData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<ProjectsData>) => void;
  onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

// Design tokens
const container = 'max-w-5xl mx-auto px-6';
const sectionPy = 'py-24';

// Section heading component
function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-14">
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">{title}</h2>
      {subtitle && <p className="text-slate-500 text-base max-w-xl">{subtitle}</p>}
      <div className="mt-4 w-10 h-0.5 bg-slate-900" />
    </div>
  );
}

export default function ProjectsSection({
  data,
  isEditing = false,
  isPublicView = false,
  onEdit,
  onDataChange,
}: ProjectsSectionProps) {
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;
  const isPreview = !isPublicView;
  const projects = data.projects || [];

  return (
    <section
      id="projects"
      className={`${sectionPy} px-6 bg-white`}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className={container}>
        <SectionHeading
          title={inlineEditMode ? (
            <EditableText
              value={data.heading || ''}
              onChange={(v) => onDataChange?.({ heading: v })}
              placeholder="Projects"
              className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
              as="span"
            />
          ) as unknown as string : (data.heading || 'Projects')}
        />

        {/* Empty state */}
        {inlineEditMode && projects.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mb-2">No projects added yet</p>
              <p className="text-xs text-slate-400">Add projects through the Properties panel on the right</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project: Project, i: number) => (
              <motion.article
                key={project.id || i}
                initial={!isEditing ? { opacity: 0, y: 20 } : undefined}
                whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                viewport={!isEditing ? { once: true } : undefined}
                transition={!isEditing ? { duration: 0.5, delay: i * 0.07 } : undefined}
                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300"
              >
                {/* Card image placeholder */}
                <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                  {/* Abstract geometric pattern */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(203 213 225) 1px, transparent 0)',
                      backgroundSize: '18px 18px',
                    }}
                  />

                  {/* Project image or initial */}
                  {inlineEditMode ? (
                    <EditableImage
                      value={project.images?.[0] || ''}
                      onChange={(value) => {
                        const updated = [...projects];
                        const idx = projects.findIndex(p => p.id === project.id);
                        updated[idx] = { ...project, images: [value, ...(project.images?.slice(1) || [])] };
                        onDataChange?.({ projects: updated });
                      }}
                      aspectRatio="video"
                      containerClassName="w-full h-full relative z-10"
                    />
                  ) : project.images?.[0] ? (
                    <div className="w-full h-full relative z-10">
                      <Image src={project.images[0]} alt={project.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-sm">
                      <span className="text-base font-bold text-slate-700">
                        {project.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Category badge */}
                  {project.category && (
                    <span className="absolute top-3 right-3 z-20 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                      {project.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                    {inlineEditMode ? (
                      <EditableText
                        value={project.title}
                        onChange={(v) => {
                          const updated = [...projects];
                          const idx = projects.findIndex(p => p.id === project.id);
                          updated[idx] = { ...project, title: v };
                          onDataChange?.({ projects: updated });
                        }}
                        placeholder="Project Title"
                        className="outline-none focus:ring-1 focus:ring-slate-400/50 rounded px-1 -mx-1"
                        as="span"
                      />
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
                    {inlineEditMode ? (
                      <EditableText
                        value={project.description}
                        onChange={(v) => {
                          const updated = [...projects];
                          const idx = projects.findIndex(p => p.id === project.id);
                          updated[idx] = { ...project, description: v };
                          onDataChange?.({ projects: updated });
                        }}
                        placeholder="Describe the project..."
                        className="outline-none focus:ring-1 focus:ring-slate-400/50 rounded px-1 -mx-1"
                        multiline
                        as="span"
                      />
                    ) : (
                      project.description
                    )}
                  </p>

                  {/* Tech stack */}
                  {(project.technologies || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.slice(0, 4).map((t, ti) => (
                        <span key={ti} className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                          {inlineEditMode ? (
                            <EditableText
                              value={t || ''}
                              onChange={(v) => {
                                const updated = [...projects];
                                const idx = projects.findIndex(p => p.id === project.id);
                                const nextTechnologies = [...(project.technologies || [])];
                                nextTechnologies[ti] = v;
                                updated[idx] = { ...project, technologies: nextTechnologies };
                                onDataChange?.({ projects: updated });
                              }}
                              placeholder="Tech"
                              className="outline-none focus:ring-1 focus:ring-slate-400/50 rounded px-1 -mx-1"
                              as="span"
                            />
                          ) : (
                            t
                          )}
                        </span>
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
        )}
      </div>
    </section>
  );
}
