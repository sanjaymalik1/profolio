"use client";

import React from 'react';
import { useEditor, useEditorActions } from '@/contexts/EditorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { EditorSection } from '@/types/editor';

type DataPath = Array<string | number>;
type SectionType = EditorSection['type'];

const DEFAULT_NAV_LINKS: Array<Record<string, unknown>> = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
];

const HERO_BLUEPRINT: Record<string, unknown> = {
  fullName: '',
  title: '',
  bio: '',
  profileImage: '',
  location: '',
  socialLinks: [],
};

const ABOUT_BASE_BLUEPRINT: Record<string, unknown> = {
  heading: '',
  content: '',
  description: '',
  profileImage: '',
  highlights: [],
  quickFacts: [],
  quote: '',
};

const ABOUT_BLANK_BLUEPRINT: Record<string, unknown> = {
  ...ABOUT_BASE_BLUEPRINT,
  personalInfo: {
    age: 0,
    location: '',
    languages: [],
    interests: [],
  },
};

const ABOUT_WARM_BLUEPRINT: Record<string, unknown> = {
  ...ABOUT_BASE_BLUEPRINT,
  location: '',
  experience: '',
  focus: '',
};

const ABOUT_ELITE_BLUEPRINT: Record<string, unknown> = {
  ...ABOUT_BASE_BLUEPRINT,
  personalInfo: {
    age: 0,
    location: '',
    languages: [],
    interests: [],
  },
  contactEmail: '',
};

const SKILLS_BLUEPRINT: Record<string, unknown> = {
  heading: '',
  skills: [],
  skillCategories: {
    technical: [],
    soft: [],
    languages: [],
    tools: [],
  },
};

const PROJECTS_BLUEPRINT: Record<string, unknown> = {
  heading: '',
  categories: [],
  projects: [],
};

const EXPERIENCE_BLUEPRINT: Record<string, unknown> = {
  heading: '',
  experiences: [],
};

const EXPERIENCE_ELITE_BLUEPRINT: Record<string, unknown> = {
  ...EXPERIENCE_BLUEPRINT,
  experience: [],
};

const EDUCATION_BLUEPRINT: Record<string, unknown> = {
  heading: '',
  education: [],
};

const CONTACT_BASE_BLUEPRINT: Record<string, unknown> = {
  heading: '',
  email: '',
  location: '',
  availability: '',
  socialLinks: [],
};

const CONTACT_BLANK_BLUEPRINT: Record<string, unknown> = {
  ...CONTACT_BASE_BLUEPRINT,
};

const CONTACT_WARM_BLUEPRINT: Record<string, unknown> = {
  ...CONTACT_BASE_BLUEPRINT,
  description: '',
  phone: '',
};

const NAVBAR_BLUEPRINT: Record<string, unknown> = {
  name: '',
  autoGenerateLinks: false,
  links: DEFAULT_NAV_LINKS,
  cta: {
    label: 'Contact',
    href: '#contact',
  },
};

const FOOTER_BLUEPRINT: Record<string, unknown> = {
  name: '',
  description: '',
  tagline: '',
  copyrightText: '',
  socialLinks: [],
  links: [],
};

const TEMPLATE_DATA_SECTION_ORDER: SectionType[] = [
  'hero',
  'about',
  'experience',
  'projects',
  'skills',
  'education',
  'contact',
  'navbar',
  'footer',
];

const BASE_SECTION_BLUEPRINTS: Partial<Record<SectionType, Record<string, unknown>>> = {
  hero: HERO_BLUEPRINT,
  about: ABOUT_BLANK_BLUEPRINT,
  skills: SKILLS_BLUEPRINT,
  projects: PROJECTS_BLUEPRINT,
  contact: CONTACT_BLANK_BLUEPRINT,
  experience: EXPERIENCE_BLUEPRINT,
  education: EDUCATION_BLUEPRINT,
  navbar: NAVBAR_BLUEPRINT,
  footer: FOOTER_BLUEPRINT,
};

