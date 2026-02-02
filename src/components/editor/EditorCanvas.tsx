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
          relative border-2 rounded-lg transition-all duration-200
          ${isSelected ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' : 'border-transparent'}
          ${state.isDragging ? 'border-dashed border-slate-300' : ''}
        `}>
          {/* Section controls overlay */}
          <div className={`
            absolute top-3 right-3 z-20 flex gap-2 transition-opacity
            ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => selectSection(section.id)}
              className="h-8 px-3 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-slate-700"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeSection(section.id)}
              className="h-8 px-3 bg-white hover:bg-red-50 border border-red-200 shadow-sm text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Drag handle */}
          <Draggable
            dragItem={dragItem}
            onDragStart={() => setDragging(true)}
            onDragEnd={() => setDragging(false)}
          >
            <div className={`
              absolute left-3 top-3 z-20 p-2 rounded-md bg-white border border-slate-200 shadow-sm
              cursor-grab active:cursor-grabbing transition-opacity
              ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `}>
              <GripVertical className="h-4 w-4 text-slate-500" />
            </div>
          </Draggable>

          {/* Section type badge */}
          <div className={`
            absolute top-3 left-14 z-20 transition-opacity
            ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}>
            <Badge variant="secondary" className="bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-sm capitalize">
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
      <div className="flex items-center justify-between mb-6 p-4 lg:p-5 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-semibold text-slate-900 text-base">Portfolio Canvas</h3>
          <p className="text-sm text-slate-600 mt-0.5">
            {state?.sections?.length || 0} section{(state?.sections?.length || 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-slate-200 hover:bg-slate-50">
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">Preview</span>
          </Button>
        </div>
      </div>

      {/* Canvas content */}
      <Droppable
        accept={['palette-section', 'editor-section']}
        onDrop={handleDrop}
        className={`
          min-h-[600px] border-2 border-dashed rounded-xl transition-all
          ${(state?.sections?.length || 0) === 0 ? 'flex items-center justify-center bg-white' : 'p-6 bg-white'}
          ${state?.isDragging ? 'border-blue-400 bg-blue-50/50 shadow-lg' : 'border-slate-300 hover:border-slate-400'}
        `}
      >
        {(state?.sections?.length || 0) === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-slate-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Start Building Your Portfolio</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Drag sections from the left panel to begin creating your portfolio, or choose a template to get started quickly.
            </p>
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
        <div className="mt-6 p-4 lg:p-5 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600 text-center leading-relaxed">
            <span className="font-medium text-slate-700">Tip:</span> Click sections to edit • Drag the grip handle to reorder • Use the trash icon to delete
          </p>
        </div>
      )}
    </div>
  );
};