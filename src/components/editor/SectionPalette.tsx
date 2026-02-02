"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
        <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-blue-300 bg-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100 flex-shrink-0">
                <IconComponent className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 text-slate-900">{section.displayName}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
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
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-slate-900">Section Palette</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Drag sections to your portfolio canvas to build your page
        </p>
      </div>

      {/* Basic Sections */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h4 className="font-semibold text-sm text-slate-900">Essential Sections</h4>
          <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 border border-slate-200">
            {basicSections.length}
          </Badge>
        </div>
        <div className="space-y-2.5">
          {basicSections.map(renderSection)}
        </div>
      </div>

      {/* Advanced Sections */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h4 className="font-semibold text-sm text-slate-900">Advanced Sections</h4>
          <Badge variant="outline" className="text-xs border-slate-300 text-slate-700">
            {advancedSections.length}
          </Badge>
        </div>
        <div className="space-y-2.5">
          {advancedSections.map(renderSection)}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h5 className="font-semibold text-sm mb-2 text-slate-900">Quick Tips</h5>
        <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
          <li>• Drag sections to reorder them</li>
          <li>• Click on sections to edit content</li>
          <li>• Use the properties panel to customize</li>
        </ul>
      </div>
    </div>
  );
};