"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trash2,
  Clock,
  Globe,
  Plus,
  ExternalLink,
  Pencil,
  LayoutTemplate,
} from 'lucide-react';
import { usePortfolios } from '@/hooks/usePortfolios';
import { TemplatePreview } from '@/components/templates/TemplatePreview';
import { PublishDialog } from '@/components/portfolio/PublishDialog';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { TEMPLATE_REGISTRY, BLANK_TEMPLATE, getTemplateName } from '@/lib/portfolio/registry';
import { ScaledTemplatePreview } from '@/components/templates/ScaledPreview';
import type { EditorSection } from '@/types/editor';

// ─── Portfolio card ──────────────────────────────────────────────────────────

/** Extract templateData from portfolio content sections */
function getPortfolioTemplateData(
  content?: { sections?: Array<{ type: string; data: Record<string, unknown> }> } | null
): Record<string, unknown> | undefined {
  if (!content?.sections?.length) return undefined;
  const templateSection = content.sections.find((s) => s.type === 'template');
  if (templateSection) {
    return (templateSection.data as { templateData?: Record<string, unknown> }).templateData ?? templateSection.data;
  }
  return undefined;
}

interface PortfolioCardProps {
  portfolio: {
    id: string;
    title: string;
    slug: string;
    customSlug?: string;
    template: string;
    isPublic: boolean;
    content?: { sections?: Array<{ type: string; data: Record<string, unknown> }> } | null;
    sectionCount: number;
    viewCount: number;
    updatedAt: string;
  };
  onEdit: () => void;
  onPublish: () => void;
  onDelete: () => void;
}

function PortfolioCard({ portfolio, onEdit, onPublish, onDelete }: PortfolioCardProps) {
  const templateData = getPortfolioTemplateData(portfolio.content);
  const sections = portfolio.content?.sections as EditorSection[] | undefined;

  return (
    <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
      {/* Thumbnail */}
      <div
        className="relative w-full aspect-[16/10] overflow-hidden"
        onClick={onEdit}
      >
        <ScaledTemplatePreview templateId={portfolio.template} data={templateData} sections={sections} />

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-200 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 text-xs font-semibold rounded-lg shadow-md hover:bg-slate-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onPublish(); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 text-xs font-semibold rounded-lg shadow-md hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {portfolio.isPublic ? 'View' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1" onClick={onEdit}>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium text-slate-900 truncate">{portfolio.title}</span>
            {portfolio.isPublic ? (
              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-[10px] px-1.5 py-0 shrink-0">
                Live
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200 px-1.5 py-0 shrink-0">
                Draft
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock className="w-3 h-3" />
            <span>
              {new Date(portfolio.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="text-slate-300">·</span>
            <span>{portfolio.sectionCount} sections</span>
          </div>
        </div>

        {/* Delete — visible on hover */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-150 shrink-0"
          title="Delete portfolio"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <LayoutTemplate className="w-7 h-7 text-slate-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center shadow-sm">
          <Plus className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1.5">Build your first portfolio</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-xs">
        Pick a template to get started or begin from a blank canvas.
      </p>
      <Button
        onClick={onCreate}
        className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-5 shadow-sm"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Create a site
      </Button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { portfolios, loading: portfoliosLoading, deletePortfolio, refetch } = usePortfolios();
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [publishDialogPortfolio, setPublishDialogPortfolio] = useState<{
    id: string; title: string; slug: string; customSlug?: string; isPublic: boolean; viewCount?: number;
  } | null>(null);
  const [isCreating, setIsCreating] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch('/api/profile')
        .catch((error) => console.error('Error fetching profile:', error))
        .finally(() => setLoading(false));
    }
  }, [user]);

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-slate-900 mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <DashboardNav />

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-20">

        {/* ── Start from a template ──────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Start from a template</h2>
              <p className="text-xs text-slate-500 mt-0.5">Pick a starting point and customise it your way</p>
            </div>
            <Link href="/templates">
              <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-900 gap-1">
                View all
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...TEMPLATE_REGISTRY, BLANK_TEMPLATE].map((template) => (
              <div
                key={template.id ?? 'blank'}
                className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => createPortfolio(template.defaultTitle, template.id ?? undefined)}
              >
                {template.badge && (
                  <div className="absolute top-2 right-2 z-10 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {template.badge}
                  </div>
                )}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ScaledTemplatePreview templateId={template.id} />
                  <div className="absolute inset-0 bg-transparent group-hover:bg-slate-900/10 transition-colors" />
                  <span className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <span className={`${template.ctaStyle} inline-flex items-center justify-center text-xs font-semibold rounded-lg h-8 px-3 shadow-md`}>
                      {template.id ? 'Use Template' : 'Start Blank'}
                    </span>
                  </span>
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-xs font-semibold text-slate-800">{template.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Workspace header ───────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6 pt-8 border-t border-slate-200">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">My Portfolios</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage and publish your portfolio sites</p>
          </div>
          <Button
            onClick={() => createPortfolio('Untitled Portfolio')}
            disabled={isCreating !== null}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm text-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {isCreating === 'blank' ? 'Creating…' : 'New Portfolio'}
          </Button>
        </div>

        {/* ── Portfolio grid ─────────────────────────────────────────── */}
        {portfoliosLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-slate-200 border-t-slate-900" />
          </div>
        ) : portfolios.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl">
            <EmptyState onCreate={() => createPortfolio('Untitled Portfolio')} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onEdit={() => router.push(`/editor-v2?id=${portfolio.id}`)}
                onPublish={() => setPublishDialogPortfolio(portfolio)}
                onDelete={() => {
                  if (confirm(`Delete "${portfolio.title}"? This cannot be undone.`)) {
                    deletePortfolio(portfolio.id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      <TemplatePreview
        templateId={previewTemplateId}
        isOpen={!!previewTemplateId}
        onClose={() => setPreviewTemplateId(null)}
        onUseTemplate={(templateId) => {
          createPortfolio(getTemplateName(templateId), templateId);
        }}
      />

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
