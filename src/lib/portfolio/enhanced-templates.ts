import { PortfolioTemplate, ColorScheme, Typography, LayoutConfig, PortfolioSection } from '@/types/portfolio';

// ===============================
// ENHANCED COLOR SCHEMES
// ===============================

export const enhancedColorSchemes: Record<string, ColorScheme> = {
  // Dark Professional
  darkProfessional: {
    primary: '#3B82F6', // Blue-500
    secondary: '#1E40AF', // Blue-800
    accent: '#10B981', // Emerald-500
    background: '#0F172A',
    surface: '#1E293B',
    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      muted: '#94A3B8'
    },
    border: '#334155'
  },

  // Warm Minimalist
  warmMinimalist: {
    primary: '#DC2626', // Red-600
    secondary: '#B91C1C', // Red-700
    accent: '#F59E0B', // Amber-500
    background: '#FFFBEB',
    surface: '#FEF3C7',
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      muted: '#6B7280'
    },
    border: '#FDE68A'
  },

  // Elegant Monochrome
  elegantMono: {
    primary: '#374151', // Gray-700
    secondary: '#1F2937', // Gray-800
    accent: '#6366F1', // Indigo-500
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      muted: '#9CA3AF'
    },
    border: '#E5E7EB'
  }
};

// ===============================
// ENHANCED TYPOGRAPHY CONFIGS
// ===============================

export const enhancedTypographyConfigs: Record<string, Typography> = {
  warmMinimalist: {
    fontFamily: {
      heading: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      body: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      mono: 'SF Mono, Monaco, Inconsolata, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.5rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },

  darkProfessional: {
    fontFamily: {
      heading: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
      body: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif',
      mono: 'JetBrains Mono, SF Mono, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.75rem'
    },
    fontWeight: {
      normal: 300,
      medium: 400,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.6,
      relaxed: 1.8
    }
  },

  elegantMono: {
    fontFamily: {
      heading: 'Playfair Display, Georgia, serif',
      body: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif',
      mono: 'IBM Plex Mono, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.5rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.3,
      normal: 1.6,
      relaxed: 1.75
    }
  }
};

// ===============================
// ENHANCED LAYOUT CONFIGS
// ===============================

export const enhancedLayoutConfigs: Record<string, LayoutConfig> = {
  warmMinimalist: {
    maxWidth: '1200px',
    spacing: {
      section: '5rem',
      element: '1.5rem'
    },
    borderRadius: {
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem'
    },
    shadows: {
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
      lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)'
    }
  },

  darkProfessional: {
    maxWidth: '1100px',
    spacing: {
      section: '4rem',
      element: '1.25rem'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 3px 0 rgb(59 130 246 / 0.1)',
      md: '0 4px 6px -1px rgb(59 130 246 / 0.1)',
      lg: '0 20px 25px -5px rgb(59 130 246 / 0.1)'
    }
  },

  elegantMono: {
    maxWidth: '1000px',
    spacing: {
      section: '4.5rem',
      element: '1.75rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    shadows: {
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.12), 0 1px 2px 0 rgb(0 0 0 / 0.24)',
      md: '0 3px 6px 0 rgb(0 0 0 / 0.16), 0 3px 6px 0 rgb(0 0 0 / 0.23)',
      lg: '0 10px 20px 0 rgb(0 0 0 / 0.19), 0 6px 6px 0 rgb(0 0 0 / 0.23)'
    }
  }
};

// ===============================
// ENHANCED TEMPLATE SECTIONS
// ===============================

const createEnhancedSections = (templateId: string, templateType: string): PortfolioSection[] => {
  const baseId = `${templateId}`;
  
  const commonSections: PortfolioSection[] = [
    {
      id: `${baseId}-hero`,
      type: 'hero',
      title: 'Hero Section',
      enabled: true,
      order: 0,
      data: {
        fullName: 'Your Name',
        title: 'Your Professional Title',
        bio: 'Crafting digital experiences that make a difference. Passionate about innovation and elegant solutions.',
        profileImage: '',
        backgroundImage: '',
        socialLinks: [
          { platform: 'github', url: 'https://github.com/yourusername' },
          { platform: 'linkedin', url: 'https://linkedin.com/in/yourusername' },
          { platform: 'email', url: 'mailto:your.email@example.com' }
        ],
        contactEmail: 'your.email@example.com',
        location: 'Your City, Country'
      },
      styling: {
        backgroundColor: 'transparent',
        textColor: 'inherit',
        alignment: 'center',
        layout: 'default',
        padding: {
          top: '6rem',
          bottom: '6rem',
          left: '2rem',
          right: '2rem'
        },
        margin: {
          top: '0',
          bottom: '0'
        },
        animation: {
          type: 'fade',
          delay: 200,
          duration: 800
        }
      }
    },
    {
      id: `${baseId}-about`,
      type: 'about',
      title: 'About Section',
      enabled: true,
      order: 1,
      data: {
        heading: 'About Me',
        content: 'I am a passionate professional with expertise in creating innovative solutions. My journey spans across various technologies and industries, always focusing on delivering exceptional results.',
        profileImage: '',
        highlights: [
          '5+ years of experience',
          'Delivered 50+ successful projects',
          'Collaborated with international teams',
          'Continuous learner and innovator'
        ],
        personalInfo: {
          location: 'Your City, Country',
          languages: ['English', 'Spanish'],
          interests: ['Technology', 'Design', 'Innovation', 'Travel']
        }
      },
      styling: {
        backgroundColor: 'transparent',
        textColor: 'inherit',
        alignment: 'left',
        layout: 'default',
        padding: {
          top: '4rem',
          bottom: '4rem',
          left: '2rem',
          right: '2rem'
        },
        margin: {
          top: '0',
          bottom: '0'
        },
        animation: {
          type: 'slide',
          delay: 400,
          duration: 600
        }
      }
    }
  ];

  // Add template-specific sections
  const templateSpecificSections = getTemplateSpecificSections(baseId, templateType);
  
  return [...commonSections, ...templateSpecificSections];
};

