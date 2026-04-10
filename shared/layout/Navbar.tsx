import Link from "next/link";

import { auth, signOut } from "@/features/auth/server/auth";
import { NavLinks } from "@/shared/layout/NavLinks";
import type { NavItem } from "@/shared/types";

const navItems: NavItem[] = [
  { href: "/questions", label: "题库" },
  { href: "/favorites", label: "收藏" },
  { href: "/dashboard", label: "统计" },
];

export async function Navbar() {
  const session = await auth();
  const brandHref = session?.user?.id ? "/dashboard" : "/";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <Link className="text-lg font-semibold text-slate-900" href={brandHref}>
            前端面试通关平台
          </Link>
          {session?.user?.id ? <NavLinks items={navItems} /> : null}
        </div>

        {session?.user?.id ? (
          <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between md:justify-end">
            <span className="truncate">{session.user.name ?? session.user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="w-full rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 sm:w-auto" type="submit">
                退出登录
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center md:justify-end">
            <Link className="font-medium text-slate-600 hover:text-slate-900" href="/login">
              登录
            </Link>
            <Link className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 font-medium text-white" href="/register">
              免费开始
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
