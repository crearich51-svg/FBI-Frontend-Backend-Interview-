"use client";

import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";

export function OAuthButtons() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <button
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        onClick={() => {
          setError(undefined);
          startTransition(async () => {
            try {
              await signIn("github", { callbackUrl: "/dashboard" });
            } catch {
              setError("GitHub 登录失败，请稍后重试");
            }
          });
        }}
        type="button"
      >
        {isPending ? "跳转中..." : "使用 GitHub 登录"}
      </button>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
