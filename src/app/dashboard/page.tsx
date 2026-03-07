"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trash,
  Clock,
  Globe
} from 'lucide-react';
import { usePortfolios } from '@/hooks/usePortfolios';
import { TemplatePreview } from '@/components/templates/TemplatePreview';
import { PublishDialog } from '@/components/portfolio/PublishDialog';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { TEMPLATE_REGISTRY, BLANK_TEMPLATE, getTemplateName } from '@/lib/portfolio/registry';



export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { portfolios, loading: portfoliosLoading, deletePortfolio, refetch } = usePortfolios();
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [publishDialogPortfolio, setPublishDialogPortfolio] = useState<{ id: string; title: string; slug: string; customSlug?: string; isPublic: boolean; viewCount?: number } | null>(null);
  const [isCreating, setIsCreating] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch('/api/profile')
        .catch((error) => console.error('Error fetching profile:', error))
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Single function replacing 5 identical inline fetch blocks.
  // title    — portfolio title to create
  // templateId — template to apply ('dark-professional' | 'elegant-monochrome' |
  //              'warm-minimalist' | undefined for blank)
  const createPortfolio = async (title: string, templateId?: string) => {
    try {
      setIsCreating(templateId ?? 'blank');
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: { sections: [] },
          template: templateId || 'blank',
          isPublic: false,
        }),
      });
      const result = await response.json();
      if (result.success) {
        const editorUrl = templateId
          ? `/editor-v2?id=${result.data.id}&template=${templateId}`
          : `/editor-v2?id=${result.data.id}`;
        router.push(editorUrl);
      } else {
        alert('Failed to create portfolio: ' + result.error);
      }
    } catch {
      alert('Failed to create portfolio. Please try again.');
    } finally {
      setIsCreating(null);
    }
  };


  if (!user || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-6 text-sm font-medium text-slate-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/30">
      <DashboardNav />

      <main className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-7">
          {/* Active Portfolio Workspace Card */}
          {portfoliosLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-white">
              <p className="text-slate-600 mb-6 text-sm">No portfolios yet. Create one to get started.</p>
              <Button
                onClick={() => createPortfolio('Untitled Portfolio')}
                disabled={isCreating !== null}
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 shadow-sm"
              >
                {isCreating === 'blank' ? 'Creating...' : 'Create Portfolio'}
              </Button>
            </div>
          ) : (
            <>
              {/* Active Portfolio Card */}
              {(() => {
                const activePortfolio = [...portfolios].sort((a, b) =>
                  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                )[0];

                return (
                  <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-xl p-6 sm:p-8 shadow-md border border-slate-200/60">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">You&apos;re currently working on this</span>
                          {activePortfolio.isPublic ? (
                            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-xs">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-slate-500 border-slate-200">
                              Draft
                            </Badge>
                          )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
                          {activePortfolio.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-1">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            Updated {new Date(activePortfolio.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="font-medium text-slate-700">{activePortfolio.sectionCount} sections added</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {activePortfolio.isPublic ? 'Live on the web' : 'Last edited by you'}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          size="lg"
                          className="bg-slate-900 hover:bg-slate-800 shadow-sm"
                          onClick={() => {
                            router.push(`/editor-v2?id=${activePortfolio.id}`);
                          }}
                        >
                          Continue Editing
                        </Button>
                        {activePortfolio.isPublic ? (
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setPublishDialogPortfolio(activePortfolio)}
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        ) : (
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setPublishDialogPortfolio(activePortfolio)}
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            Publish
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* All Portfolios */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-slate-500">Recent portfolios</h2>
                  <Button
                    onClick={() => createPortfolio('Untitled Portfolio')}
                    disabled={isCreating !== null}
                    variant="outline"
                    size="sm"
                  >
                    {isCreating === 'blank' ? 'Creating...' : 'Create New'}
                  </Button>
                </div>
                <div className="bg-white border border-slate-200/60 rounded-lg divide-y divide-slate-100">
                  {portfolios.map((portfolio) => (
                    <div key={portfolio.id} className="group p-3.5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        {/* Portfolio Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-1">
                              <h3 className="text-sm font-medium text-slate-900 truncate">
                                {portfolio.title}
                              </h3>
                              {portfolio.isPublic ? (
                                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-xs px-2 py-0">
                                  Published
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs text-slate-400 border-slate-200 px-2 py-0">
                                  Draft
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>Updated {new Date(portfolio.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              <span>•</span>
                              <span>{portfolio.sectionCount} sections</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            className="bg-slate-900 hover:bg-slate-800 h-8 text-xs shadow-sm"
                            onClick={() => {
                              router.push(`/editor-v2?id=${portfolio.id}`);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-slate-500"
                            onClick={() => setPublishDialogPortfolio(portfolio)}
                          >
                            {portfolio.isPublic ? 'View' : 'Publish'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              if (confirm(`Delete "${portfolio.title}"? This cannot be undone.`)) {
                                deletePortfolio(portfolio.id);
                              }
                            }}
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Templates Section — data-driven from TEMPLATE_REGISTRY */}
          <div className="pt-7 border-t border-slate-200/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-slate-600">Start something new</h2>
                <p className="text-xs text-slate-500 mt-0.5">Templates provide a starting point—customize them however you like</p>
              </div>
              <Link href="/templates">
                <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-900">
                  View all
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...TEMPLATE_REGISTRY, BLANK_TEMPLATE].map((template) => (
                <div
                  key={template.id ?? 'blank'}
                  className={`group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all text-left cursor-pointer ${template.badge
                    ? 'border-2 border-slate-900/10 hover:border-slate-900/20'
                    : 'border border-slate-200 hover:border-slate-300'
                    }`}
                  onClick={() => createPortfolio(template.defaultTitle, template.id ?? undefined)}
                >
                  {template.badge && (
                    <div className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] font-medium px-2 py-0.5 rounded opacity-90">
                      {template.badge}
                    </div>
                  )}
                  <div className={`aspect-[16/10] ${template.previewBg} flex items-center justify-center relative`}>
                    <div className={`absolute inset-0 bg-transparent group-hover:${template.hoverOverlay} transition-colors`} />
                    <span
                      className={`absolute opacity-0 group-hover:opacity-100 transition-opacity ${template.ctaStyle} inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-md h-9 px-3`}
                    >
                      {template.id ? 'Use Template' : 'Start Blank'}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-xs font-medium text-slate-700">{template.label}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Template Preview Modal */}
      <TemplatePreview
        templateId={previewTemplateId}
        isOpen={!!previewTemplateId}
        onClose={() => setPreviewTemplateId(null)}
        onUseTemplate={(templateId) => {
          createPortfolio(getTemplateName(templateId), templateId);
        }}
      />

      {/* Publish Dialog */}
      {publishDialogPortfolio && (
        <PublishDialog
          portfolioId={publishDialogPortfolio.id}
          portfolioTitle={publishDialogPortfolio.title}
          isPublic={publishDialogPortfolio.isPublic || false}
          currentSlug={publishDialogPortfolio.slug}
          customSlug={publishDialogPortfolio.customSlug}
          publicUrl={publishDialogPortfolio.isPublic ? `${window.location.origin}/p/${publishDialogPortfolio.customSlug || publishDialogPortfolio.slug}` : undefined}
          viewCount={publishDialogPortfolio.viewCount || 0}
          isOpen={true}
          onClose={() => setPublishDialogPortfolio(null)}
          onPublishSuccess={() => refetch()}
        />
      )}
    </div>
  );
}