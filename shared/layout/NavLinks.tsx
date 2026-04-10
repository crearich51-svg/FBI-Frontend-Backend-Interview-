"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavLinksProps } from "@/shared/types";

export function NavLinks({ items }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-3 md:gap-4">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
