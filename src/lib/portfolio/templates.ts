import { PortfolioTemplate, ColorScheme, Typography, LayoutConfig, PortfolioSection } from '@/types/portfolio';

// ===============================
// COLOR SCHEMES
// ===============================

export const colorSchemes: Record<string, ColorScheme> = {
  modern: {
    primary: '#3B82F6', // Blue
    secondary: '#6366F1', // Indigo  
    accent: '#F59E0B', // Amber
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      muted: '#9CA3AF'
    },
    border: '#E5E7EB'
  },
  classic: {
    primary: '#1F2937', // Dark Gray
    secondary: '#374151',
    accent: '#DC2626', // Red
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      muted: '#6B7280'
    },
    border: '#D1D5DB'
  },
  creative: {
    primary: '#8B5CF6', // Purple
    secondary: '#EC4899', // Pink
    accent: '#06D6A0', // Teal
    background: '#0F0F0F',
    surface: '#1A1A1A',
    text: {
      primary: '#FFFFFF',
      secondary: '#D1D5DB',
      muted: '#9CA3AF'
    },
    border: '#374151'
  },
  developer: {
    primary: '#10B981', // Emerald
    secondary: '#059669',
    accent: '#F59E0B', // Amber
    background: '#0D1117',
    surface: '#161B22',
    text: {
      primary: '#F0F6FC',
      secondary: '#8B949E',
      muted: '#6E7681'
    },
    border: '#30363D'
  },
  designer: {
    primary: '#EF4444', // Red
    secondary: '#F97316', // Orange
    accent: '#8B5CF6', // Purple
    background: '#FEFEFE',
    surface: '#FAFAFA',
    text: {
      primary: '#18181B',
      secondary: '#52525B',
      muted: '#71717A'
    },
    border: '#E4E4E7'
  }
};

// ===============================
// TYPOGRAPHY CONFIGS
// ===============================

