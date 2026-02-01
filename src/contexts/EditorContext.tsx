"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
  SectionStyling 
} from '@/types/portfolio';

// Initial editor state
const initialState: EditorState = {
  sections: [],
  selectedSectionId: null,
  isDragging: false,
  isPreviewMode: false,
  previewDevice: 'desktop',
  hasUnsavedChanges: false,
};

// Default section data generators
const createDefaultSectionData = (type: DraggableSectionType): any => {
  const defaultStyling: SectionStyling = {
    backgroundColor: 'transparent',
    textColor: 'inherit',
    padding: { top: '3rem', right: '2rem', bottom: '3rem', left: '2rem' },
    margin: { top: '0', bottom: '2rem' },
    alignment: 'left',
    layout: 'default',
    animation: { type: 'slide', duration: 600, delay: 200 }
  };

  switch (type) {
    case 'hero':
      return {
        fullName: 'Your Name',
        title: 'Your Title',
        bio: 'Brief description about yourself and what you do.',
        profileImage: '',
        backgroundImage: '',
        socialLinks: [],
        contactEmail: '',
        location: ''
      } as HeroData;

    case 'about':
      return {
        heading: 'About Me',
        content: 'Tell your story here. Share your background, experience, and what drives you.',
        profileImage: '',
        highlights: ['Add your key highlights here'],
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
        phone: '',
        location: 'Your Location',
        availability: 'Available for work',
        socialLinks: [],
        contactForm: {
          enabled: true,
          fields: [
            { name: 'name', type: 'text', label: 'Name', required: true, placeholder: 'Your name' },
            { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'your.email@example.com' },
            { name: 'message', type: 'textarea', label: 'Message', required: true, placeholder: 'Your message...' }
          ]
        }
      } as ContactData;

    default:
      return {};
  }
};

// Helper function for deep cloning
const deepClone = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

// Reducer function
const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'ADD_SECTION': {
      const { sectionType, index } = action.payload;
      const newSection: EditorSection = {
        id: `${sectionType}-${Date.now()}`,
        type: sectionType,
        data: deepClone(createDefaultSectionData(sectionType)),
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
      };

      const newSections = [...state.sections];
      if (index !== undefined) {
        // Insert at specific index
        newSections.splice(index, 0, newSection);
        // Update order for subsequent sections
        newSections.forEach((section, idx) => {
          section.order = idx;
        });
      } else {
        // Add to end
        newSections.push(newSection);
      }

      return {
        ...state,
        sections: newSections,
        selectedSectionId: newSection.id,
        hasUnsavedChanges: true
      };
    }

    case 'REMOVE_SECTION': {
      const { sectionId } = action.payload;
      const newSections = state.sections
        .filter(section => section.id !== sectionId)
        .map((section, index) => ({ ...section, order: index }));
      
      return {
        ...state,
        sections: newSections,
        selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
        hasUnsavedChanges: true
      };
    }

    case 'MOVE_SECTION': {
      const { sectionId, newIndex } = action.payload;
      const sectionIndex = state.sections.findIndex(s => s.id === sectionId);
      if (sectionIndex === -1) return state;

      const newSections = [...state.sections];
      const [movedSection] = newSections.splice(sectionIndex, 1);
      newSections.splice(newIndex, 0, movedSection);
      
      // Update order
      newSections.forEach((section, index) => {
        section.order = index;
      });

      return {
        ...state,
        sections: newSections,
        hasUnsavedChanges: true
      };
    }

    case 'UPDATE_SECTION_DATA': {
      const { sectionId, data } = action.payload;
      const newSections = state.sections.map(section =>
        section.id === sectionId
          ? { 
              ...section, 
              data: deepClone({ ...section.data, ...data })
            }
          : section
      );

      return {
        ...state,
        sections: newSections,
        hasUnsavedChanges: true
      };
    }

    case 'UPDATE_SECTION_STYLING': {
      const { sectionId, styling } = action.payload;
      const newSections = state.sections.map(section =>
        section.id === sectionId
          ? { 
              ...section, 
              styling: deepClone({ ...section.styling, ...styling })
            }
          : section
      );

      return {
        ...state,
        sections: newSections,
        hasUnsavedChanges: true
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
      return {
        ...state,
        sections: deepClone(action.payload.sections),
        hasUnsavedChanges: false
      };
    }

    case 'RESET_EDITOR': {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
};

// Context
const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
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
  const { dispatch } = useEditor();

  const addSection = (sectionType: DraggableSectionType, index?: number) => {
    dispatch({ type: 'ADD_SECTION', payload: { sectionType, index } });
  };

  const removeSection = (sectionId: string) => {
    dispatch({ type: 'REMOVE_SECTION', payload: { sectionId } });
  };

  const moveSection = (sectionId: string, newIndex: number) => {
    dispatch({ type: 'MOVE_SECTION', payload: { sectionId, newIndex } });
  };

  const updateSectionData = (sectionId: string, data: any) => {
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

  const loadSections = (sections: EditorSection[]) => {
    dispatch({ type: 'LOAD_SECTIONS', payload: { sections } });
  };

  const resetEditor = () => {
    dispatch({ type: 'RESET_EDITOR' });
  };

  const loadPortfolioData = (portfolioData: any) => {
    if (portfolioData && portfolioData.sections) {
      // Deep clone the portfolio data to prevent reference sharing
      loadSections(deepClone(portfolioData.sections));
    }
  };

  return {
    addSection,
    removeSection,
    moveSection,
    updateSectionData,
    updateSectionStyling,
    selectSection,
    setDragging,
    setPreviewMode,
    setPreviewDevice,
    loadSections,
    resetEditor,
    loadPortfolioData
  };
};

// Provider component
interface EditorProviderProps {
  children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration before accessing localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load portfolio from localStorage after hydration
  useEffect(() => {
    if (!isHydrated) return;
    
    try {
      // Check if we need to apply a template
      const applyTemplate = localStorage.getItem('apply_template');
      const selectedTemplate = localStorage.getItem('selected_template');
      if (applyTemplate && selectedTemplate) {
        // Import and apply template
        import('@/lib/templateConverter').then(({ convertTemplateToSections }) => {
          try {
            const sections = convertTemplateToSections(selectedTemplate);
            dispatch({ 
              type: 'LOAD_SECTIONS', 
              payload: { sections }
            });
            // Clear the flags
            localStorage.removeItem('apply_template');
            localStorage.removeItem('selected_template');
          } catch (error) {
            console.error('Error applying template:', error);
            localStorage.removeItem('apply_template');
            localStorage.removeItem('selected_template');
          }
        });
        return;
      }

      // Otherwise load existing portfolio
      const currentPortfolio = localStorage.getItem('current_portfolio');
      if (currentPortfolio) {
        const portfolio = JSON.parse(currentPortfolio);
        if (portfolio?.data?.sections && Array.isArray(portfolio.data.sections)) {
          dispatch({ 
            type: 'LOAD_SECTIONS', 
            payload: { sections: portfolio.data.sections }
          });
        }
      }
    } catch (error) {
      console.error('Error loading portfolio from localStorage:', error);
    }
  }, [isHydrated]);

  return (
    <DndProvider backend={HTML5Backend}>
      <EditorContext.Provider value={{ state, dispatch }}>
        {children}
      </EditorContext.Provider>
    </DndProvider>
  );
};