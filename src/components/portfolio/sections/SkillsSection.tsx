"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SkillsData, SectionStyling } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Code2, Wrench, Globe, Star, Zap, Plus } from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { spacing } from '@/design/spacing';
import { typography, textColors } from '@/design/typography';

interface SkillsSectionProps {
  data: SkillsData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<SkillsData>) => void;
  onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

const CATEGORY_CONFIG = {
  technical: {
    label: 'Technical Skills',
    icon: Code2,
    gradient: 'from-indigo-500 to-purple-500',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    border: 'hover:border-indigo-200',
    barColor: 'from-indigo-500 to-purple-500',
  },
  soft: {
    label: 'Soft Skills',
    icon: Star,
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    border: 'hover:border-amber-200',
    barColor: 'from-amber-500 to-orange-500',
  },
  languages: {
    label: 'Languages',
    icon: Globe,
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    border: 'hover:border-emerald-200',
    barColor: 'from-emerald-500 to-teal-500',
  },
  tools: {
    label: 'Tools & Platforms',
    icon: Wrench,
    gradient: 'from-rose-500 to-pink-500',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    border: 'hover:border-rose-200',
    barColor: 'from-rose-500 to-pink-500',
  },
} as const;

export default function SkillsSection({
  data,
  styling,
  isEditing = false,
  isPublicView = false,
  onEdit,
  onDataChange,
}: SkillsSectionProps) {
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;

  const containerStyle = {
    backgroundColor: styling.backgroundColor || 'transparent',
    color: styling.textColor || 'inherit',
    padding: `${styling.padding?.top || '3rem'} ${styling.padding?.right || '2rem'} ${styling.padding?.bottom || '3rem'} ${styling.padding?.left || '2rem'}`,
    margin: `${styling.margin?.top || '0'} 0 ${styling.margin?.bottom || '0'} 0`,
    textAlign: styling.alignment || 'left',
  } as React.CSSProperties;

  const skillsByCategory = {
    technical: data.skillCategories?.technical || [],
    soft: data.skillCategories?.soft || [],
    languages: data.skillCategories?.languages || [],
    tools: data.skillCategories?.tools || [],
  };

  const totalSkills = Object.values(skillsByCategory).reduce((s, a) => s + a.length, 0);
  const expertSkills = Object.values(skillsByCategory).reduce((s, a) => s + a.filter(sk => sk.level >= 90).length, 0);
  const advancedSkills = Object.values(skillsByCategory).reduce((s, a) => s + a.filter(sk => sk.level >= 75).length, 0);

  const isEmpty = totalSkills === 0;

  return (
    <motion.section
      className={`relative ${spacing.section}`}
      style={containerStyle}
      initial={!isEditing && styling.animation?.type !== 'none' ? 'hidden' : 'visible'}
      whileInView={!isEditing ? 'visible' : undefined}
      viewport={!isEditing ? { once: true, margin: '-100px' } : undefined}
      variants={!isEditing ? {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
      } : undefined}
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
              <EditableText
                value={data.heading || ''}
                onChange={(value) => onDataChange?.({ heading: value })}
                placeholder="Skills & Expertise"
                className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2"
                as="span"
              />
            ) : (
              data.heading || 'Skills & Expertise'
            )}
          </h2>
          <p className={`${typography.body} ${textColors.muted} max-w-2xl mx-auto ${spacing.marginBottom.medium}`}>
            Technologies, tools, and capabilities I bring to every project
          </p>
          <div className="w-20 h-1 bg-current mx-auto opacity-50 rounded-full" />
        </motion.div>

        {/* Empty state */}
        {inlineEditMode && isEmpty ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mb-2">No skills added yet</p>
              <p className="text-xs text-slate-400">Add skills through the Properties panel on the right</p>
            </div>
          </div>
        ) : (
          <>
            {/* Category cards — 2-column grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
              {(Object.entries(skillsByCategory) as [keyof typeof CATEGORY_CONFIG, typeof skillsByCategory.technical][]).map(
                ([key, skills], catIdx) => {
                  const config = CATEGORY_CONFIG[key];
                  const Icon = config.icon;
                  if (!inlineEditMode && skills.length === 0) return null;

                  return (
                    <motion.div
                      key={key}
                      initial={!isEditing ? { opacity: 0, y: 30 } : undefined}
                      whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                      viewport={!isEditing ? { once: true } : undefined}
                      transition={!isEditing ? { delay: 0.15 + catIdx * 0.1, duration: 0.55, ease: 'easeOut' } : undefined}
                      whileHover={!isEditing ? { y: -3 } : undefined}
                    >
                      <Card className={`border border-slate-200 ${config.border} hover:shadow-md transition-all duration-300 overflow-hidden h-full`}>
                        {/* Gradient accent top bar */}
                        <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />
                        <CardContent className="p-5 sm:p-6">

                          {/* Category header */}
                          <div className="flex items-center gap-3 mb-5">
                            <div className={`p-2.5 ${config.iconBg} rounded-lg border border-slate-100 flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${config.iconColor}`} />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-slate-900">{config.label}</h3>
                              <p className="text-xs text-slate-500">{skills.length} skill{skills.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>

                          {skills.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No skills added in this category yet</p>
                          ) : styling.layout === 'grid' ? (
                            /* Badge/pill layout */
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill, si) => (
                                <motion.div
                                  key={si}
                                  initial={!isEditing ? { opacity: 0, scale: 0.8 } : undefined}
                                  whileInView={!isEditing ? { opacity: 1, scale: 1 } : undefined}
                                  viewport={!isEditing ? { once: true } : undefined}
                                  transition={!isEditing ? { delay: 0.2 + catIdx * 0.1 + si * 0.04, duration: 0.35, type: 'spring', stiffness: 120 } : undefined}
                                  whileHover={!isEditing ? { scale: 1.06 } : undefined}
                                >
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-default font-medium"
                                  >
                                    {skill.name}
                                    <span className="ml-1.5 text-[10px] opacity-60">{skill.level}%</span>
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            /* Progress bar layout (default) */
                            <div className="space-y-4">
                              {skills.map((skill, si) => (
                                <motion.div
                                  key={si}
                                  initial={!isEditing ? { opacity: 0, x: -15 } : undefined}
                                  whileInView={!isEditing ? { opacity: 1, x: 0 } : undefined}
                                  viewport={!isEditing ? { once: true } : undefined}
                                  transition={!isEditing ? { delay: 0.2 + catIdx * 0.1 + si * 0.05, duration: 0.45 } : undefined}
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-slate-700">
                                      {inlineEditMode ? (
                                        <EditableText
                                          value={skill.name}
                                          onChange={(value) => {
                                            const updated = [...skills];
                                            updated[si] = { ...skill, name: value };
                                            onDataChange?.({ skillCategories: { ...data.skillCategories, [key]: updated } });
                                          }}
                                          placeholder="Skill name"
                                          className="outline-none focus:ring-1 focus:ring-indigo-400/50 rounded px-1 -mx-1"
                                          as="span"
                                        />
                                      ) : skill.name}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">{skill.level}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                      className={`h-full rounded-full bg-gradient-to-r ${config.barColor}`}
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${skill.level}%` }}
                                      viewport={{ once: true }}
                                      transition={{ delay: 0.35 + catIdx * 0.1 + si * 0.05, duration: 0.9, ease: 'easeOut' }}
                                    />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                }
              )}
            </div>

            {/* Stats bar */}
            {totalSkills > 0 && (
              <motion.div
                className="mt-10 sm:mt-12"
                initial={!isEditing ? { opacity: 0, y: 20 } : undefined}
                whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                viewport={!isEditing ? { once: true } : undefined}
                transition={!isEditing ? { delay: 0.5, duration: 0.6 } : undefined}
              >
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total Skills', value: totalSkills, color: 'text-indigo-600', icon: Zap },
                    { label: 'Expert (90%+)', value: expertSkills, color: 'text-emerald-600', icon: Star },
                    { label: 'Advanced (75%+)', value: advancedSkills, color: 'text-purple-600', icon: Code2 },
                  ].map(({ label, value, color, icon: Icon }, i) => (
                    <Card key={i} className="text-center border-2 hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-5">
                        <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                        <div className={`text-2xl sm:text-3xl font-bold ${color} mb-1`}>{value}</div>
                        <div className="text-xs text-slate-500 font-medium">{label}</div>
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