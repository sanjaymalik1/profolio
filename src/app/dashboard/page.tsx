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
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
                ProFolio
              </Link>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="text-sm text-slate-700 hidden md:inline max-w-[200px] truncate font-medium">
                {session.user?.name || session.user?.email}
              </span>
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="secondary" size="sm" className="text-sm border-slate-200">
                    <span className="hidden sm:inline">Admin Panel</span>
                    <span className="sm:hidden">Admin</span>
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut} className="text-sm border-slate-200 hover:bg-slate-50">
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Manage your portfolios and profile</p>
          </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Profile Card */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Avatar className="h-12 w-12 border-2 border-slate-100">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
                      {(session.user?.name || session.user?.email || 'U')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold text-slate-900">Profile</CardTitle>
                    <CardDescription className="text-xs truncate">
                      {profile?.firstName && profile?.lastName 
                        ? `${profile.firstName} ${profile.lastName}`
                        : session.user?.name || 'Complete your profile'
                      }
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="w-full border-slate-200 hover:bg-slate-50">
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Portfolios Card */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold text-slate-900">Portfolios</CardTitle>
                    <CardDescription className="text-xs">
                      {portfoliosLoading ? 'Loading...' : `${getPortfolioStats().total} Created`}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  {portfolios.length > 0 && (
                    <p className="text-xs text-slate-600 text-center font-medium">
                      {getPortfolioStats().recentlyUpdated} updated recently
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Account Info Card */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="h-12 w-12 rounded-full bg-purple-100 border-2 border-purple-200 flex items-center justify-center">
                    <span className="text-purple-700 text-xl font-bold">A</span>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold text-slate-900">Account</CardTitle>
                    <CardDescription className="text-xs">
                      {(session.user as any)?.role || 'USER'}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-xs text-slate-600 truncate">
                    {session.user?.email}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Button 
                  onClick={() => {
                    // Clear all portfolio-related flags to start fresh with section palette
                    localStorage.removeItem('current_portfolio');
                    localStorage.removeItem('apply_template');
                    localStorage.removeItem('selected_template');
                    router.push('/editor-v2');
                  }}
                  className="w-full sm:w-auto"
                  size="default"
                >
                  Create New Portfolio
                </Button>
                <Link href="/templates" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50">Browse Templates</Button>
                </Link>
              </div>
            </div>

            {/* Template Showcase */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Popular Templates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-slate-900 to-blue-600 rounded-lg mb-3 flex items-center justify-center shadow-inner">
                      <span className="text-white font-semibold">Dark</span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900">Dark Professional</h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">Sleek dark theme for developers and tech professionals</p>
                    <Badge variant="outline" className="text-xs mt-2 border-slate-200">Developer</Badge>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline"
                        className="flex-1 text-xs border-slate-200 hover:bg-slate-50" 
                        size="sm"
                        onClick={() => setPreviewTemplateId('dark-professional')}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Preview
                      </Button>
                      <Button 
                        className="flex-1 text-xs" 
                        size="sm"
                        onClick={() => {
                          localStorage.setItem('apply_template', 'true');
                          localStorage.setItem('selected_template', 'dark-professional');
                          localStorage.removeItem('current_portfolio');
                          router.push('/editor-v2');
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg mb-3 flex items-center justify-center shadow-inner">
                      <span className="text-gray-800 font-semibold">Elegant</span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900">Elegant Monochrome</h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">Sophisticated design for business professionals</p>
                    <Badge variant="outline" className="text-xs mt-2 border-slate-200">Business</Badge>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline"
                        className="flex-1 text-xs border-slate-200 hover:bg-slate-50" 
                        size="sm"
                        onClick={() => setPreviewTemplateId('elegant-monochrome')}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Preview
                      </Button>
                      <Button 
                        className="flex-1 text-xs" 
                        size="sm"
                        onClick={() => {
                          localStorage.setItem('apply_template', 'true');
                          localStorage.setItem('selected_template', 'elegant-monochrome');
                          localStorage.removeItem('current_portfolio');
                          router.push('/editor-v2');
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-amber-100 to-red-200 rounded-lg mb-3 flex items-center justify-center shadow-inner">
                      <span className="text-red-800 font-semibold">Warm</span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900">Warm Minimalist</h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">Approachable design for freelancers and consultants</p>
                    <Badge variant="outline" className="text-xs mt-2 border-slate-200">Freelancer</Badge>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline"
                        className="flex-1 text-xs border-slate-200 hover:bg-slate-50" 
                        size="sm"
                        onClick={() => setPreviewTemplateId('warm-minimalist')}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Preview
                      </Button>
                      <Button 
                        className="flex-1 text-xs" 
                        size="sm"
                        onClick={() => {
                          localStorage.setItem('apply_template', 'true');
                          localStorage.setItem('selected_template', 'warm-minimalist');
                          localStorage.removeItem('current_portfolio');
                          router.push('/editor-v2');
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Portfolio Management */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Your Portfolios</h2>
                {portfolios.length > 0 && (
                  <Badge variant="secondary" className="text-sm w-fit bg-slate-100 text-slate-700 border border-slate-200">
                    {portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              
              {portfoliosLoading ? (
                <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
                  <p className="mt-4 text-sm font-medium text-slate-700">Loading portfolios...</p>
                </div>
              ) : portfolios.length === 0 ? (
                <Card className="text-center py-12 border-slate-200 shadow-sm">
                  <CardContent>
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No portfolios yet</h3>
                    <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">Create your first portfolio to showcase your work and share it with the world</p>
                    <Button 
                      onClick={() => {
                        // Clear any existing portfolio session to start fresh
                        localStorage.removeItem('current_portfolio');
                        router.push('/editor-v2');
                      }}
                    >
                      Create Your First Portfolio
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {portfolios.map((portfolio) => (
                    <Card key={portfolio.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2 sm:pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm sm:text-base line-clamp-1">{portfolio.title}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1 text-xs sm:text-sm">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{new Date(portfolio.updatedAt).toLocaleDateString()}</span>
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-1 flex-shrink-0">
                            <Badge variant="outline" className="text-xs">
                              {portfolio.content?.sections?.length || 0}
                            </Badge>
                            {portfolio.isPublic && (
                              <>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                                  <Globe className="h-3 w-3 mr-1" />
                                  <span className="hidden sm:inline">Live</span>
                                </Badge>
                                {portfolio.lastPublishedAt && portfolio.updatedAt && 
                                 new Date(portfolio.updatedAt) > new Date(portfolio.lastPublishedAt) && (
                                  <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                                    New
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => {
                              // Load portfolio into editor with proper structure
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
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant={portfolio.isPublic ? "default" : "outline"}
                            className="text-xs"
                            onClick={() => setPublishDialogPortfolio(portfolio)}
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">{portfolio.isPublic ? 'Published' : 'Publish'}</span>
                            <span className="sm:hidden">{portfolio.isPublic ? 'Live' : 'Pub'}</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => {
                              // Export portfolio
                              const dataStr = JSON.stringify(portfolio.content, null, 2);
                              const dataBlob = new Blob([dataStr], { type: 'application/json' });
                              const url = URL.createObjectURL(dataBlob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `${portfolio.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
                              link.click();
                              URL.revokeObjectURL(url);
                            }}
                          >
                            <Download className="h-3 w-3" />
                            <span className="ml-1 hidden sm:inline">Export</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 text-xs"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${portfolio.title}"?`)) {
                                deletePortfolio(portfolio.id);
                              }
                            }}
                          >
                            <Trash className="h-3 w-3" />
                            <span className="ml-1 hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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