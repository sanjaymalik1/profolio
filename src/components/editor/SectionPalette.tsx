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
        <Card className="cursor-grab hover:shadow-md transition-shadow border-2 hover:border-blue-300">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconComponent size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1">{section.displayName}</h4>
                <p className="text-xs text-muted-foreground leading-tight">
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
        <h3 className="text-lg font-semibold mb-4">Section Palette</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Drag sections to your portfolio canvas to build your page
        </p>
      </div>

      {/* Basic Sections */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h4 className="font-medium text-sm">Essential Sections</h4>
          <Badge variant="secondary" className="text-xs">
            {basicSections.length}
          </Badge>
        </div>
        <div className="space-y-2">
          {basicSections.map(renderSection)}
        </div>
      </div>

      {/* Advanced Sections */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h4 className="font-medium text-sm">Advanced Sections</h4>
          <Badge variant="outline" className="text-xs">
            {advancedSections.length}
          </Badge>
        </div>
        <div className="space-y-2">
          {advancedSections.map(renderSection)}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h5 className="font-medium text-sm mb-2">💡 Quick Tips</h5>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Drag sections to reorder them</li>
          <li>• Click on sections to edit content</li>
          <li>• Use the properties panel to customize styling</li>
        </ul>
      </div>
    </div>
  );
};