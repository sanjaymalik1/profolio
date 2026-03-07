"use client";

import React, { useState } from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import type { ExperienceData, Experience } from '@/types/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Briefcase,
    X,
} from 'lucide-react';

interface ExperiencePropertyFormProps {
    section: EditorSection;
}

function generateId() {
    return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const ExperiencePropertyForm: React.FC<ExperiencePropertyFormProps> = ({ section }) => {
    const { updateSectionData } = useEditorActions();
    const data = section.data as ExperienceData;
    const experiences = data.experiences || [];

    const [expandedIndex, setExpandedIndex] = useState<number | null>(experiences.length > 0 ? 0 : null);
    const [newTech, setNewTech] = useState<Record<number, string>>({});
    const [newResp, setNewResp] = useState<Record<number, string>>({});

    const update = (experiences: Experience[]) => {
        updateSectionData(section.id, { ...data, experiences });
    };

    const addEntry = () => {
        const newExp: Experience = {
            id: generateId(),
            company: '',
            position: '',
            startDate: '',
            endDate: undefined,
            description: '',
            responsibilities: [],
            technologies: [],
            location: '',
        };
        const updated = [...experiences, newExp];
        update(updated);
        setExpandedIndex(updated.length - 1);
    };

    const removeEntry = (index: number) => {
        const updated = experiences.filter((_, i) => i !== index);
        update(updated);
        setExpandedIndex(null);
    };

    const updateEntry = (index: number, field: keyof Experience, value: unknown) => {
        const updated = experiences.map((exp, i) =>
            i === index ? { ...exp, [field]: value } : exp
        );
        update(updated);
    };

    const addTech = (index: number) => {
        const val = (newTech[index] || '').trim();
        if (!val) return;
        const existing = experiences[index].technologies || [];
        updateEntry(index, 'technologies', [...existing, val]);
        setNewTech((p) => ({ ...p, [index]: '' }));
    };

    const removeTech = (expIndex: number, techIndex: number) => {
        const techs = (experiences[expIndex].technologies || []).filter((_, i) => i !== techIndex);
        updateEntry(expIndex, 'technologies', techs);
    };

    const addResp = (index: number) => {
        const val = (newResp[index] || '').trim();
        if (!val) return;
        const existing = experiences[index].responsibilities || [];
        updateEntry(index, 'responsibilities', [...existing, val]);
        setNewResp((p) => ({ ...p, [index]: '' }));
    };

    const removeResp = (expIndex: number, respIndex: number) => {
        const resps = (experiences[expIndex].responsibilities || []).filter((_, i) => i !== respIndex);
        updateEntry(expIndex, 'responsibilities', resps);
    };

    return (
        <div className="space-y-5">
            {/* Section heading */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Section Heading
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        value={data.heading || ''}
                        onChange={(e) =>
                            updateSectionData(section.id, { ...data, heading: e.target.value })
                        }
                        placeholder="Work Experience"
                    />
                </CardContent>
            </Card>

            {/* Experience entries */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Entries ({experiences.length})
                    </p>
                    <Button size="sm" variant="outline" onClick={addEntry}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Role
                    </Button>
                </div>

                {experiences.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">
                        No experience added yet. Click &quot;Add Role&quot; to get started.
                    </p>
                )}

                {experiences.map((exp, index) => (
                    <Card key={exp.id} className="overflow-hidden">
                        {/* Accordion header — must be a div, not a button, because it contains a Button (delete) */}
                        <div
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer select-none"
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        >
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="text-sm font-medium text-slate-800 truncate">
                                    {exp.position || 'Untitled Role'}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {exp.company || '—'}{exp.startDate ? ` · ${exp.startDate}` : ''}
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
                                    <div>
                                        <Label className="text-xs">Job Title *</Label>
                                        <Input
                                            value={exp.position}
                                            onChange={(e) => updateEntry(index, 'position', e.target.value)}
                                            placeholder="Senior Engineer"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Company *</Label>
                                        <Input
                                            value={exp.company}
                                            onChange={(e) => updateEntry(index, 'company', e.target.value)}
                                            placeholder="Acme Corp"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Start Date</Label>
                                        <Input
                                            value={exp.startDate}
                                            onChange={(e) => updateEntry(index, 'startDate', e.target.value)}
                                            placeholder="Jan 2022"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">End Date</Label>
                                        <Input
                                            value={exp.endDate || ''}
                                            onChange={(e) => updateEntry(index, 'endDate', e.target.value || undefined)}
                                            placeholder="Present"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-xs">Location</Label>
                                        <Input
                                            value={exp.location || ''}
                                            onChange={(e) => updateEntry(index, 'location', e.target.value)}
                                            placeholder="San Francisco, CA"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="text-xs">Description</Label>
                                    <Textarea
                                        value={exp.description}
                                        onChange={(e) => updateEntry(index, 'description', e.target.value)}
                                        placeholder="Brief overview of your role and impact..."
                                        rows={3}
                                        className="mt-1 text-xs"
                                    />
                                </div>

                                {/* Responsibilities */}
                                <div>
                                    <Label className="text-xs mb-1 block">Key Responsibilities</Label>
                                    <div className="space-y-1.5 mb-2">
                                        {(exp.responsibilities || []).map((r, ri) => (
                                            <div key={ri} className="flex items-center gap-2 bg-slate-50 rounded px-2 py-1">
                                                <span className="flex-1 text-xs text-slate-700">{r}</span>
                                                <button onClick={() => removeResp(index, ri)}>
                                                    <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-1.5">
                                        <Input
                                            value={newResp[index] || ''}
                                            onChange={(e) => setNewResp((p) => ({ ...p, [index]: e.target.value }))}
                                            placeholder="Led team of 5 engineers..."
                                            className="text-xs"
                                            onKeyDown={(e) => e.key === 'Enter' && addResp(index)}
                                        />
                                        <Button size="sm" variant="outline" onClick={() => addResp(index)}>
                                            <Plus className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Technologies */}
                                <div>
                                    <Label className="text-xs mb-1 block">Technologies Used</Label>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {(exp.technologies || []).map((tech, ti) => (
                                            <span
                                                key={ti}
                                                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100"
                                            >
                                                {tech}
                                                <button onClick={() => removeTech(index, ti)}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-1.5">
                                        <Input
                                            value={newTech[index] || ''}
                                            onChange={(e) => setNewTech((p) => ({ ...p, [index]: e.target.value }))}
                                            placeholder="React, TypeScript..."
                                            className="text-xs"
                                            onKeyDown={(e) => e.key === 'Enter' && addTech(index)}
                                        />
                                        <Button size="sm" variant="outline" onClick={() => addTech(index)}>
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
