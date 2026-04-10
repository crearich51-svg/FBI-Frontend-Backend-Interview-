import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>前端面试通关平台 · 一期 MVP</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link className="hover:text-slate-900" href="/login">
            立即开始
          </Link>
          <Link className="hover:text-slate-900" href="/register">
            注册账号
          </Link>
        </div>
      </div>
    </footer>
  );
}
