// Drag and Drop Types for Portfolio Editor
import { 
  HeroData, 
  AboutData, 
  SkillsData, 
  ProjectsData, 
  ContactData, 
  ExperienceData, 
  EducationData,
  TemplateSectionData,
  SectionStyling 
} from './portfolio';

export interface DragItem {
  type: string;
  id: string;
  index?: number;
}

// Section types that can be dragged
export type DraggableSectionType = 
  | 'hero'
  | 'about' 
  | 'skills'
  | 'projects'
  | 'contact'
  | 'experience'
  | 'education'
  | 'template';

// Drag item for new sections from palette
export interface PaletteDragItem extends DragItem {
  type: 'palette-section';
  sectionType: DraggableSectionType;
  displayName: string;
  icon: string;
  description: string;
}

// Drag item for existing sections in editor
export interface EditorSectionDragItem extends DragItem {
  type: 'editor-section';
  sectionType: DraggableSectionType;
  sectionId: string;
  index: number;
}

// Drop result for handling drops
export interface DropResult {
  dropEffect: string;
  targetIndex?: number;
  targetZone: 'editor' | 'trash' | 'palette';
}

// Editor state for sections - Discriminated union based on section type
interface BaseEditorSection {
  id: string;
  styling: SectionStyling;
  isEditable: boolean;
  order: number;
}

interface HeroEditorSection extends BaseEditorSection {
  type: 'hero';
  data: HeroData;
}

interface AboutEditorSection extends BaseEditorSection {
  type: 'about';
  data: AboutData;
}

interface SkillsEditorSection extends BaseEditorSection {
  type: 'skills';
  data: SkillsData;
}

interface ProjectsEditorSection extends BaseEditorSection {
  type: 'projects';
  data: ProjectsData;
}

interface ContactEditorSection extends BaseEditorSection {
  type: 'contact';
  data: ContactData;
}

interface ExperienceEditorSection extends BaseEditorSection {
  type: 'experience';
  data: ExperienceData;
}

interface EducationEditorSection extends BaseEditorSection {
  type: 'education';
  data: EducationData;
}

interface TemplateEditorSection extends BaseEditorSection {
  type: 'template';
  data: TemplateSectionData;
}

export type EditorSection = 
  | HeroEditorSection
  | AboutEditorSection
  | SkillsEditorSection
  | ProjectsEditorSection
  | ContactEditorSection
  | ExperienceEditorSection
  | EducationEditorSection
  | TemplateEditorSection;

// History state for undo/redo (excludes history fields to avoid nested history)
export interface EditorStateSnapshot {
  sections: EditorSection[];
  selectedSectionId: string | null;
  isDragging: boolean;
  isPreviewMode: boolean;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  portfolioTitle: string;
}

// Editor context state
export interface EditorState {
  sections: EditorSection[];
  selectedSectionId: string | null;
  isDragging: boolean;
  isPreviewMode: boolean;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  hasUnsavedChanges: boolean;
  portfolioTitle: string;
  past: EditorStateSnapshot[];
  future: EditorStateSnapshot[];
}

// Editor actions
export type EditorAction = 
  | { type: 'ADD_SECTION'; payload: { sectionType: DraggableSectionType; index?: number } }
  | { type: 'REMOVE_SECTION'; payload: { sectionId: string } }
  | { type: 'MOVE_SECTION'; payload: { sectionId: string; newIndex: number } }
  | { type: 'UPDATE_SECTION_DATA'; payload: { sectionId: string; data: Record<string, unknown> } }
  | { type: 'UPDATE_SECTION_STYLING'; payload: { sectionId: string; styling: Partial<SectionStyling> } }
  | { type: 'SELECT_SECTION'; payload: { sectionId: string | null } }
  | { type: 'SET_DRAGGING'; payload: { isDragging: boolean } }
  | { type: 'SET_PREVIEW_MODE'; payload: { isPreviewMode: boolean } }
  | { type: 'SET_PREVIEW_DEVICE'; payload: { device: 'desktop' | 'tablet' | 'mobile' } }
  | { type: 'SET_UNSAVED_CHANGES'; payload: { hasUnsavedChanges: boolean } }
  | { type: 'LOAD_SECTIONS'; payload: { sections: EditorSection[] } }
  | { type: 'LOAD_PORTFOLIO'; payload: { sections: EditorSection[]; title: string } }
  | { type: 'UPDATE_TITLE'; payload: { title: string } }
  | { type: 'DUPLICATE_SECTION'; payload: { sectionId: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_EDITOR' };

// Component props for drag and drop
export interface DraggableProps {
  children: React.ReactNode;
  dragItem: DragItem;
  canDrag?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (result: DropResult | null) => void;
}

export interface DroppableProps {
  children: React.ReactNode;
  accept: string | string[];
  onDrop: (item: DragItem, monitor: unknown) => void;
  canDrop?: (item: DragItem) => boolean;
  className?: string;
}

// Section palette item
export interface PaletteSection {
  type: DraggableSectionType;
  displayName: string;
  icon: string;
  description: string;
  category: 'basic' | 'advanced' | 'specialty';
  preview: string; // Preview image or component
}

export * from './portfolio';