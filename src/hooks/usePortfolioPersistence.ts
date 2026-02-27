"use client";

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useEditor, useEditorActions } from '@/contexts/EditorContext';
import { EditorState } from '@/types/editor';
import { useSearchParams } from 'next/navigation';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export const usePortfolioPersistence = () => {
  const { state } = useEditor();
  const { setUnsavedChanges } = useEditorActions();
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get('id');
  
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  // Debounce timer ref
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef(false);

  // Debounced auto-save with queue
  useEffect(() => {
    if (!autoSaveEnabled || !portfolioId) return;
    if (state.sections.length === 0) return; // Don't save empty portfolios
    if (!state.hasUnsavedChanges) return;

    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Set new debounced save
    saveTimerRef.current = setTimeout(() => {
      if (!isSavingRef.current) {
        performAutoSave();
      } else {
        // Mark that we need to save again after current save completes
        pendingSaveRef.current = true;
      }
    }, 3000); // 3 second debounce

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [state.sections, state.hasUnsavedChanges, state.portfolioTitle, portfolioId]);

  const performAutoSave = async () => {
    if (!portfolioId) return;
    
    isSavingRef.current = true;
    setSaveState('saving');
    setSaveError(null);

    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: state, 
          title: state.portfolioTitle 
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSaveState('saved');
        setLastSaved(new Date());
        setSaveError(null);
        
        // Clear unsaved changes flag immediately after successful save
        setUnsavedChanges(false);
        
        // Reset to idle after showing success briefly
        setTimeout(() => {
          setSaveState('idle');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('[Auto-save] Error:', error);
      setSaveState('error');
      setSaveError(error instanceof Error ? error.message : 'Failed to save portfolio');
      
      // Show error for 5 seconds then reset
      setTimeout(() => {
        setSaveState('idle');
      }, 5000);
    } finally {
      isSavingRef.current = false;
      
      // If there was a pending save request, trigger it now
      if (pendingSaveRef.current) {
        pendingSaveRef.current = false;
        setTimeout(() => performAutoSave(), 100);
      }
    }
  };

  const saveToDatabase = useCallback(async (title?: string) => {
    if (!portfolioId) {
      throw new Error('No portfolio ID available');
    }

    setSaveState('saving');
    setSaveError(null);

    try {
      const updateData: {
        content: unknown;
        title: string;
      } = { 
        content: state,
        title: title || state.portfolioTitle
      };

      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.status === 401) {
        throw new Error('Please sign in to save portfolios');
      }

      if (result.success) {
        setSaveState('saved');
        setLastSaved(new Date());
        setSaveError(null);
        
        // Clear unsaved changes flag immediately after successful save
        setUnsavedChanges(false);
        
        setTimeout(() => {
          setSaveState('idle');
        }, 2000);
        
        return portfolioId;
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('[Manual save] Error:', error);
      setSaveState('error');
      setSaveError(error instanceof Error ? error.message : 'Failed to save portfolio');
      throw error;
    }
  }, [state, portfolioId]);

  const loadFromDatabase = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/portfolios/${id}`);
      const result = await response.json();

      if (result.success && result.data.content) {
        return result.data.content;
      }

      throw new Error(result.error || 'Portfolio not found');
    } catch (error) {
      console.error('[Load] Error:', error);
      throw error;
    }
  }, []);

  const exportPortfolio = useCallback(async (format: 'json' | 'html' = 'json') => {
    try {
      if (format === 'json') {
        const exportData = {
          title: 'Portfolio Export',
          exportedAt: new Date().toISOString(),
          data: state
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('[Export] Error:', error);
      throw error;
    }
  }, [state]);

  return {
    // State
    saveState,
    isSaving: saveState === 'saving',
    lastSaved,
    saveError,
    autoSaveEnabled,
    portfolioId,

    // Actions
    saveToDatabase,
    loadFromDatabase,
    exportPortfolio,
    clearSaveError: () => setSaveError(null),

    // Settings
    setAutoSaveEnabled
  };
};
