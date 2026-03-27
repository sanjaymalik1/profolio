"use client";

import React from 'react';
import { EditorContext } from '@/contexts/EditorContext';

export function useTemplateInlineEditor(isEditing: boolean, sectionId?: string) {
  const editorContext = React.useContext(EditorContext);
  const inlineEditMode = isEditing && !!editorContext && !!sectionId;

  const updateSectionData = React.useCallback(
    (data: Record<string, unknown>) => {
      if (!editorContext || !sectionId) return;
      editorContext.dispatch({
        type: 'UPDATE_SECTION_DATA',
        payload: { sectionId, data },
      });
    },
    [editorContext, sectionId]
  );

  return {
    inlineEditMode,
    updateSectionData,
  };
}

export function updateArrayItem<T>(items: T[] | undefined, index: number, updater: (item: T) => T): T[] {
  const safeItems = Array.isArray(items) ? items : [];
  return safeItems.map((item, itemIndex) => (itemIndex === index ? updater(item) : item));
}

export function safeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}
