import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "姓名至少 2 个字符").max(50, "姓名最多 50 个字符"),
    email: z.email("请输入有效的邮箱地址").trim(),
    password: z
      .string()
      .min(8, "密码至少 8 位")
      .max(100, "密码最多 100 位")
      .regex(/^(?=.*[A-Z])(?=.*\d).+$/, "密码需包含至少 1 个大写字母和 1 个数字"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "两次输入的密码不一致",
  });

export const loginSchema = z.object({
  email: z.email("请输入有效的邮箱地址").trim(),
  password: z.string().min(1, "请输入密码"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
