import { redirect } from "next/navigation";

import { auth } from "@/features/auth/server/auth";
import type { AppLayoutProps } from "@/shared/types";

export default async function AuthLayout({ children }: AppLayoutProps) {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
