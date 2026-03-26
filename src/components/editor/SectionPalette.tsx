"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

import { useEditor } from '@/contexts/EditorContext';
import { Draggable } from './Draggable';
import { PaletteDragItem, PaletteSection } from '@/types/editor';
import {
  User,
  FileText,
  Code,
  Briefcase,
  Mail,
  GraduationCap,
  Award
} from 'lucide-react';

// Section definitions for the palette
// Note: navbar and footer are auto-added and not shown in palette
const sectionDefinitions: PaletteSection[] = [
  {
    type: 'hero',
    displayName: 'Hero Section',
    icon: 'User',
    description: 'Introduction with profile image and call-to-action buttons',
    category: 'basic',
    preview: 'Hero preview'
  },
  {
    type: 'about',
    displayName: 'About Me',
    icon: 'FileText',
    description: 'Personal story, background, and highlights',
    category: 'basic',
    preview: 'About preview'
  },
  {
    type: 'skills',
    displayName: 'Skills',
    icon: 'Code',
    description: 'Technical skills, tools, and expertise levels',
    category: 'basic',
    preview: 'Skills preview'
  },
  {
    type: 'projects',
    displayName: 'Projects',
    icon: 'Briefcase',
    description: 'Portfolio projects with images and links',
    category: 'basic',
    preview: 'Projects preview'
  },
  {
    type: 'contact',
    displayName: 'Contact',
    icon: 'Mail',
    description: 'Contact information and form',
    category: 'basic',
    preview: 'Contact preview'
  },
  {
    type: 'experience',
    displayName: 'Experience',
    icon: 'Award',
    description: 'Work experience and career timeline',
    category: 'advanced',
    preview: 'Experience preview'
  },
  {
    type: 'education',
    displayName: 'Education',
    icon: 'GraduationCap',
    description: 'Educational background and certifications',
    category: 'advanced',
    preview: 'Education preview'
  }
];

const iconComponents = {
  User,
  FileText,
  Code,
  Briefcase,
  Mail,
  Award,
  GraduationCap
};

interface SectionPaletteProps {
  className?: string;
}

export const SectionPalette: React.FC<SectionPaletteProps> = ({ className = '' }) => {
  const { state } = useEditor();
  const basicSections = sectionDefinitions.filter(s => s.category === 'basic');
  const advancedSections = sectionDefinitions.filter(s => s.category === 'advanced');

  const getIsSectionAdded = (sectionType: string) => {
    return state.sections.some(s => s.type === sectionType);
  };

  const renderSection = (section: PaletteSection) => {
    const IconComponent = iconComponents[section.icon as keyof typeof iconComponents];
    const isAdded = getIsSectionAdded(section.type);

    const dragItem: PaletteDragItem = {
      type: 'palette-section',
      id: `palette-${section.type}`,
      sectionType: section.type,
      displayName: section.displayName,
      icon: section.icon,
      description: section.description
    };

    const cardContent = (
      <Card className={`transition-all duration-200 border bg-white
        ${isAdded 
          ? 'opacity-50 border-slate-200 cursor-not-allowed bg-slate-50' 
          : 'cursor-grab active:cursor-grabbing hover:shadow-sm border-slate-200/60 hover:border-slate-300'
        }`}
      >
        <CardContent className="p-3.5 relative overflow-hidden">
          <div className="flex items-start gap-2.5">
            <div className={`p-2 rounded-md flex-shrink-0 border 
              ${isAdded ? 'bg-slate-100 border-slate-200' : 'bg-slate-50 border-slate-200/50'}`
            }>
              <IconComponent className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0 pr-12">
              <h4 className="font-semibold text-[0.98rem] mb-0.5 text-[#2d2a26] flex items-center gap-2">
                {section.displayName}
              </h4>
              <p className="text-[0.76rem] text-[#5c554d] leading-snug truncate pr-2">
                {section.description}
              </p>
            </div>
          </div>
          
          {isAdded && (
            <div className="absolute right-0 top-0 bottom-0 flex items-center px-3 bg-gradient-to-l from-slate-50 via-slate-50 to-transparent">
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded">
                Added
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );

    if (isAdded) {
      return (
        <div key={section.type} title="This section type is already in your portfolio">
          {cardContent}
        </div>
      );
    }

    return (
      <Draggable
        key={section.type}
        dragItem={dragItem}
      >
        {cardContent}
      </Draggable>
    );
  };

  return (
    <div className={`space-y-5 editor-typography ${className}`}>
      <div>
        <h3 className="text-lg font-semibold mb-1">Sections</h3>
        <p className="text-[0.72rem] uppercase tracking-[0.11em] text-[#5c554d]">
          Drag to canvas to build your portfolio
        </p>
      </div>

      {/* Basic Sections */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <h4 className="font-semibold text-[0.72rem] uppercase tracking-[0.12em] text-[#5c554d]">Essential</h4>
        </div>
        <div className="space-y-2">
          {basicSections.map(renderSection)}
        </div>
      </div>

      {/* Advanced Sections */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <h4 className="font-semibold text-[0.72rem] uppercase tracking-[0.12em] text-[#5c554d]">Advanced</h4>
        </div>
        <div className="space-y-2">
          {advancedSections.map(renderSection)}
        </div>
      </div>

      {/* Tips - subtle */}
      <div className="p-3 bg-slate-50/50 border border-slate-200/50 rounded-md">
        <p className="text-[0.78rem] text-[#5c554d] leading-relaxed">
          Drag sections to canvas, click to edit, reorder anytime
        </p>
      </div>
    </div>
  );
};