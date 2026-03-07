"use client";

import React, { useState } from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import type { EducationData, Education } from '@/types/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    GraduationCap,
    X,
} from 'lucide-react';

interface EducationPropertyFormProps {
    section: EditorSection;
}

function generateId() {
    return `edu_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const EducationPropertyForm: React.FC<EducationPropertyFormProps> = ({ section }) => {
    const { updateSectionData } = useEditorActions();
    const data = section.data as EducationData;
    const educationList = data.education || [];

    const [expandedIndex, setExpandedIndex] = useState<number | null>(educationList.length > 0 ? 0 : null);
    const [newHonor, setNewHonor] = useState<Record<number, string>>({});
    const [newCourse, setNewCourse] = useState<Record<number, string>>({});

    const update = (education: Education[]) => {
        updateSectionData(section.id, { ...data, education });
    };

    const addEntry = () => {
        const newEdu: Education = {
            id: generateId(),
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            gpa: undefined,
            honors: [],
            coursework: [],
            location: '',
        };
        const updated = [...educationList, newEdu];
        update(updated);
        setExpandedIndex(updated.length - 1);
    };

    const removeEntry = (index: number) => {
        const updated = educationList.filter((_, i) => i !== index);
        update(updated);
        setExpandedIndex(null);
    };

    const updateEntry = (index: number, field: keyof Education, value: unknown) => {
        const updated = educationList.map((edu, i) =>
            i === index ? { ...edu, [field]: value } : edu
        );
        update(updated);
    };

    const addHonor = (index: number) => {
        const val = (newHonor[index] || '').trim();
        if (!val) return;
        const existing = educationList[index].honors || [];
        updateEntry(index, 'honors', [...existing, val]);
        setNewHonor((p) => ({ ...p, [index]: '' }));
    };

    const removeHonor = (eduIndex: number, hi: number) => {
        const updated = (educationList[eduIndex].honors || []).filter((_, i) => i !== hi);
        updateEntry(eduIndex, 'honors', updated);
    };

    const addCourse = (index: number) => {
        const val = (newCourse[index] || '').trim();
        if (!val) return;
        const existing = educationList[index].coursework || [];
        updateEntry(index, 'coursework', [...existing, val]);
        setNewCourse((p) => ({ ...p, [index]: '' }));
    };

    const removeCourse = (eduIndex: number, ci: number) => {
        const updated = (educationList[eduIndex].coursework || []).filter((_, i) => i !== ci);
        updateEntry(eduIndex, 'coursework', updated);
    };

    return (
        <div className="space-y-5">
            {/* Section heading */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Section Heading
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        value={data.heading || ''}
                        onChange={(e) =>
                            updateSectionData(section.id, { ...data, heading: e.target.value })
                        }
                        placeholder="Education"
                    />
                </CardContent>
            </Card>

            {/* Education entries */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Entries ({educationList.length})
                    </p>
                    <Button size="sm" variant="outline" onClick={addEntry}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Entry
                    </Button>
                </div>

                {educationList.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">
                        No education added yet. Click &quot;Add Entry&quot; to get started.
                    </p>
                )}

                {educationList.map((edu, index) => (
                    <Card key={edu.id} className="overflow-hidden">
                        {/* Accordion header — div not button, to avoid nested button violation */}
                        <div
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer select-none"
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        >
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="text-sm font-medium text-slate-800 truncate">
                                    {edu.degree || 'Untitled Degree'}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {edu.institution || '—'}{edu.startDate ? ` · ${edu.startDate}` : ''}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={(e) => { e.stopPropagation(); removeEntry(index); }}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                                {expandedIndex === index
                                    ? <ChevronUp className="w-4 h-4 text-slate-400" />
                                    : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </div>
                        </div>

                        {/* Accordion body */}
                        {expandedIndex === index && (
                            <CardContent className="pt-0 pb-4 px-3 space-y-3 border-t border-slate-100">
                                <div className="grid grid-cols-2 gap-2 pt-3">
                                    <div className="col-span-2">
                                        <Label className="text-xs">Institution *</Label>
                                        <Input
                                            value={edu.institution}
                                            onChange={(e) => updateEntry(index, 'institution', e.target.value)}
                                            placeholder="MIT"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-xs">Degree *</Label>
                                        <Input
                                            value={edu.degree}
                                            onChange={(e) => updateEntry(index, 'degree', e.target.value)}
                                            placeholder="Bachelor of Science"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-xs">Field of Study</Label>
                                        <Input
                                            value={edu.field}
                                            onChange={(e) => updateEntry(index, 'field', e.target.value)}
                                            placeholder="Computer Science"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Start Year</Label>
                                        <Input
                                            value={edu.startDate || ''}
                                            onChange={(e) => updateEntry(index, 'startDate', e.target.value)}
                                            placeholder="2018"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">End Year</Label>
                                        <Input
                                            value={edu.endDate || ''}
                                            onChange={(e) => updateEntry(index, 'endDate', e.target.value)}
                                            placeholder="2022"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">GPA (optional)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="4"
                                            value={edu.gpa ?? ''}
                                            onChange={(e) =>
                                                updateEntry(index, 'gpa', e.target.value ? parseFloat(e.target.value) : undefined)
                                            }
                                            placeholder="3.8"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Location</Label>
                                        <Input
                                            value={edu.location || ''}
                                            onChange={(e) => updateEntry(index, 'location', e.target.value)}
                                            placeholder="Cambridge, MA"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Honors & Awards */}
                                <div>
                                    <Label className="text-xs mb-1 block">Honors & Awards</Label>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {(edu.honors || []).map((h, hi) => (
                                            <span
                                                key={hi}
                                                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200"
                                            >
                                                {h}
                                                <button onClick={() => removeHonor(index, hi)}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-1.5">
                                        <Input
                                            value={newHonor[index] || ''}
                                            onChange={(e) => setNewHonor((p) => ({ ...p, [index]: e.target.value }))}
                                            placeholder="Magna Cum Laude"
                                            className="text-xs"
                                            onKeyDown={(e) => e.key === 'Enter' && addHonor(index)}
                                        />
                                        <Button size="sm" variant="outline" onClick={() => addHonor(index)}>
                                            <Plus className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Coursework */}
                                <div>
                                    <Label className="text-xs mb-1 block">Relevant Coursework</Label>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {(edu.coursework || []).map((c, ci) => (
                                            <span
                                                key={ci}
                                                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200"
                                            >
                                                {c}
                                                <button onClick={() => removeCourse(index, ci)}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-1.5">
                                        <Input
                                            value={newCourse[index] || ''}
                                            onChange={(e) => setNewCourse((p) => ({ ...p, [index]: e.target.value }))}
                                            placeholder="Data Structures, Algorithms..."
                                            className="text-xs"
                                            onKeyDown={(e) => e.key === 'Enter' && addCourse(index)}
                                        />
                                        <Button size="sm" variant="outline" onClick={() => addCourse(index)}>
                                            <Plus className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};
