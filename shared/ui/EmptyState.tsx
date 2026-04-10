import { cn } from "@/shared/utils";
import type { EmptyStateProps } from "@/shared/types";

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm sm:p-8", className)}>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
