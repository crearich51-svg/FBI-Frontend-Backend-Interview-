"use client";

import { useMemo, useState } from "react";

import { MarkdownRenderer } from "@/shared/ui/MarkdownRenderer";
import type { AnswerAccordionProps } from "@/features/questions/types";

export function AnswerAccordion({ answerHint, answer, deepKnowledge }: AnswerAccordionProps) {
  const sections = useMemo(
    () => [
      answerHint ? { key: "hint", title: "提示", content: answerHint } : null,
      answer ? { key: "answer", title: "参考答案", content: answer } : null,
      deepKnowledge ? { key: "deep", title: "深入知识点", content: deepKnowledge } : null,
    ].filter(Boolean) as Array<{ key: string; title: string; content: string }>,
    [answer, answerHint, deepKnowledge],
  );

  const [openKeys, setOpenKeys] = useState<string[]>(sections.length ? [sections[0].key] : []);

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isOpen = openKeys.includes(section.key);
        return (
          <div key={section.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-900"
              onClick={() =>
                setOpenKeys((current) =>
                  current.includes(section.key)
                    ? current.filter((item) => item !== section.key)
                    : [...current, section.key],
                )
              }
              type="button"
            >
              <span>{section.title}</span>
              <span>{isOpen ? "收起" : "展开"}</span>
            </button>
            {isOpen ? (
              <div className="border-t border-slate-100 px-5 py-4">
                <MarkdownRenderer content={section.content} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
