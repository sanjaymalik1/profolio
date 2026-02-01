// Drag and Drop Types for Portfolio Editor
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

// Editor state for sections
export interface EditorSection {
  id: string;
  type: DraggableSectionType;
  data: any; // Will be typed based on section type
  styling: SectionStyling;
  isEditable: boolean;
  order: number;
}

// Editor context state
export interface EditorState {
  sections: EditorSection[];
  selectedSectionId: string | null;
  isDragging: boolean;
  isPreviewMode: boolean;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  hasUnsavedChanges: boolean;
}

// Editor actions
export type EditorAction = 
  | { type: 'ADD_SECTION'; payload: { sectionType: DraggableSectionType; index?: number } }
  | { type: 'REMOVE_SECTION'; payload: { sectionId: string } }
  | { type: 'MOVE_SECTION'; payload: { sectionId: string; newIndex: number } }
  | { type: 'UPDATE_SECTION_DATA'; payload: { sectionId: string; data: any } }
  | { type: 'UPDATE_SECTION_STYLING'; payload: { sectionId: string; styling: Partial<SectionStyling> } }
  | { type: 'SELECT_SECTION'; payload: { sectionId: string | null } }
  | { type: 'SET_DRAGGING'; payload: { isDragging: boolean } }
  | { type: 'SET_PREVIEW_MODE'; payload: { isPreviewMode: boolean } }
  | { type: 'SET_PREVIEW_DEVICE'; payload: { device: 'desktop' | 'tablet' | 'mobile' } }
  | { type: 'SET_UNSAVED_CHANGES'; payload: { hasUnsavedChanges: boolean } }
  | { type: 'LOAD_SECTIONS'; payload: { sections: EditorSection[] } }
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
  onDrop: (item: DragItem, monitor: any) => void;
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

// Import existing types
import { SectionStyling } from './portfolio';

export * from './portfolio';