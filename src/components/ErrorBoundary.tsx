"use client";

import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    /** Shown when the boundary catches an error. Defaults to a minimal inline fallback. */
    fallback?: ReactNode;
    /** Optional label used in error logging (e.g. "HeroSection") */
    label?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Catches JavaScript errors in its subtree and renders a fallback instead of
 * crashing the entire page. Wrap individual sections so one bad section
 * doesn't take down the editor or a public portfolio.
 *
 * Usage:
 *   <ErrorBoundary label="HeroSection">
 *     <HeroSection ... />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        const label = this.props.label ?? 'Unknown';
        console.error(`[ErrorBoundary] "${label}" threw an error:`, error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="w-full py-8 px-4 flex items-center justify-center bg-red-50 border border-red-200 rounded-md text-center">
                    <div>
                        <p className="text-sm font-medium text-red-700">
                            {this.props.label ? `"${this.props.label}" failed to render` : 'This section failed to render'}
                        </p>
                        <p className="text-xs text-red-500 mt-1">
                            {this.state.error?.message ?? 'An unexpected error occurred'}
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
