"use client";

import React, { useState } from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { enhancedPortfolioTemplates } from '@/lib/portfolio/enhanced-templates';

import { applyTemplateToEditor } from '@/lib/templateConverter';
import { TemplateGallery } from './TemplateGallery';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Layout, Wand2, Sparkles } from 'lucide-react';

export function TemplateManager() {
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const { loadSections, resetEditor } = useEditorActions();


  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowConfirmDialog(true);
  };

  const handleConfirmTemplate = async () => {
    if (!selectedTemplateId) return;

    try {
      await applyTemplateToEditor(selectedTemplateId, {
        clearEditor: resetEditor,
        loadState: (state: unknown) => {
          // The state should be an array of EditorSection
          if (Array.isArray(state)) {
            loadSections(state);
          }
        }
      }, {
        replaceAll: true,
        showConfirmation: false, // We already showed confirmation
        onSuccess: () => {
          setShowConfirmDialog(false);
          setSelectedTemplateId(null);
          setShowTemplateGallery(false);
        },
        onError: (error) => {
          alert(`Failed to apply template: ${error.message}`);
        }
      });
    } catch (error) {
      console.error('Error applying template:', error);
      alert('Failed to apply template. Please try again.');
      setShowConfirmDialog(false);
      setSelectedTemplateId(null);
    }
  };

  const selectedTemplate = selectedTemplateId
    ? enhancedPortfolioTemplates.find(t => t.id === selectedTemplateId)
    : null;

  return (
    <>
      {/* Template Gallery Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowTemplateGallery(true)}
        className="gap-2"
      >
        <Layout className="w-4 h-4" />
        Templates
      </Button>

      {/* Template Gallery Modal */}
      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-blue-500" />
              Apply Template
            </DialogTitle>
            <DialogDescription>
              This will replace your current portfolio content with the selected template.
              Any unsaved changes will be lost.
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              {/* Template Preview */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {selectedTemplate.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedTemplate.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="capitalize">{selectedTemplate.category}</span>
                      <span>•</span>
                      <span className="capitalize">{selectedTemplate.difficulty}</span>
                      <span>•</span>
                      <span>{selectedTemplate.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Features */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What&apos;s included:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {selectedTemplate.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmTemplate}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Apply Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}