const getTemplateSpecificSections = (baseId: string, templateType: string): PortfolioSection[] => {
  switch (templateType) {
    case 'tech':
      return [
        {
          id: `${baseId}-skills`,
          type: 'skills',
          title: 'Technical Skills',
          enabled: true,
          order: 2,
          data: {
            heading: 'Technical Expertise',
            skills: [],
            skillCategories: {
              technical: [
                { name: 'JavaScript', level: 90, category: 'technical', icon: 'js' },
                { name: 'React', level: 85, category: 'technical', icon: 'react' },
                { name: 'Node.js', level: 80, category: 'technical', icon: 'nodejs' },
                { name: 'TypeScript', level: 85, category: 'technical', icon: 'typescript' }
              ],
              tools: [
                { name: 'Git', level: 90, category: 'tool', icon: 'git' },
                { name: 'Docker', level: 75, category: 'tool', icon: 'docker' },
                { name: 'AWS', level: 70, category: 'tool', icon: 'aws' }
              ],
              languages: [
                { name: 'English', level: 100, category: 'language', icon: 'language' },
                { name: 'Spanish', level: 80, category: 'language', icon: 'language' }
              ],
              soft: [
                { name: 'Leadership', level: 85, category: 'soft', icon: 'leadership' },
                { name: 'Communication', level: 90, category: 'soft', icon: 'communication' },
                { name: 'Problem Solving', level: 95, category: 'soft', icon: 'problem-solving' }
              ]
            }
          },
          styling: {
            backgroundColor: 'transparent',
            textColor: 'inherit',
            alignment: 'center',
            layout: 'grid',
            padding: {
              top: '4rem',
              bottom: '4rem',
              left: '2rem',
              right: '2rem'
            },
            margin: {
              top: '0',
              bottom: '0'
            },
            animation: {
              type: 'fade',
              delay: 600,
              duration: 600
            }
          }
        },
        {
          id: `${baseId}-projects`,
          type: 'projects',
          title: 'Featured Projects',
          enabled: true,
          order: 3,
          data: {
            heading: 'Featured Projects',
            projects: [],
            categories: ['Web Development', 'Mobile Apps', 'API Development', 'DevOps']
          },
          styling: {
            backgroundColor: 'transparent',
            textColor: 'inherit',
            alignment: 'left',
            layout: 'grid',
            padding: {
              top: '4rem',
              bottom: '4rem',
              left: '2rem',
              right: '2rem'
            },
            margin: {
              top: '0',
              bottom: '0'
            },
            animation: {
              type: 'slide',
              delay: 800,
              duration: 600
            }
          }
        }
      ];
    
    case 'creative':
      return [
        {
          id: `${baseId}-skills`,
          type: 'skills',
          title: 'Creative Skills',
          enabled: true,
          order: 2,
          data: {
            heading: 'Creative Expertise',
            skills: [],
            skillCategories: {
              technical: [
                { name: 'Adobe Photoshop', level: 95, category: 'technical', icon: 'photoshop' },
                { name: 'Adobe Illustrator', level: 90, category: 'technical', icon: 'illustrator' },
                { name: 'Figma', level: 85, category: 'technical', icon: 'figma' },
                { name: 'Adobe After Effects', level: 80, category: 'technical', icon: 'after-effects' }
              ],
              tools: [
                { name: 'Sketch', level: 85, category: 'tool', icon: 'sketch' },
                { name: 'InVision', level: 75, category: 'tool', icon: 'invision' },
                { name: 'Principle', level: 70, category: 'tool', icon: 'principle' }
              ],
              languages: [
                { name: 'English', level: 100, category: 'language', icon: 'language' },
                { name: 'French', level: 75, category: 'language', icon: 'language' }
              ],
              soft: [
                { name: 'Creativity', level: 95, category: 'soft', icon: 'creativity' },
                { name: 'Visual Communication', level: 90, category: 'soft', icon: 'visual-communication' },
                { name: 'Brand Strategy', level: 85, category: 'soft', icon: 'brand-strategy' }
              ]
            }
          },
          styling: {
            backgroundColor: 'transparent',
            textColor: 'inherit',
            alignment: 'center',
            layout: 'masonry',
            padding: {
              top: '4rem',
              bottom: '4rem',
              left: '2rem',
              right: '2rem'
            },
            margin: {
              top: '0',
              bottom: '0'
            },
            animation: {
              type: 'zoom',
              delay: 600,
              duration: 600
            }
          }
        }
      ];
    
    default:
      return [
        {
          id: `${baseId}-skills`,
          type: 'skills',
          title: 'Skills',
          enabled: true,
          order: 2,
          data: {
            heading: 'Skills & Expertise',
            skills: [],
            skillCategories: {
              technical: [],
              soft: [],
              languages: [],
              tools: []
            }
          },
          styling: {
            backgroundColor: 'transparent',
            textColor: 'inherit',
            alignment: 'center',
            layout: 'grid',
            padding: {
              top: '4rem',
              bottom: '4rem',
              left: '2rem',
              right: '2rem'
            },
            margin: {
              top: '0',
              bottom: '0'
            },
            animation: {
              type: 'fade',
              delay: 600,
              duration: 600
            }
          }
        }
      ];
  }
};

