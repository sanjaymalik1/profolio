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
import { Settings, User, Briefcase, Code, FolderGit2, Mail, Plus, Trash2, Building2, GraduationCap } from 'lucide-react';

interface TemplatePropertyFormProps {
  section: EditorSection;
}

export const TemplatePropertyForm: React.FC<TemplatePropertyFormProps> = ({ section }) => {
  const { updateSectionData } = useEditorActions();

  // Derive form data directly from section props to ensure it stays in sync
  const formData = section.type === 'template' ? section.data.templateData : {};

  // Type guard: ensure this is a template section
  if (section.type !== 'template') {
    return null;
  }

  const handleChange = (path: string[], value: string | unknown) => {
    const newData = JSON.parse(JSON.stringify(formData));
    let current: any = newData;

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      const nextKey = path[i + 1];

      if (current[key] === undefined || current[key] === null) {
        // Create an array if the next key is an index, otherwise an object
        current[key] = isNaN(Number(nextKey)) ? {} : [];
      }
      current = current[key];
    }

    current[path[path.length - 1]] = value;

    updateSectionData(section.id, {
      templateId: section.data.templateId,
      templateData: newData
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
            <TabsList className="flex flex-wrap w-full h-auto gap-1 mb-4 p-1 bg-slate-100/50">
              <TabsTrigger value="hero" className="text-[10px] flex-1 min-w-[60px] py-1.5 px-2">
                <User className="w-3 h-3 mr-1 hidden md:block" /> Hero
              </TabsTrigger>
              <TabsTrigger value="about" className="text-[10px] flex-1 min-w-[60px] py-1.5 px-2">
                <Briefcase className="w-3 h-3 mr-1 hidden md:block" /> About
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-[10px] flex-1 min-w-[60px] py-1.5 px-2">
                <Code className="w-3 h-3 mr-1 hidden md:block" /> Skills
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-[10px] flex-1 min-w-[60px] py-1.5 px-2">
                <FolderGit2 className="w-3 h-3 mr-1 hidden md:block" /> Projects
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-[10px] flex-1 min-w-[60px] py-1.5 px-2">
                <Building2 className="w-3 h-3 mr-1 hidden md:block" /> Exp
              </TabsTrigger>
              <TabsTrigger value="education" className="text-[10px] flex-1 min-w-[60px] py-1.5 px-2">
                <GraduationCap className="w-3 h-3 mr-1 hidden md:block" /> Edu
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-[10px] flex-1 min-w-[60px] py-1.5 px-2">
                <Mail className="w-3 h-3 mr-1 hidden md:block" /> Contact
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

              {/* Social Links Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Social Links</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-2"
                    onClick={() => {
                      const current = formData?.hero?.socialLinks || [];
                      handleChange(['hero', 'socialLinks'], [...current, { platform: 'github', url: '' }]);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Link
                  </Button>
                </div>

                <div className="space-y-3">
                  {(formData?.hero?.socialLinks || []).map((link, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="space-y-2 flex-1">
                        <Input
                          placeholder="Platform (e.g. github, linkedin)"
                          value={link.platform}
                          onChange={(e) => handleChange(['hero', 'socialLinks', String(idx), 'platform'], e.target.value)}
                          className="h-8 text-xs"
                        />
                        <Input
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) => handleChange(['hero', 'socialLinks', String(idx), 'url'], e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                        onClick={() => {
                          const current = [...(formData?.hero?.socialLinks || [])];
                          current.splice(idx, 1);
                          handleChange(['hero', 'socialLinks'], current);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {(!formData?.hero?.socialLinks || formData.hero.socialLinks.length === 0) && (
                    <p className="text-xs text-slate-400 text-center py-2">No social links added.</p>
                  )}
                </div>
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

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              <div>
                <Label>Heading</Label>
                <Input
                  value={formData?.experience?.heading || ''}
                  onChange={(e) => handleChange(['experience', 'heading'], e.target.value)}
                  className="mb-4"
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <Label>Experience</Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-2"
                  onClick={() => {
                    const current = formData?.experience?.experiences || [];
                    handleChange(['experience', 'experiences'], [...current, { id: Date.now().toString(), position: '', company: '', startDate: '', endDate: '', description: '', responsibilities: [] }]);
                  }}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Role
                </Button>
              </div>

              <div className="space-y-4">
                {(formData?.experience?.experiences || []).map((exp, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative group">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-2 h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const current = [...(formData?.experience?.experiences || [])];
                        current.splice(idx, 1);
                        handleChange(['experience', 'experiences'], current);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>

                    <div className="space-y-3 mt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] text-slate-500 mb-1 block">Position</Label>
                          <Input
                            value={exp.position || ''}
                            onChange={(e) => handleChange(['experience', 'experiences', String(idx), 'position'], e.target.value)}
                            className="h-7 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] text-slate-500 mb-1 block">Company</Label>
                          <Input
                            value={exp.company || ''}
                            onChange={(e) => handleChange(['experience', 'experiences', String(idx), 'company'], e.target.value)}
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] text-slate-500 mb-1 block">Start Date</Label>
                          <Input
                            value={exp.startDate || ''}
                            onChange={(e) => handleChange(['experience', 'experiences', String(idx), 'startDate'], e.target.value)}
                            className="h-7 text-xs"
                            placeholder="e.g. Jan 2020"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] text-slate-500 mb-1 block">End Date</Label>
                          <Input
                            value={exp.endDate || ''}
                            onChange={(e) => handleChange(['experience', 'experiences', String(idx), 'endDate'], e.target.value)}
                            className="h-7 text-xs"
                            placeholder="e.g. Present"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-[10px] text-slate-500 mb-1 block">Description</Label>
                        <Textarea
                          value={exp.description || ''}
                          onChange={(e) => handleChange(['experience', 'experiences', String(idx), 'description'], e.target.value)}
                          className="h-16 text-xs resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              <div>
                <Label>Heading</Label>
                <Input
                  value={formData?.education?.heading || ''}
                  onChange={(e) => handleChange(['education', 'heading'], e.target.value)}
                  className="mb-4"
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <Label>Education</Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-2"
                  onClick={() => {
                    const current = formData?.education?.education || [];
                    handleChange(['education', 'education'], [...current, { id: Date.now().toString(), degree: '', field: '', institution: '', startDate: '', endDate: '' }]);
                  }}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Degree
                </Button>
              </div>

              <div className="space-y-4">
                {(formData?.education?.education || []).map((edu, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative group">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-2 h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const current = [...(formData?.education?.education || [])];
                        current.splice(idx, 1);
                        handleChange(['education', 'education'], current);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>

                    <div className="space-y-3 mt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] text-slate-500 mb-1 block">Degree</Label>
                          <Input
                            value={edu.degree || ''}
                            onChange={(e) => handleChange(['education', 'education', String(idx), 'degree'], e.target.value)}
                            className="h-7 text-xs"
                            placeholder="e.g. B.S."
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] text-slate-500 mb-1 block">Institution</Label>
                          <Input
                            value={edu.institution || ''}
                            onChange={(e) => handleChange(['education', 'education', String(idx), 'institution'], e.target.value)}
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] text-slate-500 mb-1 block">Start Date</Label>
                          <Input
                            value={edu.startDate || ''}
                            onChange={(e) => handleChange(['education', 'education', String(idx), 'startDate'], e.target.value)}
                            className="h-7 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] text-slate-500 mb-1 block">End Date</Label>
                          <Input
                            value={edu.endDate || ''}
                            onChange={(e) => handleChange(['education', 'education', String(idx), 'endDate'], e.target.value)}
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              <div>
                <Label htmlFor="skillsHeading">Heading</Label>
                <Input
                  id="skillsHeading"
                  value={formData?.skills?.heading || ''}
                  onChange={(e) => handleChange(['skills', 'heading'], e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <Label>Technical Skills</Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-2"
                  onClick={() => {
                    const current = formData?.skills?.skillCategories?.technical || [];
                    handleChange(['skills', 'skillCategories', 'technical'], [...current, { name: '', level: 50 }]);
                  }}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Skill
                </Button>
              </div>

              <div className="space-y-2">
                {(formData?.skills?.skillCategories?.technical || []).map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      placeholder="Skill name"
                      value={skill.name || ''}
                      onChange={(e) => handleChange(['skills', 'skillCategories', 'technical', String(idx), 'name'], e.target.value)}
                      className="h-8 text-xs flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="%"
                      value={skill.level || ''}
                      onChange={(e) => handleChange(['skills', 'skillCategories', 'technical', String(idx), 'level'], Number(e.target.value))}
                      className="h-8 text-xs w-16"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 flex-shrink-0"
                      onClick={() => {
                        const current = [...(formData?.skills?.skillCategories?.technical || [])];
                        current.splice(idx, 1);
                        handleChange(['skills', 'skillCategories', 'technical'], current);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              <div>
                <Label htmlFor="projectsHeading">Heading</Label>
                <Input
                  id="projectsHeading"
                  value={formData?.projects?.heading || ''}
                  onChange={(e) => handleChange(['projects', 'heading'], e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <Label>Projects</Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-2"
                  onClick={() => {
                    const current = formData?.projects?.projects || [];
                    handleChange(['projects', 'projects'], [...current, { id: Date.now().toString(), title: '', description: '', technologies: [], links: {}, status: 'completed' }]);
                  }}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Project
                </Button>
              </div>

              <div className="space-y-4">
                {(formData?.projects?.projects || []).map((project, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative group">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-2 h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const current = [...(formData?.projects?.projects || [])];
                        current.splice(idx, 1);
                        handleChange(['projects', 'projects'], current);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>

                    <div className="space-y-3 mt-4">
                      <div>
                        <Label className="text-[10px] text-slate-500 mb-1 block">Title</Label>
                        <Input
                          value={project.title || ''}
                          onChange={(e) => handleChange(['projects', 'projects', String(idx), 'title'], e.target.value)}
                          className="h-7 text-xs"
                        />
                      </div>

                      <div>
                        <Label className="text-[10px] text-slate-500 mb-1 block">Description</Label>
                        <Textarea
                          value={project.description || ''}
                          onChange={(e) => handleChange(['projects', 'projects', String(idx), 'description'], e.target.value)}
                          className="h-16 text-xs resize-none"
                        />
                      </div>

                      <div>
                        <Label className="text-[10px] text-slate-500 mb-1 block">Link</Label>
                        <Input
                          value={project.links?.live || project.links?.github || project.link || ''}
                          onChange={(e) => handleChange(['projects', 'projects', String(idx), 'links', 'live'], e.target.value)}
                          className="h-7 text-xs"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
        </CardContent>
      </Card>
    </div>
  );
};
