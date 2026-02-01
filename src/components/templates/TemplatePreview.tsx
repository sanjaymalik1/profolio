"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { templateComponents, getTemplate } from './index';
import { applyTemplateToEditor } from '@/lib/templateConverter';
import { useEditorActions } from '@/contexts/EditorContext';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink,
  Sparkles,
  Palette,
  Code
} from 'lucide-react';

interface TemplatePreviewProps {
  templateId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate?: (templateId: string) => void;
}

export function TemplatePreview({ templateId, isOpen, onClose, onUseTemplate }: TemplatePreviewProps) {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isApplying, setIsApplying] = useState(false);
  const template = templateId ? getTemplate(templateId) : null;
  
  // Try to get editor actions if available (will be null on landing page)
  let editorActions = null;
  try {
    editorActions = useEditorActions();
  } catch (e) {
    // Not in editor context, that's fine
  }

  if (!template) return null;

  const TemplateComponent = template.component;

  const getDeviceClasses = () => {
    switch (previewDevice) {
      case 'tablet':
        return 'max-w-2xl mx-auto';
      case 'mobile':
        return 'max-w-sm mx-auto';
      default:
        return 'w-full';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'developer':
        return <Code className="w-4 h-4" />;
      case 'creative':
        return <Palette className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const handleUseTemplate = async () => {
    if (!templateId) return;
    
    // If no editor actions (landing page), just call the callback
    if (!editorActions) {
      onUseTemplate?.(templateId);
      onClose();
      return;
    }
    
    setIsApplying(true);
    
    try {
      await applyTemplateToEditor(templateId, editorActions, {
        replaceAll: true,
        showConfirmation: true,
        onSuccess: () => {
          // Close preview modal
          onClose();
          // Call original callback if provided
          onUseTemplate?.(templateId);
        },
        onError: (error) => {
          alert(`Failed to apply template: ${error.message}`);
        }
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[85vw] sm:!max-w-[85vw] md:!max-w-[80vw] lg:!max-w-[75vw] max-h-[90vh] w-full h-full flex flex-col overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{template.name} Template Preview</DialogTitle>
          <DialogDescription>Preview of the {template.name} portfolio template</DialogDescription>
        </DialogHeader>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getCategoryIcon(template.category)}
              <div>
                <h2 className="text-xl font-semibold">{template.name}</h2>
                <p className="text-sm text-gray-500 capitalize">{template.category} Template</p>
              </div>
            </div>
            <Badge variant="secondary" className="capitalize">
              {template.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Device Toggle */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
              <Button
                variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('desktop')}
                className="p-2"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                size="sm" 
                onClick={() => setPreviewDevice('tablet')}
                className="p-2"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('mobile')}
                className="p-2"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleUseTemplate} 
                className="gap-2"
                disabled={isApplying}
              >
                <Sparkles className="w-4 h-4" />
                {isApplying ? 'Applying...' : 'Use Template'}
              </Button>
              <Button variant="outline" onClick={onClose} size="sm" className="p-2">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <div className="h-full overflow-y-auto">
            <motion.div
              key={previewDevice}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`${getDeviceClasses()} transition-all duration-300`}
            >
              <div className="bg-white shadow-lg">
                <TemplateComponent 
                  data={template.previewData}
                  isPreview={true}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="border-t bg-white p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>Template: {template.name}</span>
              <span>•</span>
              <span>Category: {template.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Preview Mode: {previewDevice}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}