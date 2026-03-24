"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AboutData, SectionStyling } from '@/types/portfolio';
import { MapPin, ChevronRight } from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableImage } from '@/components/editor/inline/EditableImage';
import { EditableList } from '@/components/editor/inline/EditableList';

interface AboutSectionProps {
  data: AboutData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<AboutData>) => void;
  onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

// Design tokens (Executive Pro style)
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

// Tech badge component
function TechBadge({ label }: { label: string }) {
  return (
    <span className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full border border-slate-200">
      {label}
    </span>
  );
}

export default function AboutSection({
  data,
  isEditing = false,
  isPublicView = false,
  onEdit,
  onDataChange,
}: AboutSectionProps) {
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;

  return (
    <section
      id="about"
      className={`${sectionPy} px-6 bg-slate-50`}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className={container}>
        <SectionHeading
          title={inlineEditMode ? (
            <EditableText
              value={data.heading || ''}
              onChange={(v) => onDataChange?.({ heading: v })}
              placeholder="About Me"
              className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
              as="span"
            />
          ) as unknown as string : (data.heading || 'About Me')}
        />

        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Text column */}
          <motion.div
            className="md:col-span-3"
            initial={!isEditing ? { opacity: 0, y: 20 } : undefined}
            whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
            viewport={!isEditing ? { once: true } : undefined}
            transition={!isEditing ? { duration: 0.55 } : undefined}
          >
            {/* Profile image (optional, shown at top on mobile) */}
            {(data.profileImage || inlineEditMode) && (
              <div className="mb-8 md:hidden">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm relative">
                  {inlineEditMode ? (
                    <EditableImage
                      value={data.profileImage || ''}
                      onChange={(url) => onDataChange?.({ profileImage: url })}
                      alt="Profile"
                      containerClassName="w-full h-full"
                      className="object-cover"
                      aspectRatio="square"
                    />
                  ) : data.profileImage ? (
                    <Image src={data.profileImage} alt="Profile" fill className="object-cover" />
                  ) : null}
                </div>
              </div>
            )}

            <p className="text-slate-600 text-base leading-relaxed mb-8">
              {inlineEditMode ? (
                <EditableText
                  value={data.content || ''}
                  onChange={(v) => onDataChange?.({ content: v })}
                  placeholder="Tell your story here. Share your background, experience, and what drives you."
                  className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1 block min-h-[80px]"
                  as="span"
                  multiline
                />
              ) : (
                data.content || 'Tell your story here. Share your background, experience, and what drives you.'
              )}
            </p>

            {/* Highlights */}
            {((data.highlights && data.highlights.length > 0) || inlineEditMode) && (
              <ul className="space-y-3">
                {inlineEditMode ? (
                  <EditableList
                    items={data.highlights || []}
                    onChange={(items) => onDataChange?.({ highlights: items })}
                    placeholder="Enter a highlight..."
                    addButtonText="Add highlight"
                    emptyMessage="No highlights yet. Click 'Add highlight' to get started."
                    renderItem={(item, index, onEditItem, onDelete) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3 text-slate-700 text-sm group"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.07 }}
                      >
                        <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => onEditItem(e.target.value)}
                          onBlur={() => { if (!item.trim()) onDelete(); }}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          placeholder="Enter a highlight..."
                          className="flex-1 bg-transparent border-none outline-none focus:ring-1 focus:ring-slate-400/50 rounded px-1 -mx-1 text-sm text-slate-700"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onDelete(); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-red-400 text-xs"
                        >
                          ×
                        </button>
                      </motion.li>
                    )}
                  />
                ) : (
                  data.highlights?.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={!isEditing ? { opacity: 0, x: -10 } : undefined}
                      whileInView={!isEditing ? { opacity: 1, x: 0 } : undefined}
                      viewport={!isEditing ? { once: true } : undefined}
                      transition={!isEditing ? { duration: 0.4, delay: i * 0.07 } : undefined}
                      className="flex items-start gap-3 text-slate-700 text-sm"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      {h}
                    </motion.li>
                  ))
                )}
              </ul>
            )}
          </motion.div>

          {/* Quick facts panel */}
          <motion.div
            className="md:col-span-2"
            initial={!isEditing ? { opacity: 0, y: 20 } : undefined}
            whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
            viewport={!isEditing ? { once: true } : undefined}
            transition={!isEditing ? { duration: 0.55, delay: 0.1 } : undefined}
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
                Quick Facts
              </h3>
              <div className="space-y-4 text-sm">
                {/* Location */}
                {(data.personalInfo?.location || (inlineEditMode && data.quickFacts)) && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {data.personalInfo?.location || data.quickFacts?.[0] || 'Your Location'}
                  </div>
                )}

                {/* Languages */}
                {(data.personalInfo?.languages && data.personalInfo.languages.length > 0) && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1.5">Languages</p>
                    <div className="flex flex-wrap gap-1.5">
                      {data.personalInfo.languages.map((l, i) => (
                        <TechBadge key={i} label={l} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                {(data.personalInfo?.interests && data.personalInfo.interests.length > 0) && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1.5">Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {data.personalInfo.interests.map((l, i) => (
                        <TechBadge key={i} label={l} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quote */}
                {data.quote && (
                  <blockquote className="border-l-2 border-slate-300 pl-4 text-slate-500 italic text-xs leading-relaxed mt-4">
                    {inlineEditMode ? (
                      <EditableText
                        value={data.quote}
                        onChange={(v) => onDataChange?.({ quote: v })}
                        placeholder="An inspirational quote..."
                        className="outline-none focus:ring-1 focus:ring-slate-400/50 rounded px-1 -mx-1"
                        as="span"
                      />
                    ) : `"${data.quote}"`}
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
