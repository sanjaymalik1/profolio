"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Globe,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

interface PublishDialogProps {
  portfolioId: string;
  portfolioTitle: string;
  isPublic: boolean;
  currentSlug: string;
  customSlug?: string;
  publicUrl?: string;
  viewCount?: number;
  isOpen: boolean;
  onClose: () => void;
  onPublishSuccess?: () => void;
}

export function PublishDialog({
  portfolioId,
  portfolioTitle,
  isPublic: initialIsPublic,
  currentSlug,
  customSlug: initialCustomSlug,
  publicUrl: initialPublicUrl,
  viewCount = 0,
  isOpen,
  onClose,
  onPublishSuccess,
}: PublishDialogProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [customSlug, setCustomSlug] = useState(initialCustomSlug || '');
  const [publicUrl, setPublicUrl] = useState(initialPublicUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/portfolios/${portfolioId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublic: true,
          customSlug: customSlug || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to publish portfolio');
        return;
      }

      setIsPublic(true);
      setPublicUrl(data.data.publicUrl);
      onPublishSuccess?.();
    } catch (err) {
      setError('An error occurred while publishing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm('Are you sure you want to unpublish this portfolio? It will no longer be accessible via the public URL.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/portfolios/${portfolioId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: false }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to unpublish portfolio');
        return;
      }

      setIsPublic(false);
      setPublicUrl('');
      onPublishSuccess?.();
      onClose();
    } catch (err) {
      setError('An error occurred while unpublishing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVisitSite = () => {
    if (publicUrl) {
      window.open(publicUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {isPublic ? 'Manage Published Portfolio' : 'Publish Portfolio'}
          </DialogTitle>
          <DialogDescription>
            {isPublic 
              ? 'Your portfolio is live and accessible to everyone'
              : 'Make your portfolio publicly accessible with a custom URL'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Portfolio Title */}
          <div>
            <Label className="text-sm font-medium">Portfolio</Label>
            <p className="text-sm text-gray-600 mt-1">{portfolioTitle}</p>
          </div>

          {/* Status Badge */}
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <div className="mt-1">
              {isPublic ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <Eye className="w-3 h-3 mr-1" />
                  Published
                </Badge>
              ) : (
                <Badge variant="outline">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Not Published
                </Badge>
              )}
            </div>
          </div>

          {/* Custom Slug Input (only show when not published) */}
          {!isPublic && (
            <div>
              <Label htmlFor="customSlug" className="text-sm font-medium">
                Custom URL (optional)
              </Label>
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">/p/</span>
                  <Input
                    id="customSlug"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder={currentSlug}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use default: /p/{currentSlug}
                </p>
              </div>
            </div>
          )}

          {/* Public URL (only show when published) */}
          {isPublic && publicUrl && (
            <div>
              <Label className="text-sm font-medium">Public URL</Label>
              <div className="flex gap-2 mt-1">
                <Input value={publicUrl} readOnly className="flex-1" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyUrl}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleVisitSite}
                  className="shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* View Count (only show when published) */}
          {isPublic && (
            <div>
              <Label className="text-sm font-medium">Views</Label>
              <p className="text-2xl font-bold text-gray-900 mt-1">{viewCount.toLocaleString()}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          {isPublic ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={handleUnpublish}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Unpublish
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handlePublish} disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Publish Portfolio
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
