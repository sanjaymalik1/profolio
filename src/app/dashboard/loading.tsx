// Next.js convention: this component shows instantly during navigation
// to the dashboard before the page component renders.
export default function DashboardLoading() {
    return (
        <div className="bg-slate-50/30">
            {/* Nav skeleton */}
            <div className="bg-white border-b border-slate-200/60 h-14" />

            <main className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 pb-16">
                <div className="space-y-7 animate-pulse">
                    {/* Active portfolio card skeleton */}
                    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md border border-slate-200/60 h-40" />

                    {/* Portfolio list skeleton */}
                    <div className="mt-6">
                        <div className="h-4 w-36 bg-slate-200 rounded mb-3" />
                        <div className="bg-white border border-slate-200/60 rounded-lg divide-y divide-slate-100">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-3.5 flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="h-3 w-40 bg-slate-200 rounded" />
                                        <div className="h-2.5 w-24 bg-slate-100 rounded" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-12 bg-slate-200 rounded" />
                                        <div className="h-8 w-16 bg-slate-100 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Templates section skeleton */}
                    <div className="pt-7 border-t border-slate-200/60">
                        <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                    <div className="aspect-[16/10] bg-slate-100" />
                                    <div className="p-2.5 space-y-1.5">
                                        <div className="h-3 w-24 bg-slate-200 rounded" />
                                        <div className="h-2.5 w-16 bg-slate-100 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
