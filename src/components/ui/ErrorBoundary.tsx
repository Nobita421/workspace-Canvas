'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    router?: { push: (path: string) => void };
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
        
        // Call optional error handler
        this.props.onError?.(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ 
            hasError: false, 
            error: null, 
            errorInfo: null 
        });
    };

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        // Use router if available, otherwise use window.location
        if (this.props.router) {
            this.props.router.push('/');
        } else {
            // Safe navigation without potential XSS
            window.location.assign('/');
        }
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        {/* Title */}
                        <h1 className="text-xl font-bold text-white mb-2">
                            Something went wrong
                        </h1>

                        {/* Description */}
                        <p className="text-slate-400 text-sm mb-6">
                            An unexpected error occurred. This has been logged and we&apos;ll look into it.
                        </p>

                        {/* Error details (collapsible in dev) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400 mb-2">
                                    Error details
                                </summary>
                                <div className="bg-slate-800 rounded-lg p-3 overflow-auto max-h-40">
                                    <p className="text-xs text-red-400 font-mono break-all">
                                        {this.state.error.message}
                                    </p>
                                    {this.state.errorInfo?.componentStack && (
                                        <pre className="text-xs text-slate-500 mt-2 whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    )}
                                </div>
                            </details>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors"
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-sm transition-colors"
                            >
                                <Home size={16} />
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Hook-friendly wrapper for error boundary
 * Usage: <ErrorBoundaryWrapper><YourComponent /></ErrorBoundaryWrapper>
 */
export function ErrorBoundaryWrapper({ 
    children, 
    fallback,
    onError 
}: { 
    children: ReactNode; 
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}) {
    // Note: We don't use useRouter here because it violates Rules of Hooks
    // ErrorBoundary will fallback to window.location.assign() instead
    return (
        <ErrorBoundary fallback={fallback} onError={onError}>
            {children}
        </ErrorBoundary>
    );
}
