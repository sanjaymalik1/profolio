// ===============================
// PORTFOLIO SECTION DATA TYPES
// ===============================

export interface HeroData {
  fullName: string;
  title: string;
  subtitle?: string;
  bio: string;
  profileImage?: string;
  backgroundImage?: string;
  socialLinks: SocialLink[];
  contactEmail?: string;
  location?: string;
}

export interface AboutData {
  heading: string;
  content: string;
  profileImage?: string;
  highlights: string[];
  quote?: string;
  personalInfo?: {
    age?: number;
    location?: string;
    languages: string[];
    interests: string[];
  };
}

export interface Skill {
  name: string;
  level: number; // 1-100
  category: 'technical' | 'soft' | 'language' | 'tool';
  icon?: string;
}

export interface SkillsData {
  heading: string;
  skills: Skill[];
  skillCategories: {
    technical: Skill[];
    soft: Skill[];
    languages: Skill[];
    tools: Skill[];
  };
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string; // null if current
  description: string;
  responsibilities: string[];
  technologies?: string[];
  achievements?: string[];
  location?: string;
  companyLogo?: string;
}

export interface ExperienceData {
  heading: string;
  experiences: Experience[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  images: string[];
  links: {
    live?: string;
    github?: string;
    demo?: string;
    documentation?: string;
  };
  featured: boolean;
  category: string;
  startDate?: string;
  endDate?: string;
  status: 'completed' | 'in-progress' | 'planned';
  teamSize?: number;
  role?: string;
}

export interface ProjectsData {
  heading: string;
  projects: Project[];
  categories: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  honors?: string[];
  coursework?: string[];
  activities?: string[];
  location?: string;
  logo?: string;
}

export interface EducationData {
  heading: string;
  education: Education[];
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'dribbble' | 'behance' | 'website' | 'email' | 'youtube' | 'medium';
  url: string;
  username?: string;
}

export interface ContactData {
  heading: string;
  email: string;
  phone?: string;
  location: string;
  availability: string;
  socialLinks: SocialLink[];
  contactForm: {
    enabled: boolean;
    fields: ContactFormField[];
  };
}

export interface ContactFormField {
  name: string;
  type: 'text' | 'email' | 'textarea' | 'select';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select fields
}

// ===============================
// STYLING AND THEMING TYPES
// ===============================

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
}

export interface Typography {
  fontFamily: {
    heading: string;
    body: string;
    mono?: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface LayoutConfig {
  maxWidth: string;
  spacing: {
    section: string;
    element: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

// ===============================
// PORTFOLIO SECTION TYPES
// ===============================

export interface PortfolioSection {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  order: number;
  data: SectionData;
  styling: SectionStyling;
}

export type SectionType = 
  | 'hero' 
  | 'about' 
  | 'skills' 
  | 'experience' 
  | 'projects' 
  | 'education' 
  | 'contact' 
  | 'testimonials'
  | 'certifications'
  | 'custom';

export type SectionData = 
  | HeroData 
  | AboutData 
  | SkillsData 
  | ExperienceData 
  | ProjectsData 
  | EducationData 
  | ContactData
  | Record<string, any>; // for custom sections

export interface SectionStyling {
  backgroundColor?: string;
  textColor?: string;
  padding?: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  margin?: {
    top: string;
    bottom: string;
  };
  alignment: 'left' | 'center' | 'right';
  layout: 'default' | 'grid' | 'masonry' | 'timeline';
  animation?: {
    type: 'fade' | 'slide' | 'zoom' | 'none';
    delay: number;
    duration: number;
  };
}

// ===============================
// TEMPLATE TYPES
// ===============================

export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string;
  previewImages: string[];
  tags: string[];
  sections: PortfolioSection[];
  colorScheme: ColorScheme;
  typography: Typography;
  layout: LayoutConfig;
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string; // e.g., "30 minutes"
  createdAt: string;
  updatedAt: string;
  isPopular: boolean;
  isPremium: boolean;
}

export type TemplateCategory = 
  | 'modern' 
  | 'classic' 
  | 'creative' 
  | 'developer' 
  | 'designer' 
  | 'business'
  | 'academic'
  | 'freelancer';

// ===============================
// PORTFOLIO TYPES
// ===============================

export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  slug: string;
  templateId: string;
  sections: PortfolioSection[];
  customizations: PortfolioCustomizations;
  settings: PortfolioSettings;
  metadata: PortfolioMetadata;
  isPublic: boolean;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioCustomizations {
  colorScheme: Partial<ColorScheme>;
  typography: Partial<Typography>;
  layout: Partial<LayoutConfig>;
  customCSS?: string;
}

export interface PortfolioSettings {
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  analytics: {
    googleAnalytics?: string;
    trackingEnabled: boolean;
  };
  domain: {
    customDomain?: string;
    subdomain: string; // e.g., "johndoe.profolio.com"
  };
  privacy: {
    passwordProtected: boolean;
    password?: string;
    allowDownload: boolean;
    allowComments: boolean;
  };
}

export interface PortfolioMetadata {
  views: number;
  lastViewed?: string;
  version: number;
  backups: PortfolioBackup[];
}

export interface PortfolioBackup {
  id: string;
  createdAt: string;
  description: string;
  data: Omit<Portfolio, 'metadata'>;
}

// ===============================
// EDITOR TYPES
// ===============================

export interface EditorState {
  selectedSection?: string;
  draggedSection?: string;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  showGrid: boolean;
  zoom: number;
  history: HistoryState[];
  historyIndex: number;
}

export interface HistoryState {
  id: string;
  timestamp: string;
  action: string;
  portfolio: Portfolio;
}

// ===============================
// API TYPES
// ===============================

export interface CreatePortfolioRequest {
  title: string;
  templateId: string;
  initialData?: Partial<PortfolioSection[]>;
}

export interface UpdatePortfolioRequest {
  title?: string;
  sections?: PortfolioSection[];
  customizations?: Partial<PortfolioCustomizations>;
  settings?: Partial<PortfolioSettings>;
  isPublic?: boolean;
}

export interface PortfolioResponse {
  portfolio: Portfolio;
  template: PortfolioTemplate;
  isOwner: boolean;
}

// Legacy types for backward compatibility
export interface ComponentData {
  about?: AboutData;
  skills?: SkillsData;
  projects?: ProjectsData;
  contact?: ContactData;
}

export type ComponentType = SectionType;
