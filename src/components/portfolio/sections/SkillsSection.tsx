"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SkillsData, SectionStyling, Skill } from '@/types/portfolio';
import { Plus } from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';

interface SkillsSectionProps {
  data: SkillsData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<SkillsData>) => void;
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

export default function SkillsSection({
  data,
  isEditing = false,
  isPublicView = false,
  onEdit,
  onDataChange,
}: SkillsSectionProps) {
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;

  const technical = data.skillCategories?.technical || [];
  const tools = data.skillCategories?.tools || [];
  const soft = data.skillCategories?.soft || [];
  const languages = data.skillCategories?.languages || [];

  const groups = [
    { label: 'Core Technologies', key: 'technical' as const, items: technical },
    { label: 'Tools & Infrastructure', key: 'tools' as const, items: tools },
    { label: 'Soft Skills', key: 'soft' as const, items: soft },
    { label: 'Languages', key: 'languages' as const, items: languages },
  ].filter((g) => g.items.length > 0 || inlineEditMode);

  const isEmpty = technical.length === 0 && tools.length === 0 && soft.length === 0 && languages.length === 0;

  return (
    <section
      id="skills"
      className={`${sectionPy} px-6 bg-slate-50 ${isEditing ? 'cursor-pointer' : ''}`}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className={container}>
        <SectionHeading
          title={inlineEditMode ? (
            <EditableText
              value={data.heading || ''}
              onChange={(value) => onDataChange?.({ heading: value })}
              placeholder="Skills"
              className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
              as="span"
            />
          ) as unknown as string : (data.heading || 'Skills')}
        />

        {/* Empty state */}
        {inlineEditMode && isEmpty ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mb-2">No skills added yet</p>
              <p className="text-xs text-slate-400">Add skills through the Properties panel on the right</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-8">
            {groups.map((group) => (
              <motion.div
                key={group.label}
                initial={!isEditing ? { opacity: 0, y: 16 } : undefined}
                whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                viewport={!isEditing ? { once: true } : undefined}
                transition={!isEditing ? { duration: 0.5 } : undefined}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
                  {group.label}
                </h3>
                {group.items.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No skills added in this category yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill: Skill, si: number) => (
                      <motion.span
                        key={si}
                        initial={!isEditing ? { opacity: 0, scale: 0.9 } : undefined}
                        whileInView={!isEditing ? { opacity: 1, scale: 1 } : undefined}
                        viewport={!isEditing ? { once: true } : undefined}
                        transition={!isEditing ? { duration: 0.3, delay: si * 0.04 } : undefined}
                        className="inline-flex items-center px-3.5 py-1.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors duration-150 cursor-default"
                      >
                        {inlineEditMode ? (
                          <EditableText
                            value={skill.name}
                            onChange={(value) => {
                              const updated = [...group.items] as Skill[];
                              updated[si] = { ...skill, name: value };
                              onDataChange?.({ skillCategories: { ...data.skillCategories, [group.key]: updated } });
                            }}
                            placeholder="Skill name"
                            className="outline-none focus:ring-1 focus:ring-slate-400/50 rounded px-1 -mx-1 bg-transparent"
                            as="span"
                          />
                        ) : (
                          skill.name
                        )}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
