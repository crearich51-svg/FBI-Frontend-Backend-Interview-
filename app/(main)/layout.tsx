import { redirect } from "next/navigation";

import { auth } from "@/features/auth/server/auth";
import type { AppLayoutProps } from "@/shared/types";

export default async function MainLayout({ children }: AppLayoutProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>;
}