export const typographyConfigs: Record<string, Typography> = {
  modern: {
    fontFamily: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
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
  classic: {
    fontFamily: {
      heading: 'Playfair Display, serif',
      body: 'Source Sans Pro, sans-serif',
      mono: 'Source Code Pro, monospace'
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
      tight: 1.2,
      normal: 1.6,
      relaxed: 1.8
    }
  },
  creative: {
    fontFamily: {
      heading: 'Poppins, sans-serif',
      body: 'Open Sans, sans-serif',
      mono: 'Fira Code, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: 300,
      medium: 400,
      semibold: 600,
      bold: 800
    },
    lineHeight: {
      tight: 1.3,
      normal: 1.5,
      relaxed: 1.7
    }
  },
  developer: {
    fontFamily: {
      heading: 'JetBrains Mono, monospace',
      body: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
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
  designer: {
    fontFamily: {
      heading: 'Montserrat, sans-serif',
      body: 'Lato, sans-serif',
      mono: 'Roboto Mono, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8
    }
  }
};

// ===============================
// LAYOUT CONFIGS
// ===============================

export const layoutConfigs: Record<string, LayoutConfig> = {
  modern: {
    maxWidth: '1200px',
    spacing: {
      section: '4rem',
      element: '1.5rem'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
    }
  },
  classic: {
    maxWidth: '1100px',
    spacing: {
      section: '5rem',
      element: '2rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    shadows: {
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    }
  },
  creative: {
    maxWidth: '1300px',
    spacing: {
      section: '3rem',
      element: '1rem'
    },
    borderRadius: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    shadows: {
      sm: '0 0 10px rgb(139 92 246 / 0.3)',
      md: '0 0 20px rgb(139 92 246 / 0.2)',
      lg: '0 0 30px rgb(139 92 246 / 0.4)'
    }
  },
  developer: {
    maxWidth: '1000px',
    spacing: {
      section: '3.5rem',
      element: '1.25rem'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(16 185 129 / 0.1)',
      md: '0 4px 6px -1px rgb(16 185 129 / 0.1)',
      lg: '0 10px 15px -3px rgb(16 185 129 / 0.2)'
    }
  },
  designer: {
    maxWidth: '1200px',
    spacing: {
      section: '4.5rem',
      element: '1.75rem'
    },
    borderRadius: {
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem'
    },
    shadows: {
      sm: '0 2px 4px 0 rgb(0 0 0 / 0.06)',
      md: '0 8px 25px -5px rgb(0 0 0 / 0.1)',
      lg: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
    }
  }
};

// ===============================
// DEFAULT SECTION TEMPLATES
// ===============================

const createDefaultSections = (templateId: string): PortfolioSection[] => {
  const baseId = templateId;
  
  return [
    {
      id: `${baseId}-hero`,
      type: 'hero',
      title: 'Hero Section',
      enabled: true,
      order: 0,
      data: {
        fullName: 'Your Name',
        title: 'Your Professional Title',
        subtitle: 'Passionate about creating amazing experiences',
        bio: 'Brief introduction about yourself and what you do.',
        profileImage: '',
        backgroundImage: '',
        socialLinks: [
          { platform: 'linkedin', url: '', username: '' },
          { platform: 'github', url: '', username: '' },
          { platform: 'twitter', url: '', username: '' }
        ],
        contactEmail: '',
        location: ''
      },
      styling: {
        backgroundColor: '',
        textColor: '',
        alignment: 'center',
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
          type: 'fade',
          delay: 0,
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
        content: 'Tell your story here. Share your background, experience, and what drives you.',
        profileImage: '',
        highlights: [
          'Key achievement or skill',
          'Another important highlight',
          'What makes you unique'
        ],
        personalInfo: {
          location: '',
          languages: ['English'],
          interests: []
        }
      },
      styling: {
        alignment: 'left',
        layout: 'default',
        padding: {
          top: '3rem',
          bottom: '3rem',
          left: '2rem',
          right: '2rem'
        },
        margin: {
          top: '0',
          bottom: '0'
        },
        animation: {
          type: 'slide',
          delay: 200,
          duration: 600
        }
      }
    },
    {
      id: `${baseId}-skills`,
      type: 'skills',
      title: 'Skills Section',
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
        alignment: 'center',
        layout: 'grid',
        padding: {
          top: '3rem',
          bottom: '3rem',
          left: '2rem',
          right: '2rem'
        },
        margin: {
          top: '0',
          bottom: '0'
        },
        animation: {
          type: 'fade',
          delay: 400,
          duration: 600
        }
      }
    },
    {
      id: `${baseId}-projects`,
      type: 'projects',
      title: 'Projects Section',
      enabled: true,
      order: 3,
      data: {
        heading: 'Featured Projects',
        projects: [],
        categories: ['Web Development', 'Mobile App', 'Design', 'Other']
      },
      styling: {
        alignment: 'left',
        layout: 'grid',
        padding: {
          top: '3rem',
          bottom: '3rem',
          left: '2rem',
          right: '2rem'
        },
        margin: {
          top: '0',
          bottom: '0'
        },
        animation: {
          type: 'slide',
          delay: 600,
          duration: 600
        }
      }
    },
    {
      id: `${baseId}-contact`,
      type: 'contact',
      title: 'Contact Section',
      enabled: true,
      order: 4,
      data: {
        heading: 'Get In Touch',
        email: '',
        phone: '',
        location: '',
        availability: 'Available for new opportunities',
        socialLinks: [
          { platform: 'email', url: '' }
        ],
        contactForm: {
          enabled: true,
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'Your name' },
            { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'your@email.com' },
            { name: 'message', type: 'textarea', label: 'Message', required: true, placeholder: 'Your message...' }
          ]
        }
      },
      styling: {
        alignment: 'center',
        layout: 'default',
        padding: {
          top: '3rem',
          bottom: '3rem',
          left: '2rem',
          right: '2rem'
        },
        margin: {
          top: '0',
          bottom: '0'
        },
        animation: {
          type: 'fade',
          delay: 800,
          duration: 600
        }
      }
    }
  ];
};

// ===============================
// PORTFOLIO TEMPLATES
// ===============================

