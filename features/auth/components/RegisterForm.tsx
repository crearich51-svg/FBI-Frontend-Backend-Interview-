"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

import { registerUser } from "@/features/auth/server/actions";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";
import type { LoginFormFieldProps } from "@/features/auth/types";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setError(undefined);

    startTransition(async () => {
      const result = await registerUser(values);

      if (!result.success) {
        setError(result.message);
        return;
      }

      const loginResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (loginResult?.error) {
        setError("注册成功，但自动登录失败，请手动登录");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormField
        label="姓名"
        error={errors.name?.message}
        input={<input {...register("name")} className="field" placeholder="请输入你的姓名" />}
      />
      <FormField
        label="邮箱"
        error={errors.email?.message}
        input={<input {...register("email")} className="field" placeholder="name@example.com" />}
      />
      <FormField
        label="密码"
        error={errors.password?.message}
        input={<input {...register("password")} className="field" placeholder="至少 8 位，包含大写字母和数字" type="password" />}
      />
      <FormField
        label="确认密码"
        error={errors.confirmPassword?.message}
        input={<input {...register("confirmPassword")} className="field" placeholder="再次输入密码" type="password" />}
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <button
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "注册中..." : "注册并进入 Dashboard"}
      </button>
    </form>
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
