import { Suspense } from 'react';
import EditorV2Client from './EditorV2Client';

function EditorLoadingFallback() {
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

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoadingFallback />}>
      <EditorV2Client />
    </Suspense>
  );
}