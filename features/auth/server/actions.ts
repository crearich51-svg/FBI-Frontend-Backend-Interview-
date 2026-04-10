"use server";

import { hash } from "bcryptjs";

import { registerSchema, type RegisterInput } from "@/features/auth/schemas";
import type { AuthActionState } from "@/features/auth/types";
import { db } from "@/shared/db/client";

export async function registerUser(input: RegisterInput): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "注册信息不合法",
    };
  }

  const existingUser = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return {
      success: false,
      message: "该邮箱已被注册",
    };
  }

  const passwordHash = await hash(parsed.data.password, 10);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    },
  });

  return {
    success: true,
  };
}
