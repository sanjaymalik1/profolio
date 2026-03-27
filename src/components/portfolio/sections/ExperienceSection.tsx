"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExperienceData, SectionStyling, Experience } from '@/types/portfolio';
import { Calendar, Building2, Plus } from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';

interface ExperienceSectionProps {
  data: ExperienceData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<ExperienceData>) => void;
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

export default function ExperienceSection({
  data,
  isEditing = false,
  isPublicView = false,
  onEdit,
  onDataChange,
}: ExperienceSectionProps) {
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;
  const experiences = data.experiences || [];

  if (!inlineEditMode && experiences.length === 0) return null;

  return (
    <section
      id="experience"
      className={`${sectionPy} px-6 bg-white`}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className={container}>
        <SectionHeading
          title={inlineEditMode ? (
            <EditableText
              value={data.heading || ''}
              onChange={(value) => onDataChange?.({ heading: value })}
              placeholder="Experience"
              className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
              as="span"
            />
          ) as unknown as string : (data.heading || 'Experience')}
        />

        {/* Empty state */}
        {inlineEditMode && experiences.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mb-2">No work experience added yet</p>
              <p className="text-xs text-slate-400">Add entries through the Properties panel on the right</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline track */}
            <div className="absolute top-0 bottom-0 left-[7px] w-px bg-slate-200 hidden sm:block" />

            <div className="space-y-10">
              {experiences.map((exp: Experience, i: number) => (
                <motion.div
                  key={exp.id || i}
                  initial={!isEditing ? { opacity: 0, y: 18 } : undefined}
                  whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                  viewport={!isEditing ? { once: true } : undefined}
                  transition={!isEditing ? { duration: 0.5, delay: i * 0.08 } : undefined}
                  className="sm:pl-8 relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-5 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-400 hidden sm:block" />

                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {inlineEditMode ? (
                            <EditableText
                              value={exp.position}
                              onChange={(value) => {
                                const updated = [...experiences];
                                updated[i] = { ...exp, position: value };
                                onDataChange?.({ experiences: updated });
                              }}
                              placeholder="Job Title"
                              className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                              as="span"
                            />
                          ) : (
                            exp.position
                          )}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {inlineEditMode ? (
                            <EditableText
                              value={exp.company}
                              onChange={(value) => {
                                const updated = [...experiences];
                                updated[i] = { ...exp, company: value };
                                onDataChange?.({ experiences: updated });
                              }}
                              placeholder="Company Name"
                              className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                              as="span"
                            />
                          ) : (
                            exp.company
                          )}
                          {(exp.location || inlineEditMode) && (
                            <span className="text-slate-400">
                              {' · '}
                              {inlineEditMode ? (
                                <EditableText
                                  value={exp.location || ''}
                                  onChange={(value) => {
                                    const updated = [...experiences];
                                    updated[i] = { ...exp, location: value || undefined };
                                    onDataChange?.({ experiences: updated });
                                  }}
                                  placeholder="Location"
                                  className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                                  as="span"
                                />
                              ) : (
                                exp.location
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5" />
                        {inlineEditMode ? (
                          <>
                            <EditableText
                              value={exp.startDate || ''}
                              onChange={(value) => {
                                const updated = [...experiences];
                                updated[i] = { ...exp, startDate: value };
                                onDataChange?.({ experiences: updated });
                              }}
                              placeholder="Start"
                              className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                              as="span"
                            />
                            <span> — </span>
                            <EditableText
                              value={exp.endDate || ''}
                              onChange={(value) => {
                                const updated = [...experiences];
                                updated[i] = { ...exp, endDate: value || undefined };
                                onDataChange?.({ experiences: updated });
                              }}
                              placeholder="Present"
                              className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                              as="span"
                            />
                          </>
                        ) : (
                          <>{exp.startDate} — {exp.endDate || 'Present'}</>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {(exp.description || inlineEditMode) && (
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {inlineEditMode ? (
                          <EditableText
                            value={exp.description || ''}
                            onChange={(value) => {
                              const updated = [...experiences];
                              updated[i] = { ...exp, description: value };
                              onDataChange?.({ experiences: updated });
                            }}
                            placeholder="Describe your role and impact..."
                            className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1 text-slate-600"
                            multiline
                            as="span"
                          />
                        ) : (
                          exp.description
                        )}
                      </p>
                    )}

                    {/* Responsibilities */}
                    {(exp.responsibilities || []).length > 0 && (
                      <ul className="space-y-1.5 mb-4">
                        {exp.responsibilities.map((r, ri) => (
                          <li key={ri} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-slate-300 mt-1.5">▸</span>
                            {inlineEditMode ? (
                              <EditableText
                                value={r || ''}
                                onChange={(value) => {
                                  const updated = [...experiences];
                                  const nextResponsibilities = [...(exp.responsibilities || [])];
                                  nextResponsibilities[ri] = value;
                                  updated[i] = { ...exp, responsibilities: nextResponsibilities };
                                  onDataChange?.({ experiences: updated });
                                }}
                                placeholder="Responsibility"
                                className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                                as="span"
                              />
                            ) : (
                              r
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Technologies */}
                    {(exp.technologies || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                        {exp.technologies!.map((t, ti) => (
                          <span key={ti} className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                            {inlineEditMode ? (
                              <EditableText
                                value={t || ''}
                                onChange={(value) => {
                                  const updated = [...experiences];
                                  const nextTechnologies = [...(exp.technologies || [])];
                                  nextTechnologies[ti] = value;
                                  updated[i] = { ...exp, technologies: nextTechnologies };
                                  onDataChange?.({ experiences: updated });
                                }}
                                placeholder="Technology"
                                className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                                as="span"
                              />
                            ) : (
                              t
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
