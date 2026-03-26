"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import {
  EditorState,
  EditorAction,
  EditorSection,
  DraggableSectionType
} from '@/types/editor';
import {
  HeroData,
  AboutData,
  SkillsData,
  ProjectsData,
  ContactData,
  ExperienceData,
  EducationData,
  NavbarData,
  FooterData,
  SectionStyling,
  SectionData
} from '@/types/portfolio';

// Initial editor state
const initialState: EditorState = {
  templateId: null,
  sections: [],
  selectedSectionId: null,
  isDragging: false,
  isPreviewMode: false,
  previewDevice: 'desktop',
  hasUnsavedChanges: false,
  portfolioTitle: 'Untitled Portfolio',
};

// Default section data generators
const createDefaultSectionData = (type: DraggableSectionType): SectionData => {

  switch (type) {
    case 'hero':
      return {
        fullName: 'Your Name',
        title: 'Your Title',
        bio: 'Brief description about yourself and what you do.',
        profileImage: '',
        location: '',
        socialLinks: []
      } as HeroData;

    case 'about':
      return {
        heading: 'About Me',
        content: 'Tell your story here. Share your background, experience, and what drives you.',
        profileImage: '',
        highlights: ['Add your key highlights here'],
        quote: 'The best way to predict the future is to create it.',
        personalInfo: {
          location: 'Your Location',
          languages: ['English'],
          interests: ['Your interests']
        }
      } as AboutData;

    case 'skills':
      return {
        heading: 'Skills & Expertise',
        skills: [],
        skillCategories: {
          technical: [],
          soft: [],
          languages: [],
          tools: []
        }
      } as SkillsData;

    case 'projects':
      return {
        heading: 'Featured Projects',
        projects: [],
        categories: []
      } as ProjectsData;

    case 'contact':
      return {
        heading: 'Get In Touch',
        email: 'your.email@example.com',
        location: 'Your Location',
        availability: 'Available for work',
        socialLinks: [],
        contactForm: { enabled: false, fields: [] }
      } as ContactData;

    case 'experience':
      return {
        heading: 'Work Experience',
        experiences: [
          {
            id: `exp_${Date.now()}`,
            company: 'Your Company',
            position: 'Your Role',
            startDate: 'Jan 2022',
            description: 'Describe your responsibilities and key contributions in this role.',
            responsibilities: [
              'Led cross-functional team projects',
              'Improved system performance by 40%',
            ],
            technologies: ['React', 'TypeScript', 'Node.js'],
            location: 'Remote',
          },
        ],
      } as ExperienceData;

    case 'education':
      return {
        heading: 'Education',
        education: [
          {
            id: `edu_${Date.now()}`,
            institution: 'Your University',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2018',
            endDate: '2022',
            honors: ["Dean's List"],
            coursework: ['Data Structures', 'Algorithms', 'Machine Learning'],
            location: 'Your City',
          },
        ],
      } as EducationData;

    case 'navbar':
      return {
        name: 'Your Name',
        logo: '',
        autoGenerateLinks: true,
        links: [
          { label: 'About', href: '#about' },
          { label: 'Experience', href: '#experience' },
          { label: 'Projects', href: '#projects' },
          { label: 'Skills', href: '#skills' },
        ],
        cta: {
          label: 'Hire me',
          href: '#contact'
        }
      } as NavbarData;

    case 'footer':
      return {
        name: 'Your Name',
        copyrightText: '',
        links: [
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' }
        ]
      } as FooterData;

    default:
      return {};
  }
};


// Utility function to ensure proper section ordering (navbar first, footer last)
const ensureSectionOrder = (sections: EditorSection[]): EditorSection[] => {
  const navbar = sections.find(s => s.type === 'navbar');
  const footer = sections.find(s => s.type === 'footer');
  const otherSections = sections.filter(s => s.type !== 'navbar' && s.type !== 'footer');

  const orderedSections: EditorSection[] = [];

  if (navbar) orderedSections.push(navbar);
  orderedSections.push(...otherSections);
  if (footer) orderedSections.push(footer);

  // Update order property
  return orderedSections.map((section, index) => ({
    ...section,
    order: index
  }));
};

