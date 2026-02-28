"use client";

import React, { useState } from 'react';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import { EditorBlock } from './EditorBlock';
import { useEditor, useEditorActions } from '@/contexts/EditorContext';
import { DragItem, PaletteDragItem, EditorSectionDragItem, EditorSection } from '@/types/editor';


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
import { Badge } from '@/components/ui/badge';
import {
  GripVertical,
  Plus,
  Eye
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
    duplicateSection,
    moveSectionUp,
    moveSectionDown,
    selectSection,
    setDragging,
    updateSectionData,
    updateSectionStyling
  } = useEditorActions();

  // Block selection state (separate from section selection for PropertyPanel)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Get selected section info for orientation feedback
  const selectedSection = state.sections.find(s => s.id === selectedBlockId);
  const formatSectionName = (type?: string) => {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1) + ' Section';
  };

  const handleDrop = (item: DragItem) => {
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

  const renderSection = (section: EditorSection, index: number) => {
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
      switch (section.type) {
        case 'template':
          // TypeScript now knows section.data is TemplateSectionData
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
              Template &quot;{section.data.templateId}&quot; not found
            </div>
          );
        case 'hero':
          // TypeScript knows section.data is HeroData here
          return (
            <HeroSection
              data={section.data}
              styling={section.styling}
              isEditing={true}
              isPublicView={false}
              onEdit={() => selectSection(section.id)}
              onDataChange={(newData) => updateSectionData(section.id, newData)}
              onStylingChange={(newStyling) => updateSectionStyling(section.id, newStyling)}
            />
          );
        case 'about':
          // TypeScript knows section.data is AboutData here
          return (
            <AboutSection
              data={section.data}
              styling={section.styling}
              isEditing={true}
              isPublicView={false}
              onEdit={() => selectSection(section.id)}
              onDataChange={(newData) => updateSectionData(section.id, newData)}
              onStylingChange={(newStyling) => updateSectionStyling(section.id, newStyling)}
            />
          );
        case 'skills':
          // TypeScript knows section.data is SkillsData here
          return (
            <SkillsSection
              data={section.data}
              styling={section.styling}
              isEditing={true}
              isPublicView={false}
              onEdit={() => selectSection(section.id)}
              onDataChange={(newData) => updateSectionData(section.id, newData)}
              onStylingChange={(newStyling) => updateSectionStyling(section.id, newStyling)}
            />
          );
        case 'projects':
          // TypeScript knows section.data is ProjectsData here
          return (
            <ProjectsSection
              data={section.data}
              styling={section.styling}
              isEditing={true}
              isPublicView={false}
              onEdit={() => selectSection(section.id)}
              onDataChange={(newData) => updateSectionData(section.id, newData)}
              onStylingChange={(newStyling) => updateSectionStyling(section.id, newStyling)}
            />
          );
        case 'contact':
          // TypeScript knows section.data is ContactData here
          return (
            <ContactSection
              data={section.data}
              styling={section.styling}
              isEditing={true}
              isPublicView={false}
              onEdit={() => selectSection(section.id)}
              onDataChange={(newData) => updateSectionData(section.id, newData)}
              onStylingChange={(newStyling) => updateSectionStyling(section.id, newStyling)}
            />
          );
        case 'experience':
          // TypeScript knows section.data is ExperienceData here
          return (
            <div className="p-8 text-center text-muted-foreground">
              Experience section component not yet implemented
            </div>
          );
        case 'education':
          // TypeScript knows section.data is EducationData here
          return (
            <div className="p-8 text-center text-muted-foreground">
              Education section component not yet implemented
            </div>
          );
        default:
          // Exhaustive type check - ensures all section types are handled
          void (section as never);
          return null;
      }
    };

    return (
      <div key={section.id} className="relative group">
        {/* Drop zone above section - subtle */}
        <Droppable
          accept={['palette-section', 'editor-section']}
          onDrop={(item) => handleSectionDrop(item, index)}
          className="h-1.5 -mb-1.5 relative z-10 opacity-0 group-hover:opacity-100"
        >
          <div className="h-full bg-blue-400 rounded-full mx-4" />
        </Droppable>

        {/* EditorBlock wrapper for block-level interactions */}
        <EditorBlock
          blockId={section.id}
          sectionType={section.type}
          isSelected={selectedBlockId === section.id}
          onSelect={() => setSelectedBlockId(section.id)}
          onDuplicate={() => duplicateSection(section.id)}
          onDelete={() => removeSection(section.id)}
          onMoveUp={() => moveSectionUp(section.id)}
          onMoveDown={() => moveSectionDown(section.id)}
          canMoveUp={index > 0}
          canMoveDown={index < state.sections.length - 1}
        >
          {/* Section wrapper - Webflow-style subtle borders */}
          <div className={`
            relative border rounded-md transition-all duration-200
            ${isSelected ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-transparent hover:border-slate-300'}
            ${state.isDragging ? 'border-dashed border-slate-300' : ''}
          `}>

            {/* Drag handle - minimal */}
            <Draggable
              dragItem={dragItem}
              onDragStart={() => setDragging(true)}
              onDragEnd={() => setDragging(false)}
            >
              <div className={`
              absolute left-2 top-2 z-20 p-1.5 rounded-md bg-white/95 border border-slate-200/60 shadow-sm backdrop-blur-sm
              cursor-grab active:cursor-grabbing transition-opacity
              ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `}>
                <GripVertical className="h-4 w-4 text-slate-400" />
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

            {/* Section content - Static editor rendering, no animations */}
            <div onClick={() => selectSection(section.id)} className="[&_*]:!transition-none [&_*]:!animation-none">
              <SectionComponent />
            </div>
          </div>
        </EditorBlock>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Editor Orientation Feedback - Sticky at top, responsive */}
      {selectedBlockId && selectedSection && (
        <div className="sticky top-0 z-30 mb-3 sm:mb-4 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-blue-900">
              Editing: {formatSectionName(selectedSection.type)}
            </span>
          </div>
        </div>
      )}

      {/* Canvas header - responsive */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 sm:p-4 lg:p-5 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Portfolio Canvas</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {state?.sections?.length || 0} section{(state?.sections?.length || 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-slate-200 hover:bg-slate-50 text-xs sm:text-sm">
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden md:inline">Preview</span>
          </Button>
        </div>
      </div>

      {/* Canvas content - responsive minimal design */}
      <Droppable
        accept={['palette-section', 'editor-section']}
        onDrop={handleDrop}
        className={`
          min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] border border-dashed rounded-lg transition-all
          ${(state?.sections?.length || 0) === 0 ? 'flex items-center justify-center bg-slate-50/30' : 'p-3 sm:p-4 md:p-6 bg-white'}
          ${state?.isDragging ? 'border-blue-400 bg-blue-50/30' : 'border-slate-300'}
        `}
      >
        <div
          className="w-full h-full"
          onClick={(e) => {
            // Deselect block when clicking canvas background
            if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.space-y-0') === null) {
              setSelectedBlockId(null);
            }
          }}
        >
          {(state?.sections?.length || 0) === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
              </div>
              <h4 className="text-sm sm:text-base font-medium text-slate-700 mb-1">Start building your portfolio</h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                <span className="hidden lg:inline">Drag sections from the left panel to begin</span>
                <span className="lg:hidden">Add sections to get started</span>
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
        </div>
      </Droppable>

      {/* Canvas footer - responsive */}
      {(state?.sections?.length || 0) > 0 && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 lg:p-5 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs sm:text-sm text-slate-600 text-center leading-relaxed">
            <span className="font-medium text-slate-700">Tip:</span>
            <span className="hidden sm:inline"> Click sections to edit • Drag the grip handle to reorder • Use the trash icon to delete</span>
            <span className="sm:hidden"> Tap sections to edit properties</span>
          </p>
        </div>
      )}
    </div>
  );
};