"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EducationData, SectionStyling } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    GraduationCap,
    MapPin,
    Calendar,
    Star,
    BookOpen,
    Plus,
} from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { spacing } from '@/design/spacing';
import { typography, textColors } from '@/design/typography';

interface EducationSectionProps {
    data: EducationData;
    styling: SectionStyling;
    isEditing?: boolean;
    isPublicView?: boolean;
    onEdit?: () => void;
    onDataChange?: (newData: Partial<EducationData>) => void;
    onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

export default function EducationSection({
    data,
    styling,
    isEditing = false,
    isPublicView = false,
    onEdit,
    onDataChange,
}: EducationSectionProps) {
    const inlineEditMode = isEditing && !isPublicView && !!onDataChange;

    const containerStyle = {
        backgroundColor: styling.backgroundColor || 'transparent',
        color: styling.textColor || 'inherit',
        padding: `${styling.padding?.top || '3rem'} ${styling.padding?.right || '2rem'} ${styling.padding?.bottom || '3rem'} ${styling.padding?.left || '2rem'}`,
        margin: `${styling.margin?.top || '0'} 0 ${styling.margin?.bottom || '0'} 0`,
        textAlign: styling.alignment || 'left',
    } as React.CSSProperties;

    const educationList = data.education || [];

    const isTimeline = styling.layout === 'timeline';

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
                                placeholder="Education"
                                className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2"
                                as="span"
                            />
                        ) : (
                            data.heading || 'Education'
                        )}
                    </h2>
                    <p className={`${typography.body} ${textColors.muted} max-w-2xl mx-auto ${spacing.marginBottom.medium}`}>
                        Academic background and qualifications
                    </p>
                    <div className="w-20 h-1 bg-current mx-auto opacity-50 rounded-full" />
                </motion.div>

                {/* Empty state */}
                {inlineEditMode && educationList.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 px-4">
                        <div className="max-w-md mx-auto">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
                            </div>
                            <p className="text-slate-500 text-xs sm:text-sm mb-2">
                                No education entries added yet
                            </p>
                            <p className="text-xs text-slate-400">
                                Add entries through the Properties panel on the right
                            </p>
                        </div>
                    </div>
                ) : isTimeline ? (
                    /* ── Timeline layout ── */
                    <div className="relative">
                        <div className="absolute left-[28px] sm:left-[34px] top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-transparent hidden sm:block" />
                        <div className="space-y-8">
                            {educationList.map((edu, index) => (
                                <motion.div
                                    key={edu.id}
                                    initial={!isEditing ? { opacity: 0, x: -20 } : undefined}
                                    whileInView={!isEditing ? { opacity: 1, x: 0 } : undefined}
                                    viewport={!isEditing ? { once: true } : undefined}
                                    transition={!isEditing ? { delay: 0.15 + index * 0.1, duration: 0.5 } : undefined}
                                    className="relative flex gap-4 sm:gap-6 group"
                                >
                                    <div className="flex-shrink-0 hidden sm:flex">
                                        <div className="relative w-[56px] sm:w-[68px] flex justify-center">
                                            <motion.div
                                                className="w-4 h-4 rounded-full bg-white border-2 border-slate-400 group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-colors duration-200 mt-5 z-10"
                                                whileHover={{ scale: 1.3 }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 pb-2">
                                        <Card className="border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                                            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                                            <CardContent className="p-4 sm:p-5 md:p-6">
                                                <EducationCard
                                                    edu={edu}
                                                    index={index}
                                                    inlineEditMode={inlineEditMode}
                                                    educationList={educationList}
                                                    onDataChange={onDataChange}
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* ── Card grid layout (default) ── */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                        {educationList.map((edu, index) => (
                            <motion.div
                                key={edu.id}
                                initial={!isEditing ? { opacity: 0, y: 30 } : undefined}
                                whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                                viewport={!isEditing ? { once: true } : undefined}
                                transition={!isEditing ? { delay: 0.15 + index * 0.1, duration: 0.55, ease: 'easeOut' } : undefined}
                                whileHover={!isEditing ? { y: -4 } : undefined}
                            >
                                <Card className="border border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                                    {/* Gradient accent top bar */}
                                    <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
                                    <CardContent className="p-5 sm:p-6">

                                        {/* Degree + institution */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 flex-shrink-0 mt-0.5">
                                                <GraduationCap className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-semibold text-slate-900 leading-snug">
                                                    {inlineEditMode ? (
                                                        <EditableText
                                                            value={edu.degree}
                                                            onChange={(value) => {
                                                                const updated = [...educationList];
                                                                updated[index] = { ...edu, degree: value };
                                                                onDataChange?.({ education: updated });
                                                            }}
                                                            placeholder="Degree"
                                                            className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 -mx-1"
                                                            as="span"
                                                        />
                                                    ) : (
                                                        edu.degree
                                                    )}
                                                </h3>
                                                {edu.field && (
                                                    <p className="text-sm text-emerald-600 font-medium mt-0.5">
                                                        {inlineEditMode ? (
                                                            <EditableText
                                                                value={edu.field}
                                                                onChange={(value) => {
                                                                    const updated = [...educationList];
                                                                    updated[index] = { ...edu, field: value };
                                                                    onDataChange?.({ education: updated });
                                                                }}
                                                                placeholder="Field of Study"
                                                                className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 -mx-1"
                                                                as="span"
                                                            />
                                                        ) : edu.field}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Institution */}
                                        <p className="text-sm font-medium text-slate-700 mb-3 pl-[52px]">
                                            {inlineEditMode ? (
                                                <EditableText
                                                    value={edu.institution}
                                                    onChange={(value) => {
                                                        const updated = [...educationList];
                                                        updated[index] = { ...edu, institution: value };
                                                        onDataChange?.({ education: updated });
                                                    }}
                                                    placeholder="Institution Name"
                                                    className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 -mx-1"
                                                    as="span"
                                                />
                                            ) : edu.institution}
                                        </p>

                                        {/* Meta row */}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-3 pl-[52px]">
                                            {(edu.startDate || edu.endDate) && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {edu.startDate}
                                                    {edu.endDate ? ` – ${edu.endDate}` : ' – Present'}
                                                </span>
                                            )}
                                            {edu.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {edu.location}
                                                </span>
                                            )}
                                            {edu.gpa && (
                                                <span className="flex items-center gap-1 font-medium text-amber-600">
                                                    <Star className="w-3 h-3" />
                                                    GPA: {edu.gpa}
                                                </span>
                                            )}
                                        </div>

                                        {/* Honors */}
                                        {edu.honors && edu.honors.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-3 pl-[52px]">
                                                {edu.honors.map((honor, hi) => (
                                                    <Badge
                                                        key={hi}
                                                        className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200"
                                                    >
                                                        {honor}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Coursework pills */}
                                        {edu.coursework && edu.coursework.length > 0 && (
                                            <div className="pl-[52px]">
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3" /> Coursework
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {edu.coursework.map((course, ci) => (
                                                        <Badge
                                                            key={ci}
                                                            variant="secondary"
                                                            className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600"
                                                        >
                                                            {course}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.section>
    );
}

/* ─── Shared card content for timeline layout ─── */
interface EducationCardProps {
    edu: EducationData['education'][number];
    index: number;
    inlineEditMode: boolean;
    educationList: EducationData['education'];
    onDataChange?: (newData: Partial<EducationData>) => void;
}

function EducationCard({ edu, index, inlineEditMode, educationList, onDataChange }: EducationCardProps) {
    return (
        <div>
            <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900">
                        {inlineEditMode ? (
                            <EditableText
                                value={edu.degree}
                                onChange={(value) => {
                                    const updated = [...educationList];
                                    updated[index] = { ...edu, degree: value };
                                    onDataChange?.({ education: updated });
                                }}
                                placeholder="Degree"
                                className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 -mx-1"
                                as="span"
                            />
                        ) : edu.degree}
                    </h3>
                    <p className="text-sm text-emerald-600 font-medium">{edu.field}</p>
                    <p className="text-sm font-medium text-slate-700 mt-0.5">{edu.institution}</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 ml-[44px]">
                {(edu.startDate || edu.endDate) && (
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ' – Present'}
                    </span>
                )}
                {edu.location && (
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {edu.location}
                    </span>
                )}
                {edu.gpa && (
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Star className="w-3 h-3" />GPA: {edu.gpa}
                    </span>
                )}
            </div>
            {edu.honors && edu.honors.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 ml-[44px]">
                    {edu.honors.map((h, i) => (
                        <Badge key={i} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200">{h}</Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
