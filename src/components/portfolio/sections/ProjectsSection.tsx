"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProjectsData, SectionStyling } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Github, Calendar, User, Star, Plus, Layers, CheckCircle2, Code2 } from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableImage } from '@/components/editor/inline/EditableImage';
import { typography, textColors } from '@/design/typography';
import { spacing } from '@/design/spacing';

interface ProjectsSectionProps {
  data: ProjectsData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<ProjectsData>) => void;
  onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

// Cycle through gradient pairs per project card
const CARD_GRADIENTS = [
  'from-indigo-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-fuchsia-500',
];

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
  planned: 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function ProjectsSection({
  data, styling, isEditing = false, isPublicView = false, onEdit, onDataChange,
}: ProjectsSectionProps) {
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;
  const isGridLayout = styling.layout === 'grid' || styling.layout === 'masonry';

  const containerStyle = {
    backgroundColor: styling.backgroundColor || 'transparent',
    color: styling.textColor || 'inherit',
    padding: `${styling.padding?.top || '3rem'} ${styling.padding?.right || '2rem'} ${styling.padding?.bottom || '3rem'} ${styling.padding?.left || '2rem'}`,
    margin: `${styling.margin?.top || '0'} 0 ${styling.margin?.bottom || '0'} 0`,
    textAlign: styling.alignment || 'left',
  } as React.CSSProperties;

  const projects = data.projects || [];

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const featuredProjects = projects.filter(p => p.featured).length;
  const techCount = new Set(projects.flatMap(p => p.technologies || [])).size;

  return (
    <motion.section
      className={`relative ${spacing.section}`}
      style={containerStyle}
      initial={!isEditing && styling.animation?.type !== 'none' ? 'hidden' : 'visible'}
      whileInView={!isEditing ? 'visible' : undefined}
      viewport={!isEditing ? { once: true, margin: '-100px' } : undefined}
      variants={!isEditing ? { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } } : undefined}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className={`${spacing.container} px-4 sm:px-6 lg:px-8 relative z-0`}>

        {/* Section Header */}
        <motion.div
          className={`text-center ${spacing.marginBottom.xlarge}`}
          initial={!isEditing ? { opacity: 0, y: 20 } : undefined}
          whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
          viewport={!isEditing ? { once: true } : undefined}
          transition={!isEditing ? { delay: 0.1, duration: 0.6 } : undefined}
        >
          <h2 className={`${typography.sectionTitle} ${spacing.marginBottom.small}`}>
            {inlineEditMode ? (
              <EditableText value={data.heading || ''} onChange={(v) => onDataChange?.({ heading: v })}
                placeholder="Featured Projects" className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2" as="span" />
            ) : (data.heading || 'Featured Projects')}
          </h2>
          <p className={`${typography.body} ${textColors.muted} max-w-2xl mx-auto ${spacing.marginBottom.medium}`}>
            A showcase of my recent work and contributions
          </p>
          <div className="w-20 h-1 bg-current mx-auto opacity-50 rounded-full" />
        </motion.div>

        {/* Empty state */}
        {inlineEditMode && projects.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-indigo-500" />
              </div>
              <p className="text-slate-500 text-sm mb-1">No projects added yet</p>
              <p className="text-xs text-slate-400">Add projects through the Properties panel on the right</p>
            </div>
          </div>
        ) : (
          <>
            {/* Project cards grid */}
            <div className={`grid gap-5 sm:gap-6 ${isGridLayout ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {projects.map((project, index) => {
                const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
                const statusStyle = project.status ? (STATUS_STYLES[project.status] || STATUS_STYLES.planned) : '';

                return (
                  <motion.div
                    key={project.id}
                    initial={!isEditing ? { opacity: 0, y: 30 } : undefined}
                    whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                    viewport={!isEditing ? { once: true } : undefined}
                    transition={!isEditing ? { delay: 0.15 + index * 0.1, duration: 0.55, ease: 'easeOut' } : undefined}
                    whileHover={!isEditing ? { y: -5 } : undefined}
                    className="group"
                  >
                    <Card className="border border-slate-200 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                      {/* Gradient accent bar */}
                      <div className={`h-1 bg-gradient-to-r ${gradient} flex-shrink-0`} />

                      {/* Project image */}
                      {(project.images && project.images.length > 0) || inlineEditMode ? (
                        <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio: '16/9' }}>
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
                              containerClassName="w-full h-full"
                            />
                          ) : project.images?.[0] ? (
                            <Image src={project.images[0]} alt={project.title} fill
                              className="object-cover group-hover:scale-105 transition-transform duration-400" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-10 flex items-center justify-center`}>
                              <Layers className="w-12 h-12 text-slate-400" />
                            </div>
                          )}
                          {/* Badges overlaid on image */}
                          <div className="absolute top-3 right-3 flex gap-1.5">
                            {project.featured && (
                              <Badge className="bg-amber-500 text-white text-[10px] px-2 py-0.5 border-0 shadow">
                                <Star className="w-2.5 h-2.5 mr-1" />Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* No-image placeholder */
                        <div className={`h-3 bg-gradient-to-r ${gradient} opacity-30`} />
                      )}

                      <CardContent className="p-5 flex flex-col flex-1 gap-3">

                        {/* Title row */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug">
                            {inlineEditMode ? (
                              <EditableText value={project.title}
                                onChange={(v) => {
                                  const updated = [...projects];
                                  const idx = projects.findIndex(p => p.id === project.id);
                                  updated[idx] = { ...project, title: v };
                                  onDataChange?.({ projects: updated });
                                }}
                                placeholder="Project Title"
                                className="outline-none focus:ring-1 focus:ring-indigo-400/50 rounded px-1 -mx-1" as="span" />
                            ) : project.title}
                          </h3>
                          {project.status && (
                            <Badge variant="outline" className={`text-[10px] px-2 py-0.5 flex-shrink-0 border ${statusStyle}`}>
                              {project.status}
                            </Badge>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {inlineEditMode ? (
                            <EditableText value={project.description}
                              onChange={(v) => {
                                const updated = [...projects];
                                const idx = projects.findIndex(p => p.id === project.id);
                                updated[idx] = { ...project, description: v };
                                onDataChange?.({ projects: updated });
                              }}
                              placeholder="Describe the project..."
                              className="outline-none focus:ring-1 focus:ring-indigo-400/50 rounded px-1 -mx-1"
                              multiline as="span" />
                          ) : project.description}
                        </p>

                        {/* Meta row */}
                        {(project.startDate || project.role || project.category) && (
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            {project.startDate && (
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{project.startDate}</span>
                            )}
                            {project.role && (
                              <span className="flex items-center gap-1"><User className="w-3 h-3" />{project.role}</span>
                            )}
                            {project.category && (
                              <Badge variant="secondary" className="text-[10px] px-2 py-0.5">{project.category}</Badge>
                            )}
                          </div>
                        )}

                        {/* Tech badges */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 6).map((tech, ti) => (
                              <Badge key={ti} variant="outline"
                                className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors cursor-default">
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 6 && (
                              <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-500">
                                +{project.technologies.length - 6}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Action buttons — push to bottom */}
                        {(project.links?.live || project.links?.github) && (
                          <div className="flex gap-2.5 mt-auto pt-2">
                            {project.links.live && (
                              <Link href={project.links.live} target="_blank" rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:shadow-md hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-200">
                                <ExternalLink size={12} />Live Demo
                              </Link>
                            )}
                            {project.links.github && (
                              <Link href={project.links.github} target="_blank" rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 transition-all duration-200">
                                <Github size={12} />Code
                              </Link>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats row */}
            {totalProjects > 0 && (
              <motion.div
                className="mt-10 sm:mt-12"
                initial={!isEditing ? { opacity: 0, y: 20 } : undefined}
                whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                viewport={!isEditing ? { once: true } : undefined}
                transition={!isEditing ? { delay: 0.55, duration: 0.6 } : undefined}
              >
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: 'Total', value: totalProjects, color: 'text-indigo-600', icon: Layers },
                    { label: 'Completed', value: completedProjects, color: 'text-emerald-600', icon: CheckCircle2 },
                    { label: 'Featured', value: featuredProjects, color: 'text-amber-600', icon: Star },
                    { label: 'Technologies', value: techCount, color: 'text-purple-600', icon: Code2 },
                  ].map(({ label, value, color, icon: Icon }, i) => (
                    <Card key={i} className="text-center border border-slate-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4">
                        <Icon className={`w-4 h-4 ${color} mx-auto mb-1.5`} />
                        <div className={`text-xl sm:text-2xl font-bold ${color} mb-0.5`}>{value}</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 font-medium">{label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
}