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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                ProFolio
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {session.user?.name || session.user?.email}</span>
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="secondary" size="sm">
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Button variant="destructive" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Avatar>
                    <AvatarFallback>
                      {(session.user?.name || session.user?.email || 'U')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <CardTitle className="text-sm font-medium">Profile</CardTitle>
                    <CardDescription>
                      {profile?.firstName && profile?.lastName 
                        ? `${profile.firstName} ${profile.lastName}`
                        : session.user?.name || 'Complete your profile'
                      }
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="w-full">
                      Edit profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Portfolios Card */}
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <CardTitle className="text-sm font-medium">Portfolios</CardTitle>
                    <CardDescription>
                      {portfoliosLoading ? 'Loading...' : `${getPortfolioStats().total} Created`}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {portfolios.length > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      {getPortfolioStats().recentlyUpdated} updated recently
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Account Info Card */}
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">A</span>
                  </div>
                  <div className="ml-4">
                    <CardTitle className="text-sm font-medium">Account</CardTitle>
                    <CardDescription>
                      {(session.user as any)?.role || 'USER'}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {session.user?.email}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => {
                    // Clear all portfolio-related flags to start fresh with section palette
                    localStorage.removeItem('current_portfolio');
                    localStorage.removeItem('apply_template');
                    localStorage.removeItem('selected_template');
                    router.push('/editor-v2');
                  }}
                >
                  Create New Portfolio
                </Button>
                <Link href="/templates">
                  <Button variant="outline">Browse Templates</Button>
                </Link>
              </div>
            </div>

            {/* Template Showcase */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Popular Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-slate-900 to-blue-600 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-white font-medium">Dark</span>
                    </div>
                    <h3 className="font-medium text-sm">Dark Professional</h3>
                    <p className="text-xs text-gray-600 mt-1">Sleek dark theme for developers and tech professionals</p>
                    <Badge variant="outline" className="text-xs mt-2">Developer</Badge>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline"
                        className="flex-1" 
                        size="sm"
                        onClick={() => setPreviewTemplateId('dark-professional')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        className="flex-1" 
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

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-800 font-medium">Elegant</span>
                    </div>
                    <h3 className="font-medium text-sm">Elegant Monochrome</h3>
                    <p className="text-xs text-gray-600 mt-1">Sophisticated design for business professionals</p>
                    <Badge variant="outline" className="text-xs mt-2">Business</Badge>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline"
                        className="flex-1" 
                        size="sm"
                        onClick={() => setPreviewTemplateId('elegant-monochrome')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        className="flex-1" 
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

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-amber-100 to-red-200 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-red-800 font-medium">Warm</span>
                    </div>
                    <h3 className="font-medium text-sm">Warm Minimalist</h3>
                    <p className="text-xs text-gray-600 mt-1">Approachable design for freelancers and consultants</p>
                    <Badge variant="outline" className="text-xs mt-2">Freelancer</Badge>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline"
                        className="flex-1" 
                        size="sm"
                        onClick={() => setPreviewTemplateId('warm-minimalist')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        className="flex-1" 
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
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Your Portfolios</h2>
                {portfolios.length > 0 && (
                  <Badge variant="secondary">
                    {portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              
              {portfoliosLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading portfolios...</p>
                </div>
              ) : portfolios.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios yet</h3>
                    <p className="text-gray-600 mb-4">Create your first portfolio to get started</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolios.map((portfolio) => (
                    <Card key={portfolio.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base line-clamp-1">{portfolio.title}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {new Date(portfolio.updatedAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-1 ml-2">
                            <Badge variant="outline">
                              {portfolio.content?.sections?.length || 0} sections
                            </Badge>
                            {portfolio.isPublic && (
                              <>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Live
                                </Badge>
                                {portfolio.lastPublishedAt && portfolio.updatedAt && 
                                 new Date(portfolio.updatedAt) > new Date(portfolio.lastPublishedAt) && (
                                  <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                                    Updated
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
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
                            onClick={() => setPublishDialogPortfolio(portfolio)}
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            {portfolio.isPublic ? 'Published' : 'Publish'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
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
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${portfolio.title}"?`)) {
                                deletePortfolio(portfolio.id);
                              }
                            }}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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