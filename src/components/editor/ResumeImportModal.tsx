import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UploadCloud,
    FileText,
    Image as ImageIcon,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    FileBadge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEditor } from '@/contexts/EditorContext';
import { ParsedResumeResult } from '@/lib/gemini';

interface ResumeImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'upload' | 'processing' | 'review' | 'success';

export function ResumeImportModal({ isOpen, onClose }: ResumeImportModalProps) {
    const { dispatch } = useEditor();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState<Step>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<ParsedResumeResult | null>(null);

    // Selection state for which sections to import
    const [selectedSections, setSelectedSections] = useState({
        hero: true,
        about: true,
        experience: true,
        education: true,
        skills: true,
        contact: true,
        projects: true
    });

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelected(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelected = (selectedFile: File) => {
        setError(null);

        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Please upload a PDF or Image (JPG, PNG, WEBP).');
            return;
        }

        // Validate size (10MB limit)
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size must be under 10MB.');
            return;
        }

        setFile(selectedFile);
    };

    const processResume = async () => {
        if (!file) return;

        setStep('processing');
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to parse resume');
            }

            setParsedData(result.data);
            setStep('review');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
            setStep('upload');
        }
    };

    const applyToPortfolio = () => {
        if (!parsedData) return;

        const filteredData: Partial<ParsedResumeResult> = {};
        if (selectedSections.hero && parsedData.hero) filteredData.hero = parsedData.hero;
        if (selectedSections.about && parsedData.about) filteredData.about = parsedData.about;
        if (selectedSections.experience && parsedData.experience) filteredData.experience = parsedData.experience;
        if (selectedSections.education && parsedData.education) filteredData.education = parsedData.education;
        if (selectedSections.skills && parsedData.skills) filteredData.skills = parsedData.skills;
        if (selectedSections.contact && parsedData.contact) filteredData.contact = parsedData.contact;
        if (selectedSections.projects && parsedData.projects) filteredData.projects = parsedData.projects;

        // Dispatch the action to merge it into editor context
        dispatch({
            type: 'IMPORT_RESUME_DATA',
            payload: { data: filteredData }
        });

        setStep('success');

        // Close modal after showing success briefly
        setTimeout(() => {
            resetAndClose();
        }, 2000);
    };

    const resetAndClose = () => {
        setStep('upload');
        setFile(null);
        setError(null);
        setParsedData(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={resetAndClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden m-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <FileBadge className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Import Resume</h2>
                            <p className="text-xs text-slate-500">Auto-fill your portfolio using AI</p>
                        </div>
                    </div>
                    <button
                        onClick={resetAndClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: UPLOAD */}
                        {step === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                {!file ? (
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
                                    >
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                                            <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-900 mb-1">Click to upload or drag & drop</h3>
                                        <p className="text-sm text-slate-500 mb-4">Supported formats: PDF, JPG, PNG, WEBP (Max 10MB)</p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="application/pdf,image/jpeg,image/png,image/webp"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                                                {file.type.includes('pdf') ? (
                                                    <FileText className="w-6 h-6 text-rose-500" />
                                                ) : (
                                                    <ImageIcon className="w-6 h-6 text-blue-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setFile(null)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
                                    <Button
                                        onClick={processResume}
                                        disabled={!file}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        Extract Data <FileText className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: PROCESSING */}
                        {step === 'processing' && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-slate-100 rounded-full" />
                                    <div className="w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-indigo-600 animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Analyzing your resume</h3>
                                    <p className="text-sm text-slate-500">AI is extracting your skills, experience, and education...</p>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: REVIEW */}
                        {step === 'review' && parsedData && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-emerald-900">Extraction Complete!</h4>
                                        <p className="text-xs text-emerald-700 mt-1">
                                            Review the sections we've populated. Select which ones you want to add to your portfolio.
                                            Existing data in your portfolio will be preserved and merged.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {[
                                        { id: 'hero', label: 'Basic Info', data: parsedData.hero, count: parsedData.hero ? 1 : 0 },
                                        { id: 'about', label: 'Bio & Highlights', data: parsedData.about, count: parsedData.about ? 1 : 0 },
                                        { id: 'experience', label: 'Work Experience', data: parsedData.experience, count: parsedData.experience?.experiences?.length || 0 },
                                        { id: 'education', label: 'Education', data: parsedData.education, count: parsedData.education?.education?.length || 0 },
                                        { id: 'skills', label: 'Skills', data: parsedData.skills, count: (parsedData.skills?.skillCategories?.technical?.length || 0) + (parsedData.skills?.skillCategories?.soft?.length || 0) },
                                        { id: 'projects', label: 'Projects', data: parsedData.projects, count: parsedData.projects?.projects?.length || 0 },
                                        { id: 'contact', label: 'Contact Details', data: parsedData.contact, count: parsedData.contact ? 1 : 0 },
                                    ].map((section) => (
                                        <Card
                                            key={section.id}
                                            className={`cursor-pointer transition-all ${!section.data ? 'opacity-50 grayscale cursor-not-allowed' : selectedSections[section.id as keyof typeof selectedSections] ? 'border-indigo-500 bg-indigo-50/20 shadow-sm' : 'hover:border-slate-300'}`}
                                            onClick={() => {
                                                if (section.data) {
                                                    setSelectedSections(p => ({ ...p, [section.id]: !p[section.id as keyof typeof p] }));
                                                }
                                            }}
                                        >
                                            <CardContent className="p-4 flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selectedSections[section.id as keyof typeof selectedSections] && section.data ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                                    {selectedSections[section.id as keyof typeof selectedSections] && section.data && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-semibold ${selectedSections[section.id as keyof typeof selectedSections] && section.data ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                        {section.label}
                                                    </p>
                                                    <p className="text-xs text-slate-500 truncate">
                                                        {section.count > 0 ? `${section.count} item${section.count !== 1 ? 's' : ''} found` : 'No data found'}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <Button variant="outline" onClick={() => setStep('upload')}>Back</Button>
                                    <Button
                                        onClick={applyToPortfolio}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                                        disabled={!Object.values(selectedSections).some(Boolean)}
                                    >
                                        Apply Selected to Portfolio
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: SUCCESS */}
                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-16 flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Portfolio Updated!</h3>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                        Your resume data has been successfully imported into the editor. You can now tweak and customize it.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
