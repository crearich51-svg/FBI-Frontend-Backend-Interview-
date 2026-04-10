"use client";

import { useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

import "highlight.js/styles/github.css";

import type { MarkdownRendererProps } from "@/shared/types";

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const normalized = useMemo(() => content.trim(), [content]);

  return (
    <div className="prose prose-slate max-w-none prose-pre:rounded-2xl prose-pre:bg-slate-950 prose-pre:text-slate-100">
      <Markdown rehypePlugins={[rehypeRaw, rehypeHighlight]} remarkPlugins={[remarkGfm]}>
        {normalized}
      </Markdown>
    </div>
  );
}
