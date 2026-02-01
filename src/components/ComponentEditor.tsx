"use client";
import React, { useState } from 'react';
import { ComponentType, AboutData, SkillsData, ProjectsData, ContactData } from '@/types/portfolio';

interface ComponentEditorProps {
  componentType: ComponentType;
  data: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function ComponentEditor({ componentType, data, isOpen, onClose, onSave }: ComponentEditorProps) {
  const [editingData, setEditingData] = useState(data);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editingData);
    onClose();
  };

  const renderAboutEditor = () => {
    const aboutData = editingData as AboutData;
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={aboutData.name || ''}
            onChange={(e) => setEditingData({...aboutData, name: e.target.value})}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={aboutData.title || ''}
            onChange={(e) => setEditingData({...aboutData, title: e.target.value})}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={aboutData.description || ''}
            onChange={(e) => setEditingData({...aboutData, description: e.target.value})}
            rows={4}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    );
  };

  const renderSkillsEditor = () => {
    const skillsData = editingData as SkillsData;
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
        {skillsData.skills?.map((skill, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => {
                const newSkills = [...skillsData.skills];
                newSkills[index].name = e.target.value;
                setEditingData({...skillsData, skills: newSkills});
              }}
              placeholder="Skill name"
              className="flex-1 p-2 border rounded-md"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={skill.level}
              onChange={(e) => {
                const newSkills = [...skillsData.skills];
                newSkills[index].level = parseInt(e.target.value);
                setEditingData({...skillsData, skills: newSkills});
              }}
              className="w-20 p-2 border rounded-md"
            />
            <button
              onClick={() => {
                const newSkills = skillsData.skills.filter((_, i) => i !== index);
                setEditingData({...skillsData, skills: newSkills});
              }}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const newSkills = [...(skillsData.skills || []), { name: '', level: 50 }];
            setEditingData({...skillsData, skills: newSkills});
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Add Skill
        </button>
      </div>
    );
  };

  const renderContactEditor = () => {
    const contactData = editingData as ContactData;
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={contactData.email || ''}
            onChange={(e) => setEditingData({...contactData, email: e.target.value})}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            value={contactData.phone || ''}
            onChange={(e) => setEditingData({...contactData, phone: e.target.value})}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={contactData.location || ''}
            onChange={(e) => setEditingData({...contactData, location: e.target.value})}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
          <input
            type="url"
            value={contactData.linkedin || ''}
            onChange={(e) => setEditingData({...contactData, linkedin: e.target.value})}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
          <input
            type="url"
            value={contactData.github || ''}
            onChange={(e) => setEditingData({...contactData, github: e.target.value})}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="url"
            value={contactData.website || ''}
            onChange={(e) => setEditingData({...contactData, website: e.target.value})}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    );
  };

  const renderProjectsEditor = () => {
    const projectsData = editingData as ProjectsData;
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
        {projectsData.projects?.map((project, index) => (
          <div key={index} className="border rounded-md p-4 space-y-2">
            <input
              type="text"
              value={project.title}
              onChange={(e) => {
                const newProjects = [...projectsData.projects];
                newProjects[index].title = e.target.value;
                setEditingData({...projectsData, projects: newProjects});
              }}
              placeholder="Project title"
              className="w-full p-2 border rounded-md"
            />
            <textarea
              value={project.description}
              onChange={(e) => {
                const newProjects = [...projectsData.projects];
                newProjects[index].description = e.target.value;
                setEditingData({...projectsData, projects: newProjects});
              }}
              placeholder="Project description"
              rows={2}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              value={project.technologies.join(', ')}
              onChange={(e) => {
                const newProjects = [...projectsData.projects];
                newProjects[index].technologies = e.target.value.split(',').map(t => t.trim());
                setEditingData({...projectsData, projects: newProjects});
              }}
              placeholder="Technologies (comma separated)"
              className="w-full p-2 border rounded-md"
            />
            <div className="flex gap-2">
              <input
                type="url"
                value={project.link || ''}
                onChange={(e) => {
                  const newProjects = [...projectsData.projects];
                  newProjects[index].link = e.target.value;
                  setEditingData({...projectsData, projects: newProjects});
                }}
                placeholder="Live demo URL"
                className="flex-1 p-2 border rounded-md"
              />
              <input
                type="url"
                value={project.github || ''}
                onChange={(e) => {
                  const newProjects = [...projectsData.projects];
                  newProjects[index].github = e.target.value;
                  setEditingData({...projectsData, projects: newProjects});
                }}
                placeholder="GitHub URL"
                className="flex-1 p-2 border rounded-md"
              />
            </div>
            <button
              onClick={() => {
                const newProjects = projectsData.projects.filter((_, i) => i !== index);
                setEditingData({...projectsData, projects: newProjects});
              }}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete Project
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const newProjects = [...(projectsData.projects || []), { 
              title: '', 
              description: '', 
              technologies: [],
              link: '',
              github: ''
            }];
            setEditingData({...projectsData, projects: newProjects});
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Add Project
        </button>
      </div>
    );
  };

  const renderEditor = () => {
    switch (componentType) {
      case 'about':
        return renderAboutEditor();
      case 'skills':
        return renderSkillsEditor();
      case 'projects':
        return renderProjectsEditor();
      case 'contact':
        return renderContactEditor();
      default:
        return <div>Editor for {componentType} coming soon...</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit {componentType.charAt(0).toUpperCase() + componentType.slice(1)}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        {renderEditor()}
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
