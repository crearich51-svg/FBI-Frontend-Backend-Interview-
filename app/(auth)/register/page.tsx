import Link from "next/link";

import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-slate-500">创建账号</p>
        <h1 className="text-3xl font-semibold text-slate-900">注册开始刷题</h1>
        <p className="text-sm text-slate-500">邮箱注册后会自动登录并进入 Dashboard。</p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-slate-500">
        已有账号？{" "}
        <Link className="font-medium text-slate-900 underline-offset-4 hover:underline" href="/login">
          去登录
        </Link>
      </p>
    </div>
  );
}
