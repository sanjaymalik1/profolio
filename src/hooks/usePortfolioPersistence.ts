"use client";

import { useCallback, useEffect, useState, useRef } from 'react';
import { useEditor, useEditorActions } from '@/contexts/EditorContext';

import { useSearchParams, useRouter } from 'next/navigation';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export const usePortfolioPersistence = () => {
  const { state } = useEditor();
  const { setUnsavedChanges } = useEditorActions();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialId = searchParams.get('id');
  const [activePortfolioId, setActivePortfolioId] = useState<string | null>(initialId);

  useEffect(() => {
    setActivePortfolioId(initialId);
  }, [initialId]);

  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Debounce timer ref
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef(false);
  const latestSaveOpRef = useRef(0);

  const beginSaveOperation = () => {
    latestSaveOpRef.current += 1;
    return latestSaveOpRef.current;
  };

  const isLatestSaveOperation = (opId: number) => latestSaveOpRef.current === opId;

  const performAutoSave = useCallback(async () => {
    const saveOpId = beginSaveOperation();
    isSavingRef.current = true;
    setSaveState('saving');
    setSaveError(null);

    try {
      // Strip undefined values so MongoDB / Prisma never sees them.
      const sanitizedSections = JSON.parse(JSON.stringify(state.sections));

      const payload = {
        content: { sections: sanitizedSections, portfolioTitle: state.portfolioTitle },
        title: state.portfolioTitle || 'Untitled Portfolio',
        template: state.templateId || 'default'
      };

      let response;
      if (activePortfolioId) {
        response = await fetch(`/api/portfolios/${activePortfolioId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`/api/portfolios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      // Guard against HTML error pages (e.g. Next.js 500 page) being returned
      // instead of JSON — without this, response.json() throws a SyntaxError.
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Server error (${response.status}) — expected JSON but received ${contentType || 'HTML'}`);
      }

      const result = await response.json();

      if (response.ok && result.success) {
        if (!activePortfolioId) {
          setActivePortfolioId(result.data.id);
          router.replace(`/editor-v2?id=${result.data.id}`, { scroll: false });
        }

        if (isLatestSaveOperation(saveOpId)) {
          setSaveState('saved');
          setLastSaved(new Date());
          setSaveError(null);
        }

        // Clear unsaved changes flag immediately after successful save
        setUnsavedChanges(false);

        // Reset to idle after showing success briefly
        setTimeout(() => {
          if (isLatestSaveOperation(saveOpId)) {
            setSaveState('idle');
          }
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('[Auto-save] Error:', error);
      if (isLatestSaveOperation(saveOpId)) {
        setSaveState('error');
        setSaveError(error instanceof Error ? error.message : 'Failed to save portfolio');
      }

      // Show error for 5 seconds then reset
      setTimeout(() => {
        if (isLatestSaveOperation(saveOpId)) {
          setSaveState('idle');
        }
      }, 5000);
    } finally {
      isSavingRef.current = false;

      // If there was a pending save request, trigger it now
      if (pendingSaveRef.current) {
        pendingSaveRef.current = false;
        setTimeout(() => performAutoSave(), 100);
      }
    }
  }, [activePortfolioId, state, setUnsavedChanges, router]);


  // Debounced auto-save with queue
  useEffect(() => {
    if (!autoSaveEnabled) return;
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
    }, 5000); // 5 second debounce

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [state.sections, state.hasUnsavedChanges, state.portfolioTitle, activePortfolioId, autoSaveEnabled, performAutoSave]);

  const saveToDatabase = useCallback(async (title?: string) => {
    const saveOpId = beginSaveOperation();

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    pendingSaveRef.current = false;

    setSaveState('saving');
    setSaveError(null);

    try {
      // Strip undefined values before sending (same as auto-save)
      const sanitizedSections = JSON.parse(JSON.stringify(state.sections));

      const payload = {
        content: { sections: sanitizedSections, portfolioTitle: state.portfolioTitle },
        title: title || state.portfolioTitle || 'Untitled Portfolio',
        template: state.templateId || 'default'
      };

      let response;
      if (activePortfolioId) {
        response = await fetch(`/api/portfolios/${activePortfolioId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`/api/portfolios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      // Guard against HTML error pages
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Server error (${response.status})`);
      }

      const result = await response.json();

      if (response.status === 401) {
        throw new Error('Please sign in to save portfolios');
      }

      if (result.success) {
        if (!activePortfolioId) {
          setActivePortfolioId(result.data.id);
          router.replace(`/editor-v2?id=${result.data.id}`, { scroll: false });
        }

        if (isLatestSaveOperation(saveOpId)) {
          setSaveState('saved');
          setLastSaved(new Date());
          setSaveError(null);
        }

        // Clear unsaved changes flag immediately after successful save
        setUnsavedChanges(false);

        setTimeout(() => {
          if (isLatestSaveOperation(saveOpId)) {
            setSaveState('idle');
          }
        }, 2000);

        return result.data.id;
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('[Manual save] Error:', error);
      if (isLatestSaveOperation(saveOpId)) {
        setSaveState('error');
        setSaveError(error instanceof Error ? error.message : 'Failed to save portfolio');
      }
      throw error;
    }
  }, [state, activePortfolioId, setUnsavedChanges, router]);

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
    portfolioId: activePortfolioId, // Backward compatibility

    // Actions
    saveToDatabase,
    loadFromDatabase,
    exportPortfolio,
    clearSaveError: () => setSaveError(null),

    // Settings
    setAutoSaveEnabled
  };
};