// Default styling for structural sections (navbar/footer)
const structuralSectionStyling = {
  backgroundColor: 'transparent',
  textColor: 'inherit',
  padding: { top: '0', right: '0', bottom: '0', left: '0' },
  margin: { top: '0', bottom: '0' },
  alignment: 'left' as const,
  layout: 'default' as const,
  animation: { type: 'slide' as const, duration: 600, delay: 200 }
};

// Create a navbar section
const createNavbarSection = (): EditorSection => ({
  id: `navbar-${Date.now()}`,
  type: 'navbar',
  data: createDefaultSectionData('navbar'),
  styling: structuralSectionStyling,
  isEditable: true,
  order: 0
} as EditorSection);

// Create a footer section
const createFooterSection = (order: number): EditorSection => ({
  id: `footer-${Date.now() + 1}`,
  type: 'footer',
  data: createDefaultSectionData('footer'),
  styling: structuralSectionStyling,
  isEditable: true,
  order
} as EditorSection);

/**
 * Automatically calculates navbar links based on the current sections 
 * if autoGenerateLinks is enabled OR links is empty.
 */
const updateNavbarLinks = (sections: EditorSection[]): EditorSection[] => {
  const navbarIndex = sections.findIndex(s => s.type === 'navbar');
  if (navbarIndex === -1) return sections;

  const navbar = sections[navbarIndex];
  const navData = navbar.data as NavbarData;
  const isAutoMode = navData.autoGenerateLinks === true || 
    (navData.autoGenerateLinks === undefined && (!navData.links || navData.links.length === 0));

  if (!isAutoMode) return sections;

  const linkMapping: Record<string, string> = {
    about: 'About',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
  };

  const NAVBAR_SECTIONS = ['about', 'projects', 'experience', 'skills'];

  // Get unique section types to prevent duplicate links
  const uniqueSectionTypes = new Set<string>();
  const autoLinks: { label: string; href: string }[] = [];

  // Important: Custom logic to enforce strict ordering specifically for the navbar
  const orderedSections = [...sections].sort((a, b) => {
    const aIndex = NAVBAR_SECTIONS.indexOf(a.type);
    const bIndex = NAVBAR_SECTIONS.indexOf(b.type);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  orderedSections
    .filter(s => NAVBAR_SECTIONS.includes(s.type))
    .forEach(s => {
      if (!uniqueSectionTypes.has(s.type)) {
        uniqueSectionTypes.add(s.type);
        autoLinks.push({
          label: linkMapping[s.type] || s.type.charAt(0).toUpperCase() + s.type.slice(1),
          href: `#${s.type}`
        });
      }
    });

  const newSections = [...sections];
  newSections[navbarIndex] = {
    ...navbar,
    data: {
      ...navData,
      links: autoLinks
    }
  } as EditorSection;

  return newSections;
};

/**
 * Ensures navbar and footer exist and are properly ordered.
 * - Adds navbar at start if missing
 * - Adds footer at end if missing
 * - Orders: navbar → other sections → footer
 */
const ensureStructure = (sections: EditorSection[]): EditorSection[] => {
  let result = [...sections];

  // Add navbar if missing
  const hasNavbar = result.some(s => s.type === 'navbar');
  if (!hasNavbar) {
    result.unshift(createNavbarSection());
  }

  // Add footer if missing
  const hasFooter = result.some(s => s.type === 'footer');
  if (!hasFooter) {
    result.push(createFooterSection(result.length));
  }

  // Ensure proper ordering (navbar first, footer last)
  result = ensureSectionOrder(result);
  
  // Update navbar links if auto mode is enabled
  return updateNavbarLinks(result);
};

// Reducer function
const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'ADD_SECTION': {
      const { sectionType, index } = action.payload;

      // Prevent duplicate sections for section types we only want one of
      const singleInstanceTypes = ['hero', 'about', 'skills', 'projects', 'contact', 'navbar', 'footer', 'experience', 'education'];
      if (singleInstanceTypes.includes(sectionType) && state.sections.some(s => s.type === sectionType)) {
        // Return without adding if it already exists
        return state;
      }

      // Prevent duplicate navbar or footer (backup check)
      if (sectionType === 'navbar' && state.sections.some(s => s.type === 'navbar')) {
        return state; // Already exists, do nothing
      }
      if (sectionType === 'footer' && state.sections.some(s => s.type === 'footer')) {
        return state; // Already exists, do nothing
      }

      const newSection = {
        id: `${sectionType}-${Date.now()}`,
        type: sectionType,
        data: structuredClone(createDefaultSectionData(sectionType)),
        styling: {
          backgroundColor: 'transparent',
          textColor: 'inherit',
          padding: { top: '3rem', right: '2rem', bottom: '3rem', left: '2rem' },
          margin: { top: '0', bottom: '2rem' },
          alignment: 'left',
          layout: 'default',
          animation: { type: 'slide', duration: 600, delay: 200 }
        },
        isEditable: true,
        order: index !== undefined ? index : state.sections.length
      } as EditorSection;

      let newSections = [...state.sections];
      if (index !== undefined) {
        // Insert at specific index
        newSections.splice(index, 0, newSection);
      } else {
        // Add to end
        newSections.push(newSection);
      }

      // Ensure structure (navbar first, footer last) and add if missing
      newSections = ensureStructure(newSections);

      return {
        ...state,
        sections: newSections,
        selectedSectionId: newSection.id,
        hasUnsavedChanges: true,
      };
    }

    case 'REMOVE_SECTION': {
      const { sectionId } = action.payload;
      const sectionToRemove = state.sections.find(s => s.id === sectionId);

      // Prevent deletion of navbar and footer
      if (sectionToRemove && (sectionToRemove.type === 'navbar' || sectionToRemove.type === 'footer')) {
        return state; // Cannot delete navbar or footer
      }

      let newSections = state.sections
        .filter(section => section.id !== sectionId)
        .map((section, index) => ({ ...section, order: index }));

      // Update navbar links if a section was removed
      newSections = updateNavbarLinks(newSections);

      return {
        ...state,
        sections: newSections,
        selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
        hasUnsavedChanges: true,
      };
    }

    case 'MOVE_SECTION': {
      const { sectionId, newIndex } = action.payload;
      const sectionIndex = state.sections.findIndex(s => s.id === sectionId);
      if (sectionIndex === -1) return state;

      const section = state.sections[sectionIndex];

      // Prevent moving navbar or footer
      if (section.type === 'navbar' || section.type === 'footer') {
        return state; // Navbar and footer cannot be moved
      }

      const newSections = [...state.sections];
      const [movedSection] = newSections.splice(sectionIndex, 1);
      newSections.splice(newIndex, 0, movedSection);

      // Ensure structure (navbar first, footer last)
      const orderedSections = ensureStructure(newSections);

      return {
        ...state,
        sections: orderedSections,
        hasUnsavedChanges: true,
      };
    }

    case 'UPDATE_SECTION_DATA': {
      const { sectionId, data } = action.payload;
      let newSections = state.sections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            data: structuredClone({ ...section.data, ...data })
          }
          : section
      ) as EditorSection[];

      newSections = updateNavbarLinks(newSections);

      return {
        ...state,
        sections: newSections,
        hasUnsavedChanges: true,
      };
    }

    case 'UPDATE_SECTION_STYLING': {
      const { sectionId, styling } = action.payload;
      const newSections = state.sections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            styling: structuredClone({ ...section.styling, ...styling })
          }
          : section
      ) as EditorSection[];

      return {
        ...state,
        sections: newSections,
        hasUnsavedChanges: true,
      };
    }

    case 'SELECT_SECTION': {
      return {
        ...state,
        selectedSectionId: action.payload.sectionId
      };
    }

    case 'SET_DRAGGING': {
      return {
        ...state,
        isDragging: action.payload.isDragging
      };
    }

    case 'SET_PREVIEW_MODE': {
      return {
        ...state,
        isPreviewMode: action.payload.isPreviewMode
      };
    }

    case 'SET_PREVIEW_DEVICE': {
      return {
        ...state,
        previewDevice: action.payload.device
      };
    }

    case 'SET_UNSAVED_CHANGES': {
      return {
        ...state,
        hasUnsavedChanges: action.payload.hasUnsavedChanges
      };
    }

    case 'LOAD_SECTIONS': {
      const sections = structuredClone(action.payload.sections);

      // Ensure navbar and footer exist and are properly ordered
      const structuredSections = ensureStructure(sections);

      return {
        ...state,
        sections: structuredSections,
        templateId: action.payload.templateId !== undefined ? action.payload.templateId : state.templateId,
        hasUnsavedChanges: false,
      };
    }

    case 'LOAD_PORTFOLIO': {
      const sections = structuredClone(action.payload.sections);

      // Ensure navbar and footer exist and are properly ordered
      const structuredSections = ensureStructure(sections);

      return {
        ...state,
        sections: structuredSections,
        portfolioTitle: action.payload.title,
        templateId: action.payload.templateId !== undefined ? action.payload.templateId : state.templateId,
        hasUnsavedChanges: false,
      };
    }

    case 'IMPORT_RESUME_DATA': {
      const { data } = action.payload;
      const newSections = [...state.sections];

      // Check if the user is using a global 'template' section (like DeveloperTemplate) instead of individual sections
      const templateSectionIndex = newSections.findIndex(s => s.type === 'template');

      if (templateSectionIndex >= 0) {
        // --- TEMPLATE MERGE LOGIC ---
        const templateSection = newSections[templateSectionIndex];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentTemplateData = (templateSection.data as any).templateData || {};

        const mergedTemplateData = {
          ...currentTemplateData,
          hero: data.hero ? { ...(currentTemplateData.hero || {}), ...data.hero } : currentTemplateData.hero,
          about: data.about ? { ...(currentTemplateData.about || {}), ...data.about } : currentTemplateData.about,
          experience: data.experience ? { ...(currentTemplateData.experience || {}), ...data.experience } : currentTemplateData.experience,
          education: data.education ? { ...(currentTemplateData.education || {}), ...data.education } : currentTemplateData.education,
          skills: data.skills ? { ...(currentTemplateData.skills || {}), ...data.skills } : currentTemplateData.skills,
          contact: data.contact ? { ...(currentTemplateData.contact || {}), ...data.contact } : currentTemplateData.contact,
          projects: data.projects ? { ...(currentTemplateData.projects || {}), ...data.projects } : currentTemplateData.projects,
        };

        newSections[templateSectionIndex] = {
          ...templateSection,
          data: {
            ...templateSection.data,
            templateData: mergedTemplateData
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any
        };
      } else {
        // --- INDIVIDUAL BUILDER SECTIONS MERGE LOGIC ---
        const mergeOrAddSection = (type: DraggableSectionType, parsedData: unknown) => {
          if (!parsedData || typeof parsedData !== 'object') return;
          const typedData = parsedData as Record<string, unknown>;

          const sectionIndex = newSections.findIndex(s => s.type === type);

          if (sectionIndex >= 0) {
            // Merge data into existing section
            newSections[sectionIndex] = {
              ...newSections[sectionIndex],
              data: {
                ...newSections[sectionIndex].data,
                ...typedData
              }
            } as unknown as EditorSection;
          } else {
            // Create new section
            const newSection = {
              id: `${type}-${Date.now()}`,
              type,
              data: { ...createDefaultSectionData(type), ...typedData },
              styling: {
                backgroundColor: 'transparent',
                textColor: 'inherit',
                padding: { top: '3rem', right: '2rem', bottom: '3rem', left: '2rem' },
                margin: { top: '0', bottom: '2rem' },
                alignment: 'left',
                layout: 'default',
                animation: { type: 'slide', duration: 600, delay: 200 }
              },
              isEditable: true,
              order: newSections.length
            } as unknown as EditorSection;
            newSections.push(newSection);
          }
        };

        mergeOrAddSection('hero', data.hero);
        mergeOrAddSection('about', data.about);
        mergeOrAddSection('experience', data.experience);
        mergeOrAddSection('education', data.education);
        mergeOrAddSection('skills', data.skills);
        mergeOrAddSection('projects', data.projects);
        mergeOrAddSection('contact', data.contact);

        // Re-sort just in case order was messed up
        newSections.forEach((s, idx) => { s.order = idx; });
      }

      return {
        ...state,
        sections: ensureStructure(newSections),
        hasUnsavedChanges: true,
      };
    }

    case 'UPDATE_TITLE': {
      return {
        ...state,
        portfolioTitle: action.payload.title,
        hasUnsavedChanges: true,
      };
    }

    case 'DUPLICATE_SECTION': {
      const { sectionId } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (!section) return state;

      // Prevent duplicating single-instance sections
      const singleInstanceTypes = ['hero', 'about', 'skills', 'projects', 'contact', 'navbar', 'footer', 'experience', 'education'];
      if (singleInstanceTypes.includes(section.type)) {
        return state;
      }

      const sectionIndex = state.sections.findIndex(s => s.id === sectionId);

      // Create duplicated section with new ID but identical data/styling
      const duplicatedSection: EditorSection = {
        ...structuredClone(section),
        id: `${section.type}-${Date.now()}`,
        order: sectionIndex + 1
      };

      // Insert the duplicated section right after the original
      const newSections = [...state.sections];
      newSections.splice(sectionIndex + 1, 0, duplicatedSection);

      // Update order for all sections
      newSections.forEach((s, idx) => {
        s.order = idx;
      });

      return {
        ...state,
        sections: newSections,
        selectedSectionId: duplicatedSection.id,
        hasUnsavedChanges: true,
      };
    }


    case 'RESET_EDITOR': {
      // Reset editor with navbar and footer
      return {
        ...initialState,
        sections: ensureStructure([])
      };
    }

    default:
      return state;
  }
};

