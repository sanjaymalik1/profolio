"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AboutData, SectionStyling } from '@/types/portfolio';
import { Card, CardContent } from '@/components/ui/card';

import { CheckCircle2, Quote, User, Briefcase, MapPin, Calendar } from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableImage } from '@/components/editor/inline/EditableImage';
import { EditableList } from '@/components/editor/inline/EditableList';
import { typography, textColors } from '@/design/typography';
import { spacing } from '@/design/spacing';
import { PersonalInfoCards } from './PersonalInfoCards';

interface AboutSectionProps {
    data: AboutData;
    styling: SectionStyling;
    isEditing?: boolean;
    isPublicView?: boolean;
    onEdit?: () => void;
    onDataChange?: (newData: Partial<AboutData>) => void;
    onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

export default function AboutSection({
    data, styling, isEditing = false, isPublicView = false, onEdit, onDataChange,
}: AboutSectionProps) {
    const inlineEditMode = isEditing && !isPublicView && !!onDataChange;

    const containerStyle = {
        backgroundColor: styling.backgroundColor || 'transparent',
        color: styling.textColor || 'inherit',
        padding: `${styling.padding?.top || '3rem'} ${styling.padding?.right || '2rem'} ${styling.padding?.bottom || '3rem'} ${styling.padding?.left || '2rem'}`,
        margin: `${styling.margin?.top || '0'} 0 ${styling.margin?.bottom || '0'} 0`,
        textAlign: styling.alignment || 'left',
    } as React.CSSProperties;

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
                                placeholder="About Me" className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2" as="span" />
                        ) : (data.heading || 'About Me')}
                    </h2>
                    <p className={`${typography.body} ${textColors.muted} max-w-2xl mx-auto ${spacing.marginBottom.medium}`}>
                        My background, values, and what drives me
                    </p>
                    <div className="w-20 h-1 bg-current mx-auto opacity-50 rounded-full" />
                </motion.div>

                {/* Main 2-col layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-start">

                    {/* Left — profile image + personal info cards */}
                    <motion.div
                        className="lg:col-span-2 flex flex-col items-center gap-5"
                        initial={!isEditing ? { opacity: 0, x: -30 } : undefined}
                        whileInView={!isEditing ? { opacity: 1, x: 0 } : undefined}
                        viewport={!isEditing ? { once: true } : undefined}
                        transition={!isEditing ? { delay: 0.2, duration: 0.6 } : undefined}
                    >
                        {(data.profileImage || inlineEditMode) && (
                            <Card className="w-full border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                                <CardContent className="p-5 flex flex-col items-center gap-3">
                                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-2 ring-indigo-100">
                                        {inlineEditMode ? (
                                            <EditableImage value={data.profileImage || ''} onChange={(url) => onDataChange?.({ profileImage: url })}
                                                alt="Profile" containerClassName="w-full h-full" className="object-cover" aspectRatio="square" />
                                        ) : (
                                            data.profileImage && <Image src={data.profileImage} alt="Profile" fill className="object-cover" />
                                        )}
                                        {!data.profileImage && !inlineEditMode && (
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                                <User className="w-14 h-14 text-indigo-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick facts */}
                                    {data.quickFacts && data.quickFacts.length > 0 && (
                                        <div className="w-full mt-2 space-y-2">
                                            {data.quickFacts.slice(0, 4).map((fact, i) => {
                                                const icons = [Briefcase, MapPin, Calendar, User];
                                                const Icon = icons[i % icons.length];
                                                return (
                                                    <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                                                        <Icon className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                                        <span className="truncate">{fact}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>

                    {/* Right — bio + highlights */}
                    <motion.div
                        className="lg:col-span-3 space-y-5"
                        initial={!isEditing ? { opacity: 0, x: 30 } : undefined}
                        whileInView={!isEditing ? { opacity: 1, x: 0 } : undefined}
                        viewport={!isEditing ? { once: true } : undefined}
                        transition={!isEditing ? { delay: 0.3, duration: 0.6 } : undefined}
                    >
                        {/* Bio card */}
                        <Card className="border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                            <CardContent className="p-5 sm:p-6">
                                <p className="text-slate-600 leading-relaxed text-[15px]">
                                    {inlineEditMode ? (
                                        <EditableText value={data.content || ''} onChange={(v) => onDataChange?.({ content: v })}
                                            placeholder="Tell your story here. Share your background, experience, and what drives you."
                                            className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 -mx-1 block min-h-[80px]" as="span" multiline />
                                    ) : (
                                        data.content || 'Tell your story here. Share your background, experience, and what drives you.'
                                    )}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Highlights card */}
                        {((data.highlights && data.highlights.length > 0) || inlineEditMode) && (
                            <Card className="border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                                <CardContent className="p-5 sm:p-6">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900">Key Highlights</h3>
                                    </div>
                                    <div className="space-y-2.5">
                                        {inlineEditMode ? (
                                            <EditableList
                                                items={data.highlights || []}
                                                onChange={(items) => onDataChange?.({ highlights: items })}
                                                placeholder="Enter a highlight..."
                                                addButtonText="Add highlight"
                                                emptyMessage="No highlights yet. Click 'Add highlight' to get started."
                                                renderItem={(item, index, onEdit, onDelete) => (
                                                    <motion.div key={index} className="flex items-start gap-2.5 group"
                                                        initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }} transition={{ delay: 0.35 + index * 0.08, duration: 0.4 }}>
                                                        <CheckCircle2 className="text-emerald-500 mt-0.5 flex-shrink-0 w-4 h-4" />
                                                        <input type="text" value={item} onChange={e => onEdit(e.target.value)}
                                                            onBlur={() => { if (!item.trim()) onDelete(); }}
                                                            onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}
                                                            placeholder="Enter a highlight..."
                                                            className="flex-1 bg-transparent border-none outline-none focus:ring-1 focus:ring-emerald-400/50 rounded px-1 -mx-1 text-sm text-slate-700" />
                                                        <button type="button" onClick={e => { e.stopPropagation(); onDelete(); }}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-red-400 text-xs">×</button>
                                                    </motion.div>
                                                )}
                                            />
                                        ) : (
                                            data.highlights?.map((h, i) => (
                                                <motion.div key={i} className="flex items-start gap-2.5"
                                                    initial={!isEditing ? { opacity: 0, x: -15 } : undefined}
                                                    whileInView={!isEditing ? { opacity: 1, x: 0 } : undefined}
                                                    viewport={!isEditing ? { once: true } : undefined}
                                                    transition={!isEditing ? { delay: 0.35 + i * 0.08, duration: 0.4 } : undefined}>
                                                    <CheckCircle2 className="text-emerald-500 mt-0.5 flex-shrink-0 w-4 h-4" />
                                                    <span className="text-sm text-slate-700 leading-relaxed">{h}</span>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quote */}
                        {data.quote && (
                            <motion.div
                                initial={!isEditing ? { opacity: 0, y: 15 } : undefined}
                                whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                                viewport={!isEditing ? { once: true } : undefined}
                                transition={!isEditing ? { delay: 0.5, duration: 0.5 } : undefined}
                            >
                                <Card className="border border-slate-200 hover:border-amber-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                                    <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                                    <CardContent className="p-5 sm:p-6">
                                        <div className="flex gap-3">
                                            <Quote className="w-8 h-8 text-amber-400 flex-shrink-0 mt-0.5" />
                                            <blockquote className="text-slate-700 italic text-[15px] leading-relaxed">
                                                {inlineEditMode ? (
                                                    <EditableText value={data.quote} onChange={(v) => onDataChange?.({ quote: v })}
                                                        placeholder="An inspirational quote..." className="outline-none focus:ring-1 focus:ring-amber-400/50 rounded px-1 -mx-1" as="span" />
                                                ) : `"${data.quote}"`}
                                            </blockquote>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Personal info cards row */}
                <PersonalInfoCards data={data} inlineEditMode={inlineEditMode} onDataChange={onDataChange} />
            </div>
        </motion.section>
    );
}
