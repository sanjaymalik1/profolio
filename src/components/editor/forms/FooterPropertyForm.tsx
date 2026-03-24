"use client";

import React from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import type { FooterData } from '@/types/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Plus, Trash2 } from 'lucide-react';

interface FooterPropertyFormProps {
  section: EditorSection;
}

export const FooterPropertyForm: React.FC<FooterPropertyFormProps> = ({ section }) => {
  const { updateSectionData } = useEditorActions();
  const footerData = section.data as FooterData;

  const handleInputChange = <K extends keyof FooterData>(field: K, value: FooterData[K]) => {
    updateSectionData(section.id, { ...footerData, [field]: value });
  };

  const handleLinkChange = (index: number, field: 'label' | 'href', value: string) => {
    const updatedLinks = [...(footerData.links || [])];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    handleInputChange('links', updatedLinks);
  };

  const addLink = () => {
    const newLinks = [...(footerData.links || []), { label: 'New Link', href: '#' }];
    handleInputChange('links', newLinks);
  };

  const removeLink = (index: number) => {
    const updatedLinks = [...(footerData.links || [])];
    updatedLinks.splice(index, 1);
    handleInputChange('links', updatedLinks);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={footerData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Brand/Company Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="copyrightText">Copyright Text</Label>
        <Input
          id="copyrightText"
          value={footerData.copyrightText || ''}
          onChange={(e) => handleInputChange('copyrightText', e.target.value)}
          placeholder="© 2024 Your Name. All rights reserved."
        />
      </div>

      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Footer Links
            </span>
            <Button variant="ghost" size="sm" onClick={addLink} className="h-8 px-2">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-4">
          {(footerData.links || []).map((link, index) => (
            <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 rounded-md border border-slate-100 relative">
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Label</Label>
                  <Input
                    value={link.label}
                    onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                    placeholder="Link Label"
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">URL</Label>
                  <Input
                    value={link.href}
                    onChange={(e) => handleLinkChange(index, 'href', e.target.value)}
                    placeholder="https://"
                    className="h-8"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLink(index)}
                className="h-8 w-8 text-slate-400 hover:text-red-500 absolute top-2 right-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {!(footerData.links?.length) && (
            <div className="text-center text-xs text-slate-500 py-4">
              No footer links added
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
