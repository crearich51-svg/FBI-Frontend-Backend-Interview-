"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

import { OAuthButtons } from "@/features/auth/components/OAuthButtons";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import type { LoginFormFieldProps } from "@/features/auth/types";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setError(undefined);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("邮箱或密码错误");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  });

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField
          label="邮箱"
          error={errors.email?.message}
          input={<input {...register("email")} className="field" placeholder="name@example.com" />}
        />
        <FormField
          label="密码"
          error={errors.password?.message}
          input={<input {...register("password")} className="field" placeholder="请输入密码" type="password" />}
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "登录中..." : "邮箱密码登录"}
        </button>
      </form>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          <span>or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <OAuthButtons />
      </div>
    </div>
  );
}

function FormField({ label, error, input }: LoginFormFieldProps) {
  return (
    <label className="block space-y-2 text-sm text-slate-700">
      <span className="font-medium">{label}</span>
      {input}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </label>
  );
}
