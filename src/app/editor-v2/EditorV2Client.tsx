"use client";

import React from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { EditorProvider, useEditor } from '@/contexts/EditorContext';
import { SectionPalette } from '@/components/editor/SectionPalette';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { PropertyPanel } from '@/components/editor/PropertyPanel';
import { PortfolioPreview } from '@/components/editor/PortfolioPreview';
import { PortfolioManager } from '@/components/editor/PortfolioManager';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Eye,
  LogIn,
  ArrowLeft
} from 'lucide-react';

function EditorLayout() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = React.useState('canvas');
  const [isMounted, setIsMounted] = React.useState(false);
  const { state, isLoading } = useEditor();

  // Client-only rendering guard to prevent hydration mismatches
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Unsaved changes protection
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.hasUnsavedChanges]);

  // Determine if section palette should be visible
  // Hide it if there's a template section in the portfolio
  const showSectionPalette = !state.sections.some(section => section.type === 'template');

  // Don't render toolbar buttons until mounted to prevent hydration errors
  // Show loading skeleton while portfolio data is loading
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Editor Header - Simplified for loading state */}
        <header className="border-b border-slate-200/60 bg-white">
          <div className="flex h-14 items-center justify-between px-6">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-slate-900 tracking-tight">Profolio</h1>
                  <p className="text-xs text-slate-500">Design your professional portfolio</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Loading skeleton for header buttons */}
              <div className="w-20 h-8 bg-slate-200 rounded-md animate-pulse" />
              <div className="w-32 h-8 bg-slate-200 rounded-md animate-pulse" />
              <div className="w-24 h-8 bg-slate-200 rounded-md animate-pulse" />
            </div>
          </div>
        </header>

        {/* Editor Layout - Loading skeleton */}
        <div className="flex h-[calc(100vh-3.5rem)]">
          {/* Left Sidebar Skeleton */}
          <aside className="w-64 lg:w-72 xl:w-80 border-r border-slate-200/50 bg-white overflow-y-auto hidden md:block">
            <div className="p-5 space-y-4">
              <div className="h-6 bg-slate-200 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
              </div>
            </div>
          </aside>

          {/* Main Content Area Skeleton */}
          <main className="flex-1 overflow-hidden bg-slate-50/50">
            <div className="h-full p-8 space-y-6">
              <div className="bg-white rounded-lg border border-slate-200 p-8 space-y-4">
                <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse" />
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-8 space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
              </div>
            </div>
          </main>

          {/* Right Sidebar Skeleton */}
          <aside className="w-80 border-l border-slate-200/50 bg-white overflow-y-auto hidden lg:block">
            <div className="p-5 space-y-4">
              <div className="h-6 bg-slate-200 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-10 bg-slate-100 rounded animate-pulse" />
                <div className="h-10 bg-slate-100 rounded animate-pulse" />
                <div className="h-10 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-slate-50">
        {/* Editor Header - Responsive Minimal Design */}
        <header className="border-b border-slate-200/60 bg-white">
          <div className="flex h-12 sm:h-14 items-center justify-between px-3 sm:px-4 lg:px-6">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xs sm:text-sm">P</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-semibold text-slate-900 tracking-tight">Profolio</h1>
                  <p className="text-xs text-slate-500 hidden lg:block">Design your professional portfolio</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              {/* Back to Dashboard */}
              {isLoaded && user && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 h-7 sm:h-8 px-1.5 sm:px-2 text-xs rounded-md"
                  asChild
                >
                  <Link href="/dashboard">
                    <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5 sm:mr-1.5" />
                    <span className="hidden md:inline">Dashboard</span>
                  </Link>
                </Button>
              )}
              
              {/* Auth Status - Subtle */}
              {isLoaded && !user && (
                <div className="text-xs text-slate-500 px-2 py-1 rounded-md hidden md:flex items-center gap-1.5">
                  <LogIn className="h-3.5 w-3.5" />
                  <Link href="/sign-in" className="hover:text-slate-700">Sign in</Link>
                </div>
              )}

              {/* Canvas/Preview Toggle - Responsive */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="grid w-full grid-cols-2 h-7 sm:h-8 bg-slate-100/50 p-0.5">
                  <TabsTrigger value="canvas" className="text-xs font-medium px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-sm">
                    <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs font-medium px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-sm">
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline">Preview</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Portfolio Management */}
              <PortfolioManager />
            </div>
          </div>
        </header>

        {/* Editor Layout - Responsive with mobile-first approach */}
        <div className="flex h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)]">
          
          {/* Left Sidebar - Section Palette (Hidden on mobile/tablet, visible on desktop) */}
          {showSectionPalette && (
            <aside className="w-56 lg:w-64 xl:w-72 2xl:w-80 border-r border-slate-200/50 bg-white overflow-y-auto hidden lg:block">
              <div className="p-3 lg:p-4 xl:p-5">
                <SectionPalette />
              </div>
            </aside>
          )}

          {/* Main Content Area - Full width on mobile, flexible on larger screens */}
          <main className="flex-1 overflow-hidden bg-slate-50/50 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsContent value="canvas" className="h-full m-0 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
                <EditorCanvas />
              </TabsContent>
              <TabsContent value="preview" className="h-full m-0 overflow-hidden bg-white">
                <PortfolioPreview />
              </TabsContent>
            </Tabs>
          </main>

          {/* Right Sidebar - Properties Panel (Hidden on small mobile, drawer-style on tablet, sidebar on desktop) */}
          <PropertyPanel />
        </div>
      </div>
  );
}

export default function EditorV2Client() {
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get('id');
  const templateId = searchParams.get('template');

  return (
    <EditorProvider portfolioId={portfolioId || undefined} templateId={templateId || undefined}>
      <EditorLayout />
    </EditorProvider>
  );
}
