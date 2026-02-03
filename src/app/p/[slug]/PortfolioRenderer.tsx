"use client";

import React from 'react';
import { EditorSection } from '@/types/editor';
import { DarkProfessionalTemplate } from '@/components/templates/DarkProfessionalTemplate';
import { ElegantMonochromeTemplate } from '@/components/templates/ElegantMonochromeTemplate';
import { WarmMinimalistTemplate } from '@/components/templates/WarmMinimalistTemplate';
import HeroSection from '@/components/portfolio/sections/HeroSection';
import AboutSection from '@/components/portfolio/sections/AboutSection';
import SkillsSection from '@/components/portfolio/sections/SkillsSection';
import ProjectsSection from '@/components/portfolio/sections/ProjectsSection';
import ContactSection from '@/components/portfolio/sections/ContactSection';

interface PortfolioRendererProps {
  sections: EditorSection[];
}

export function PortfolioRenderer({ sections }: PortfolioRendererProps) {
  // Check if this is a template-based portfolio
  const templateSection = sections.find(section => section.type === 'template');

  if (templateSection) {
    // Render template component
    const templateId = (templateSection.data as any)?.templateId;
    const templateData = (templateSection.data as any)?.templateData || templateSection.data;
    
    switch (templateId) {
      case 'dark-professional':
        return <DarkProfessionalTemplate data={templateData} isPreview={true} />;
      case 'elegant-monochrome':
        return <ElegantMonochromeTemplate data={templateData} isPreview={true} />;
      case 'warm-minimalist':
        return <WarmMinimalistTemplate data={templateData} isPreview={true} />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p>Unknown template: {templateId}</p>
          </div>
        );
    }
  }

  // Render individual sections for generic portfolios
  return (
    <div className="min-h-screen bg-white">
      {sections.map((section) => {
        // isEditing is NOT passed here, defaults to false to enable animations on public page
        switch (section.type) {
          case 'hero':
            return <HeroSection key={section.id} data={section.data} styling={section.styling} isEditing={false} />;
          case 'about':
            return <AboutSection key={section.id} data={section.data} styling={section.styling} isEditing={false} />;
          case 'skills':
            return <SkillsSection key={section.id} data={section.data} styling={section.styling} isEditing={false} />;
          case 'projects':
            return <ProjectsSection key={section.id} data={section.data} styling={section.styling} isEditing={false} />;
          case 'contact':
            return <ContactSection key={section.id} data={section.data} styling={section.styling} isEditing={false} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