export const portfolioTemplates: PortfolioTemplate[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for professionals and consultants',
    category: 'modern',
    thumbnail: '/templates/modern-professional-thumb.jpg',
    previewImages: [
      '/templates/modern-professional-1.jpg',
      '/templates/modern-professional-2.jpg',
      '/templates/modern-professional-3.jpg'
    ],
    tags: ['professional', 'clean', 'corporate', 'minimal'],
    sections: createDefaultSections('modern-professional'),
    colorScheme: colorSchemes.modern,
    typography: typographyConfigs.modern,
    layout: layoutConfigs.modern,
    features: [
      'Responsive design',
      'Contact form integration', 
      'Social media links',
      'Project showcase',
      'Skills visualization'
    ],
    difficulty: 'beginner',
    estimatedTime: '30 minutes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPopular: true,
    isPremium: false
  },
  {
    id: 'classic-elegant', 
    name: 'Classic Elegant',
    description: 'Timeless design with elegant typography and traditional layouts',
    category: 'classic',
    thumbnail: '/templates/classic-elegant-thumb.jpg',
    previewImages: [
      '/templates/classic-elegant-1.jpg',
      '/templates/classic-elegant-2.jpg',
      '/templates/classic-elegant-3.jpg'
    ],
    tags: ['elegant', 'traditional', 'timeless', 'serif'],
    sections: createDefaultSections('classic-elegant'),
    colorScheme: colorSchemes.classic,
    typography: typographyConfigs.classic,
    layout: layoutConfigs.classic,
    features: [
      'Classic typography',
      'Elegant layouts',
      'Professional styling',
      'Timeline view',
      'PDF export ready'
    ],
    difficulty: 'beginner',
    estimatedTime: '25 minutes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPopular: false,
    isPremium: false
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Bold, creative design for artists, designers, and creative professionals',
    category: 'creative',
    thumbnail: '/templates/creative-bold-thumb.jpg',
    previewImages: [
      '/templates/creative-bold-1.jpg',
      '/templates/creative-bold-2.jpg',
      '/templates/creative-bold-3.jpg'
    ],
    tags: ['creative', 'bold', 'artistic', 'colorful', 'unique'],
    sections: createDefaultSections('creative-bold'),
    colorScheme: colorSchemes.creative,
    typography: typographyConfigs.creative,
    layout: layoutConfigs.creative,
    features: [
      'Bold color schemes',
      'Creative animations',
      'Masonry layouts',
      'Interactive elements',
      'Custom shapes'
    ],
    difficulty: 'intermediate',
    estimatedTime: '45 minutes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPopular: true,
    isPremium: true
  },
  {
    id: 'developer-terminal',
    name: 'Developer Terminal',
    description: 'Perfect for developers with terminal-inspired design and code highlighting',
    category: 'developer', 
    thumbnail: '/templates/developer-terminal-thumb.jpg',
    previewImages: [
      '/templates/developer-terminal-1.jpg',
      '/templates/developer-terminal-2.jpg',
      '/templates/developer-terminal-3.jpg'
    ],
    tags: ['developer', 'terminal', 'code', 'dark', 'tech'],
    sections: createDefaultSections('developer-terminal'),
    colorScheme: colorSchemes.developer,
    typography: typographyConfigs.developer,
    layout: layoutConfigs.developer,
    features: [
      'Code syntax highlighting',
      'Terminal aesthetics',
      'GitHub integration',
      'Tech stack showcase',
      'Commit history display'
    ],
    difficulty: 'intermediate',
    estimatedTime: '40 minutes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPopular: true,
    isPremium: false
  },
  {
    id: 'designer-portfolio',
    name: 'Designer Showcase',
    description: 'Beautiful portfolio template designed specifically for designers and creatives',
    category: 'designer',
    thumbnail: '/templates/designer-portfolio-thumb.jpg',
    previewImages: [
      '/templates/designer-portfolio-1.jpg',
      '/templates/designer-portfolio-2.jpg',
      '/templates/designer-portfolio-3.jpg'
    ],
    tags: ['designer', 'portfolio', 'visual', 'showcase', 'modern'],
    sections: createDefaultSections('designer-portfolio'),
    colorScheme: colorSchemes.designer,
    typography: typographyConfigs.designer,
    layout: layoutConfigs.designer,
    features: [
      'Visual project showcase',
      'Image galleries',
      'Design process display',
      'Client testimonials',
      'Brand color integration'
    ],
    difficulty: 'advanced',
    estimatedTime: '60 minutes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPopular: false,
    isPremium: true
  }
];

export default portfolioTemplates;