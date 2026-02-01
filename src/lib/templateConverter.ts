import { EditorSection, DraggableSectionType } from '@/types/editor';
import { SectionStyling } from '@/types/portfolio';
import { getAllTemplates, getTemplate } from '@/components/templates';
import { enhancedColorSchemes } from '@/lib/portfolio/enhanced-templates';

// Default styling for converted sections
const getDefaultStyling = (sectionType: DraggableSectionType): SectionStyling => ({
  backgroundColor: 'transparent',
  textColor: 'inherit',
  padding: { top: '4rem', right: '2rem', bottom: '4rem', left: '2rem' },
  margin: { top: '0', bottom: '0' },
  alignment: sectionType === 'hero' ? 'center' : 'left',
  layout: 'default',
  animation: { 
    type: sectionType === 'hero' ? 'fade' : 'slide', 
    duration: 600, 
    delay: 200 
  }
});

// Get template-specific styling
const getTemplateStyling = (templateId: string, sectionType: DraggableSectionType): SectionStyling => {
  // Only apply custom styling for dark-professional template
  if (templateId === 'dark-professional') {
    const colorScheme = enhancedColorSchemes.darkProfessional;
    
    return {
      backgroundColor: sectionType === 'hero' ? colorScheme.background : colorScheme.surface,
      textColor: colorScheme.text.primary,
      padding: { 
        top: sectionType === 'hero' ? '6rem' : '5rem', 
        right: '2rem', 
        bottom: sectionType === 'hero' ? '6rem' : '5rem', 
        left: '2rem' 
      },
      margin: { top: '0', bottom: '0' },
      alignment: sectionType === 'hero' ? 'center' : 'left',
      layout: 'default',
      animation: { 
        type: sectionType === 'hero' ? 'fade' : 'slide', 
        duration: 800, 
        delay: sectionType === 'hero' ? 200 : 300 
      },
      customStyles: {
        // Add border for non-hero sections
        ...(sectionType !== 'hero' && {
          borderTop: `1px solid ${colorScheme.border}`,
        })
      }
    };
  }
  
  // For other templates, use default styling
  return getDefaultStyling(sectionType);
};

// Generate unique section IDs
const generateSectionId = (type: DraggableSectionType, index = 0): string => {
  return `${type}-${Date.now()}-${index}`;
};