const TEMPLATE_SECTION_OVERRIDES: Record<string, Partial<Record<SectionType, Record<string, unknown>>>> = {
  'dark-professional': {
    about: ABOUT_BASE_BLUEPRINT,
    contact: CONTACT_BASE_BLUEPRINT,
    experience: EXPERIENCE_BLUEPRINT,
  },
  'elegant-monochrome': {
    about: ABOUT_BASE_BLUEPRINT,
    contact: CONTACT_BASE_BLUEPRINT,
    experience: EXPERIENCE_BLUEPRINT,
  },
  'warm-minimalist': {
    about: ABOUT_WARM_BLUEPRINT,
    contact: CONTACT_WARM_BLUEPRINT,
    experience: EXPERIENCE_BLUEPRINT,
  },
  'elite-pro': {
    about: ABOUT_ELITE_BLUEPRINT,
    contact: CONTACT_BASE_BLUEPRINT,
    experience: EXPERIENCE_ELITE_BLUEPRINT,
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTemplateSection(
  section: EditorSection
): section is Extract<EditorSection, { type: 'template' }> {
  return section.type === 'template';
}

function formatLabel(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

function isMultilineField(key: string): boolean {
  const normalized = key.toLowerCase();
  return (
    normalized.includes('bio') ||
    normalized.includes('content') ||
    normalized.includes('description') ||
    normalized.includes('longdescription') ||
    normalized.includes('summary') ||
    normalized.includes('tagline') ||
    normalized.includes('quote') ||
    normalized.includes('copyright') ||
    normalized.includes('availability')
  );
}

function isMetaField(key: string): boolean {
  return key === 'id' || key === 'templateId';
}

function getAtPath(root: unknown, path: DataPath): unknown {
  return path.reduce<unknown>((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    if (Array.isArray(acc) && typeof part === 'number') {
      return acc[part];
    }
    if (isPlainObject(acc)) {
      return acc[String(part)];
    }
    return undefined;
  }, root);
}

function setAtPath(root: unknown, path: DataPath, value: unknown): void {
  if (path.length === 0 || !isPlainObject(root)) return;

  let current: unknown = root;

  for (let i = 0; i < path.length - 1; i += 1) {
    const part = path[i];
    const nextPart = path[i + 1];

    if (Array.isArray(current) && typeof part === 'number') {
      if (current[part] === undefined || current[part] === null) {
        current[part] = typeof nextPart === 'number' ? [] : {};
      }
      current = current[part];
      continue;
    }

    if (isPlainObject(current)) {
      const key = String(part);
      if (current[key] === undefined || current[key] === null) {
        current[key] = typeof nextPart === 'number' ? [] : {};
      }
      current = current[key];
    }
  }

  const finalPart = path[path.length - 1];
  if (Array.isArray(current) && typeof finalPart === 'number') {
    current[finalPart] = value;
    return;
  }

  if (isPlainObject(current)) {
    current[String(finalPart)] = value;
  }
}

function withBlueprint(actual: unknown, blueprint: unknown): unknown {
  if (Array.isArray(blueprint)) {
    if (Array.isArray(actual)) {
      return actual;
    }
    return structuredClone(blueprint);
  }

  if (isPlainObject(blueprint)) {
    const actualObject = isPlainObject(actual) ? actual : {};
    const merged = structuredClone(actualObject) as Record<string, unknown>;

    for (const [key, blueprintValue] of Object.entries(blueprint)) {
      merged[key] = withBlueprint(actualObject[key], blueprintValue);
    }

    return merged;
  }

  return actual === undefined || actual === null ? blueprint : actual;
}

function getSectionBlueprint(sectionType: SectionType, templateId?: string): Record<string, unknown> {
  const base = BASE_SECTION_BLUEPRINTS[sectionType] || {};
  if (!templateId) {
    return structuredClone(base);
  }

  const templateOverride = TEMPLATE_SECTION_OVERRIDES[templateId]?.[sectionType] || {};
  return withBlueprint(base, templateOverride) as Record<string, unknown>;
}

function getTemplateDataBlueprint(templateId?: string): Record<string, unknown> {
  const resolvedTemplateId = templateId || 'dark-professional';
  const templateDataBlueprint: Record<string, unknown> = {};

  TEMPLATE_DATA_SECTION_ORDER.forEach((sectionType) => {
    templateDataBlueprint[sectionType] = getSectionBlueprint(sectionType, resolvedTemplateId);
  });

  return templateDataBlueprint;
}

function resolveRenderData(
  section: EditorSection,
  rawSectionData: Record<string, unknown>,
  activeTemplateId?: string
): Record<string, unknown> {
  if (isTemplateSection(section)) {
    const sectionTemplateId = typeof rawSectionData.templateId === 'string'
      ? rawSectionData.templateId
      : activeTemplateId || 'dark-professional';

    const templateBlueprint: Record<string, unknown> = {
      templateId: sectionTemplateId,
      templateData: getTemplateDataBlueprint(sectionTemplateId),
    };

    return withBlueprint(rawSectionData, templateBlueprint) as Record<string, unknown>;
  }

  const sectionBlueprint = getSectionBlueprint(section.type, activeTemplateId);
  return withBlueprint(rawSectionData, sectionBlueprint) as Record<string, unknown>;
}

function inferArrayItem(path: DataPath, currentArray: unknown[]): unknown {
  const sample = currentArray.find((item) => item !== undefined && item !== null);
  const pathKey = String(path[path.length - 1] ?? '').toLowerCase();
  const pathTrail = path.map((part) => String(part).toLowerCase());

  if (sample !== undefined) {
    if (Array.isArray(sample)) return [];
    if (isPlainObject(sample)) {
      const next: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(sample)) {
        if (k === 'id') {
          next[k] = `${pathKey || 'item'}-${Date.now()}`;
          continue;
        }
        if (Array.isArray(v)) {
          next[k] = [];
        } else if (isPlainObject(v)) {
          next[k] = {};
        } else if (typeof v === 'number') {
          next[k] = 0;
        } else if (typeof v === 'boolean') {
          next[k] = false;
        } else {
          next[k] = '';
        }
      }
      return next;
    }
    if (typeof sample === 'number') return 0;
    if (typeof sample === 'boolean') return false;
    return '';
  }

  if (pathTrail.includes('skillcategories')) {
    const categoryKey = pathKey;
    const normalizedCategory = categoryKey === 'languages'
      ? 'language'
      : categoryKey.endsWith('s')
        ? categoryKey.slice(0, -1)
        : categoryKey;

    return {
      name: '',
      level: categoryKey === 'technical' ? 70 : 0,
      category: normalizedCategory,
    };
  }

  if (pathTrail.includes('contactform') && pathKey === 'fields') {
    return {
      name: '',
      type: 'text',
      label: '',
      required: true,
      placeholder: '',
      options: [],
    };
  }

  if (pathKey.includes('social')) return { platform: 'website', url: '' };
  if (pathKey === 'links') return { label: 'New Link', href: '#' };

  if (pathKey === 'projects') {
    return {
      id: `project-${Date.now()}`,
      title: '',
      description: '',
      longDescription: '',
      technologies: [],
      images: [],
      links: {
        live: '',
        github: '',
        demo: '',
        documentation: '',
      },
      featured: false,
      category: '',
      status: 'completed',
      teamSize: 0,
      role: '',
    };
  }

  if (pathKey === 'experiences' || pathKey === 'experience') {
    return {
      id: `experience-${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
      responsibilities: [],
      technologies: [],
      achievements: [],
      companyLogo: '',
    };
  }

  if (pathKey === 'education') {
    return {
      id: `education-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: 0,
      honors: [],
      coursework: [],
      activities: [],
      location: '',
      logo: '',
    };
  }

  if (
    pathKey === 'highlights' ||
    pathKey === 'quickfacts' ||
    pathKey === 'languages' ||
    pathKey === 'interests' ||
    pathKey === 'technologies' ||
    pathKey === 'responsibilities' ||
    pathKey === 'achievements' ||
    pathKey === 'honors' ||
    pathKey === 'coursework' ||
    pathKey === 'activities' ||
    pathKey === 'categories'
  ) {
    return '';
  }

  return '';
}

const SectionDataPropertyForm: React.FC<{ section: EditorSection; activeTemplateId?: string }> = ({
  section,
  activeTemplateId,
}) => {
  const { updateSectionData } = useEditorActions();

  const rawSectionData = React.useMemo(() => {
    if (isPlainObject(section.data)) {
      return section.data as Record<string, unknown>;
    }
    return {} as Record<string, unknown>;
  }, [section.data]);

  const renderData = React.useMemo(
    () => resolveRenderData(section, rawSectionData, activeTemplateId),
    [activeTemplateId, rawSectionData, section]
  );

  const updatePath = React.useCallback((path: DataPath, value: unknown) => {
    const nextData = structuredClone(rawSectionData) as Record<string, unknown>;
    setAtPath(nextData, path, value);
    updateSectionData(section.id, nextData);
  }, [rawSectionData, section.id, updateSectionData]);

  const removeArrayItem = React.useCallback((path: DataPath, index: number) => {
    const current = getAtPath(renderData, path);
    if (!Array.isArray(current)) return;
    const next = current.filter((_, i) => i !== index);
    updatePath(path, next);
  }, [renderData, updatePath]);

  const addArrayItem = React.useCallback((path: DataPath) => {
    const current = getAtPath(renderData, path);
    if (!Array.isArray(current)) return;
    const nextItem = inferArrayItem(path, current);
    updatePath(path, [...current, nextItem]);
  }, [renderData, updatePath]);

  const renderPrimitiveField = (
    value: unknown,
    path: DataPath,
    key: string,
    fieldLabel?: string
  ): React.ReactNode => {
    if (isMetaField(key)) {
      return null;
    }

    const label = fieldLabel ?? formatLabel(key);

    if (typeof value === 'boolean') {
      return (
        <div className="property-field" key={path.join('.')}>
          <Label htmlFor={path.join('.')}>{label}</Label>
          <div className="flex items-center gap-2">
            <input
              id={path.join('.')}
              type="checkbox"
              checked={value}
              onChange={(e) => updatePath(path, e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-xs text-slate-500">{value ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div className="property-field" key={path.join('.')}>
          <Label htmlFor={path.join('.')}>{label}</Label>
          <Input
            id={path.join('.')}
            type="number"
            value={Number.isFinite(value) ? value : 0}
            onChange={(e) => updatePath(path, e.target.value === '' ? 0 : Number(e.target.value))}
          />
        </div>
      );
    }

    const normalized = value === null || value === undefined ? '' : String(value);

    if (isMultilineField(key) || normalized.includes('\n')) {
      return (
        <div className="property-field" key={path.join('.')}>
          <Label htmlFor={path.join('.')}>{label}</Label>
          <Textarea
            id={path.join('.')}
            value={normalized}
            rows={4}
            onChange={(e) => updatePath(path, e.target.value)}
          />
        </div>
      );
    }

    return (
      <div className="property-field" key={path.join('.')}>
        <Label htmlFor={path.join('.')}>{label}</Label>
        <Input
          id={path.join('.')}
          value={normalized}
          onChange={(e) => updatePath(path, e.target.value)}
        />
      </div>
    );
  };

  const renderNode = (value: unknown, path: DataPath, key: string): React.ReactNode => {
    const nodeKey = path.join('.') || key;

    if (Array.isArray(value)) {
      const label = formatLabel(key);
      return (
        <Card className="property-section" key={nodeKey}>
          <CardHeader className="property-section-header pb-3">
            <CardTitle className="property-section-title text-sm flex items-center justify-between">
              <span>{label}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => addArrayItem(path)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="property-section-content space-y-3">
            {value.length === 0 && (
              <p className="text-xs text-slate-400">No items</p>
            )}

            {value.map((item, index) => {
              const itemPath = [...path, index];
              const itemKey = `${nodeKey}.${index}`;

              if (isPlainObject(item)) {
                const entries = Object.entries(item).filter(([childKey]) => !isMetaField(childKey));
                return (
                  <div key={itemKey} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Item {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                        onClick={() => removeArrayItem(path, index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {entries.map(([childKey, childValue]) => renderNode(childValue, [...itemPath, childKey], childKey))}
                  </div>
                );
              }

              return (
                <div key={itemKey} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Item {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                      onClick={() => removeArrayItem(path, index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {renderPrimitiveField(item, itemPath, String(index), 'Value')}
                </div>
              );
            })}
          </CardContent>
        </Card>
      );
    }

    if (isPlainObject(value)) {
      const entries = Object.entries(value).filter(([childKey]) => !isMetaField(childKey));
      const label = formatLabel(key);

      return (
        <Card className="property-section" key={nodeKey}>
          <CardHeader className="property-section-header pb-3">
            <CardTitle className="property-section-title text-sm">{label}</CardTitle>
          </CardHeader>
          <CardContent className="property-section-content space-y-3">
            {entries.length === 0 && (
              <p className="text-xs text-slate-400">No fields</p>
            )}
            {entries.map(([childKey, childValue]) => renderNode(childValue, [...path, childKey], childKey))}
          </CardContent>
        </Card>
      );
    }

    return renderPrimitiveField(value, path, key);
  };

  const topLevelEntries = Object.entries(renderData).filter(([key]) => !isMetaField(key));

  return (
    <div className="property-form">
      {topLevelEntries.length === 0 ? (
        <Card className="property-section">
          <CardHeader className="property-section-header pb-3">
            <CardTitle className="property-section-title text-sm">Section Data</CardTitle>
          </CardHeader>
          <CardContent className="property-section-content">
            <p className="text-xs text-slate-500">No editable fields available for this section.</p>
          </CardContent>
        </Card>
      ) : (
        topLevelEntries.map(([key, value]) => renderNode(value, [key], key))
      )}
    </div>
  );
};

export const PropertyPanel: React.FC = () => {
  const { state } = useEditor();
  const selectedSection = state.selectedSectionId
    ? state.sections.find((section: EditorSection) => section.id === state.selectedSectionId)
    : null;

  const activeTemplateId = React.useMemo(() => {
    if (selectedSection && isTemplateSection(selectedSection)) {
      return selectedSection.data.templateId;
    }

    if (typeof state.templateId === 'string' && state.templateId.trim().length > 0) {
      return state.templateId;
    }

    const templateSection = state.sections.find((section): section is Extract<EditorSection, { type: 'template' }> =>
      isTemplateSection(section)
    );

    return templateSection?.data.templateId;
  }, [selectedSection, state.sections, state.templateId]);

  const renderPropertyForm = () => {
    if (!selectedSection) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
          <Settings className="w-8 h-8 text-slate-300 mb-3" />
          <h3 className="text-sm font-medium text-slate-600 mb-1">No section selected</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Select a section from the canvas to edit its properties
          </p>
        </div>
      );
    }

    return <SectionDataPropertyForm section={selectedSection} activeTemplateId={activeTemplateId} />;
  };

  return (
    <aside className="property-panel hidden md:flex w-64 lg:w-72 xl:w-80 2xl:w-96 bg-[#f5f1ea] border-l border-slate-200/50 flex-col h-full editor-typography">
      <div className="p-3 sm:p-4 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold flex items-center gap-2 text-[#2d2a26]">
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Properties</span>
          </h2>
          {selectedSection && (
            <Badge variant="secondary" className="text-[0.68rem] uppercase tracking-[0.11em] bg-slate-100 text-[#5c554d] border-0 font-semibold">
              {selectedSection.type}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="property-panel-content p-4 sm:p-5">
          <div className="property-panel-form">
            {renderPropertyForm()}
          </div>
        </div>
      </div>
    </aside>
  );
};
