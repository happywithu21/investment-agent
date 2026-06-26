"use client";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      {/* Animated triple ring */}
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-spin-slow"
          style={{ borderTopColor: "#3b82f6" }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-2 rounded-full border-2 border-indigo-500/20"
          style={{
            borderTopColor: "#6366f1",
            animation: "spin-slow 2s linear infinite reverse",
          }}
        />
        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-slate-300 font-medium">Running Analysis Pipeline</p>
        <p className="text-slate-500 text-sm">Multi-agent workflow in progress…</p>
      </div>
    </div>
  );
}
