"use client";

import React from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Settings } from 'lucide-react';
import { EditorSection } from '@/types/editor';
import { HeroPropertyForm } from './forms/HeroPropertyForm';
import { AboutPropertyForm } from './forms/AboutPropertyForm';
import { SkillsPropertyForm } from './forms/SkillsPropertyForm';
import { ProjectsPropertyForm } from './forms/ProjectsPropertyForm';
import { ContactPropertyForm } from './forms/ContactPropertyForm';
import { TemplatePropertyForm } from './forms/TemplatePropertyForm';
import { ExperiencePropertyForm } from './forms/ExperiencePropertyForm';
import { EducationPropertyForm } from './forms/EducationPropertyForm';
import { NavbarPropertyForm } from './forms/NavbarPropertyForm';
import { FooterPropertyForm } from './forms/FooterPropertyForm';

export const PropertyPanel: React.FC = () => {
  const { state } = useEditor();
  const selectedSection = state.selectedSectionId ?
    state.sections.find((section: EditorSection) => section.id === state.selectedSectionId) :
    null;

  const renderPropertyForm = () => {
    if (!selectedSection) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
          <Settings className="w-8 h-8 text-slate-300 mb-3" />
          <h3 className="text-sm font-medium text-slate-600 mb-1">No section selected</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Select a section from the canvas to edit its properties
          </p>
        </div>
      );
    }

    switch (selectedSection.type) {
      case 'template':
        return <TemplatePropertyForm section={selectedSection} />;
      case 'hero':
        return <HeroPropertyForm section={selectedSection} />;
      case 'about':
        return <AboutPropertyForm section={selectedSection} />;
      case 'skills':
        return <SkillsPropertyForm section={selectedSection} />;
      case 'projects':
        return <ProjectsPropertyForm section={selectedSection} />;
      case 'contact':
        return <ContactPropertyForm section={selectedSection} />;
      case 'experience':
        return <ExperiencePropertyForm section={selectedSection} />;
      case 'education':
        return <EducationPropertyForm section={selectedSection} />;
      case 'navbar':
        return <NavbarPropertyForm section={selectedSection} />;
      case 'footer':
        return <FooterPropertyForm section={selectedSection} />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Section Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 p-4">
                <p className="text-sm">Property form coming soon.</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <aside className="hidden md:flex w-64 lg:w-72 xl:w-80 2xl:w-96 bg-[#f5f1ea] border-l border-slate-200/50 flex-col h-full editor-typography">
      {/* Header - minimal and responsive */}
      <div className="p-3 sm:p-4 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold flex items-center gap-2 text-[#2d2a26]">
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Properties</span>
          </h2>
          {selectedSection && (
            <Badge variant="secondary" className="text-[0.68rem] uppercase tracking-[0.11em] bg-slate-100 text-[#5c554d] border-0 font-semibold">
              {selectedSection.type}
            </Badge>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4">
          {renderPropertyForm()}
        </div>
      </div>
    </aside>
  );
};