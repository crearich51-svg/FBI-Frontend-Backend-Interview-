import type { ReactNode } from "react";

export type AuthActionState = {
  success: boolean;
  message?: string;
};

export type LoginFormFieldProps = {
  label: string;
  error?: string;
  input: ReactNode;
};
