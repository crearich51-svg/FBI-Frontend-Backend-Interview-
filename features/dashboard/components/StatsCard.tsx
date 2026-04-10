import type { StatsCardProps } from "@/features/dashboard/types";

export function StatsCard({ label, value, description }: StatsCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
    </article>
  );
}