// Context
export const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  isLoading: boolean;
} | null>(null);

// Hook to use editor context
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

// Helper hooks for common operations
export const useEditorActions = () => {
  const { dispatch, state } = useEditor();

  const addSection = (sectionType: DraggableSectionType, index?: number) => {
    dispatch({ type: 'ADD_SECTION', payload: { sectionType, index } });
  };

  const removeSection = (sectionId: string) => {
    dispatch({ type: 'REMOVE_SECTION', payload: { sectionId } });
  };

  const moveSection = (sectionId: string, newIndex: number) => {
    dispatch({ type: 'MOVE_SECTION', payload: { sectionId, newIndex } });
  };

  const duplicateSection = (sectionId: string) => {
    // Use proper DUPLICATE_SECTION action that sets hasUnsavedChanges: true
    dispatch({
      type: 'DUPLICATE_SECTION',
      payload: { sectionId }
    });
  };

  const moveSectionUp = (sectionId: string) => {
    const sectionIndex = state.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex > 0) {
      moveSection(sectionId, sectionIndex - 1);
    }
  };

  const moveSectionDown = (sectionId: string) => {
    const sectionIndex = state.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex < state.sections.length - 1) {
      moveSection(sectionId, sectionIndex + 1);
    }
  };

  const updateSectionData = (sectionId: string, data: Record<string, unknown>) => {
    dispatch({ type: 'UPDATE_SECTION_DATA', payload: { sectionId, data } });
  };

  const updateSectionStyling = (sectionId: string, styling: Partial<SectionStyling>) => {
    dispatch({ type: 'UPDATE_SECTION_STYLING', payload: { sectionId, styling } });
  };

  const selectSection = (sectionId: string | null) => {
    dispatch({ type: 'SELECT_SECTION', payload: { sectionId } });
  };

  const setDragging = (isDragging: boolean) => {
    dispatch({ type: 'SET_DRAGGING', payload: { isDragging } });
  };

  const setPreviewMode = (isPreviewMode: boolean) => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: { isPreviewMode } });
  };

  const setPreviewDevice = (device: 'desktop' | 'tablet' | 'mobile') => {
    dispatch({ type: 'SET_PREVIEW_DEVICE', payload: { device } });
  };

  const loadSections = (sections: EditorSection[], templateId?: string | null) => {
    dispatch({ type: 'LOAD_SECTIONS', payload: { sections, templateId } });
  };

  const resetEditor = () => {
    dispatch({ type: 'RESET_EDITOR' });
  };

  const loadPortfolioData = (portfolioData: { sections?: EditorSection[] }) => {
    if (portfolioData && portfolioData.sections) {
      loadSections(structuredClone(portfolioData.sections));
    }
  };

  const setUnsavedChanges = (hasUnsavedChanges: boolean) => {
    dispatch({ type: 'SET_UNSAVED_CHANGES', payload: { hasUnsavedChanges } });
  };

  const updateTitle = (title: string) => {
    dispatch({ type: 'UPDATE_TITLE', payload: { title } });
  };

  const loadPortfolio = (sections: EditorSection[], title: string, templateId?: string) => {
    dispatch({ type: 'LOAD_PORTFOLIO', payload: { sections, title, templateId } });
  };


  return {
    addSection,
    removeSection,
    moveSection,
    duplicateSection,
    moveSectionUp,
    moveSectionDown,
    updateSectionData,
    updateSectionStyling,
    selectSection,
    setDragging,
    setPreviewMode,
    setPreviewDevice,
    loadSections,
    resetEditor,
    loadPortfolioData,
    setUnsavedChanges,
    updateTitle,
    loadPortfolio,
  };
};

