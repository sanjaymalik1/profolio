import { EditorSection, DraggableSectionType } from '@/types/editor';
import { SectionStyling, TemplateData } from '@/types/portfolio';
import { getTemplate } from '@/components/templates';
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
      }
    };
  }

  if (templateId === 'modern-developer') {
    return {
      backgroundColor: sectionType === 'hero' ? '#FFFFFF' : '#F8FAFC',
      textColor: '#0F172A',
      padding: { top: '5rem', right: '1.5rem', bottom: '5rem', left: '1.5rem' },
      margin: { top: '0', bottom: '0' },
      alignment: sectionType === 'hero' ? 'left' : 'left',
      layout: 'grid',
      animation: { type: 'slide', duration: 400, delay: 100 }
    };
  }

  if (templateId === 'sidebar-resume') {
    return {
      backgroundColor: '#FFFFFF',
      textColor: '#111827',
      padding: { top: '4rem', right: '3rem', bottom: '4rem', left: '3rem' },
      margin: { top: '0', bottom: '0' },
      alignment: 'left',
      layout: 'default',
      animation: { type: 'fade', duration: 300, delay: 50 }
    };
  }

  if (templateId === 'creative-minimal') {
    return {
      backgroundColor: '#FAFAFA',
      textColor: '#171717',
      padding: { top: '8rem', right: '4rem', bottom: '8rem', left: '4rem' },
      margin: { top: '0', bottom: '0' },
      alignment: sectionType === 'projects' || sectionType === 'skills' ? 'center' : 'left',
      layout: 'grid',
      animation: { type: 'fade', duration: 1000, delay: 300 }
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
export const convertTemplateToSections = (templateId: string, customData?: Partial<TemplateData>): EditorSection[] => {
  const template = getTemplate(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  const sections: EditorSection[] = [];
  let sectionOrder = 0;

  // Get template sample data from the component
  const defaultData = getTemplateDefaultData(templateId) as TemplateData;
  const templateData = (customData || defaultData) as TemplateData;

  
  // Convert Hero Section
  if (templateData.hero) {
    sections.push({
      id: generateSectionId('hero', sectionOrder),
      type: 'hero',
      order: sectionOrder++,
      data: {
        ...templateData.hero,
        contactEmail: templateData.hero.socialLinks?.find((link) => link.platform === 'email')?.url?.replace('mailto:', '') || '',
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
    const transformedProjects = templateData.projects.projects?.map((p: { id?: string; title: string; description: string; longDescription?: string; technologies?: string[]; image?: string; images?: string[]; category?: string; links?: { live?: string; github?: string; demo?: string; documentation?: string }; featured?: boolean; status?: 'completed' | 'in-progress' | 'planned'; startDate?: string; endDate?: string; teamSize?: number; role?: string }, index: number) => ({
      id: `project-${Date.now()}-${index}`,
      title: p.title,
      description: p.description,
      longDescription: p.longDescription || p.description,
      technologies: p.technologies || [],
      images: p.image ? [p.image] : (p.images || []),
      links: {
        live: p.links?.live,
        github: p.links?.github,
        demo: p.links?.demo,
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
      order: sectionOrder++,
      data: {
        heading: templateData.projects.heading,
        projects: transformedProjects,
        categories: Array.from(new Set(transformedProjects.map((p: { category?: string }) => p.category).filter((cat: string | undefined): cat is string => cat !== undefined)))
      },
      styling: getTemplateStyling(templateId, 'projects'),
      isEditable: true
    });
  }

  // Convert Experience Section
  if (templateData.experience) {
    sections.push({
      id: generateSectionId('experience', sectionOrder),
      type: 'experience',
      order: sectionOrder++,
      data: templateData.experience,
      styling: getTemplateStyling(templateId, 'experience'),
      isEditable: true
    });
  }

  // Convert Education Section
  if (templateData.education) {
    sections.push({
      id: generateSectionId('education', sectionOrder),
      type: 'education',
      order: sectionOrder++,
      data: templateData.education,
      styling: getTemplateStyling(templateId, 'education'),
      isEditable: true
    });
  }

  // Convert Contact Section
  if (templateData.contact) {
    sections.push({
      id: generateSectionId('contact', sectionOrder),
      type: 'contact',
      order: sectionOrder++,
      data: templateData.contact,
      styling: getTemplateStyling(templateId, 'contact'),
      isEditable: true
    });
  }

  return sections;
};

// Extract default data from template components
const getTemplateDefaultData = (templateId: string): TemplateData => {
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
          heading: "About",
          content: "I'm a senior software engineer with a passion for building robust, scalable systems. My expertise spans full-stack development, cloud architecture, and team leadership. I believe in writing clean, maintainable code and fostering collaborative development environments.",
          highlights: [
            "8+ years of professional experience",
            "Built 50+ web applications",
            "Expert in React, Node.js, and TypeScript",
            "AWS Certified Solutions Architect"
          ]
        },
        experience: {
          heading: "Experience",
          experiences: []
        },
        education: {
          heading: "Education",
          education: []
        },
        skills: {
          heading: "Technical Expertise",
          skills: [],
          skillCategories: {
            technical: [
              { name: "JavaScript", level: 95, category: 'technical' },
              { name: "TypeScript", level: 90, category: 'technical' },
              { name: "React", level: 95, category: 'technical' },
              { name: "Node.js", level: 88, category: 'technical' },
              { name: "Python", level: 85, category: 'technical' }
            ],
            soft: [
              { name: "Problem Solving", level: 92, category: 'soft' },
              { name: "Team Collaboration", level: 88, category: 'soft' },
              { name: "Communication", level: 85, category: 'soft' }
            ],
            languages: [
              { name: "English", level: 100, category: 'language' },
              { name: "Spanish", level: 75, category: 'language' }
            ],
            tools: [
              { name: "Git", level: 90, category: 'tool' },
              { name: "Docker", level: 75, category: 'tool' },
              { name: "AWS", level: 70, category: 'tool' }
            ]
          }
        },
        projects: {
          heading: "Projects",
          projects: [
            {
              id: "project-1",
              title: "E-Commerce Platform",
              description: "Full-stack e-commerce solution with React frontend, Node.js backend, and PostgreSQL database. Includes payment processing, inventory management, and admin dashboard.",
              images: [],
              technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
              links: {
                live: "https://demo.example.com",
                github: "https://github.com/example/ecommerce"
              },
              featured: true,
              category: "Web Development",
              status: 'completed' as const
            },
            {
              id: "project-2",
              title: "Task Management App",
              description: "Real-time collaborative task management application with drag-and-drop functionality, team workspaces, and progress tracking.",
              images: [],
              technologies: ["React", "Socket.io", "MongoDB", "Express"],
              links: {
                live: "https://tasks.example.com",
                github: "https://github.com/example/taskmanager"
              },
              featured: true,
              category: "Productivity",
              status: 'completed' as const
            }
          ],
          categories: ["Web Development", "Productivity", "Other"]
        },
        contact: {
          heading: "Contact",
          email: "alex@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          availability: "Available for freelance opportunities",
          socialLinks: [],
          contactForm: {
            enabled: true,
            fields: []
          }
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
        experience: {
          heading: "Professional Experience",
          experiences: []
        },
        education: {
          heading: "Education",
          education: []
        },
        skills: {
          heading: "Core Competencies",
          skills: [],
          skillCategories: {
            technical: [
              { name: "Strategic Planning", level: 95, category: 'technical' },
              { name: "Business Analysis", level: 90, category: 'technical' },
              { name: "Project Management", level: 88, category: 'technical' },
              { name: "Data Analytics", level: 85, category: 'technical' },
              { name: "Financial Modeling", level: 82, category: 'technical' }
            ],
            soft: [
              { name: "Leadership", level: 95, category: 'soft' },
              { name: "Client Relations", level: 92, category: 'soft' },
              { name: "Presentation Skills", level: 90, category: 'soft' }
            ],
            languages: [
              { name: "English", level: 100, category: 'language' },
              { name: "French", level: 85, category: 'language' }
            ],
            tools: [
              { name: "Microsoft Suite", level: 95, category: 'tool' },
              { name: "Tableau", level: 80, category: 'tool' },
              { name: "Salesforce", level: 75, category: 'tool' },
              { name: "SAP", level: 70, category: 'tool' }
            ]
          }
        },
        projects: {
          heading: "Key Projects",
          projects: [
            {
              id: "project-3",
              title: "Digital Transformation Initiative",
              description: "Led comprehensive digital transformation for Fortune 500 company, resulting in 40% efficiency improvement and $5M annual cost savings.",
              images: [],
              technologies: ["Strategy", "Change Management", "Process Optimization"],
              links: {},
              featured: true,
              category: "Strategy",
              status: 'completed' as const
            }
          ],
          categories: ["Strategy", "Consulting", "Other"]
        },
        contact: {
          heading: "Get In Touch",
          email: "victoria@example.com",
          phone: "+44 20 7946 0958",
          location: "London, UK",
          availability: "Open to consulting engagements",
          socialLinks: [],
          contactForm: {
            enabled: true,
            fields: []
          }
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
        experience: {
          heading: "Experience",
          experiences: []
        },
        education: {
          heading: "Education",
          education: []
        },
        skills: {
          heading: "What I Do Best",
          skills: [],
          skillCategories: {
            technical: [
              { name: "Brand Identity Design", level: 95, category: 'technical' },
              { name: "Web Design", level: 90, category: 'technical' },
              { name: "Illustration", level: 85, category: 'technical' },
              { name: "Photography", level: 80, category: 'technical' },
              { name: "Content Strategy", level: 88, category: 'technical' }
            ],
            soft: [
              { name: "Client Communication", level: 95, category: 'soft' },
              { name: "Creative Thinking", level: 92, category: 'soft' },
              { name: "Time Management", level: 88, category: 'soft' }
            ],
            languages: [
              { name: "English", level: 100, category: 'language' },
              { name: "Spanish", level: 80, category: 'language' }
            ],
            tools: [
              { name: "Adobe Creative Suite", level: 95, category: 'tool' },
              { name: "Figma", level: 90, category: 'tool' },
              { name: "Webflow", level: 85, category: 'tool' },
              { name: "Canva", level: 80, category: 'tool' }
            ]
          }
        },
        projects: {
          heading: "Recent Work",
          projects: [
            {
              id: "project-4",
              title: "Bloom Coffee Co.",
              description: "Complete brand identity and packaging design for a local organic coffee roaster. Created a warm, approachable brand that reflects their commitment to sustainability.",
              images: [],
              technologies: ["Brand Identity", "Packaging", "Web Design"],
              links: {},
              featured: true,
              category: "Branding",
              status: 'completed' as const
            }
          ],
          categories: ["Branding", "Design", "Other"]
        },
        contact: {
          heading: "Let's Create Together",
          email: "sarah@example.com",
          phone: "+1 (512) 555-0123",
          location: "Austin, TX",
          availability: "Taking on new projects",
          socialLinks: [],
          contactForm: {
            enabled: true,
            fields: []
          }
        }
      };

    case 'modern-developer':
      return {
        hero: {
          fullName: "Alex Rivera",
          title: "Full Stack Engineer",
          bio: "Building robust backend systems and beautiful frontend experiences. Passionate about clean code, open source, and continuous learning.",
          profileImage: "",
          location: "Remote / New York",
          socialLinks: [
            { platform: "github", url: "https://github.com/alexrivera" },
            { platform: "linkedin", url: "https://linkedin.com/in/alexrivera" }
          ]
        },
        about: {
          heading: "01. About",
          content: "I am a software engineer focused on building exceptional, high-quality websites and applications. Currently, my main focus is building accessible, inclusive products and digital experiences.",
          highlights: ["Over 5 years of engineering experience", "Open source contributor", "AWS Certified Developer", "TypeScript specialist"]
        },
        experience: {
          heading: "02. Experience",
          experiences: []
        },
        education: {
          heading: "03. Education",
          education: []
        },
        skills: {
          heading: "04. Technologies",
          skillCategories: {
            technical: [{ name: "TypeScript", level: 90, category: "technical" }, { name: "React", level: 95, category: "technical" }],
            soft: [],
            languages: [],
            tools: [{ name: "Git", level: 90, category: "tool" }, { name: "Docker", level: 80, category: "tool" }]
          },
          skills: []
        },
        projects: {
          heading: "05. Selected Work",
          categories: ["Frontend", "Backend", "Fullstack"],
          projects: []
        },
        contact: {
          heading: "06. Get In Touch",
          email: "alex@example.com",
          phone: "",
          location: "New York, USA",
          availability: "Currently looking for new opportunities.",
          socialLinks: [],
          contactForm: { enabled: true, fields: [] }
        }
      };

    case 'sidebar-resume':
      return {
        hero: {
          fullName: "Emily Chen",
          title: "Product Manager",
          bio: "Data-driven Product Manager with a track record of successfully launching B2B SaaS products.",
          profileImage: "",
          location: "Toronto, ON",
          socialLinks: [{ platform: "linkedin", url: "https://linkedin.com/in/emilychen" }]
        },
        about: {
          heading: "Professional Summary",
          content: "Strategic Product Manager with 7+ years of experience leading cross-functional teams in the B2B SaaS space.",
          highlights: []
        },
        experience: { heading: "Work Experience", experiences: [] },
        education: { heading: "Education", education: [] },
        skills: {
          heading: "Skills",
          skillCategories: { technical: [], soft: [], languages: [], tools: [] },
          skills: []
        },
        projects: { heading: "Product Launches", categories: ["SaaS", "Mobile"], projects: [] },
        contact: {
          heading: "Contact Information",
          email: "emily@example.com",
          phone: "+1 (555) 987-6543",
          location: "Toronto, ON",
          availability: "",
          socialLinks: [],
          contactForm: { enabled: false, fields: [] }
        }
      };

    case 'creative-minimal':
      return {
        hero: {
          fullName: "Marcus Cole",
          title: "Art Director",
          bio: "Minimalist. Creator. Visionary. Crafting digital experiences that speak louder than words.",
          profileImage: "",
          location: "Berlin, DE",
          socialLinks: [{ platform: "instagram", url: "https://instagram.com/marcuscole" }]
        },
        about: {
          heading: "The Vision",
          content: "Design is not just what it looks like and feels like. Design is how it works.",
          highlights: ["Award winning Art Director", "Exhibited in Berlin & London"]
        },
        experience: { heading: "Chronicle", experiences: [] },
        education: { heading: "Background", education: [] },
        skills: {
          heading: "Discipline",
          skillCategories: { technical: [{ name: "Art Direction", level: 100, category: "technical" }], soft: [], languages: [], tools: [] },
          skills: []
        },
        projects: { heading: "Exhibition", categories: ["Art", "Design"], projects: [] },
        contact: {
          heading: "Collaborate",
          email: "marcus@example.com",
          phone: "",
          location: "Berlin",
          availability: "Accepting select commissions.",
          socialLinks: [],
          contactForm: { enabled: true, fields: [] }
        }
      };

    case 'executive-pro':
      return {
        hero: {
          fullName: "Alex Morgan",
          title: "Full-Stack Engineer & Technical Lead",
          bio: "Building robust, scalable software and leading teams to ship products users love.",
          profileImage: "",
          location: "San Francisco, CA",
          socialLinks: [
            { platform: "github", url: "https://github.com/alexmorgan" },
            { platform: "linkedin", url: "https://linkedin.com/in/alexmorgan" }
          ]
        },
        about: {
          heading: "About Me",
          content: "I'm a technical leader and full-stack engineer with over a decade of experience building scalable applications and leading high-performing teams.",
          highlights: [
            "10+ years engineering experience",
            "Led team of 15+ developers",
            "System Architecture Expert",
            "Open Source Contributor"
          ]
        },
        experience: {
          heading: "Experience",
          experiences: []
        },
        education: {
          heading: "Education",
          education: []
        },
        skills: {
          heading: "Skills & Technologies",
          skillCategories: {
            technical: [
              { name: "React / Next.js", level: 95, category: "technical" },
              { name: "Node.js", level: 90, category: "technical" },
              { name: "TypeScript", level: 95, category: "technical" },
              { name: "System Architecture", level: 85, category: "technical" }
            ],
            soft: [
              { name: "Technical Leadership", level: 95, category: "soft" },
              { name: "Mentoring", level: 90, category: "soft" }
            ],
            languages: [],
            tools: [
              { name: "AWS", level: 85, category: "tool" },
              { name: "Docker/Kubernetes", level: 80, category: "tool" }
            ]
          },
          skills: []
        },
        projects: {
          heading: "Featured Projects",
          categories: ["Frontend", "Backend", "Fullstack"],
          projects: []
        },
        contact: {
          heading: "Get In Touch",
          email: "alex@example.com",
          phone: "",
          location: "San Francisco, CA",
          availability: "Open to new opportunities.",
          socialLinks: [],
          contactForm: { enabled: true, fields: [] }
        }
      };

    default:
      throw new Error(`Template data not found for template: ${templateId}`);
  }
};

// Apply template to editor with confirmation and loading states
export const applyTemplateToEditor = async (
  templateId: string,
  editorActions: {
    clearEditor: () => void;
    loadState: (state: unknown) => void;
  },
  options: {
    replaceAll?: boolean;
    showConfirmation?: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<void> => {
  const {
    replaceAll = true,
    showConfirmation = true,
    onSuccess,
    onError
  } = options;

  try {
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
      editorActions.clearEditor();
      editorActions.loadState({ sections, templateId });
    } else {
      // Add sections to existing content - not fully supported with current interface
      editorActions.loadState({ sections, templateId });
    }

    // Success callback
    onSuccess?.();

  } catch (error) {
    console.error('Error applying template:', error);
    const errorMessage = error instanceof Error ? error : new Error('Failed to apply template');
    onError?.(errorMessage);
  }
};