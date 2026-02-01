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
  const aboutData = section.data as AboutData;

  const handleInputChange = (field: keyof AboutData, value: any) => {
    const updatedData = { ...aboutData, [field]: value };
    updateSectionData(section.id, updatedData);
  };

  return (
    <div className="space-y-6">
      
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="w-4 h-4" />
            About Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heading">Section Heading</Label>
            <Input
              id="heading"
              value={aboutData.heading || ''}
              onChange={(e) => handleInputChange('heading', e.target.value)}
              placeholder="About Me"
            />
          </div>

          <div>
            <Label htmlFor="content">About Content</Label>
            <Textarea
              id="content"
              value={aboutData.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Tell your story and background..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Image */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Profile Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="profileImage">Profile Image URL</Label>
            <Input
              id="profileImage"
              value={aboutData.profileImage || ''}
              onChange={(e) => handleInputChange('profileImage', e.target.value)}
              placeholder="https://example.com/profile-image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="highlights">Key Highlights (one per line)</Label>
            <Textarea
              id="highlights"
              value={aboutData.highlights?.join('\n') || ''}
              onChange={(e) => handleInputChange('highlights', e.target.value.split('\n').filter(Boolean))}
              placeholder="5+ years of experience&#10;Full-stack development expertise&#10;Team leadership skills"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};