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
      <div className="min-h-screen bg-background">
        {/* Editor Header */}
        <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <h1 className="text-base sm:text-lg lg:text-xl font-semibold truncate">Portfolio Editor</h1>
              <Separator orientation="vertical" className="h-4 sm:h-6 hidden md:block" />
              <div className="items-center gap-1 sm:gap-2 hidden md:flex">
                <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                  <Undo size={14} className="sm:w-4 sm:h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                  <Redo size={14} className="sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Auth Status Indicator */}
              {status === 'unauthenticated' && (
                <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 hidden sm:flex items-center">
                  <LogIn className="h-3 w-3 inline mr-1" />
                  <Link href="/auth/signin" className="underline">Sign in</Link> to save
                </div>
              )}
              {status === 'authenticated' && session?.user && (
                <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 hidden sm:flex items-center">
                  ✓ <span className="ml-1 hidden lg:inline">{session.user.name || session.user.email}</span>
                </div>
              )}

              {/* Canvas/Preview Toggle */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="grid w-full grid-cols-2 h-8 sm:h-9">
                  <TabsTrigger value="canvas" className="text-xs px-2 sm:px-3">
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Canvas</span>
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs px-2 sm:px-3">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Preview</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Separator orientation="vertical" className="h-4 sm:h-6 hidden md:block" />

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
            <aside className="w-60 sm:w-72 lg:w-80 border-r bg-muted/30 overflow-y-auto hidden md:block">
              <div className="p-4 sm:p-6">
                <SectionPalette />
              </div>
            </aside>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsContent value="canvas" className="h-full m-0 p-3 sm:p-4 lg:p-6 overflow-y-auto">
                <EditorCanvas />
              </TabsContent>
              <TabsContent value="preview" className="h-full m-0 overflow-hidden">
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