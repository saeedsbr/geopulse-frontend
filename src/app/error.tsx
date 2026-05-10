"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
      <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
        Intelligence feed unavailable
      </h2>
      <p className="text-[var(--muted)] mb-6 max-w-md">
        {error.message ||
          "Unable to load the War Room. The backend may be temporarily unreachable."}
      </p>
      <button
        onClick={reset}
        className="btn-primary inline-flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Retry connection
      </button>
    </div>
  );
}
