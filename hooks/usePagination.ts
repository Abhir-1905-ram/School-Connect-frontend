"use client";

import { useCallback, useState } from "react";

export const DEFAULT_PAGE_SIZE = 10;

export function usePagination(initialLimit = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);

  const resetPage = useCallback(() => setPage(1), []);

  return { page, setPage, limit, resetPage };
}
