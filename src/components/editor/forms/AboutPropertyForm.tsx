"use client";

import React from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import { AboutData } from '@/types/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, FileText, Image as ImageIcon } from 'lucide-react';

interface AboutPropertyFormProps {
  section: EditorSection;
}

export const AboutPropertyForm: React.FC<AboutPropertyFormProps> = ({ section }) => {
  const { updateSectionData } = useEditorActions();
  const aboutData = section.data as unknown as AboutData;

  const handleInputChange = (field: keyof AboutData, value: string | string[] | unknown) => {
    const updatedData = { ...aboutData, [field]: value };
    updateSectionData(section.id, updatedData);
  };

  return (
    <div className="space-y-5">
      
      {/* Basic Information */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 bg-slate-50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            <User className="w-4 h-4 text-slate-600" />
            About Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="heading" className="text-sm font-medium text-slate-700">Section Heading</Label>
            <Input
              id="heading"
              value={aboutData.heading || ''}
              onChange={(e) => handleInputChange('heading', e.target.value)}
              placeholder="About Me"
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-slate-700">About Content</Label>
            <Textarea
              id="content"
              value={aboutData.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Tell your story and background..."
              rows={6}
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Image */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 bg-slate-50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            <ImageIcon className="w-4 h-4 text-slate-600" />
            Profile Image
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <Label htmlFor="profileImage" className="text-sm font-medium text-slate-700">Profile Image URL</Label>
            <Input
              id="profileImage"
              value={aboutData.profileImage || ''}
              onChange={(e) => handleInputChange('profileImage', e.target.value)}
              placeholder="https://example.com/profile-image.jpg"
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 bg-slate-50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            <FileText className="w-4 h-4 text-slate-600" />
            Highlights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <Label htmlFor="highlights" className="text-sm font-medium text-slate-700">Key Highlights (one per line)</Label>
            <Textarea
              id="highlights"
              value={aboutData.highlights?.join('\n') || ''}
              onChange={(e) => handleInputChange('highlights', e.target.value.split('\n').filter(Boolean))}
              placeholder="5+ years of experience&#10;Full-stack development expertise&#10;Team leadership skills"
              rows={4}
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};