// ===============================
// ENHANCED PORTFOLIO TEMPLATES
// ===============================

export const enhancedPortfolioTemplates: PortfolioTemplate[] = [
  {
    id: 'dark-professional',
    name: 'Dark Professional',
    description: 'Sleek dark theme perfect for developers and tech professionals who prefer dark interfaces',
    category: 'developer',
    thumbnail: '/templates/dark-professional-thumb.jpg',
    previewImages: [
      '/templates/dark-professional-1.jpg',
      '/templates/dark-professional-2.jpg',
      '/templates/dark-professional-3.jpg'
    ],
    tags: ['dark', 'professional', 'modern', 'tech', 'sleek'],
    sections: createEnhancedSections('dark-professional', 'tech'),
    colorScheme: enhancedColorSchemes.darkProfessional,
    typography: enhancedTypographyConfigs.darkProfessional,
    layout: enhancedLayoutConfigs.darkProfessional,
    features: [
      'Dark theme design',
      'Professional layout',
      'Glowing accents',
      'Code-friendly aesthetics',
      'High contrast readability'
    ],
    difficulty: 'intermediate',
    estimatedTime: '35 minutes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPopular: true,
    isPremium: false
  },

  {
    id: 'elegant-monochrome',
    name: 'Elegant Monochrome',
    description: 'Sophisticated monochrome design perfect for business professionals and consultants',
    category: 'business',
    thumbnail: '/templates/elegant-monochrome-thumb.jpg',
    previewImages: [
      '/templates/elegant-monochrome-1.jpg',
      '/templates/elegant-monochrome-2.jpg',
      '/templates/elegant-monochrome-3.jpg'
    ],
    tags: ['elegant', 'monochrome', 'business', 'sophisticated', 'minimal'],
    sections: createEnhancedSections('elegant-monochrome', 'business'),
    colorScheme: enhancedColorSchemes.elegantMono,
    typography: enhancedTypographyConfigs.elegantMono,
    layout: enhancedLayoutConfigs.elegantMono,
    features: [
      'Timeless monochrome design',
      'Professional typography',
      'Business-focused sections',
      'Elegant animations',
      'Corporate-ready'
    ],
    difficulty: 'beginner',
    estimatedTime: '30 minutes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPopular: false,
    isPremium: false
  },

  {
    id: 'warm-minimalist',
    name: 'Warm Minimalist',
    description: 'Warm, approachable minimalist design perfect for freelancers and consultants',
    category: 'freelancer',
    thumbnail: '/templates/warm-minimalist-thumb.jpg',
    previewImages: [
      '/templates/warm-minimalist-1.jpg',
      '/templates/warm-minimalist-2.jpg',
      '/templates/warm-minimalist-3.jpg'
    ],
    tags: ['minimal', 'warm', 'friendly', 'approachable', 'freelancer'],
    sections: createEnhancedSections('warm-minimalist', 'freelancer'),
    colorScheme: enhancedColorSchemes.warmMinimalist,
    typography: enhancedTypographyConfigs.warmMinimalist,
    layout: enhancedLayoutConfigs.warmMinimalist,
    features: [
      'Warm color palette',
      'Minimalist design',
      'Friendly typography',
      'Personal branding focus',
      'Client testimonials ready'
    ],
    difficulty: 'beginner',
    estimatedTime: '20 minutes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPopular: true,
    isPremium: false
  }
];

export default enhancedPortfolioTemplates;