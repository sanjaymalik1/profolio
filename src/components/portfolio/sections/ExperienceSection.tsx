"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExperienceData, SectionStyling } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Briefcase,
    MapPin,
    Calendar,
    ChevronRight,
    Plus,
} from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { spacing } from '@/design/spacing';
import { typography, textColors } from '@/design/typography';

interface ExperienceSectionProps {
    data: ExperienceData;
    styling: SectionStyling;
    isEditing?: boolean;
    isPublicView?: boolean;
    onEdit?: () => void;
    onDataChange?: (newData: Partial<ExperienceData>) => void;
    onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

export default function ExperienceSection({
    data,
    styling,
    isEditing = false,
    isPublicView = false,
    onEdit,
    onDataChange,
}: ExperienceSectionProps) {
    const inlineEditMode = isEditing && !isPublicView && !!onDataChange;

    const containerStyle = {
        backgroundColor: styling.backgroundColor || 'transparent',
        color: styling.textColor || 'inherit',
        padding: `${styling.padding?.top || '3rem'} ${styling.padding?.right || '2rem'} ${styling.padding?.bottom || '3rem'} ${styling.padding?.left || '2rem'}`,
        margin: `${styling.margin?.top || '0'} 0 ${styling.margin?.bottom || '0'} 0`,
        textAlign: styling.alignment || 'left',
    } as React.CSSProperties;

    const experiences = data.experiences || [];

    const formatDateRange = (startDate: string, endDate?: string) => {
        if (!startDate) return '';
        const end = endDate || 'Present';
        return `${startDate} – ${end}`;
    };

    return (
        <motion.section
            className={`relative ${spacing.section}`}
            style={containerStyle}
            initial={!isEditing && styling.animation?.type !== 'none' ? 'hidden' : 'visible'}
            whileInView={!isEditing ? 'visible' : undefined}
            viewport={!isEditing ? { once: true, margin: '-100px' } : undefined}
            variants={
                !isEditing
                    ? {
                        hidden: { opacity: 0, y: 30 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: (styling.animation?.duration || 600) / 1000,
                                delay: (styling.animation?.delay || 200) / 1000,
                                ease: 'easeOut',
                            },
                        },
                    }
                    : undefined
            }
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
                                placeholder="Work Experience"
                                className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2"
                                as="span"
                            />
                        ) : (
                            data.heading || 'Work Experience'
                        )}
                    </h2>
                    <p className={`${typography.body} ${textColors.muted} max-w-2xl mx-auto ${spacing.marginBottom.medium}`}>
                        My professional journey and career milestones
                    </p>
                    <div className="w-20 h-1 bg-current mx-auto opacity-50 rounded-full" />
                </motion.div>

                {/* Empty state for editor */}
                {inlineEditMode && experiences.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 px-4">
                        <div className="max-w-md mx-auto">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
                            </div>
                            <p className="text-slate-500 text-xs sm:text-sm mb-2">
                                No work experience added yet
                            </p>
                            <p className="text-xs text-slate-400">
                                Add entries through the Properties panel on the right
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Vertical timeline line */}
                        <div className="absolute left-[28px] sm:left-[34px] top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-transparent hidden sm:block" />

                        <div className="space-y-8 sm:space-y-10">
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={exp.id}
                                    initial={!isEditing ? { opacity: 0, x: -20 } : undefined}
                                    whileInView={!isEditing ? { opacity: 1, x: 0 } : undefined}
                                    viewport={!isEditing ? { once: true } : undefined}
                                    transition={!isEditing ? { delay: 0.15 + index * 0.1, duration: 0.5, ease: 'easeOut' } : undefined}
                                    className="relative flex gap-4 sm:gap-6 group"
                                >
                                    {/* Timeline dot */}
                                    <div className="flex-shrink-0 hidden sm:flex">
                                        <div className="relative w-[56px] sm:w-[68px] flex justify-center">
                                            <motion.div
                                                className="w-4 h-4 rounded-full bg-white border-2 border-slate-400 group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-colors duration-200 mt-5 z-10"
                                                whileHover={{ scale: 1.3 }}
                                            />
                                        </div>
                                    </div>

                                    {/* Card */}
                                    <div className="flex-1 pb-2">
                                        <motion.div whileHover={!isEditing ? { y: -2 } : undefined}>
                                            <Card className="border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                                                {/* Card top accent bar */}
                                                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                                                <CardContent className="p-4 sm:p-5 md:p-6">

                                                    {/* Job header */}
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                        <div className="flex items-start gap-3">
                                                            {/* Company icon */}
                                                            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100 flex-shrink-0 mt-0.5">
                                                                <Briefcase className="w-4 h-4 text-indigo-600" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                                                                    {inlineEditMode ? (
                                                                        <EditableText
                                                                            value={exp.position}
                                                                            onChange={(value) => {
                                                                                const updated = [...experiences];
                                                                                updated[index] = { ...exp, position: value };
                                                                                onDataChange?.({ experiences: updated });
                                                                            }}
                                                                            placeholder="Job Title"
                                                                            className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 -mx-1"
                                                                            as="span"
                                                                        />
                                                                    ) : (
                                                                        exp.position
                                                                    )}
                                                                </h3>
                                                                <p className="text-sm font-medium text-indigo-600 mt-0.5">
                                                                    {inlineEditMode ? (
                                                                        <EditableText
                                                                            value={exp.company}
                                                                            onChange={(value) => {
                                                                                const updated = [...experiences];
                                                                                updated[index] = { ...exp, company: value };
                                                                                onDataChange?.({ experiences: updated });
                                                                            }}
                                                                            placeholder="Company Name"
                                                                            className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 -mx-1"
                                                                            as="span"
                                                                        />
                                                                    ) : (
                                                                        exp.company
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Date & location meta */}
                                                        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end sm:gap-1 ml-11 sm:ml-0">
                                                            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium whitespace-nowrap">
                                                                <Calendar className="w-3 h-3" />
                                                                {formatDateRange(exp.startDate, exp.endDate)}
                                                            </span>
                                                            {exp.location && (
                                                                <span className="flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {exp.location}
                                                                </span>
                                                            )}
                                                            {!exp.endDate && (
                                                                <Badge className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                                                                    Current
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    {exp.description && (
                                                        <p className="text-sm text-slate-600 leading-relaxed mb-3 ml-0 sm:ml-11">
                                                            {inlineEditMode ? (
                                                                <EditableText
                                                                    value={exp.description}
                                                                    onChange={(value) => {
                                                                        const updated = [...experiences];
                                                                        updated[index] = { ...exp, description: value };
                                                                        onDataChange?.({ experiences: updated });
                                                                    }}
                                                                    placeholder="Describe your role and impact..."
                                                                    className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 -mx-1 text-slate-600"
                                                                    multiline
                                                                    as="span"
                                                                />
                                                            ) : (
                                                                exp.description
                                                            )}
                                                        </p>
                                                    )}

                                                    {/* Key responsibilities */}
                                                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                                                        <ul className="space-y-1.5 mb-3 ml-0 sm:ml-11">
                                                            {exp.responsibilities.map((resp, ri) => (
                                                                <li key={ri} className="flex items-start gap-2 text-sm text-slate-600">
                                                                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                                                                    <span>{resp}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}

                                                    {/* Technologies */}
                                                    {exp.technologies && exp.technologies.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 ml-0 sm:ml-11 mt-3">
                                                            {exp.technologies.map((tech, ti) => (
                                                                <Badge
                                                                    key={ti}
                                                                    variant="secondary"
                                                                    className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                                                >
                                                                    {tech}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Summary stats */}
                {experiences.length > 0 && (
                    <motion.div
                        className="mt-14 sm:mt-16"
                        initial={!isEditing ? { opacity: 0, y: 20 } : undefined}
                        whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                        viewport={!isEditing ? { once: true } : undefined}
                        transition={!isEditing ? { delay: 0.4, duration: 0.6 } : undefined}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                                <CardContent className="p-5">
                                    <div className="text-3xl font-bold text-indigo-600 mb-1">
                                        {experiences.length}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">Roles</div>
                                </CardContent>
                            </Card>
                            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                                <CardContent className="p-5">
                                    <div className="text-3xl font-bold text-purple-600 mb-1">
                                        {new Set(experiences.map((e) => e.company)).size}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">Companies</div>
                                </CardContent>
                            </Card>
                            <Card className="text-center border-2 hover:shadow-lg transition-shadow hidden sm:block">
                                <CardContent className="p-5">
                                    <div className="text-3xl font-bold text-emerald-600 mb-1">
                                        {experiences.filter((e) => !e.endDate).length > 0 ? '✓' : experiences.length}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">
                                        {experiences.filter((e) => !e.endDate).length > 0 ? 'Currently Active' : 'Completed'}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
}