// Convert template data to editor sections
export const convertTemplateToSections = (templateId: string): EditorSection[] => {
  const template = getTemplate(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  const sections: EditorSection[] = [];
  let sectionOrder = 0;

  // Get template sample data from the component
  const templateData = getTemplateDefaultData(templateId);

  // For template components (dark-professional, elegant-monochrome, warm-minimalist), load entire template as single component
  if (templateId === 'dark-professional' || templateId === 'elegant-monochrome' || templateId === 'warm-minimalist') {
    // Transform projects to correct format
    const transformedTemplateData = {
      ...templateData,
      projects: {
        ...templateData.projects,
        projects: templateData.projects.projects?.map((p: any, index: number) => ({
          id: p.id || `project-${Date.now()}-${index}`,
          title: p.title,
          description: p.description,
          longDescription: p.longDescription || p.description,
          technologies: p.technologies || [],
          images: p.image ? [p.image] : (p.images || []),
          links: {
            live: p.liveUrl || p.links?.live,
            github: p.githubUrl || p.links?.github,
            demo: p.demoUrl || p.links?.demo,
            documentation: p.links?.documentation
          },
          featured: p.featured !== undefined ? p.featured : true,
          category: p.category || 'Other',
          status: p.status || 'completed' as 'completed' | 'in-progress' | 'planned',
          startDate: p.startDate,
          endDate: p.endDate,
          teamSize: p.teamSize,
          role: p.role
        })) || []
      }
    };

    // Get template display name
    const templateNames: Record<string, string> = {
      'dark-professional': 'Dark Professional Template',
      'elegant-monochrome': 'Elegant Monochrome Template',
      'warm-minimalist': 'Warm Minimalist Template'
    };

    sections.push({
      id: generateSectionId('template', 0),
      type: 'template',
      title: templateNames[templateId] || 'Template',
      enabled: true,
      order: 0,
      data: {
        templateId: templateId,
        templateData: transformedTemplateData
      },
      styling: {
        backgroundColor: 'transparent',
        textColor: 'inherit',
        padding: { top: '0', right: '0', bottom: '0', left: '0' },
        margin: { top: '0', bottom: '0' },
        alignment: 'left',
        layout: 'default',
        animation: { type: 'none', duration: 0, delay: 0 }
      },
      isEditable: true
    });
    return sections;
  }

  // For other templates, convert to individual sections (existing logic)
  
  // Convert Hero Section
  if (templateData.hero) {
    sections.push({
      id: generateSectionId('hero', sectionOrder),
      type: 'hero',
      title: 'Hero Section',
      enabled: true,
      order: sectionOrder++,
      data: {
        ...templateData.hero,
        contactEmail: templateData.hero.socialLinks?.find((link: any) => link.platform === 'email')?.url?.replace('mailto:', '') || '',
        socialLinks: templateData.hero.socialLinks || []
      },
      styling: getTemplateStyling(templateId, 'hero'),
      isEditable: true
    });
  }

  // Convert About Section
  if (templateData.about) {
    sections.push({
      id: generateSectionId('about', sectionOrder),
      type: 'about',
      title: 'About Section',
      enabled: true,
      order: sectionOrder++,
      data: {
        ...templateData.about,
        personalInfo: {
          location: templateData.hero?.location || '',
          languages: ['English'],
          interests: ['Technology', 'Innovation']
        }
      },
      styling: getTemplateStyling(templateId, 'about'),
      isEditable: true
    });
  }

  // Convert Skills Section
  if (templateData.skills) {
    sections.push({
      id: generateSectionId('skills', sectionOrder),
      type: 'skills',
      title: 'Skills Section',
      enabled: true,
      order: sectionOrder++,
      data: {
        ...templateData.skills,
        skills: [] // Legacy format support
      },
      styling: getTemplateStyling(templateId, 'skills'),
      isEditable: true
    });
  }

  // Convert Projects Section
  if (templateData.projects) {
    // Transform projects to match the correct Project type
    const transformedProjects = templateData.projects.projects?.map((p: any, index: number) => ({
      id: `project-${Date.now()}-${index}`,
      title: p.title,
      description: p.description,
      longDescription: p.longDescription || p.description,
      technologies: p.technologies || [],
      images: p.image ? [p.image] : (p.images || []),
      links: {
        live: p.liveUrl || p.links?.live,
        github: p.githubUrl || p.links?.github,
        demo: p.demoUrl || p.links?.demo,
        documentation: p.links?.documentation
      },
      featured: p.featured !== undefined ? p.featured : true,
      category: p.category || 'Other',
      status: p.status || 'completed' as 'completed' | 'in-progress' | 'planned',
      startDate: p.startDate,
      endDate: p.endDate,
      teamSize: p.teamSize,
      role: p.role
    })) || [];

    sections.push({
      id: generateSectionId('projects', sectionOrder),
      type: 'projects',
      title: 'Projects Section',
      enabled: true,
      order: sectionOrder++,
      data: {
        heading: templateData.projects.heading,
        projects: transformedProjects,
        categories: Array.from(new Set(transformedProjects.map((p: any) => p.category)))
      },
      styling: getTemplateStyling(templateId, 'projects'),
      isEditable: true
    });
  }

  // Convert Contact Section
  if (templateData.contact) {
    sections.push({
      id: generateSectionId('contact', sectionOrder),
      type: 'contact',
      title: 'Contact Section',
      enabled: true,
      order: sectionOrder++,
      data: templateData.contact,
      styling: getTemplateStyling(templateId, 'contact'),
      isEditable: true
    });
  }

  return sections;
};

// Extract default data from template components
const getTemplateDefaultData = (templateId: string): any => {
  switch (templateId) {
    case 'dark-professional':
      return {
        hero: {
          fullName: "Jordan Smith",
          title: "Senior Software Engineer",
          bio: "Building scalable systems and leading development teams with clean code practices. Expert in system architecture and team leadership.",
          profileImage: "",
          location: "Seattle, WA",
          socialLinks: [
            { platform: "github", url: "https://github.com/alexjohnson" },
            { platform: "linkedin", url: "https://linkedin.com/in/alexjohnson" },
            { platform: "email", url: "mailto:alex@example.com" }
          ]
        },
        about: {
          heading: "About Me",
          content: "I'm a passionate full-stack developer with a strong foundation in modern web technologies. I love solving complex problems and building applications that make a real impact. When I'm not coding, you'll find me contributing to open source projects or learning about emerging technologies.",
          highlights: [
            "5+ years of professional experience",
            "Built 50+ web applications",
            "Expert in React, Node.js, and TypeScript",
            "AWS Certified Solutions Architect"
          ]
        },
        skills: {
          heading: "Technical Skills",
          skillCategories: {
            technical: [
              { name: "JavaScript", level: 95 },
              { name: "TypeScript", level: 90 },
              { name: "React", level: 95 },
              { name: "Node.js", level: 88 },
              { name: "Python", level: 85 }
            ],
            soft: [
              { name: "Problem Solving", level: 92 },
              { name: "Team Collaboration", level: 88 },
              { name: "Communication", level: 85 }
            ],
            languages: [
              { name: "English", level: 100 },
              { name: "Spanish", level: 75 }
            ],
            tools: [
              { name: "Git", level: 90 },
              { name: "Docker", level: 75 },
              { name: "AWS", level: 70 }
            ]
          }
        },
        projects: {
          heading: "Featured Projects",
          projects: [
            {
              title: "E-Commerce Platform",
              description: "Full-stack e-commerce solution with React frontend, Node.js backend, and PostgreSQL database. Includes payment processing, inventory management, and admin dashboard.",
              image: "",
              technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
              liveUrl: "https://demo.example.com",
              githubUrl: "https://github.com/example/ecommerce",
              category: "Web Development"
            },
            {
              title: "Task Management App",
              description: "Real-time collaborative task management application with drag-and-drop functionality, team workspaces, and progress tracking.",
              image: "",
              technologies: ["React", "Socket.io", "MongoDB", "Express"],
              liveUrl: "https://tasks.example.com",
              githubUrl: "https://github.com/example/taskmanager",
              category: "Productivity"
            }
          ]
        },
        contact: {
          heading: "Get In Touch",
          email: "alex@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA"
        }
      };

    case 'elegant-monochrome':
      return {
        hero: {
          fullName: "Victoria Sterling",
          title: "Business Consultant & Strategy Expert",
          bio: "Transforming businesses through strategic consulting and innovative solutions. 10+ years of experience helping companies achieve sustainable growth and operational excellence.",
          profileImage: "",
          location: "London, UK",
          socialLinks: [
            { platform: "linkedin", url: "https://linkedin.com/in/victoriaserling" },
            { platform: "email", url: "mailto:victoria@example.com" }
          ]
        },
        about: {
          heading: "About Me",
          content: "I am a strategic business consultant with a passion for helping organizations unlock their full potential. My approach combines analytical rigor with creative thinking to deliver measurable results. I specialize in strategic planning, operational optimization, and change management.",
          highlights: [
            "10+ years in business consulting",
            "Managed $50M+ in strategic initiatives",
            "Certified Project Management Professional",
            "MBA from London Business School"
          ]
        },
        skills: {
          heading: "Core Competencies",
          skillCategories: {
            technical: [
              { name: "Strategic Planning", level: 95 },
              { name: "Business Analysis", level: 90 },
              { name: "Project Management", level: 88 },
              { name: "Data Analytics", level: 85 },
              { name: "Financial Modeling", level: 82 }
            ],
            soft: [
              { name: "Leadership", level: 95 },
              { name: "Client Relations", level: 92 },
              { name: "Presentation Skills", level: 90 }
            ],
            languages: [
              { name: "English", level: 100 },
              { name: "French", level: 85 }
            ],
            tools: [
              { name: "Microsoft Suite", level: 95 },
              { name: "Tableau", level: 80 },
              { name: "Salesforce", level: 75 },
              { name: "SAP", level: 70 }
            ]
          }
        },
        projects: {
          heading: "Key Projects",
          projects: [
            {
              title: "Digital Transformation Initiative",
              description: "Led comprehensive digital transformation for Fortune 500 company, resulting in 40% efficiency improvement and $5M annual cost savings.",
              image: "",
              technologies: ["Strategy", "Change Management", "Process Optimization"],
              liveUrl: "",
              githubUrl: "",
              category: "Strategy"
            }
          ]
        },
        contact: {
          heading: "Get In Touch",
          email: "victoria@example.com",
          phone: "+44 20 7946 0958",
          location: "London, UK"
        }
      };

    case 'warm-minimalist':
      return {
        hero: {
          fullName: "Sarah Martinez",
          title: "Creative Freelancer & Brand Designer",
          bio: "Helping small businesses and startups create authentic brand identities that connect with their audience. Passionate about meaningful design that tells your story.",
          profileImage: "",
          location: "Austin, TX",
          socialLinks: [
            { platform: "github", url: "https://github.com/sarahmartinez" },
            { platform: "linkedin", url: "https://linkedin.com/in/sarahmartinez" },
            { platform: "email", url: "mailto:sarah@example.com" }
          ]
        },
        about: {
          heading: "About Me",
          content: "I'm a passionate creative professional who believes great design should be accessible to everyone. With 6+ years of experience in brand design and digital marketing, I help small businesses and entrepreneurs build authentic connections with their customers through thoughtful, strategic design.",
          highlights: [
            "6+ years in brand & digital design",
            "Worked with 100+ small businesses",
            "Featured in Design Weekly magazine",
            "Certified Google Ads specialist"
          ]
        },
        skills: {
          heading: "What I Do Best",
          skillCategories: {
            technical: [
              { name: "Brand Identity Design", level: 95 },
              { name: "Web Design", level: 90 },
              { name: "Illustration", level: 85 },
              { name: "Photography", level: 80 },
              { name: "Content Strategy", level: 88 }
            ],
            soft: [
              { name: "Client Communication", level: 95 },
              { name: "Creative Thinking", level: 92 },
              { name: "Time Management", level: 88 }
            ],
            languages: [
              { name: "English", level: 100 },
              { name: "Spanish", level: 80 }
            ],
            tools: [
              { name: "Adobe Creative Suite", level: 95 },
              { name: "Figma", level: 90 },
              { name: "Webflow", level: 85 },
              { name: "Canva", level: 80 }
            ]
          }
        },
        projects: {
          heading: "Recent Work",
          projects: [
            {
              title: "Bloom Coffee Co.",
              description: "Complete brand identity and packaging design for a local organic coffee roaster. Created a warm, approachable brand that reflects their commitment to sustainability.",
              image: "",
              technologies: ["Brand Identity", "Packaging", "Web Design"],
              liveUrl: "",
              githubUrl: "",
              category: "Branding"
            }
          ]
        },
        contact: {
          heading: "Let's Create Together",
          email: "sarah@example.com",
          phone: "+1 (512) 555-0123",
          location: "Austin, TX"
        }
      };

    default:
      throw new Error(`Template data not found for template: ${templateId}`);
  }
};

// Apply template to editor with confirmation and loading states
export const applyTemplateToEditor = async (
  templateId: string,
  editorActions: any,
  options: {
    replaceAll?: boolean;
    showConfirmation?: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<void> => {
  try {
    const { 
      replaceAll = true, 
      showConfirmation = true,
      onSuccess,
      onError 
    } = options;

    // Show confirmation if requested
    if (showConfirmation && replaceAll) {
      const confirmed = confirm(
        'This will replace all current content with the template data. Are you sure you want to continue?'
      );
      if (!confirmed) return;
    }

    // Convert template to sections
    const sections = convertTemplateToSections(templateId);

    // Apply to editor
    if (replaceAll) {
      editorActions.resetEditor();
      editorActions.loadSections(sections);
    } else {
      // Add sections to existing content
      sections.forEach(section => {
        editorActions.addSection(section);
      });
    }

    // Mark as having unsaved changes
    editorActions.setUnsavedChanges(true);

    // Success callback
    onSuccess?.();
    
  } catch (error) {
    console.error('Error applying template:', error);
    const errorMessage = error instanceof Error ? error : new Error('Failed to apply template');
    onError?.(errorMessage);
  }
};