"use client";

import { useOptimistic, useTransition } from "react";

import { addFavorite, removeFavorite } from "@/features/questions/server/favorites";
import type { FavoriteButtonProps } from "@/features/questions/types";

export function FavoriteButton({ questionId, initialFavorited }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticFavorited, setOptimisticFavorited] = useOptimistic(initialFavorited);

  return (
    <button
      className={`inline-flex w-fit items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
        optimisticFavorited ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
      }`}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          setOptimisticFavorited(!optimisticFavorited);
          if (optimisticFavorited) {
            await removeFavorite(questionId);
          } else {
            await addFavorite(questionId);
          }
        });
      }}
      type="button"
    >
      {isPending ? (optimisticFavorited ? "取消中..." : "收藏中...") : optimisticFavorited ? "已收藏" : "收藏题目"}
    </button>
  );
}
