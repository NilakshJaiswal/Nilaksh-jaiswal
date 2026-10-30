import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface ContentState<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

/**
 * Fetches published public content from a given API path. Returns null data
 * on error or when nothing has been published yet, so sections can render a
 * neutral empty state instead of breaking the page.
 */
export function useContent<T>(path: string): ContentState<T> {
  const [state, setState] = useState<ContentState<T>>({ data: null, loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: false });

    api
      .get<T>(path)
      .then((res) => {
        if (!cancelled) setState({ data: res.data, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ data: null, loading: false, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}
