"use client";

import React from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import type { SkillsData } from '@/types/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Code, Brain, Globe, Wrench } from 'lucide-react';

interface SkillsPropertyFormProps {
  section: EditorSection;
}

export const SkillsPropertyForm: React.FC<SkillsPropertyFormProps> = ({ section }) => {
  const { updateSectionData } = useEditorActions();
  const skillsData = section.data as SkillsData;

  const handleInputChange = <K extends keyof SkillsData>(field: K, value: SkillsData[K]) => {
    const updatedData = { ...skillsData, [field]: value };
    updateSectionData(section.id, updatedData);
  };

  const addSkill = (category: 'technical' | 'soft' | 'languages' | 'tools') => {
    const newSkill = {
      name: '',
      level: 70,
      category,
      icon: ''
    };

    const updatedCategories = {
      ...skillsData.skillCategories,
      [category]: [...(skillsData.skillCategories?.[category] || []), newSkill]
    };

    // Update both skills array and categories
    const allSkills = Object.values(updatedCategories).flat();
    handleInputChange('skills', allSkills);
    handleInputChange('skillCategories', updatedCategories);
  };

  const removeSkill = (skillIndex: number, category: string) => {
    const updatedCategories = {
      ...skillsData.skillCategories,
      [category]: skillsData.skillCategories?.[category as keyof typeof skillsData.skillCategories]?.filter((_, index) => index !== skillIndex) || []
    };

    // Update both skills array and categories
    const allSkills = Object.values(updatedCategories).flat();
    handleInputChange('skills', allSkills);
    handleInputChange('skillCategories', updatedCategories);
  };

  const updateSkill = (skillIndex: number, category: string, field: string, value: string | number) => {
    const updatedCategories = {
      ...skillsData.skillCategories,
      [category]: skillsData.skillCategories?.[category as keyof typeof skillsData.skillCategories]?.map((skill, index) =>
        index === skillIndex ? { ...skill, [field]: value } : skill
      ) || []
    };

    // Update both skills array and categories
    const allSkills = Object.values(updatedCategories).flat();
    handleInputChange('skills', allSkills);
    handleInputChange('skillCategories', updatedCategories);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Code className="w-4 h-4" />;
      case 'soft': return <Brain className="w-4 h-4" />;
      case 'languages': return <Globe className="w-4 h-4" />;
      case 'tools': return <Wrench className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">

      {/* Section Heading */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Code className="w-4 h-4" />
            Section Heading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="heading">Heading</Label>
            <Input
              id="heading"
              value={skillsData.heading || ''}
              onChange={(e) => handleInputChange('heading', e.target.value)}
              placeholder="My Skills"
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills by Category */}
      {(['technical', 'soft', 'languages', 'tools'] as const).map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 capitalize">
              {getCategoryIcon(category)}
              {category === 'languages' ? 'Languages' : category} Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skillsData.skillCategories?.[category]?.map((skill, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(index, category, 'name', e.target.value)}
                    placeholder="Skill name"
                    className="flex-1"
                  />
                  <div className="w-20">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => updateSkill(index, category, 'level', parseInt(e.target.value) || 0)}
                      placeholder="Level"
                    />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {skill.level}%
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSkill(index, category)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )) || []}

              <Button
                variant="outline"
                size="sm"
                onClick={() => addSkill(category)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {category === 'languages' ? 'Language' : category.slice(0, -1)} Skill
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};