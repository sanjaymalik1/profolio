"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useEditor } from '@/contexts/EditorContext';
import { useEditorActions } from '@/contexts/EditorContext';
import { usePortfolioPersistence } from '@/hooks/usePortfolioPersistence';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
  Undo2,
  Redo2,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { PublishDialog } from '@/components/portfolio/PublishDialog';

export const PortfolioManager: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { state } = useEditor();
  const { undo, redo, updateTitle } = useEditorActions();
  const {
    saveState,
    isSaving,
    saveError,
    portfolioId,
    saveToDatabase,
    clearSaveError
  } = usePortfolioPersistence();

  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [portfolioDetails, setPortfolioDetails] = useState<{
    id: string;
    title: string;
    slug: string;
    customSlug?: string | null;
    isPublic: boolean;
    updatedAt: string;
    lastPublishedAt?: string | null;
    publishedAt?: string | null;
    viewCount?: number;
  } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Title editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(state.portfolioTitle);

  // Track if component is mounted (client-side)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync titleInput with state when state changes
  useEffect(() => {
    if (!isEditingTitle) {
      setTitleInput(state.portfolioTitle);
    }
  }, [state.portfolioTitle, isEditingTitle]);

  // Title editing handlers
  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTitleInput(state.portfolioTitle);
  };

  const handleTitleSave = () => {
    const newTitle = titleInput.trim() || 'Untitled Portfolio';
    updateTitle(newTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTitleInput(state.portfolioTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);


  const handleSaveWithTitle = async () => {
    try {
      const title = saveTitle.trim() || 'Untitled Portfolio';
      await saveToDatabase(title);
      setSaveTitle('');
      setShowSaveDialog(false);

      // Reload portfolio details
      fetchPortfolioDetails();
    } catch {
      // Error already displayed by saveError state
    }
  };

  // Fetch portfolio details for publishing
  const fetchPortfolioDetails = useCallback(async () => {
    if (portfolioId) {
      try {
        const response = await fetch(`/api/portfolios/${portfolioId}`);
        if (response.ok) {
          const data = await response.json();
          setPortfolioDetails(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch portfolio details:', error);
      }
    }
  }, [portfolioId]);

  useEffect(() => {
    fetchPortfolioDetails();
  }, [fetchPortfolioDetails]);

  const handlePublishClick = () => {
    if (!portfolioId) {
      alert('Please save your portfolio first before publishing');
      setShowSaveDialog(true);
      return;
    }
    setShowPublishDialog(true);
  };

  // Calculate if there are unpublished changes (client-side only to avoid hydration issues)
  const hasUnpublishedChanges = useMemo(() => {
    if (!isMounted || !portfolioDetails?.isPublic || !portfolioDetails?.lastPublishedAt || !portfolioDetails?.updatedAt) {
      return false;
    }
    return new Date(portfolioDetails.updatedAt) > new Date(portfolioDetails.lastPublishedAt);
  }, [isMounted, portfolioDetails]);

  // Get public URL (client-side only to avoid hydration issues)
  const publicUrl = useMemo(() => {
    if (!isMounted || !portfolioDetails?.isPublic) {
      return undefined;
    }
    return `${window.location.origin}/p/${portfolioDetails.customSlug || portfolioDetails.slug}`;
  }, [isMounted, portfolioDetails]);

  return (
    <div className="flex items-center gap-3">

      {/* Portfolio Title */}
      <div className="flex items-center gap-2">
        {isEditingTitle ? (
          <div className="flex items-center gap-1">
            <Input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleSave}
              className="h-8 w-48 text-sm"
              autoFocus
              placeholder="Portfolio title"
            />
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={handleTitleSave}
            >
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={handleTitleCancel}
            >
              <X className="h-3.5 w-3.5 text-slate-500" />
            </Button>
          </div>
        ) : (
          <button
            onClick={handleTitleEdit}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-100 rounded-md transition-colors group"
          >
            <span className="text-sm font-medium text-slate-700">
              {state.portfolioTitle}
            </span>
            <Edit2 className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {/* Undo / Redo */}
      <div className="flex items-center gap-1 border-l pl-3">
        <Button
          size="sm"
          variant="ghost"
          onClick={undo}
          disabled={state.past.length === 0}
          className="h-8 w-8 p-0"
          title="Undo (⌘Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={redo}
          disabled={state.future.length === 0}
          className="h-8 w-8 p-0"
          title="Redo (⌘⇧Z)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Save Status Indicator */}
      {isLoaded && user && (
        <div className="flex items-center gap-1.5 text-xs px-2 py-1 border-l pl-3">{saveState === 'saving' ? (
          <>
            <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
            <span className="hidden sm:inline text-slate-500">Saving...</span>
          </>
        ) : saveState === 'error' ? (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline text-red-600">Error</span>
          </>
        ) : state.hasUnsavedChanges ? (
          <>
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            <span className="hidden sm:inline text-slate-600">Unsaved</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline text-emerald-600">Saved</span>
          </>
        )}
        </div>
      )}

      {/* Error Display */}
      {saveError && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-md">
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="max-w-[200px] truncate">{saveError}</span>
          <button onClick={clearSaveError} className="hover:text-red-800">×</button>
        </div>
      )}

      {/* Save Dialog */}
      {isLoaded && user && (
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save Portfolio</DialogTitle>
              <DialogDescription>
                Give your portfolio a name to save it to your account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="saveTitle" className="text-sm font-medium text-slate-700">Portfolio Title</Label>
                <Input
                  id="saveTitle"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="My Awesome Portfolio"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveWithTitle()}
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="border-slate-200">
                  Cancel
                </Button>
                <Button onClick={handleSaveWithTitle} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Portfolio'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Publish Button */}
      {portfolioId && (
        <>
          <Button
            variant={portfolioDetails?.isPublic ? "default" : "outline"}
            size="sm"
            onClick={handlePublishClick}
            disabled={!portfolioDetails}
            className={portfolioDetails?.isPublic ? '' : 'border-slate-200 hover:bg-slate-50'}
          >
            <Globe className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{portfolioDetails?.isPublic ? 'Published' : 'Publish'}</span>
            {hasUnpublishedChanges && portfolioDetails?.isPublic && (
              <span className="ml-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" title="Unpublished changes" />
            )}
          </Button>
        </>
      )}

      {/* Publish Dialog */}
      {portfolioDetails && (
        <PublishDialog
          portfolioId={portfolioDetails.id}
          portfolioTitle={portfolioDetails.title}
          isPublic={portfolioDetails.isPublic || false}
          currentSlug={portfolioDetails.slug}
          customSlug={portfolioDetails.customSlug ?? undefined}
          publicUrl={publicUrl}
          viewCount={portfolioDetails.viewCount || 0}
          isOpen={showPublishDialog}
          onClose={() => setShowPublishDialog(false)}
          onPublishSuccess={fetchPortfolioDetails}
        />
      )}
    </div>
  );
};