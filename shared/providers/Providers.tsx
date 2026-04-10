"use client";

import { SessionProvider } from "next-auth/react";

import type { ProvidersProps } from "@/shared/types";

export function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
