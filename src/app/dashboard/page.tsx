"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Edit, 
  Download, 
  Trash,
  ExternalLink,
  Clock,
  FileText,
  Star,
  Globe
} from 'lucide-react';
import { usePortfolios } from '@/hooks/usePortfolios';
import { TemplatePreview } from '@/components/templates/TemplatePreview';
import { PublishDialog } from '@/components/portfolio/PublishDialog';

interface Profile {
  id: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  user: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { portfolios, loading: portfoliosLoading, deletePortfolio, getPortfolioStats, refetch } = usePortfolios();
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [publishDialogPortfolio, setPublishDialogPortfolio] = useState<any | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-6 text-sm font-medium text-slate-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="bg-slate-50/30">
      {/* Top Bar */}
      <nav className="bg-white border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-lg font-bold text-slate-900 tracking-tight">
                ProFolio
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-semibold text-slate-900">Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 hidden sm:inline">
                {session.user?.name || session.user?.email?.split('@')[0]}
              </span>
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs text-slate-600 hover:text-slate-900">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

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
                onClick={() => {
                  localStorage.removeItem('current_portfolio');
                  localStorage.removeItem('apply_template');
                  localStorage.removeItem('selected_template');
                  router.push('/editor-v2');
                }}
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 shadow-sm"
              >
                Create Portfolio
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
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">You're currently working on this</span>
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
                          <span className="font-medium text-slate-700">{activePortfolio.content?.sections?.length || 0} sections added</span>
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
                            const portfolioForEditor = {
                              id: activePortfolio.id,
                              title: activePortfolio.title,
                              data: {
                                sections: activePortfolio.content?.sections || [],
                                globalSettings: activePortfolio.content?.globalSettings || {}
                              },
                              createdAt: activePortfolio.createdAt,
                              updatedAt: activePortfolio.updatedAt
                            };
                            localStorage.setItem('current_portfolio', JSON.stringify(portfolioForEditor));
                            router.push('/editor-v2');
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
                    onClick={() => {
                      localStorage.removeItem('current_portfolio');
                      localStorage.removeItem('apply_template');
                      localStorage.removeItem('selected_template');
                      router.push('/editor-v2');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Create New
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
                              <span>{portfolio.content?.sections?.length || 0} sections</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            className="bg-slate-900 hover:bg-slate-800 h-8 text-xs shadow-sm"
                            onClick={() => {
                              const portfolioForEditor = {
                                id: portfolio.id,
                                title: portfolio.title,
                                data: {
                                  sections: portfolio.content?.sections || [],
                                  globalSettings: portfolio.content?.globalSettings || {}
                                },
                                createdAt: portfolio.createdAt,
                                updatedAt: portfolio.updatedAt
                              };
                              localStorage.setItem('current_portfolio', JSON.stringify(portfolioForEditor));
                              router.push('/editor-v2');
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

          {/* Templates Section - Secondary */}
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
              <button
                className="group bg-white border-2 border-slate-900/10 rounded-lg overflow-hidden hover:border-slate-900/20 hover:shadow-lg transition-all text-left relative"
                onClick={() => {
                  localStorage.setItem('apply_template', 'true');
                  localStorage.setItem('selected_template', 'dark-professional');
                  localStorage.removeItem('current_portfolio');
                  router.push('/editor-v2');
                }}
              >
                <div className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] font-medium px-2 py-0.5 rounded opacity-90">Recommended</div>
                <div className="aspect-[16/10] bg-slate-700 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors"></div>
                  <Button 
                    size="sm" 
                    className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 hover:bg-white shadow-lg"
                  >
                    Use Template
                  </Button>
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-medium text-slate-700">Dark Professional</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Best for developers</p>
                </div>
              </button>

              <button
                className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all text-left"
                onClick={() => {
                  localStorage.setItem('apply_template', 'true');
                  localStorage.setItem('selected_template', 'elegant-monochrome');
                  localStorage.removeItem('current_portfolio');
                  router.push('/editor-v2');
                }}
              >
                <div className="aspect-[16/10] bg-slate-50 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors"></div>
                  <Button 
                    size="sm" 
                    className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                  >
                    Use Template
                  </Button>
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-medium text-slate-700">Elegant Monochrome</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Business & consulting</p>
                </div>
              </button>

              <button
                className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all text-left"
                onClick={() => {
                  localStorage.setItem('apply_template', 'true');
                  localStorage.setItem('selected_template', 'warm-minimalist');
                  localStorage.removeItem('current_portfolio');
                  router.push('/editor-v2');
                }}
              >
                <div className="aspect-[16/10] bg-amber-50/50 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors"></div>
                  <Button 
                    size="sm" 
                    className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                  >
                    Use Template
                  </Button>
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-medium text-slate-700">Warm Minimalist</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Freelancers & creators</p>
                </div>
              </button>

              <button
                className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all text-left"
                onClick={() => {
                  localStorage.removeItem('current_portfolio');
                  localStorage.removeItem('apply_template');
                  localStorage.removeItem('selected_template');
                  router.push('/editor-v2');
                }}
              >
                <div className="aspect-[16/10] bg-slate-50 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors"></div>
                  <Button 
                    size="sm" 
                    className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                  >
                    Start Blank
                  </Button>
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-medium text-slate-700">Blank Canvas</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Full control</p>
                </div>
              </button>
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
          localStorage.setItem('apply_template', 'true');
          localStorage.setItem('selected_template', templateId);
          localStorage.removeItem('current_portfolio');
          router.push('/editor-v2');
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