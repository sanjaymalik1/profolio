"use client";

import React from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import { ProjectsData } from '@/types/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, FolderOpen, Link, ExternalLink, Github } from 'lucide-react';

interface ProjectsPropertyFormProps {
  section: EditorSection;
}

export const ProjectsPropertyForm: React.FC<ProjectsPropertyFormProps> = ({ section }) => {
  const { updateSectionData } = useEditorActions();
  const projectsData = section.data as ProjectsData;

  const handleInputChange = (field: keyof ProjectsData, value: any) => {
    const updatedData = { ...projectsData, [field]: value };
    updateSectionData(section.id, updatedData);
  };

  const addProject = () => {
    const newProject = {
      id: `project-${Date.now()}`,
      title: '',
      description: '',
      technologies: [],
      images: [],
      links: {},
      featured: false,
      category: 'web',
      status: 'completed' as const
    };
    
    const updatedProjects = [...(projectsData.projects || []), newProject];
    handleInputChange('projects', updatedProjects);
  };

  const removeProject = (projectIndex: number) => {
    const updatedProjects = projectsData.projects?.filter((_, index) => index !== projectIndex) || [];
    handleInputChange('projects', updatedProjects);
  };

  const updateProject = (projectIndex: number, field: string, value: any) => {
    const updatedProjects = [...(projectsData.projects || [])];
    updatedProjects[projectIndex] = { ...updatedProjects[projectIndex], [field]: value };
    handleInputChange('projects', updatedProjects);
  };

  const updateProjectLinks = (projectIndex: number, linkType: string, url: string) => {
    const updatedProjects = [...(projectsData.projects || [])];
    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      links: { ...updatedProjects[projectIndex].links, [linkType]: url }
    };
    handleInputChange('projects', updatedProjects);
  };

  const addCategory = () => {
    const newCategory = 'new-category';
    const updatedCategories = [...(projectsData.categories || []), newCategory];
    handleInputChange('categories', updatedCategories);
  };

  const removeCategory = (categoryIndex: number) => {
    const updatedCategories = projectsData.categories?.filter((_, index) => index !== categoryIndex) || [];
    handleInputChange('categories', updatedCategories);
  };

  const updateCategory = (categoryIndex: number, value: string) => {
    const updatedCategories = [...(projectsData.categories || [])];
    updatedCategories[categoryIndex] = value;
    handleInputChange('categories', updatedCategories);
  };

  return (
    <div className="space-y-6">
      
      {/* Section Heading */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Section Heading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="heading">Heading</Label>
            <Input
              id="heading"
              value={projectsData.heading || ''}
              onChange={(e) => handleInputChange('heading', e.target.value)}
              placeholder="My Projects"
            />
          </div>
        </CardContent>
      </Card>

      {/* Project Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Badge className="w-4 h-4" />
            Project Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projectsData.categories?.map((category, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={category}
                  onChange={(e) => updateCategory(index, e.target.value)}
                  placeholder="Category name"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeCategory(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )) || []}
            
            <Button
              variant="outline"
              size="sm"
              onClick={addCategory}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Projects ({projectsData.projects?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projectsData.projects?.map((project, index) => (
              <div key={project.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Badge variant="outline">Project {index + 1}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProject(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={project.title}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      placeholder="Project title"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select
                      value={project.category}
                      onChange={(e) => updateProject(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      {projectsData.categories?.map((cat, catIndex) => (
                        <option key={catIndex} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    placeholder="Project description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Live URL</Label>
                    <Input
                      value={project.links.live || ''}
                      onChange={(e) => updateProjectLinks(index, 'live', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label>GitHub URL</Label>
                    <Input
                      value={project.links.github || ''}
                      onChange={(e) => updateProjectLinks(index, 'github', e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={project.featured}
                      onChange={(e) => updateProject(index, 'featured', e.target.checked)}
                    />
                    Featured Project
                  </label>
                  <select
                    value={project.status}
                    onChange={(e) => updateProject(index, 'status', e.target.value)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>
            )) || []}
            
            <Button
              variant="outline"
              onClick={addProject}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};