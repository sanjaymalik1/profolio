"use client";

import { DarkProfessionalTemplate } from './DarkProfessionalTemplate';
import { ElegantMonochromeTemplate } from './ElegantMonochromeTemplate';
import { WarmMinimalistTemplate } from './WarmMinimalistTemplate';
import { ExecutiveProTemplate } from './ExecutiveProTemplate';

import type { EditorSection } from '@/types/editor';

export interface TemplateComponent {
  id: string;
  name: string;
  category: string;
  component: React.ComponentType<{ 
    data?: Record<string, unknown>; 
    isPreview?: boolean;
    sections?: EditorSection[];
    renderSection?: (section: EditorSection, index: number, content: React.ReactNode) => React.ReactNode;
  }>;
  previewData?: Record<string, unknown>;
}

export const templateComponents: Record<string, TemplateComponent> = {
  'dark-professional': {
    id: 'dark-professional',
    name: 'Dark Professional',
    category: 'developer',
    component: DarkProfessionalTemplate,
    previewData: {
      hero: {
        fullName: "Jordan Smith",
        title: "Senior Software Engineer",
        bio: "Building scalable systems and leading development teams with clean code practices.",
        location: "Seattle, WA"
      }
    }
  },
  'elegant-monochrome': {
    id: 'elegant-monochrome',
    name: 'Elegant Monochrome',
    category: 'business',
    component: ElegantMonochromeTemplate,
    previewData: {
      hero: {
        fullName: "Victoria Sterling",
        title: "Business Consultant & Strategy Expert",
        bio: "Transforming businesses through strategic consulting and innovative solutions.",
        location: "London, UK"
      }
    }
  },
  'warm-minimalist': {
    id: 'warm-minimalist',
    name: 'Warm Minimalist',
    category: 'freelancer',
    component: WarmMinimalistTemplate,
    previewData: {
      hero: {
        fullName: "Sarah Martinez",
        title: "Creative Freelancer & Brand Designer",
        bio: "Helping small businesses create authentic brand identities that connect with their audience.",
        location: "Austin, TX"
      }
    }
  },
  'executive-pro': {
    id: 'executive-pro',
    name: 'Executive Pro',
    category: 'developer',
    component: ExecutiveProTemplate,
    previewData: {
      hero: {
        fullName: "Alex Morgan",
        title: "Full-Stack Engineer & Technical Lead",
        bio: "Building robust, scalable software and leading teams to ship products users love.",
        location: "San Francisco, CA"
      }
    }
  }
};

export function getTemplate(templateId: string) {
  return templateComponents[templateId];
}

export function getAllTemplates() {
  return Object.values(templateComponents);
}