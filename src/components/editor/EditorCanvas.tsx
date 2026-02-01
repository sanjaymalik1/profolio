"use client";

import React from 'react';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import { useEditor, useEditorActions } from '@/contexts/EditorContext';
import { DragItem, PaletteDragItem, EditorSectionDragItem } from '@/types/editor';

// Import section components
import HeroSection from '@/components/portfolio/sections/HeroSection';
import AboutSection from '@/components/portfolio/sections/AboutSection';
import SkillsSection from '@/components/portfolio/sections/SkillsSection';
import ProjectsSection from '@/components/portfolio/sections/ProjectsSection';
import ContactSection from '@/components/portfolio/sections/ContactSection';

// Import template components
import { DarkProfessionalTemplate } from '@/components/templates/DarkProfessionalTemplate';
import { ElegantMonochromeTemplate } from '@/components/templates/ElegantMonochromeTemplate';
import { WarmMinimalistTemplate } from '@/components/templates/WarmMinimalistTemplate';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Edit, 
  GripVertical, 
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';

interface EditorCanvasProps {
  className?: string;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ className = '' }) => {
  const { state } = useEditor();
  const { 
    addSection, 
    removeSection, 
    moveSection, 
    selectSection,
    setDragging 
  } = useEditorActions();

  const handleDrop = (item: DragItem, monitor: any) => {
    const targetIndex = state?.sections?.length || 0;
    
    if (item.type === 'palette-section') {
      const paletteItem = item as PaletteDragItem;
      addSection(paletteItem.sectionType, targetIndex);
    } else if (item.type === 'editor-section') {
      const editorItem = item as EditorSectionDragItem;
      moveSection(editorItem.sectionId, targetIndex);
    }
  };

  const handleSectionDrop = (item: DragItem, targetIndex: number) => {
    if (item.type === 'palette-section') {
      const paletteItem = item as PaletteDragItem;
      addSection(paletteItem.sectionType, targetIndex);
    } else if (item.type === 'editor-section') {
      const editorItem = item as EditorSectionDragItem;
      if (editorItem.index !== targetIndex) {
        moveSection(editorItem.sectionId, targetIndex);
      }
    }
  };

  const renderSection = (section: any, index: number) => {
    const isSelected = state.selectedSectionId === section.id;
    
    const dragItem: EditorSectionDragItem = {
      type: 'editor-section',
      id: section.id,
      sectionType: section.type,
      sectionId: section.id,
      index
    };

    // Render the appropriate section component
    const SectionComponent = () => {
      const commonProps = {
        data: section.data,
        styling: section.styling,
        isEditing: false,
        onEdit: () => selectSection(section.id)
      };

      switch (section.type) {
        case 'template':
          // Render entire template component
          if (section.data.templateId === 'dark-professional') {
            return <DarkProfessionalTemplate data={section.data.templateData} isPreview={false} />;
          }
          if (section.data.templateId === 'elegant-monochrome') {
            return <ElegantMonochromeTemplate data={section.data.templateData} isPreview={false} />;
          }
          if (section.data.templateId === 'warm-minimalist') {
            return <WarmMinimalistTemplate data={section.data.templateData} isPreview={false} />;
          }
          return (
            <div className="p-8 text-center text-muted-foreground">
              Template "{section.data.templateId}" not found
            </div>
          );
        case 'hero':
          return <HeroSection {...commonProps} />;
        case 'about':
          return <AboutSection {...commonProps} />;
        case 'skills':
          return <SkillsSection {...commonProps} />;
        case 'projects':
          return <ProjectsSection {...commonProps} />;
        case 'contact':
          return <ContactSection {...commonProps} />;
        default:
          return (
            <div className="p-8 text-center text-muted-foreground">
              Section type "{section.type}" not implemented yet
            </div>
          );
      }
    };

    return (
      <div key={section.id} className="relative group">
        {/* Drop zone above section */}
        <Droppable
          accept={['palette-section', 'editor-section']}
          onDrop={(item) => handleSectionDrop(item, index)}
          className="h-2 -mb-2 relative z-10 opacity-0 group-hover:opacity-100"
        >
          <div className="h-full bg-blue-500 rounded-full mx-4" />
        </Droppable>

        {/* Section wrapper */}
        <div className={`
          relative border-2 border-transparent transition-all duration-200
          ${isSelected ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : ''}
          ${state.isDragging ? 'border-dashed border-gray-300' : ''}
        `}>
          {/* Section controls overlay */}
          <div className={`
            absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity
            ${isSelected ? 'opacity-100' : ''}
          `}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => selectSection(section.id)}
              className="bg-white/90 backdrop-blur-sm"
            >
              <Edit size={14} />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeSection(section.id)}
              className="bg-white/90 backdrop-blur-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </Button>
          </div>

          {/* Drag handle */}
          <Draggable
            dragItem={dragItem}
            onDragStart={() => setDragging(true)}
            onDragEnd={() => setDragging(false)}
          >
            <div className={`
              absolute left-2 top-2 z-20 p-2 rounded bg-white/90 backdrop-blur-sm
              opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing
              ${isSelected ? 'opacity-100' : ''}
            `}>
              <GripVertical size={14} className="text-gray-600" />
            </div>
          </Draggable>

          {/* Section type badge */}
          <div className={`
            absolute top-2 left-16 z-20 opacity-0 group-hover:opacity-100 transition-opacity
            ${isSelected ? 'opacity-100' : ''}
          `}>
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs">
              {section.type}
            </Badge>
          </div>

          {/* Section content */}
          <div onClick={() => selectSection(section.id)}>
            <SectionComponent />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Canvas header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-muted/30 rounded-lg">
        <div>
          <h3 className="font-semibold">Portfolio Canvas</h3>
          <p className="text-sm text-muted-foreground">
            {state?.sections?.length || 0} section{(state?.sections?.length || 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye size={14} className="mr-1" />
            Preview
          </Button>
        </div>
      </div>

      {/* Canvas content */}
      <Droppable
        accept={['palette-section', 'editor-section']}
        onDrop={handleDrop}
        className={`
          min-h-[600px] border-2 border-dashed border-gray-300 rounded-lg
          ${(state?.sections?.length || 0) === 0 ? 'flex items-center justify-center' : 'p-4'}
          ${state?.isDragging ? 'border-blue-400 bg-blue-50/30' : ''}
        `}
      >
        {(state?.sections?.length || 0) === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Plus size={48} className="mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-medium">Start Building Your Portfolio</h4>
              <p className="text-sm">
                Drag sections from the palette to begin creating your portfolio
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {(state?.sections || [])
              .sort((a, b) => a.order - b.order)
              .map((section, index) => renderSection(section, index))}
            
            {/* Final drop zone */}
            <Droppable
              accept={['palette-section', 'editor-section']}
              onDrop={(item) => handleSectionDrop(item, state?.sections?.length || 0)}
              className="h-8 opacity-0 hover:opacity-100 transition-opacity"
            >
              <div className="h-full bg-blue-500 rounded-full mx-4" />
            </Droppable>
          </div>
        )}
      </Droppable>

      {/* Canvas footer */}
      {(state?.sections?.length || 0) > 0 && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            💡 Click on sections to edit • Drag the grip handle to reorder • Use the trash icon to delete
          </p>
        </div>
      )}
    </div>
  );
};