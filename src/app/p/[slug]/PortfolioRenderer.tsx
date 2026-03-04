"use client";

import React from 'react';
import { EditorSection } from '@/types/editor';
import { HeroData, AboutData, SkillsData, ProjectsData, ContactData } from '@/types/portfolio';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DarkProfessionalTemplate } from '@/components/templates/DarkProfessionalTemplate';
import { ElegantMonochromeTemplate } from '@/components/templates/ElegantMonochromeTemplate';
import { WarmMinimalistTemplate } from '@/components/templates/WarmMinimalistTemplate';
import HeroSection from '@/components/portfolio/sections/HeroSection';
import AboutSection from '@/components/portfolio/sections/AboutSection/index';
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
    const templateId = (templateSection.data as { templateId?: string })?.templateId;
    const templateData = (templateSection.data as { templateData?: unknown })?.templateData || templateSection.data;

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
        switch (section.type) {
          case 'hero':
            return (
              <ErrorBoundary key={section.id} label="Hero">
                <HeroSection data={section.data as unknown as HeroData} styling={section.styling} isEditing={false} isPublicView={true} />
              </ErrorBoundary>
            );
          case 'about':
            return (
              <ErrorBoundary key={section.id} label="About">
                <AboutSection data={section.data as unknown as AboutData} styling={section.styling} isEditing={false} isPublicView={true} />
              </ErrorBoundary>
            );
          case 'skills':
            return (
              <ErrorBoundary key={section.id} label="Skills">
                <SkillsSection data={section.data as unknown as SkillsData} styling={section.styling} isEditing={false} isPublicView={true} />
              </ErrorBoundary>
            );
          case 'projects':
            return (
              <ErrorBoundary key={section.id} label="Projects">
                <ProjectsSection data={section.data as unknown as ProjectsData} styling={section.styling} isEditing={false} isPublicView={true} />
              </ErrorBoundary>
            );
          case 'contact':
            return (
              <ErrorBoundary key={section.id} label="Contact">
                <ContactSection data={section.data as unknown as ContactData} styling={section.styling} isEditing={false} isPublicView={true} />
              </ErrorBoundary>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
