/**
 * EditorLoadingSkeleton
 *
 * Single source of truth for the editor loading state UI.
 * Used in two places:
 *   1. page.tsx     — as the <Suspense> fallback (server-side, before EditorV2Client hydrates)
 *   2. EditorV2Client.tsx — while isMounted=false or isLoading=true (client-side)
 *
 * Keeping it in one file means visual changes only need to be made once.
 */
export function EditorLoadingSkeleton() {
    const shimmer = 'editor-loading-skeleton-shimmer';

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f5f1ea] editor-typography">
            <div className="pointer-events-none absolute inset-0 opacity-35 bg-[linear-gradient(to_right,#d8d0c6_1px,transparent_1px)] bg-[length:280px_100%]" />

            {/* Header skeleton aligned with editor/landing nav language */}
            <header className="relative z-10 border-b border-[#d8d0c6]/80 bg-[#f5f1ea]/95 backdrop-blur-sm">
                <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                        <div className={`h-7 w-7 rounded-full border border-[#cfc4b7] bg-[#ece4da] sm:h-8 sm:w-8 ${shimmer}`} />
                        <div className="hidden sm:block space-y-1.5">
                            <div className={`h-3.5 w-24 rounded ${shimmer}`} />
                            <div className={`h-2.5 w-44 rounded ${shimmer}`} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                        <div className={`h-7 w-20 rounded-md sm:h-8 sm:w-24 ${shimmer}`} />
                        <div className={`h-7 w-24 rounded-md sm:h-8 sm:w-28 ${shimmer}`} />
                        <div className={`hidden sm:block h-8 w-28 rounded-md ${shimmer}`} />
                    </div>
                </div>
            </header>

            {/* Layout skeleton mirrors real editor proportions */}
            <div className="relative z-10 flex h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)]">
                {/* Left panel: section list */}
                <aside className="hidden lg:block w-56 lg:w-64 xl:w-72 2xl:w-80 border-r border-[#d8d0c6]/75 bg-[#f5f1ea] overflow-y-auto">
                    <div className="p-3 lg:p-4 xl:p-5 space-y-4">
                        <div className={`h-5 w-20 rounded ${shimmer}`} />
                        <div className={`h-2.5 w-44 rounded ${shimmer}`} />

                        <div className="space-y-3.5 pt-1">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="rounded-xl border border-[#d8d0c6] bg-[#f8f4ee]/85 p-3.5">
                                    <div className="flex items-start gap-2.5">
                                        <div className={`h-8 w-8 rounded-md border border-[#d8d0c6] ${shimmer}`} />
                                        <div className="flex-1 space-y-2">
                                            <div className={`h-3 w-24 rounded ${shimmer}`} />
                                            <div className={`h-2.5 w-full rounded ${shimmer}`} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Center canvas: primary focus */}
                <main className="flex-1 min-w-0 overflow-hidden bg-[#f5f1ea]">
                    <div className="h-full p-3 sm:p-4 md:p-6 lg:p-8">
                        <div className="mx-auto h-full max-w-5xl rounded-2xl border border-[#d8d0c6] bg-white/85 shadow-[0_28px_80px_-52px_rgba(45,42,38,0.35)]">
                            <div className="border-b border-[#d8d0c6]/85 px-5 py-4 sm:px-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className={`h-4 w-40 rounded ${shimmer}`} />
                                        <div className={`h-3 w-56 rounded ${shimmer}`} />
                                    </div>
                                    <div className={`h-8 w-24 rounded-md ${shimmer}`} />
                                </div>
                            </div>

                            <div className="p-5 sm:p-6 md:p-7 space-y-6">
                                <div className="space-y-3">
                                    <div className={`h-7 w-56 rounded ${shimmer}`} />
                                    <div className={`h-3.5 w-full rounded ${shimmer}`} />
                                    <div className={`h-3.5 w-10/12 rounded ${shimmer}`} />
                                </div>

                                <div className="rounded-xl border border-[#d8d0c6]/90 bg-[#f8f4ee]/75 p-5 sm:p-6 space-y-3">
                                    <div className={`h-4 w-36 rounded ${shimmer}`} />
                                    <div className={`h-3 w-full rounded ${shimmer}`} />
                                    <div className={`h-3 w-11/12 rounded ${shimmer}`} />
                                    <div className={`h-3 w-8/12 rounded ${shimmer}`} />
                                </div>

                                <div className="rounded-xl border border-[#d8d0c6]/90 bg-[#f8f4ee]/75 p-5 sm:p-6 space-y-3">
                                    <div className={`h-4 w-28 rounded ${shimmer}`} />
                                    <div className={`h-3 w-full rounded ${shimmer}`} />
                                    <div className={`h-3 w-9/12 rounded ${shimmer}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right panel: property controls */}
                <aside className="hidden md:flex w-64 lg:w-72 xl:w-80 2xl:w-96 border-l border-[#d8d0c6]/75 bg-[#f5f1ea] overflow-y-auto">
                    <div className="w-full p-3 sm:p-4 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#d8d0c6]/75 pb-3">
                            <div className={`h-4 w-28 rounded ${shimmer}`} />
                            <div className={`h-5 w-16 rounded-full ${shimmer}`} />
                        </div>

                        <div className="space-y-3.5">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item} className="space-y-2.5">
                                    <div className={`h-3 w-24 rounded ${shimmer}`} />
                                    <div className={`h-9 w-full rounded-lg border border-[#d8d0c6] ${shimmer}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

        </div>
    );
}
