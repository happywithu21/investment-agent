"use client";

import { AlertTriangle, X, RefreshCcw } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onDismiss, onRetry }: ErrorBannerProps) {
  return (
    <div
      id="error-banner"
      className="card border-red-500/30 bg-red-500/5 p-5 animate-fade-in"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle size={18} className="text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-300 mb-1">Analysis Failed</p>
          <p className="text-sm text-slate-400">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
            >
              <RefreshCcw size={12} />
              Try again
            </button>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-slate-600 hover:text-slate-400 transition-colors"
          aria-label="Dismiss error"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
