"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  EditorState, 
  EditorAction, 
  EditorSection, 
  EditorStateSnapshot,
  DraggableSectionType 
} from '@/types/editor';
import { 
  HeroData, 
  AboutData, 
  SkillsData, 
  ProjectsData, 
  ContactData,
  SectionStyling,
  SectionData
} from '@/types/portfolio';

// Initial editor state
const initialState: EditorState = {
  sections: [],
  selectedSectionId: null,
  isDragging: false,
  isPreviewMode: false,
  previewDevice: 'desktop',
  hasUnsavedChanges: false,
  portfolioTitle: 'Untitled Portfolio',
  past: [],
  future: [],
};

// Default section data generators
const createDefaultSectionData = (type: DraggableSectionType): SectionData => {
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
const deepClone = <T,>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone((obj as Record<string, unknown>)[key]);
      }
    }
    return clonedObj as T;
  }
  return obj;
};

// Helper to create state snapshot (excludes history fields)
const createSnapshot = (state: EditorState): EditorStateSnapshot => ({
  sections: deepClone(state.sections),
  selectedSectionId: state.selectedSectionId,
  isDragging: state.isDragging,
  isPreviewMode: state.isPreviewMode,
  previewDevice: state.previewDevice,
  portfolioTitle: state.portfolioTitle,
});

// Helper to restore from snapshot
const restoreFromSnapshot = (state: EditorState, snapshot: EditorStateSnapshot): EditorState => ({
  ...state,
  sections: deepClone(snapshot.sections),
  selectedSectionId: snapshot.selectedSectionId,
  isDragging: snapshot.isDragging,
  isPreviewMode: snapshot.isPreviewMode,
  previewDevice: snapshot.previewDevice,
  portfolioTitle: snapshot.portfolioTitle,
  hasUnsavedChanges: true, // Undo/redo marks as unsaved
});

// Reducer function
const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'ADD_SECTION': {
      const { sectionType, index } = action.payload;
      const newSection = {
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
      } as EditorSection;

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
        hasUnsavedChanges: true,
        past: [...state.past, createSnapshot(state)],
        future: [], // Clear redo stack
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
        hasUnsavedChanges: true,
        past: [...state.past, createSnapshot(state)],
        future: [],
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
        hasUnsavedChanges: true,
        past: [...state.past, createSnapshot(state)],
        future: [],
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
      ) as EditorSection[];

      return {
        ...state,
        sections: newSections,
        hasUnsavedChanges: true,
        past: [...state.past, createSnapshot(state)],
        future: [],
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
      ) as EditorSection[];

      return {
        ...state,
        sections: newSections,
        hasUnsavedChanges: true,
        past: [...state.past, createSnapshot(state)],
        future: [],
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
        hasUnsavedChanges: false,
        past: [], // Clear history on load
        future: [],
      };
    }

    case 'LOAD_PORTFOLIO': {
      return {
        ...state,
        sections: deepClone(action.payload.sections),
        portfolioTitle: action.payload.title,
        hasUnsavedChanges: false,
        past: [],
        future: [],
      };
    }

    case 'UPDATE_TITLE': {
      return {
        ...state,
        portfolioTitle: action.payload.title,
        hasUnsavedChanges: true,
        past: [...state.past, createSnapshot(state)],
        future: [],
      };
    }

    case 'DUPLICATE_SECTION': {
      const { sectionId } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (!section) return state;
      
      const sectionIndex = state.sections.findIndex(s => s.id === sectionId);
      
      // Create duplicated section with new ID but identical data/styling
      const duplicatedSection: EditorSection = {
        ...deepClone(section),
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
        past: [...state.past, createSnapshot(state)],
        future: [],
      };
    }

    case 'UNDO': {
      if (state.past.length === 0) return state;
      
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      
      return {
        ...restoreFromSnapshot(state, previous),
        past: newPast,
        future: [createSnapshot(state), ...state.future],
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      return {
        ...restoreFromSnapshot(state, next),
        past: [...state.past, createSnapshot(state)],
        future: newFuture,
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

  const loadSections = (sections: EditorSection[]) => {
    dispatch({ type: 'LOAD_SECTIONS', payload: { sections } });
  };

  const resetEditor = () => {
    dispatch({ type: 'RESET_EDITOR' });
  };

  const loadPortfolioData = (portfolioData: { sections?: EditorSection[] }) => {
    if (portfolioData && portfolioData.sections) {
      // Deep clone the portfolio data to prevent reference sharing
      loadSections(deepClone(portfolioData.sections));
    }
  };

  const setUnsavedChanges = (hasUnsavedChanges: boolean) => {
    dispatch({ type: 'SET_UNSAVED_CHANGES', payload: { hasUnsavedChanges } });
  };

  const updateTitle = (title: string) => {
    dispatch({ type: 'UPDATE_TITLE', payload: { title } });
  };

  const loadPortfolio = (sections: EditorSection[], title: string) => {
    dispatch({ type: 'LOAD_PORTFOLIO', payload: { sections, title } });
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
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
    undo,
    redo,
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
            payload: { sections }
          });
          setIsLoading(false);
          return;
        }

        // If portfolioId exists, load from API
        if (portfolioId) {
          const response = await fetch(`/api/portfolios/${portfolioId}`);
          const result = await response.json();
          
          if (result.success && result.data.content?.sections) {
            dispatch({ 
              type: 'LOAD_PORTFOLIO', 
              payload: { 
                sections: result.data.content.sections,
                title: result.data.title || 'Untitled Portfolio'
              }
            });
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading portfolio:', error);
        setIsLoading(false);
      }
    };

    loadPortfolio();
  }, [isHydrated, portfolioId, templateId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <EditorContext.Provider value={{ state, dispatch, isLoading }}>
        {children}
      </EditorContext.Provider>
    </DndProvider>
  );
};