// Provider component
interface EditorProviderProps {
  children: ReactNode;
  portfolioId?: string;
  templateId?: string;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children, portfolioId, templateId }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Wait for hydration before accessing localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load portfolio from API based on portfolioId
  useEffect(() => {
    if (!isHydrated) return;

    const loadPortfolio = async () => {
      try {
        setIsLoading(true);

        // If template is specified, apply it
        if (templateId) {
          const { convertTemplateToSections } = await import('@/lib/templateConverter');
          const sections = convertTemplateToSections(templateId);
          dispatch({
            type: 'LOAD_SECTIONS',
            payload: { sections, templateId }
          });
          setIsLoading(false);
          return;
        }

        // If portfolioId exists, load from API
        if (portfolioId) {
          const response = await fetch(`/api/portfolios/${portfolioId}`);
          const result = await response.json();

          if (result.success && result.data.content?.sections) {
            let sections = result.data.content.sections;
            let loadedTemplateId = result.data.template || undefined;

            // Check for legacy monolithic structure
            const templateSection = sections.find((s: EditorSection) => s.type === 'template');
            if (templateSection) {
              const { convertTemplateToSections } = await import('@/lib/templateConverter');
              const tId = templateSection.data?.templateId || loadedTemplateId || 'dark-professional';
              const tData = templateSection.data?.templateData || templateSection.data || {};
              sections = convertTemplateToSections(tId, tData);
              loadedTemplateId = tId;
            }

            dispatch({
              type: 'LOAD_PORTFOLIO',
              payload: {
                sections,
                title: result.data.title || 'Untitled Portfolio',
                templateId: loadedTemplateId
              }
            });
          } else {
            // Portfolio exists but has no sections - initialize with navbar/footer
            dispatch({
              type: 'LOAD_SECTIONS',
              payload: { sections: [] }
            });
          }
        } else {
          // No portfolioId, no templateId - initialize fresh with navbar/footer
          dispatch({
            type: 'LOAD_SECTIONS',
            payload: { sections: [] }
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading portfolio:', error);
        // On error, still initialize with navbar/footer
        dispatch({
          type: 'LOAD_SECTIONS',
          payload: { sections: [] }
        });
        setIsLoading(false);
      }
    };

    loadPortfolio();
  }, [isHydrated, portfolioId, templateId]);

  return (
    <EditorContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </EditorContext.Provider>
  );
};