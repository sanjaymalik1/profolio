"use client";

import React from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Eye } from 'lucide-react';
import { EditorSection } from '@/types/editor';
import { HeroPropertyForm } from './forms/HeroPropertyForm';
import { AboutPropertyForm } from './forms/AboutPropertyForm';
import { SkillsPropertyForm } from './forms/SkillsPropertyForm';
import { ProjectsPropertyForm } from './forms/ProjectsPropertyForm';
import { ContactPropertyForm } from './forms/ContactPropertyForm';
import { TemplatePropertyForm } from './forms/TemplatePropertyForm';

export const PropertyPanel: React.FC = () => {
  const { state } = useEditor();
  const selectedSection = state.selectedSectionId ? 
    state.sections.find((section: EditorSection) => section.id === state.selectedSectionId) : 
    null;

  const renderPropertyForm = () => {
    if (!selectedSection) {
      return (
        <div className="flex flex-col items-center justify-center h-80 text-center px-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-2">No Section Selected</h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
            Select a section from the canvas to edit its properties and customize content
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
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 capitalize">
                <Settings className="w-4 h-4" />
                {selectedSection.type} Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <strong>Section ID:</strong> {selectedSection.id}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Section Type:</strong> {selectedSection.type}
                </div>
                <Separator />
                <div className="text-center text-gray-500 p-4">
                  <p>Property form for {selectedSection.type} is coming soon!</p>
                  <p className="text-xs mt-2">
                    Dynamic forms will be implemented here for editing section content.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="w-full sm:w-72 lg:w-80 xl:w-96 bg-white border-l border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 lg:p-5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base lg:text-lg font-semibold flex items-center gap-2 text-slate-900">
            <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-slate-600" />
            <span>Properties</span>
          </h2>
          <Badge variant="outline" className="text-xs border-slate-200 text-slate-700">
            <Eye className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
        {selectedSection && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              {selectedSection.type}
            </Badge>
            <span className="text-xs text-slate-600">Section</span>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {renderPropertyForm()}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-600 text-center font-medium">
          Changes are applied in real-time
        </div>
      </div>
    </div>
  );
};