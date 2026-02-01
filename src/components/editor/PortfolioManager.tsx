"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePortfolioPersistence } from '@/hooks/usePortfolioPersistence';
import { useEditorActions } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  Download, 
  Upload, 
  Trash2,
  Settings,
  AlertCircle,
  CheckCircle,
  Globe
} from 'lucide-react';
import { PublishDialog } from '@/components/portfolio/PublishDialog';

export const PortfolioManager: React.FC = () => {
  const { data: session, status } = useSession();
  const {
    isSaving,
    lastSaved,
    autoSaveEnabled,
    savedPortfolios,
    saveToDatabase,
    deletePortfolio,
    exportPortfolio,
    importPortfolio,
    getCurrentPortfolio,
    setAutoSaveEnabled
  } = usePortfolioPersistence();

  const { loadPortfolioData } = useEditorActions();
  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [portfolioDetails, setPortfolioDetails] = useState<any>(null);

  const handleSave = async () => {
    if (status !== 'authenticated') {
      alert('Please sign in to save your portfolio');
      return;
    }
    
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

  const handleDelete = async (portfolioId: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      try {
        await deletePortfolio(portfolioId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleExport = async (format: 'json' | 'html') => {
    try {
      await exportPortfolio(format);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    
    try {
      const portfolioData = await importPortfolio(importFile);
      loadPortfolioData(portfolioData);
      setImportFile(null);
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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

  return (
    <div className="flex items-center gap-2">
      
      {/* Auto-save Status */}
      {lastSaved && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span>Saved {lastSaved.toLocaleTimeString()}</span>
        </div>
      )}

      {/* Save Button */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isSaving}>
            <Save size={16} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Portfolio</DialogTitle>
            <DialogDescription>
              {getCurrentPortfolio() 
                ? `Update your portfolio: "${getCurrentPortfolio()?.title}".`
                : 'Give your portfolio a name to save it to your account.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="saveTitle">Portfolio Title</Label>
              <Input
                id="saveTitle"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Enter portfolio title"
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : (getCurrentPortfolio() ? 'Update' : 'Save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Button */}
      {currentPortfolio?.id && /^[0-9a-fA-F]{24}$/.test(currentPortfolio.id) && (
        <>
          <Button 
            variant={portfolioDetails?.isPublic ? "default" : "outline"} 
            size="sm" 
            onClick={handlePublishClick}
            disabled={!portfolioDetails}
          >
            <Globe size={16} className="mr-2" />
            {portfolioDetails?.isPublic ? 'Published' : 'Publish'}
          </Button>
          {portfolioDetails?.isPublic && portfolioDetails?.lastPublishedAt && portfolioDetails?.updatedAt && 
           new Date(portfolioDetails.updatedAt) > new Date(portfolioDetails.lastPublishedAt) && (
            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
              Unpublished changes
            </Badge>
          )}
        </>
      )}

      <Separator orientation="vertical" className="h-6" />

      {/* Export Button */}
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
          <Download size={16} className="mr-2" />
          Export JSON
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleExport('html')}>
          <Download size={16} className="mr-2" />
          Export HTML
        </Button>
      </div>

      {/* Import Button */}
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".json"
          onChange={(e) => setImportFile(e.target.files?.[0] || null)}
          className="hidden"
          id="import-file"
        />
        <Label htmlFor="import-file" asChild>
          <Button variant="outline" size="sm">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
        </Label>
        {importFile && (
          <Button size="sm" onClick={handleImport}>
            Load "{importFile.name}"
          </Button>
        )}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Settings Button */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Portfolio Settings</DialogTitle>
            <DialogDescription>
              Configure auto-save and other preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoSave">Auto-save</Label>
                <p className="text-sm text-gray-500">
                  Automatically save changes every 5 seconds
                </p>
              </div>
              <input
                type="checkbox"
                id="autoSave"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="rounded"
              />
            </div>
            
            <Separator />
            
              <div className="space-y-2">
              <h4 className="font-medium">Storage Info</h4>
              <div className="text-sm text-gray-600">
                <p>Saved portfolios: {savedPortfolios.length}</p>
                <p>Storage: Database (MongoDB)</p>
                {lastSaved && (
                  <p>Last saved: {lastSaved.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      {portfolioDetails && (
        <PublishDialog
          portfolioId={portfolioDetails.id}
          portfolioTitle={portfolioDetails.title}
          isPublic={portfolioDetails.isPublic || false}
          currentSlug={portfolioDetails.slug}
          customSlug={portfolioDetails.customSlug}
          publicUrl={portfolioDetails.isPublic ? `${window.location.origin}/p/${portfolioDetails.customSlug || portfolioDetails.slug}` : undefined}
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