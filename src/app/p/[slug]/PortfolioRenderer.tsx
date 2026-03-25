"use client";

import React from 'react';
import { EditorSection } from '@/types/editor';
import { HeroData, AboutData, SkillsData, ProjectsData, ContactData, ExperienceData, EducationData, NavbarData, FooterData } from '@/types/portfolio';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DarkProfessionalTemplate } from '@/components/templates/DarkProfessionalTemplate';
import { ElegantMonochromeTemplate } from '@/components/templates/ElegantMonochromeTemplate';
import { WarmMinimalistTemplate } from '@/components/templates/WarmMinimalistTemplate';
import { ExecutiveProTemplate } from '@/components/templates/ExecutiveProTemplate';
import HeroSection from '@/components/portfolio/sections/HeroSection';
import AboutSection from '@/components/portfolio/sections/AboutSection/index';
import SkillsSection from '@/components/portfolio/sections/SkillsSection';
import ProjectsSection from '@/components/portfolio/sections/ProjectsSection';
import ContactSection from '@/components/portfolio/sections/ContactSection';
import ExperienceSection from '@/components/portfolio/sections/ExperienceSection';
import EducationSection from '@/components/portfolio/sections/EducationSection';
import NavbarSection from '@/components/portfolio/sections/NavbarSection';
import FooterSection from '@/components/portfolio/sections/FooterSection';
import { getTemplate } from '@/components/templates';

interface PortfolioRendererProps {
  sections: EditorSection[];
  templateId?: string | null;
}

export function PortfolioRenderer({ sections, templateId }: PortfolioRendererProps) {
  // Check if ActiveTemplateComponent exists
  const ActiveTemplateComponent = templateId ? getTemplate(templateId)?.component : null;

  // Check if this is a template-based portfolio (Legacy Support)
  const templateSection = sections.find(section => section.type === 'template');

  if (ActiveTemplateComponent) {
    return (
      <ActiveTemplateComponent
        isPreview={false}
        sections={sections}
        renderSection={(section: EditorSection, index: number, content: React.ReactNode) => {
          if (content) return <React.Fragment key={section.id}>{content}</React.Fragment>;
          // Default section render logic
          switch (section.type) {
            case 'hero': return <ErrorBoundary key={section.id} label="Hero"><HeroSection data={section.data as unknown as HeroData} styling={section.styling} isEditing={false} isPublicView={true} /></ErrorBoundary>;
            case 'about': return <ErrorBoundary key={section.id} label="About"><AboutSection data={section.data as unknown as AboutData} styling={section.styling} isEditing={false} isPublicView={true} /></ErrorBoundary>;
            case 'skills': return <ErrorBoundary key={section.id} label="Skills"><SkillsSection data={section.data as unknown as SkillsData} styling={section.styling} isEditing={false} isPublicView={true} /></ErrorBoundary>;
            case 'projects': return <ErrorBoundary key={section.id} label="Projects"><ProjectsSection data={section.data as unknown as ProjectsData} styling={section.styling} isEditing={false} isPublicView={true} /></ErrorBoundary>;
            case 'contact': return <ErrorBoundary key={section.id} label="Contact"><ContactSection data={section.data as unknown as ContactData} styling={section.styling} isEditing={false} isPublicView={true} /></ErrorBoundary>;
            case 'experience': return <ErrorBoundary key={section.id} label="Experience"><ExperienceSection data={section.data as unknown as ExperienceData} styling={section.styling} isEditing={false} isPublicView={true} /></ErrorBoundary>;
            case 'education': return <ErrorBoundary key={section.id} label="Education"><EducationSection data={section.data as unknown as EducationData} styling={section.styling} isEditing={false} isPublicView={true} /></ErrorBoundary>;
            case 'navbar': return <ErrorBoundary key={section.id} label="Navbar"><NavbarSection data={section.data as unknown as NavbarData} styling={section.styling} isEditing={false} isPublicView={true} /></ErrorBoundary>;
            case 'footer': return <ErrorBoundary key={section.id} label="Footer"><FooterSection data={section.data as unknown as FooterData} styling={section.styling} isEditing={false} isPublicView={true} /></ErrorBoundary>;
            default: return null;
          }
        }}
      />
    );
  }

  if (templateSection) {
    // Render template component
    const templateId = (templateSection.data as { templateId?: string })?.templateId;
    const templateData = (templateSection.data as { templateData?: unknown })?.templateData || templateSection.data;

    switch (templateId) {
      case 'dark-professional':
        return <DarkProfessionalTemplate data={templateData} isPreview={false} />;
      case 'elegant-monochrome':
        return <ElegantMonochromeTemplate data={templateData} isPreview={false} />;
      case 'warm-minimalist':
        return <WarmMinimalistTemplate data={templateData} isPreview={false} />;
      case 'executive-pro':
        return <ExecutiveProTemplate data={templateData} isPreview={false} />;
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
        // Wrapper with section ID for anchor linking
        const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
          <section id={section.type} className="scroll-mt-24">
            {children}
          </section>
        );

        switch (section.type) {
          case 'hero':
            return (
              <SectionWrapper key={section.id}>
                <ErrorBoundary label="Hero">
                  <HeroSection data={section.data as unknown as HeroData} styling={section.styling} isEditing={false} isPublicView={true} />
                </ErrorBoundary>
              </SectionWrapper>
            );
          case 'about':
            return (
              <SectionWrapper key={section.id}>
                <ErrorBoundary label="About">
                  <AboutSection data={section.data as unknown as AboutData} styling={section.styling} isEditing={false} isPublicView={true} />
                </ErrorBoundary>
              </SectionWrapper>
            );
          case 'skills':
            return (
              <SectionWrapper key={section.id}>
                <ErrorBoundary label="Skills">
                  <SkillsSection data={section.data as unknown as SkillsData} styling={section.styling} isEditing={false} isPublicView={true} />
                </ErrorBoundary>
              </SectionWrapper>
            );
          case 'projects':
            return (
              <SectionWrapper key={section.id}>
                <ErrorBoundary label="Projects">
                  <ProjectsSection data={section.data as unknown as ProjectsData} styling={section.styling} isEditing={false} isPublicView={true} />
                </ErrorBoundary>
              </SectionWrapper>
            );
          case 'contact':
            return (
              <SectionWrapper key={section.id}>
                <ErrorBoundary label="Contact">
                  <ContactSection data={section.data as unknown as ContactData} styling={section.styling} isEditing={false} isPublicView={true} />
                </ErrorBoundary>
              </SectionWrapper>
            );
          case 'experience':
            return (
              <SectionWrapper key={section.id}>
                <ErrorBoundary label="Experience">
                  <ExperienceSection data={section.data as unknown as ExperienceData} styling={section.styling} isEditing={false} isPublicView={true} />
                </ErrorBoundary>
              </SectionWrapper>
            );
          case 'education':
            return (
              <SectionWrapper key={section.id}>
                <ErrorBoundary label="Education">
                  <EducationSection data={section.data as unknown as EducationData} styling={section.styling} isEditing={false} isPublicView={true} />
                </ErrorBoundary>
              </SectionWrapper>
            );
          case 'navbar':
            return (
              <ErrorBoundary key={section.id} label="Navbar">
                <NavbarSection data={section.data as unknown as NavbarData} styling={section.styling} isEditing={false} isPublicView={true} />
              </ErrorBoundary>
            );
          case 'footer':
            return (
              <ErrorBoundary key={section.id} label="Footer">
                <FooterSection data={section.data as unknown as FooterData} styling={section.styling} isEditing={false} isPublicView={true} />
              </ErrorBoundary>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
