"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EducationData, SectionStyling, Education } from '@/types/portfolio';
import { GraduationCap, Calendar, Plus } from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';

interface EducationSectionProps {
  data: EducationData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<EducationData>) => void;
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

export default function EducationSection({
  data,
  isEditing = false,
  isPublicView = false,
  onEdit,
  onDataChange,
}: EducationSectionProps) {
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;
  const educationList = data.education || [];

  if (!inlineEditMode && educationList.length === 0) return null;

  return (
    <section
      id="education"
      className={`${sectionPy} px-6 bg-slate-50`}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className={container}>
        <SectionHeading
          title={inlineEditMode ? (
            <EditableText
              value={data.heading || ''}
              onChange={(value) => onDataChange?.({ heading: value })}
              placeholder="Education"
              className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
              as="span"
            />
          ) as unknown as string : (data.heading || 'Education')}
        />

        {/* Empty state */}
        {inlineEditMode && educationList.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mb-2">No education entries added yet</p>
              <p className="text-xs text-slate-400">Add entries through the Properties panel on the right</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {educationList.map((edu: Education, i: number) => (
              <motion.div
                key={edu.id || i}
                initial={!isEditing ? { opacity: 0, y: 16 } : undefined}
                whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                viewport={!isEditing ? { once: true } : undefined}
                transition={!isEditing ? { duration: 0.5, delay: i * 0.08 } : undefined}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-100 rounded-xl">
                    <GraduationCap className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900">
                      {inlineEditMode ? (
                        <EditableText
                          value={edu.degree}
                          onChange={(value) => {
                            const updated = [...educationList];
                            updated[i] = { ...edu, degree: value };
                            onDataChange?.({ education: updated });
                          }}
                          placeholder="Degree"
                          className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                          as="span"
                        />
                      ) : (
                        <>
                          {edu.degree}
                          {edu.field && ` in ${edu.field}`}
                        </>
                      )}
                      {inlineEditMode && (
                        <>
                          <span> in </span>
                          <EditableText
                            value={edu.field || ''}
                            onChange={(value) => {
                              const updated = [...educationList];
                              updated[i] = { ...edu, field: value };
                              onDataChange?.({ education: updated });
                            }}
                            placeholder="Field"
                            className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                            as="span"
                          />
                        </>
                      )}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {inlineEditMode ? (
                        <EditableText
                          value={edu.institution}
                          onChange={(value) => {
                            const updated = [...educationList];
                            updated[i] = { ...edu, institution: value };
                            onDataChange?.({ education: updated });
                          }}
                          placeholder="Institution"
                          className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                          as="span"
                        />
                      ) : (
                        edu.institution
                      )}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {inlineEditMode ? (
                        <>
                          <EditableText
                            value={edu.startDate || ''}
                            onChange={(value) => {
                              const updated = [...educationList];
                              updated[i] = { ...edu, startDate: value };
                              onDataChange?.({ education: updated });
                            }}
                            placeholder="Start"
                            className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                            as="span"
                          />
                          <span> — </span>
                          <EditableText
                            value={edu.endDate || ''}
                            onChange={(value) => {
                              const updated = [...educationList];
                              updated[i] = { ...edu, endDate: value || undefined };
                              onDataChange?.({ education: updated });
                            }}
                            placeholder="Present"
                            className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                            as="span"
                          />
                          <span className="ml-2">· GPA: </span>
                          <EditableText
                            value={edu.gpa !== undefined ? String(edu.gpa) : ''}
                            onChange={(value) => {
                              const numericValue = Number(value);
                              const updated = [...educationList];
                              updated[i] = { ...edu, gpa: Number.isFinite(numericValue) ? numericValue : edu.gpa };
                              onDataChange?.({ education: updated });
                            }}
                            placeholder="4.0"
                            className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                            as="span"
                          />
                        </>
                      ) : (
                        <>
                          {edu.startDate} — {edu.endDate || 'Present'}
                          {edu.gpa && <span className="ml-2">· GPA: {edu.gpa}</span>}
                        </>
                      )}
                    </div>
                    {(edu.coursework || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {edu.coursework!.map((c, ci) => (
                          <span key={ci} className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                            {inlineEditMode ? (
                              <EditableText
                                value={c || ''}
                                onChange={(value) => {
                                  const updated = [...educationList];
                                  const nextCoursework = [...(edu.coursework || [])];
                                  nextCoursework[ci] = value;
                                  updated[i] = { ...edu, coursework: nextCoursework };
                                  onDataChange?.({ education: updated });
                                }}
                                placeholder="Course"
                                className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                                as="span"
                              />
                            ) : (
                              c
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
