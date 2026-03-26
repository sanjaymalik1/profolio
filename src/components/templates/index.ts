"use client";

import { DarkProfessionalTemplate } from './DarkProfessionalTemplate';
import { ElegantMonochromeTemplate } from './ElegantMonochromeTemplate';
import { WarmMinimalistTemplate } from './WarmMinimalistTemplate';
import EliteProTemplate from './EliteProTemplate';

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
  'elite-pro': {
    id: 'elite-pro',
    name: 'Elite Pro',
    category: 'premium',
    component: EliteProTemplate,
    previewData: {
      hero: {
        fullName: "Alex Chen",
        title: "Senior Full-Stack Engineer",
        bio: "Crafting exceptional digital experiences with cutting-edge technologies and innovative solutions.",
        location: "San Francisco, CA"
      },
      projects: {
        heading: "Featured Projects",
        projects: [
          {
            id: "project-1",
            title: "Realtime Analytics Platform",
            description: "Built a high-throughput analytics dashboard processing millions of events daily.",
            technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis"],
            images: [],
            links: {
              github: "https://github.com/alexchen/realtime-analytics",
              live: "https://example.com"
            }
          }
        ]
      },
      experience: {
        heading: "Professional Experience",
        experiences: [
          {
            id: "exp-1",
            company: "Nimbus Labs",
            position: "Lead Software Engineer",
            startDate: "2022",
            endDate: "Present",
            description: "Leading platform architecture, performance optimization, and engineering delivery.",
            responsibilities: [
              "Architected modular frontend systems",
              "Mentored a team of 6 engineers",
              "Improved page performance by 40%"
            ],
            technologies: ["React", "Next.js", "Node.js", "AWS"]
          }
        ]
      },
      skills: {
        heading: "Skills & Expertise",
        skills: ["React", "TypeScript", "Node.js", "System Design", "AWS"]
      },
      education: {
        heading: "Education",
        education: [
          {
            id: "edu-1",
            institution: "Stanford University",
            degree: "B.S.",
            field: "Computer Science",
            startDate: "2014",
            endDate: "2018",
            coursework: ["Distributed Systems", "Human-Computer Interaction"]
          }
        ]
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