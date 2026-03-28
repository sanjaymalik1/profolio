"use client";

import React from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { EditorProvider, useEditor } from '@/contexts/EditorContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
  ArrowLeft,
  FileBadge,
  PanelLeft,
  SlidersHorizontal
} from 'lucide-react';
import { EditorLoadingSkeleton } from './EditorLoadingSkeleton';
import { ResumeImportModal } from '@/components/editor/ResumeImportModal';

function EditorLayout() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = React.useState('canvas');
  const [isMounted, setIsMounted] = React.useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = React.useState(false);
  const [showMobileSections, setShowMobileSections] = React.useState(true);
  const [showMobileProperties, setShowMobileProperties] = React.useState(false);
  const { state, isLoading } = useEditor();

  // Client-only rendering guard to prevent hydration mismatches
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    document.body.classList.add('editor-mode');
    return () => {
      document.body.classList.remove('editor-mode');
    };
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
    return <EditorLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea] editor-typography">
      {/* Editor Header - Responsive Minimal Design */}
      <header className="border-b border-[#d8d0c6] bg-[#f5f1ea]">
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="flex items-center">
              <div>
                <h1 className="landing-serif text-[1.7rem] sm:text-[2.05rem] font-semibold uppercase leading-none tracking-[-0.01em] text-[#6B7A52]">
                  PROFOLIO
                </h1>
                <p className="text-[0.7rem] uppercase tracking-[0.11em] text-[#5c554d] hidden lg:block">Design your professional portfolio</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 min-w-0 overflow-x-auto">
            {/* Back to Dashboard */}
            {isLoaded && user && (
              <Button
                variant="ghost"
                size="sm"
                className="text-[#5c554d] hover:text-[#2d2a26] hover:bg-[#ece4da] h-7 sm:h-8 px-1.5 sm:px-2 text-[0.74rem] uppercase tracking-[0.1em] rounded-md"
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
              <div className="text-[0.74rem] uppercase tracking-[0.1em] text-[#5c554d] px-2 py-1 rounded-md hidden md:flex items-center gap-1.5">
                <LogIn className="h-3.5 w-3.5" />
                <Link href="/sign-in" className="hover:text-[#2d2a26]">Sign in</Link>
              </div>
            )}

            {/* Canvas/Preview Toggle - Responsive */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="grid w-full grid-cols-2 h-7 sm:h-8 bg-[#ece4da] p-0.5 border border-[#d8d0c6]">
                <TabsTrigger value="canvas" className="text-[0.74rem] uppercase tracking-[0.1em] font-medium px-2 sm:px-3 data-[state=active]:bg-[#f8f4ee] data-[state=active]:text-[#2d2a26] rounded-sm">
                  <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline">Edit</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-[0.74rem] uppercase tracking-[0.1em] font-medium px-2 sm:px-3 data-[state=active]:bg-[#f8f4ee] data-[state=active]:text-[#2d2a26] rounded-sm">
                  <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline">Preview</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Import Resume Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResumeModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 h-8 border-[#d8d0c6] text-[#5c554d] hover:bg-[#ece4da] hover:text-[#2d2a26] bg-[#f8f4ee] transition-colors"
            >
              <FileBadge className="w-4 h-4" />
              <span className="text-[0.74rem] font-semibold uppercase tracking-[0.1em]">Import Resume</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResumeModalOpen(true)}
              className="sm:hidden h-8 w-8 p-0 border-[#d8d0c6] text-[#5c554d] hover:bg-[#ece4da] hover:text-[#2d2a26] bg-[#f8f4ee]"
              title="Import Resume"
            >
              <FileBadge className="w-4 h-4" />
            </Button>

            {/* Portfolio Management */}
            <PortfolioManager />
          </div>
        </div>
      </header>

      {/* Editor Layout - Responsive with mobile-first approach */}
      <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">

        {/* Left Sidebar - Section Palette (Hidden on mobile/tablet, visible on desktop) */}
        {showSectionPalette && (
          <aside className="w-56 lg:w-64 xl:w-72 2xl:w-80 border-r border-slate-200/50 bg-[#f5f1ea] overflow-y-auto hidden lg:block">
            <div className="p-3 lg:p-4 xl:p-5">
              <SectionPalette />
            </div>
          </aside>
        )}

        {/* Main Content Area - Full width on mobile, flexible on larger screens */}
        <main className="flex-1 overflow-hidden bg-[#f5f1ea] min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsContent value="canvas" className="h-full m-0 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
              {showSectionPalette && (
                <section className="mb-4 lg:hidden rounded-lg border border-slate-200/60 bg-white/70 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowMobileSections((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                  >
                    <span className="text-xs uppercase tracking-[0.11em] font-semibold text-[#5c554d]">Sections</span>
                    <PanelLeft className="w-4 h-4 text-[#5c554d]" />
                  </button>
                  {showMobileSections && (
                    <div className="border-t border-slate-200/60 p-3 max-h-[45vh] overflow-y-auto bg-[#f5f1ea]">
                      <SectionPalette />
                    </div>
                  )}
                </section>
              )}

              <EditorCanvas />

              <section className="mt-4 md:hidden rounded-lg border border-slate-200/60 bg-white/70 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowMobileProperties((prev) => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                >
                  <span className="text-xs uppercase tracking-[0.11em] font-semibold text-[#5c554d]">Properties</span>
                  <SlidersHorizontal className="w-4 h-4 text-[#5c554d]" />
                </button>
                {showMobileProperties && (
                  <div className="border-t border-slate-200/60 p-3 bg-[#f5f1ea]">
                    <PropertyPanel mobile />
                  </div>
                )}
              </section>
            </TabsContent>
            <TabsContent value="preview" className="h-full m-0 overflow-hidden bg-[#f5f1ea]">
              <PortfolioPreview />
            </TabsContent>
          </Tabs>
        </main>

        {/* Right Sidebar - Properties Panel (Hidden on small mobile, drawer-style on tablet, sidebar on desktop) */}
        <PropertyPanel />
      </div>

      {/* Modals */}
      <ResumeImportModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}

export default function EditorV2Client() {
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get('id');
  const templateId = searchParams.get('template');

  return (
    <DndProvider backend={HTML5Backend}>
      <EditorProvider portfolioId={portfolioId || undefined} templateId={templateId || undefined}>
        <EditorLayout />
      </EditorProvider>
    </DndProvider>
  );
}
