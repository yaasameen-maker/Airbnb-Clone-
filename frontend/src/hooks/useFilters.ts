import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useFilters<T extends Record<string, any>>(initialFilters?: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useCallback(() => {
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      if (value) {
        params[key] = isNaN(Number(value)) ? value : Number(value);
      }
    });
    return { ...initialFilters, ...params } as T;
  }, [searchParams, initialFilters]);

  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        }
      });
      setSearchParams(params);
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return { filters: filters(), setFilters, clearFilters, searchParams };
}
