import { cn } from "@/shared/utils";
import type { LoadingSpinnerProps } from "@/shared/types";

export function LoadingSpinner({ className, label = "加载中...", centered = false }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-slate-500",
        centered && "justify-center rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-sm",
        className,
      )}
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      <span>{label}</span>
    </div>
  );
}
