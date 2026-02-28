"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

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
  const basicSections = sectionDefinitions.filter(s => s.category === 'basic');
  const advancedSections = sectionDefinitions.filter(s => s.category === 'advanced');

  const renderSection = (section: PaletteSection) => {
    const IconComponent = iconComponents[section.icon as keyof typeof iconComponents];

    const dragItem: PaletteDragItem = {
      type: 'palette-section',
      id: `palette-${section.type}`,
      sectionType: section.type,
      displayName: section.displayName,
      icon: section.icon,
      description: section.description
    };

    return (
      <Draggable
        key={section.type}
        dragItem={dragItem}
        onDragStart={() => console.log(`Started dragging ${section.displayName}`)}
        onDragEnd={(result) => console.log('Drag ended:', result)}
      >
        <Card className="cursor-grab active:cursor-grabbing hover:shadow-sm transition-all duration-200 border border-slate-200/60 hover:border-slate-300 bg-white">
          <CardContent className="p-3.5">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-slate-50 rounded-md border border-slate-200/50 flex-shrink-0">
                <IconComponent className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-0.5 text-slate-700">{section.displayName}</h4>
                <p className="text-xs text-slate-500 leading-snug">
                  {section.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Draggable>
    );
  };

  return (
    <div className={`space-y-5 ${className}`}>
      <div>
        <h3 className="text-sm font-medium mb-1 text-slate-700">Sections</h3>
        <p className="text-xs text-slate-500">
          Drag to canvas to build your portfolio
        </p>
      </div>

      {/* Basic Sections */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <h4 className="font-medium text-xs text-slate-600">Essential</h4>
        </div>
        <div className="space-y-2">
          {basicSections.map(renderSection)}
        </div>
      </div>

      {/* Advanced Sections */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <h4 className="font-medium text-xs text-slate-600">Advanced</h4>
        </div>
        <div className="space-y-2">
          {advancedSections.map(renderSection)}
        </div>
      </div>

      {/* Tips - subtle */}
      <div className="p-3 bg-slate-50/50 border border-slate-200/50 rounded-md">
        <p className="text-xs text-slate-500 leading-relaxed">
          Drag sections to canvas, click to edit, reorder anytime
        </p>
      </div>
    </div>
  );
};