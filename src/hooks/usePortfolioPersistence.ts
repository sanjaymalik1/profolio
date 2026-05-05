"use client";

import { useCallback, useEffect, useState, useRef } from 'react';
import { useEditor, useEditorActions } from '@/contexts/EditorContext';

import { useSearchParams, useRouter } from 'next/navigation';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

type SavedPortfolioSnapshot = {
  id: string;
  title: string;
  slug: string;
  customSlug?: string | null;
  isPublic: boolean;
  updatedAt: string;
  lastPublishedAt?: string | null;
  publishedAt?: string | null;
  viewCount?: number;
};

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
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<SavedPortfolioSnapshot | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Debounce timer ref
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef(false);
  const latestSaveOpRef = useRef(0);
  const activeSavePromiseRef = useRef<Promise<unknown> | null>(null);
  const lastSavedPayloadRef = useRef<string | null>(null);
  const stateVersionRef = useRef(0);

  useEffect(() => {
    stateVersionRef.current += 1;
  }, [state.sections, state.portfolioTitle, state.templateId]);

  const beginSaveOperation = () => {
    latestSaveOpRef.current += 1;
    return latestSaveOpRef.current;
  };

  const isLatestSaveOperation = (opId: number) => latestSaveOpRef.current === opId;

  const buildPayload = useCallback((titleOverride?: string) => {
    // Strip undefined values so MongoDB / Prisma never sees them.
    const sanitizedSections = JSON.parse(JSON.stringify(state.sections));

    return {
      content: { sections: sanitizedSections, portfolioTitle: state.portfolioTitle },
      title: titleOverride || state.portfolioTitle || 'Untitled Portfolio',
      template: state.templateId || 'default'
    };
  }, [state.portfolioTitle, state.sections, state.templateId]);

  const recordSavedSnapshot = useCallback((data: unknown) => {
    if (!data || typeof data !== 'object') return;
    const typed = data as Record<string, unknown>;
    if (typeof typed.id !== 'string') return;

    setLastSavedSnapshot({
      id: typed.id,
      title: typeof typed.title === 'string' ? typed.title : state.portfolioTitle || 'Untitled Portfolio',
      slug: typeof typed.slug === 'string' ? typed.slug : '',
      customSlug: typed.customSlug === null || typeof typed.customSlug === 'string' ? typed.customSlug : undefined,
      isPublic: Boolean(typed.isPublic),
      updatedAt: typeof typed.updatedAt === 'string' ? typed.updatedAt : new Date().toISOString(),
      lastPublishedAt: typeof typed.lastPublishedAt === 'string'
        ? typed.lastPublishedAt
        : typed.lastPublishedAt
          ? new Date(typed.lastPublishedAt as Date).toISOString()
          : null,
      publishedAt: typeof typed.publishedAt === 'string'
        ? typed.publishedAt
        : typed.publishedAt
          ? new Date(typed.publishedAt as Date).toISOString()
          : null,
      viewCount: typeof typed.viewCount === 'number' ? typed.viewCount : undefined,
    });
  }, [state.portfolioTitle]);

  const performAutoSave = useCallback(async () => {
    if (activeSavePromiseRef.current) {
      pendingSaveRef.current = true;
      return;
    }

    const saveOpId = beginSaveOperation();
    const saveVersion = stateVersionRef.current;

    const payload = buildPayload();
    const body = JSON.stringify(payload);

    if (body === lastSavedPayloadRef.current) {
      setUnsavedChanges(false);
      if (isLatestSaveOperation(saveOpId)) {
        setSaveState('saved');
        setLastSaved(new Date());
        setSaveError(null);

        setTimeout(() => {
          if (isLatestSaveOperation(saveOpId)) {
            setSaveState('idle');
          }
        }, 2000);
      }
      return;
    }

    isSavingRef.current = true;
    setSaveState('saving');
    setSaveError(null);

    try {
      let response;
      const savePromise = (async () => {
      if (activePortfolioId) {
          return fetch(`/api/portfolios/${activePortfolioId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
            body,
          });
      } else {
          return fetch(`/api/portfolios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
            body,
          });
      }
      })();

      activeSavePromiseRef.current = savePromise;
      response = await savePromise;

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
          lastSavedPayloadRef.current = body;
          setSaveState('saved');
          setLastSaved(new Date());
          setSaveError(null);
          recordSavedSnapshot(result.data);
        }

        // Clear unsaved changes if no edits landed mid-save
        if (stateVersionRef.current === saveVersion) {
          setUnsavedChanges(false);
        } else {
          pendingSaveRef.current = true;
        }

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
      if (activeSavePromiseRef.current) {
        activeSavePromiseRef.current = null;
      }

      // If there was a pending save request, trigger it now
      if (pendingSaveRef.current) {
        pendingSaveRef.current = false;
        setTimeout(() => performAutoSave(), 100);
      }
    }
  }, [activePortfolioId, buildPayload, recordSavedSnapshot, router, setUnsavedChanges]);


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
    if (activeSavePromiseRef.current) {
      await activeSavePromiseRef.current;
    }

    const saveOpId = beginSaveOperation();
    const saveVersion = stateVersionRef.current;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    pendingSaveRef.current = false;

    const payload = buildPayload(title);
    const body = JSON.stringify(payload);

    if (body === lastSavedPayloadRef.current) {
      setUnsavedChanges(false);
      if (isLatestSaveOperation(saveOpId)) {
        setSaveState('saved');
        setLastSaved(new Date());
        setSaveError(null);

        setTimeout(() => {
          if (isLatestSaveOperation(saveOpId)) {
            setSaveState('idle');
          }
        }, 2000);
      }
      return activePortfolioId || null;
    }

    isSavingRef.current = true;
    setSaveState('saving');
    setSaveError(null);

    try {
      let response;
      const savePromise = (async () => {
        if (activePortfolioId) {
          return fetch(`/api/portfolios/${activePortfolioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body,
          });
        }
        return fetch(`/api/portfolios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
      })();

      activeSavePromiseRef.current = savePromise;
      response = await savePromise;

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
          lastSavedPayloadRef.current = body;
          setSaveState('saved');
          setLastSaved(new Date());
          setSaveError(null);
          recordSavedSnapshot(result.data);
        }

        // Clear unsaved changes only if no edits landed mid-save
        if (stateVersionRef.current === saveVersion) {
          setUnsavedChanges(false);
        } else {
          pendingSaveRef.current = true;
        }

        setTimeout(() => {
          if (isLatestSaveOperation(saveOpId)) {
            setSaveState('idle');
          }
        }, 2000);

        return result.data.id;
      }
      throw new Error(result.error || 'Failed to save');
    } catch (error) {
      console.error('[Manual save] Error:', error);
      if (isLatestSaveOperation(saveOpId)) {
        setSaveState('error');
        setSaveError(error instanceof Error ? error.message : 'Failed to save portfolio');
      }
      throw error;
    } finally {
      isSavingRef.current = false;
      if (activeSavePromiseRef.current) {
        activeSavePromiseRef.current = null;
      }

      if (pendingSaveRef.current) {
        pendingSaveRef.current = false;
        setTimeout(() => performAutoSave(), 100);
      }
    }
  }, [activePortfolioId, buildPayload, performAutoSave, recordSavedSnapshot, router, setUnsavedChanges]);

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
    lastSavedSnapshot,
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
