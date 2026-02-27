"use client";

import React, { useState } from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import type { TemplateData } from '@/types/portfolio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Briefcase, Code, FolderGit2, Mail } from 'lucide-react';

interface TemplatePropertyFormProps {
  section: EditorSection;
}

export const TemplatePropertyForm: React.FC<TemplatePropertyFormProps> = ({ section }) => {
  const { updateSectionData } = useEditorActions();
  
  // Always call hooks at the top level
  const initialData = section.type === 'template' ? section.data.templateData : {};
  const [formData, setFormData] = useState<TemplateData>(initialData);
  
  // Type guard: ensure this is a template section
  if (section.type !== 'template') {
    return null;
  }

  const handleChange = (path: string[], value: string | unknown) => {
    const newData = { ...formData };
    let current: Record<string, unknown> = newData as Record<string, unknown>;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]] as Record<string, unknown>;
    }
    current[path[path.length - 1]] = value;
    
    setFormData(newData);
  };

  const handleSave = () => {
    updateSectionData(section.id, {
      templateId: section.data.templateId,
      templateData: formData
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Template Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="hero" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                Hero
              </TabsTrigger>
              <TabsTrigger value="about" className="text-xs">
                <Briefcase className="w-3 h-3 mr-1" />
                About
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">
                <Code className="w-3 h-3 mr-1" />
                Skills
              </TabsTrigger>
            </TabsList>

            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="projects" className="text-xs">
                <FolderGit2 className="w-3 h-3 mr-1" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-xs">
                <Mail className="w-3 h-3 mr-1" />
                Contact
              </TabsTrigger>
            </TabsList>

            {/* Hero Tab */}
            <TabsContent value="hero" className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData?.hero?.fullName || ''}
                  onChange={(e) => handleChange(['hero', 'fullName'], e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="title">Title/Position</Label>
                <Input
                  id="title"
                  value={formData?.hero?.title || ''}
                  onChange={(e) => handleChange(['hero', 'title'], e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData?.hero?.bio || ''}
                  onChange={(e) => handleChange(['hero', 'bio'], e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData?.hero?.location || ''}
                  onChange={(e) => handleChange(['hero', 'location'], e.target.value)}
                />
              </div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
              <div>
                <Label htmlFor="aboutHeading">Heading</Label>
                <Input
                  id="aboutHeading"
                  value={formData?.about?.heading || ''}
                  onChange={(e) => handleChange(['about', 'heading'], e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="aboutContent">Content</Label>
                <Textarea
                  id="aboutContent"
                  rows={6}
                  value={formData?.about?.content || ''}
                  onChange={(e) => handleChange(['about', 'content'], e.target.value)}
                />
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
              <div>
                <Label htmlFor="skillsHeading">Heading</Label>
                <Input
                  id="skillsHeading"
                  value={formData?.skills?.heading || ''}
                  onChange={(e) => handleChange(['skills', 'heading'], e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500">
                Skill editing coming soon. Use the full editor to modify individual skills.
              </p>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
              <div>
                <Label htmlFor="projectsHeading">Heading</Label>
                <Input
                  id="projectsHeading"
                  value={formData?.projects?.heading || ''}
                  onChange={(e) => handleChange(['projects', 'heading'], e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500">
                Project editing coming soon. Use the full editor to modify individual projects.
              </p>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
              <div>
                <Label htmlFor="contactHeading">Heading</Label>
                <Input
                  id="contactHeading"
                  value={formData?.contact?.heading || ''}
                  onChange={(e) => handleChange(['contact', 'heading'], e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData?.contact?.email || ''}
                  onChange={(e) => handleChange(['contact', 'email'], e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData?.contact?.phone || ''}
                  onChange={(e) => handleChange(['contact', 'phone'], e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contactLocation">Location</Label>
                <Input
                  id="contactLocation"
                  value={formData?.contact?.location || ''}
                  onChange={(e) => handleChange(['contact', 'location'], e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />
          
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
