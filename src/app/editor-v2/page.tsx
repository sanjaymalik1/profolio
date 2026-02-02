"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { EditorProvider, useEditor } from '@/contexts/EditorContext';
import { SectionPalette } from '@/components/editor/SectionPalette';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { PropertyPanel } from '@/components/editor/PropertyPanel';
import { PortfolioPreview } from '@/components/editor/PortfolioPreview';
import { PortfolioManager } from '@/components/editor/PortfolioManager';
import { OnboardingGuide } from '@/components/editor/OnboardingGuide';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Download, 
  Settings, 
  Undo, 
  Redo,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  LogIn
} from 'lucide-react';

function EditorLayout() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = React.useState('canvas');
  const { state } = useEditor();

  // Determine if section palette should be visible
  // Hide it if there's a template section in the portfolio
  const showSectionPalette = !state.sections.some(section => section.type === 'template');

  return (
      <div className="min-h-screen bg-slate-50">
        {/* Editor Header */}
        <header className="border-b border-slate-200 bg-white shadow-sm">
          <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <h1 className="text-base sm:text-lg lg:text-xl font-semibold tracking-tight text-slate-900 truncate">Portfolio Editor</h1>
              <Separator orientation="vertical" className="h-5 sm:h-6 bg-slate-200 hidden md:block" />
              <div className="items-center gap-1 hidden md:flex">
                <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-slate-100 text-slate-600">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-slate-100 text-slate-600">
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Auth Status Indicator */}
              {status === 'unauthenticated' && (
                <div className="text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200/60 hidden sm:flex items-center gap-1.5 transition-colors hover:bg-amber-100">
                  <LogIn className="h-3.5 w-3.5" />
                  <Link href="/auth/signin" className="hover:underline">Sign in</Link>
                  <span className="text-amber-600">to save</span>
                </div>
              )}
              {status === 'authenticated' && session?.user && (
                <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200/60 hidden sm:flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span className="hidden lg:inline">{session.user.name || session.user.email}</span>
                </div>
              )}

              {/* Canvas/Preview Toggle */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="grid w-full grid-cols-2 h-9 bg-slate-100">
                  <TabsTrigger value="canvas" className="text-xs sm:text-sm font-medium px-3 sm:px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Canvas</span>
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs sm:text-sm font-medium px-3 sm:px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Preview</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Portfolio Management */}
              <PortfolioManager />
              
              <Separator orientation="vertical" className="h-4 sm:h-6 hidden lg:block" />
              
              {/* Onboarding Guide */}
              <OnboardingGuide />
            </div>
          </div>
        </header>

        {/* Editor Layout */}
        <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
          
          {/* Left Sidebar - Section Palette (Visible when creating portfolio from scratch) */}
          {showSectionPalette && (
            <aside className="w-64 lg:w-72 xl:w-80 border-r border-slate-200 bg-white overflow-y-auto hidden md:block">
              <div className="p-6">
                <SectionPalette />
              </div>
            </aside>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-hidden bg-slate-50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsContent value="canvas" className="h-full m-0 p-6 lg:p-8 overflow-y-auto">
                <EditorCanvas />
              </TabsContent>
              <TabsContent value="preview" className="h-full m-0 overflow-hidden bg-white">
                <PortfolioPreview />
              </TabsContent>
            </Tabs>
          </main>

          {/* Right Sidebar - Properties Panel */}
          <PropertyPanel />
        </div>
      </div>
  );
}

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
}