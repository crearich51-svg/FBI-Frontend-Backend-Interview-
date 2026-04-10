import Link from "next/link";

import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-slate-500">欢迎回来</p>
        <h1 className="text-3xl font-semibold text-slate-900">登录继续刷题</h1>
        <p className="text-sm text-slate-500">支持邮箱密码登录，也支持 GitHub OAuth。</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-slate-500">
        还没有账号？{" "}
        <Link className="font-medium text-slate-900 underline-offset-4 hover:underline" href="/register">
          去注册
        </Link>
      </p>
    </div>
  );
}
