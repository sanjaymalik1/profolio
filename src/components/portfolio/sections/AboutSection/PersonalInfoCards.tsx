"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AboutData } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Globe, Heart, Plus } from 'lucide-react';
import { EditableField } from '@/components/editor/inline/EditableField';

interface PersonalInfoCardsProps {
    data: AboutData;
    inlineEditMode: boolean;
    onDataChange?: (newData: Partial<AboutData>) => void;
}

/**
 * The 3 Personal Info cards (Personal, Languages, Interests) from AboutSection.
 * Extracted to keep AboutSection's index.tsx focused on overall layout.
 */
export function PersonalInfoCards({ data, inlineEditMode, onDataChange }: PersonalInfoCardsProps) {
    if (!data.personalInfo) return null;

    return (
        <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 items-stretch">

                {/* Personal Card */}
                {((data.personalInfo.age || data.personalInfo.location) || inlineEditMode) && (
                    <Card className="border-2 hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
                            <div className="mb-4 sm:mb-5 md:mb-6">
                                <User className="mx-auto mb-2 sm:mb-3 text-current/60" size={28} />
                                <h4 className="font-semibold text-sm sm:text-base text-center">Personal</h4>
                            </div>
                            <div className="flex-1 w-full flex flex-col gap-3 justify-start">
                                {inlineEditMode ? (
                                    <>
                                        <div className="flex items-center justify-center gap-2 text-sm text-current/70">
                                            <span className="text-current/60 whitespace-nowrap">Age:</span>
                                            <EditableField
                                                value={data.personalInfo?.age?.toString() || ''}
                                                onChange={(value) => onDataChange?.({
                                                    personalInfo: {
                                                        ...data.personalInfo,
                                                        languages: data.personalInfo?.languages || [],
                                                        interests: data.personalInfo?.interests || [],
                                                        age: value ? parseInt(value) : undefined
                                                    }
                                                })}
                                                placeholder="25"
                                                type="text"
                                                className="w-16 text-center"
                                            />
                                        </div>
                                        <EditableField
                                            value={data.personalInfo?.location || ''}
                                            onChange={(value) => onDataChange?.({
                                                personalInfo: {
                                                    ...data.personalInfo,
                                                    languages: data.personalInfo?.languages || [],
                                                    interests: data.personalInfo?.interests || [],
                                                    location: value
                                                }
                                            })}
                                            placeholder="City, Country"
                                            className="text-center text-sm text-current/70"
                                        />
                                    </>
                                ) : (
                                    <>
                                        {data.personalInfo.age && (
                                            <p className="text-center text-sm text-current/70">Age: {data.personalInfo.age}</p>
                                        )}
                                        {data.personalInfo.location && (
                                            <p className="text-center text-sm text-current/70">{data.personalInfo.location}</p>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="mt-6" />
                        </CardContent>
                    </Card>
                )}

                {/* Languages Card */}
                {((data.personalInfo.languages && data.personalInfo.languages.length > 0) || inlineEditMode) && (
                    <Card className="border-2 hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
                            <div className="mb-4 sm:mb-5 md:mb-6">
                                <Globe className="mx-auto mb-2 sm:mb-3 text-current/60" size={28} />
                                <h4 className="font-semibold text-sm sm:text-base text-center">Languages</h4>
                            </div>
                            <div className="flex-1 w-full flex flex-col gap-2 justify-start items-center">
                                {inlineEditMode ? (
                                    <>
                                        {(!data.personalInfo?.languages || data.personalInfo.languages.length === 0) ? (
                                            <p className="text-sm text-current/50 py-4">No languages yet</p>
                                        ) : (
                                            data.personalInfo.languages.map((language, index) => (
                                                <div key={index} className="flex items-center gap-2 group w-full max-w-xs">
                                                    <input
                                                        type="text"
                                                        value={language}
                                                        onChange={(e) => {
                                                            const newLanguages = [...(data.personalInfo?.languages || [])];
                                                            newLanguages[index] = e.target.value;
                                                            onDataChange?.({ personalInfo: { ...data.personalInfo, languages: newLanguages, interests: data.personalInfo?.interests || [] } });
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        className="flex-1 min-w-0 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 py-1 text-sm"
                                                        placeholder="Enter language..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newLanguages = (data.personalInfo?.languages || []).filter((_, i) => i !== index);
                                                            onDataChange?.({ personalInfo: { ...data.personalInfo, languages: newLanguages, interests: data.personalInfo?.interests || [] } });
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700 text-xs flex-shrink-0"
                                                    >×</button>
                                                </div>
                                            ))
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-wrap gap-2 justify-center items-center w-full">
                                        {data.personalInfo.languages.map((language, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">{language}</Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {inlineEditMode && (
                                <div className="mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 border-t border-dashed border-slate-300">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newLanguages = [...(data.personalInfo?.languages || []), ''];
                                            onDataChange?.({ personalInfo: { ...data.personalInfo, languages: newLanguages, interests: data.personalInfo?.interests || [] } });
                                        }}
                                        className="w-full py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 rounded-lg transition-all flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-slate-400"
                                    >
                                        <Plus size={14} className="sm:w-4 sm:h-4" />
                                        Add language
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Interests Card */}
                {((data.personalInfo?.interests && data.personalInfo.interests.length > 0) || inlineEditMode) && (
                    <Card className="border-2 hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
                            <div className="mb-4 sm:mb-5 md:mb-6">
                                <Heart className="mx-auto mb-2 sm:mb-3 text-current/60" size={28} />
                                <h4 className="font-semibold text-sm sm:text-base text-center">Interests</h4>
                            </div>
                            <div className="flex-1 w-full flex flex-col gap-2 justify-start items-center">
                                {inlineEditMode ? (
                                    <>
                                        {(!data.personalInfo?.interests || data.personalInfo.interests.length === 0) ? (
                                            <p className="text-sm text-current/50 py-4">No interests yet</p>
                                        ) : (
                                            data.personalInfo.interests.map((interest, index) => (
                                                <div key={index} className="flex items-center gap-2 group w-full max-w-xs">
                                                    <input
                                                        type="text"
                                                        value={interest}
                                                        onChange={(e) => {
                                                            const newInterests = [...(data.personalInfo?.interests || [])];
                                                            newInterests[index] = e.target.value;
                                                            onDataChange?.({ personalInfo: { ...data.personalInfo, languages: data.personalInfo?.languages || [], interests: newInterests } });
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        className="flex-1 min-w-0 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 py-1 text-sm"
                                                        placeholder="Enter interest..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newInterests = (data.personalInfo?.interests || []).filter((_, i) => i !== index);
                                                            onDataChange?.({ personalInfo: { ...data.personalInfo, languages: data.personalInfo?.languages || [], interests: newInterests } });
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700 text-xs flex-shrink-0"
                                                    >×</button>
                                                </div>
                                            ))
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-wrap gap-2 justify-center items-center w-full">
                                        {data.personalInfo.interests.map((interest, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">{interest}</Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {inlineEditMode && (
                                <div className="mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 border-t border-dashed border-slate-300">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newInterests = [...(data.personalInfo?.interests || []), ''];
                                            onDataChange?.({ personalInfo: { ...data.personalInfo, languages: data.personalInfo?.languages || [], interests: newInterests } });
                                        }}
                                        className="w-full py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 rounded-lg transition-all flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-slate-400"
                                    >
                                        <Plus size={14} className="sm:w-4 sm:h-4" />
                                        Add interest
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

            </div>
        </motion.div>
    );
}
