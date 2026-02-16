"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SkillsData, SectionStyling, Skill } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Code, Palette, Wrench, Globe, Database } from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { typography, textColors } from '@/design/typography';
import { spacing, grid } from '@/design/spacing';

interface SkillsSectionProps {
  data: SkillsData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<SkillsData>) => void;
  onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

const categoryIcons = {
  technical: Code,
  soft: Star,
  tool: Wrench,
  language: Globe
} as const;

export default function SkillsSection({ 
  data, 
  styling, 
  isEditing = false, 
  isPublicView = false,
  onEdit,
  onDataChange,
  onStylingChange 
}: SkillsSectionProps) {
  // Inline editing mode detection
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;

  const animationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: (styling.animation?.duration || 600) / 1000,
        delay: (styling.animation?.delay || 200) / 1000,
        ease: "easeOut" as const
      }
    }
  };

  const containerStyle = {
    backgroundColor: styling.backgroundColor || 'transparent',
    color: styling.textColor || 'inherit',
    padding: `${styling.padding?.top || '3rem'} ${styling.padding?.right || '2rem'} ${styling.padding?.bottom || '3rem'} ${styling.padding?.left || '2rem'}`,
    margin: `${styling.margin?.top || '0'} 0 ${styling.margin?.bottom || '0'} 0`,
    textAlign: styling.alignment || 'left'
  } as React.CSSProperties;

  const getSkillLevelColor = (level: number) => {
    if (level >= 90) return 'text-green-500';
    if (level >= 75) return 'text-blue-500';
    if (level >= 60) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getProgressColor = (level: number) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 75) return 'bg-blue-500';
    if (level >= 60) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  // Group skills by category for display
  const skillsByCategory = {
    technical: data.skillCategories.technical,
    soft: data.skillCategories.soft,
    languages: data.skillCategories.languages,
    tools: data.skillCategories.tools
  };

  return (
    <motion.section 
      className={`relative ${spacing.section}`}
      style={containerStyle}
      initial={!isEditing && styling.animation?.type !== 'none' ? "hidden" : "visible"}
      whileInView={!isEditing ? "visible" : undefined}
      viewport={!isEditing ? { once: true, margin: "-100px" } : undefined}
      variants={!isEditing ? animationVariants : undefined}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className={`${spacing.container} px-4 sm:px-6 lg:px-8 relative z-0`}>
        
        {/* Section Header */}
        <motion.div 
          className={`text-center ${spacing.marginBottom.xlarge}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
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
          <div className="w-20 h-1 bg-current mx-auto opacity-50 rounded-full" />
        </motion.div>

        {/* Skills by Category */}
        {inlineEditMode && Object.values(skillsByCategory).every(arr => !arr || arr.length === 0) ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4">
                Add skills to showcase your expertise
              </p>
              <p className="text-xs text-slate-400">
                Add skills through the Properties panel on the right
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {Object.entries(skillsByCategory).map(([categoryKey, categorySkills], categoryIndex) => {
            const Icon = categoryIcons[categoryKey as keyof typeof categoryIcons] || Star;
            
            return (
              <motion.div
                key={categoryKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + categoryIndex * 0.1, duration: 0.6 }}
              >
                <Card className="border-2 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    
                    {/* Category Header - responsive */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                      <div className="p-2 sm:p-2.5 md:p-3 rounded-lg bg-current/10">
                        <Icon className="text-current" size={20} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold capitalize">
                          {categoryKey === 'technical' ? 'Technical Skills' : 
                           categoryKey === 'soft' ? 'Soft Skills' :
                           categoryKey === 'languages' ? 'Languages' : 'Tools'}
                        </h3>
                      </div>
                    </div>

                    {/* Skills Display */}
                    {styling.layout === 'default' ? (
                      /* Progress Bar Layout */
                      <div className="space-y-4">
                        {categorySkills.map((skill, skillIndex) => (
                          <motion.div
                            key={skillIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ 
                              delay: 0.3 + categoryIndex * 0.1 + skillIndex * 0.05, 
                              duration: 0.5 
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              {inlineEditMode ? (
                                <EditableText
                                  value={skill.name}
                                  onChange={(value) => {
                                    const updatedSkills = [...categorySkills];
                                    updatedSkills[skillIndex] = { ...skill, name: value };
                                    onDataChange?.({
                                      skillCategories: {
                                        ...data.skillCategories,
                                        [categoryKey]: updatedSkills
                                      }
                                    });
                                  }}
                                  placeholder="Skill name"
                                  className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 -mx-1 font-medium"
                                  as="span"
                                />
                              ) : (
                                <span className="font-medium">{skill.name}</span>
                              )}
                              <span className={`text-sm font-semibold ${getSkillLevelColor(skill.level)}`}>
                                {skill.level}%
                              </span>
                            </div>
                            <div className="relative">
                              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <motion.div
                                  className={`h-full ${getProgressColor(skill.level)} rounded-full`}
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${skill.level}%` }}
                                  viewport={{ once: true }}
                                  transition={{ 
                                    delay: 0.5 + categoryIndex * 0.1 + skillIndex * 0.05,
                                    duration: 1,
                                    ease: "easeOut"
                                  }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      /* Badge/Grid Layout - responsive */
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {categorySkills.map((skill, skillIndex) => (
                          <motion.div
                            key={skillIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ 
                              delay: 0.3 + categoryIndex * 0.1 + skillIndex * 0.05, 
                              duration: 0.4,
                              type: "spring",
                              stiffness: 100
                            }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge
                              variant="outline"
                              className={`
                                p-3 text-sm font-medium border-2 hover:shadow-md transition-all cursor-default
                                flex items-center justify-between w-full
                                ${skill.level >= 90 ? 'border-green-200 bg-green-50 text-green-700' : ''}
                                ${skill.level >= 75 && skill.level < 90 ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
                                ${skill.level >= 60 && skill.level < 75 ? 'border-yellow-200 bg-yellow-50 text-yellow-700' : ''}
                                ${skill.level < 60 ? 'border-gray-200 bg-gray-50 text-gray-700' : ''}
                              `}
                            >
                              {inlineEditMode ? (
                                <EditableText
                                  value={skill.name}
                                  onChange={(value) => {
                                    const updatedSkills = [...categorySkills];
                                    updatedSkills[skillIndex] = { ...skill, name: value };
                                    onDataChange?.({
                                      skillCategories: {
                                        ...data.skillCategories,
                                        [categoryKey]: updatedSkills
                                      }
                                    });
                                  }}
                                  placeholder="Skill name"
                                  className="outline-none focus:ring-1 focus:ring-blue-400/50 rounded px-1 -mx-1 truncate"
                                  as="span"
                                />
                              ) : (
                                <span className="truncate">{skill.name}</span>
                              )}
                              <span className="ml-2 text-xs font-bold">
                                {skill.level}%
                              </span>
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
            })}
          </div>
        )}

        {/* Skills Summary Stats */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Skills */}
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-current mb-2">
                  {Object.values(skillsByCategory).reduce((total, skills) => total + skills.length, 0)}
                </div>
                <div className="text-sm text-current/60">Total Skills</div>
              </CardContent>
            </Card>

            {/* Expert Level Skills */}
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Object.values(skillsByCategory).reduce(
                    (total, skills) => total + skills.filter(skill => skill.level >= 90).length, 0
                  )}
                </div>
                <div className="text-sm text-current/60">Expert Level (90%+)</div>
              </CardContent>
            </Card>

            {/* Advanced Skills */}
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Object.values(skillsByCategory).reduce(
                    (total, skills) => total + skills.filter(skill => skill.level >= 75).length, 0
                  )}
                </div>
                <div className="text-sm text-current/60">Advanced (75%+)</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}