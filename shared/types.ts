import type { ReactNode } from "react";

export type RouteSearchParams = Record<string, string | string[] | undefined>;

export type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

export type ProvidersProps = {
  children: ReactNode;
};

export type NavItem = {
  href: string;
  label: string;
};

export type NavLinksProps = {
  items: NavItem[];
};

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export type LoadingSpinnerProps = {
  className?: string;
  label?: string;
  centered?: boolean;
};

export type SearchInputProps = {
  defaultValue?: string;
  placeholder?: string;
  name?: string;
};

export type MarkdownRendererProps = {
  content: string;
};

export type HighlightCardProps = {
  label: string;
  text: string;
};
