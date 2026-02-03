"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { usePortfolioPersistence } from '@/hooks/usePortfolioPersistence';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Save, 
  Globe,
  CheckCircle
} from 'lucide-react';
import { PublishDialog } from '@/components/portfolio/PublishDialog';

export const PortfolioManager: React.FC = () => {
  const { user, isLoaded } = useUser();
  const {
    isSaving,
    lastSaved,
    saveToDatabase,
    getCurrentPortfolio
  } = usePortfolioPersistence();

  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [portfolioDetails, setPortfolioDetails] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Track if component is mounted (client-side)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSave = async () => {
    if (!isLoaded || !user) {
      alert('Please sign in to save your portfolio');
      return;
    }
    
    const currentPortfolio = getCurrentPortfolio();
    
    // If portfolio exists and has a title, save directly without prompting
    if (currentPortfolio?.title) {
      try {
        await saveToDatabase(currentPortfolio.title);
      } catch (error) {
        console.error('Save failed:', error);
        alert('Failed to save portfolio: ' + (error as Error).message);
      }
      return;
    }
    
    // If no title exists, show dialog
    setShowSaveDialog(true);
  };

  const handleSaveWithTitle = async () => {
    try {
      const title = saveTitle.trim() || 'Untitled Portfolio';
      await saveToDatabase(title);
      setSaveTitle('');
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save portfolio: ' + (error as Error).message);
    }
  };

  const currentPortfolio = getCurrentPortfolio();

  // Fetch portfolio details for publishing
  React.useEffect(() => {
    const fetchPortfolioDetails = async () => {
      const portfolio = getCurrentPortfolio();
      if (portfolio?.id && /^[0-9a-fA-F]{24}$/.test(portfolio.id)) {
        try {
          const response = await fetch(`/api/portfolios/${portfolio.id}`);
          if (response.ok) {
            const data = await response.json();
            setPortfolioDetails(data.data);
          }
        } catch (error) {
          console.error('Failed to fetch portfolio details:', error);
        }
      }
    };

    fetchPortfolioDetails();
  }, [currentPortfolio?.id]);

  const handlePublishClick = () => {
    if (!currentPortfolio?.id || !/^[0-9a-fA-F]{24}$/.test(currentPortfolio.id)) {
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
      
      {/* Subtle Save Status Indicator - Webflow style */}
      {status === 'authenticated' && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 px-2 py-1">
          {isSaving ? (
            <>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" />
              <span className="hidden sm:inline">Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Saved</span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
              <span className="hidden sm:inline">Unsaved</span>
            </>
          )}
        </div>
      )}

      {/* Hidden trigger for save dialog when portfolio has no title */}
      {status === 'authenticated' && (
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
      {currentPortfolio?.id && /^[0-9a-fA-F]{24}$/.test(currentPortfolio.id) && (
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
          customSlug={portfolioDetails.customSlug}
          publicUrl={publicUrl}
          viewCount={portfolioDetails.viewCount || 0}
          isOpen={showPublishDialog}
          onClose={() => setShowPublishDialog(false)}
          onPublishSuccess={async () => {
            // Refetch portfolio details
            const response = await fetch(`/api/portfolios/${portfolioDetails.id}`);
            if (response.ok) {
              const data = await response.json();
              setPortfolioDetails(data.data);
            }
          }}
        />
      )}
    </div>
  );
};