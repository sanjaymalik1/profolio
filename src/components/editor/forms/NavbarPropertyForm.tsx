"use client";

import React from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import type { NavbarData } from '@/types/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Plus, Trash2 } from 'lucide-react';

interface NavbarPropertyFormProps {
  section: EditorSection;
}

export const NavbarPropertyForm: React.FC<NavbarPropertyFormProps> = ({ section }) => {
  const { updateSectionData } = useEditorActions();
  const navbarData = section.data as NavbarData;

  const handleInputChange = <K extends keyof NavbarData>(field: K, value: NavbarData[K]) => {
    updateSectionData(section.id, { ...navbarData, [field]: value });
  };

  const handleLinkChange = (index: number, field: 'label' | 'href', value: string) => {
    const updatedLinks = [...(navbarData.links || [])];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    handleInputChange('links', updatedLinks);
  };

  const addLink = () => {
    const newLinks = [...(navbarData.links || []), { label: 'New Link', href: '#' }];
    handleInputChange('links', newLinks);
  };

  const removeLink = (index: number) => {
    const updatedLinks = [...(navbarData.links || [])];
    updatedLinks.splice(index, 1);
    handleInputChange('links', updatedLinks);
  };

  const handleCtaChange = (field: 'label' | 'href', value: string) => {
    const currentCta = navbarData.cta || { label: '', href: '' };
    handleInputChange('cta', { ...currentCta, [field]: value });
  };

  const isAutoGenerate = navbarData.autoGenerateLinks === true || 
    (navbarData.autoGenerateLinks === undefined && (!navbarData.links || navbarData.links.length === 0));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={navbarData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Brand Name"
        />
      </div>

      <Card>
        <CardHeader className="p-4 pb-2 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Link className="w-4 h-4" />
              Navigation Links
            </CardTitle>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                id="autoGenerateLinks"
                checked={isAutoGenerate}
                onChange={(e) => handleInputChange('autoGenerateLinks', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <Label htmlFor="autoGenerateLinks" className="text-xs font-normal cursor-pointer select-none text-slate-600">
                Auto-generate
              </Label>
            </div>
          </div>
          {!isAutoGenerate && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={addLink} className="h-8 px-2">
                <Plus className="w-4 h-4 mr-1" />
                Add Link
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-4 space-y-4">
          {(navbarData.links || []).map((link, index) => (
            <div key={index} className={`flex gap-2 items-start bg-slate-50 p-3 rounded-md border border-slate-100 relative ${isAutoGenerate ? 'opacity-70' : ''}`}>
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Label</Label>
                  <Input
                    value={link.label}
                    onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                    placeholder="Link Label"
                    className="h-8"
                    disabled={isAutoGenerate}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">URL</Label>
                  <Input
                    value={link.href}
                    onChange={(e) => handleLinkChange(index, 'href', e.target.value)}
                    placeholder="https://"
                    className="h-8"
                    disabled={isAutoGenerate}
                  />
                </div>
              </div>
              {!isAutoGenerate && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(index)}
                  className="h-8 w-8 text-slate-400 hover:text-red-500 absolute top-2 right-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          {!(navbarData.links?.length) && (
            <div className="text-center text-xs text-slate-500 py-4">
              No navigation links added
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">CTA Button</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3 bg-slate-50 rounded-b-lg border-t border-slate-100">
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Label</Label>
            <Input
              value={navbarData.cta?.label || ''}
              onChange={(e) => handleCtaChange('label', e.target.value)}
              placeholder="Button Label"
              className="bg-white h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">URL</Label>
            <Input
              value={navbarData.cta?.href || ''}
              onChange={(e) => handleCtaChange('href', e.target.value)}
              placeholder="Button URL"
              className="bg-white h-8"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
