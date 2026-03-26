"use client";

import { useState, useEffect, useCallback } from 'react';

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  customSlug?: string;
  template: string;
  isPublic: boolean;
  content?: { sections?: Array<{ type: string; data: Record<string, unknown> }> } | null;
  sectionCount: number;
  viewCount: number;
  lastPublishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedPortfoliosResponse {
  portfolios: Portfolio[];
  total: number;
}

interface PortfoliosCache {
  portfolios: Portfolio[];
  total: number;
  page: number;
}

const PAGE_SIZE = 4;

let portfoliosInFlightRequest: Promise<PaginatedPortfoliosResponse> | null = null;
let portfoliosMemoryCache: PortfoliosCache | null = null;

export const usePortfolios = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => portfoliosMemoryCache?.portfolios ?? []);
  const [page, setPage] = useState(() => portfoliosMemoryCache?.page ?? 1);
  const [total, setTotal] = useState(() => portfoliosMemoryCache?.total ?? 0);
  const [loading, setLoading] = useState(() => portfoliosMemoryCache === null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPortfoliosPage = useCallback(async (pageToLoad: number): Promise<PaginatedPortfoliosResponse> => {
    const response = await fetch(`/api/portfolios?page=${pageToLoad}&limit=${PAGE_SIZE}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (response.status === 401) {
      console.warn('[usePortfolios] Unauthorized - user not signed in');
      return { portfolios: [], total: 0 };
    }

    if (response.status === 403) {
      console.warn('[usePortfolios] Forbidden - insufficient permissions');
      return { portfolios: [], total: 0 };
    }

    const result = await response.json();

    if (result.success) {
      const parsedPortfolios = (result.portfolios ?? result.data ?? []) as Portfolio[];
      const parsedTotal = typeof result.total === 'number' ? result.total : parsedPortfolios.length;
      return {
        portfolios: parsedPortfolios,
        total: parsedTotal,
      };
    }

    console.error('[usePortfolios] Error loading portfolios:', result.error || 'Unknown error');
    return { portfolios: [], total: 0 };
  }, []);

  const loadPortfolios = useCallback(async (force = false) => {
    if (!force && portfoliosMemoryCache) {
      setPortfolios(portfoliosMemoryCache.portfolios);
      setPage(portfoliosMemoryCache.page);
      setTotal(portfoliosMemoryCache.total);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      if (force || !portfoliosInFlightRequest) {
        portfoliosInFlightRequest = fetchPortfoliosPage(1);
      }

      const loaded = await portfoliosInFlightRequest;
      portfoliosMemoryCache = {
        portfolios: loaded.portfolios,
        total: loaded.total,
        page: 1,
      };
      setPortfolios(loaded.portfolios);
      setTotal(loaded.total);
      setPage(1);
    } catch (error) {
      console.error('[usePortfolios] Failed to fetch portfolios:', error);
      portfoliosMemoryCache = {
        portfolios: [],
        total: 0,
        page: 1,
      };
      setPortfolios([]);
      setTotal(0);
      setPage(1);
    } finally {
      portfoliosInFlightRequest = null;
      setLoading(false);
    }
  }, [fetchPortfoliosPage]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || portfolios.length >= total) {
      return;
    }

    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const loaded = await fetchPortfoliosPage(nextPage);
      setPortfolios((prev) => {
        const existingIds = new Set(prev.map((portfolio) => portfolio.id));
        const nextItems = loaded.portfolios.filter((portfolio) => !existingIds.has(portfolio.id));
        const merged = [...prev, ...nextItems];

        portfoliosMemoryCache = {
          portfolios: merged,
          total: loaded.total,
          page: nextPage,
        };

        return merged;
      });
      setPage(nextPage);
      setTotal(loaded.total);
    } catch (error) {
      console.error('[usePortfolios] Failed to load more portfolios:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPortfoliosPage, loading, loadingMore, page, portfolios, total]);

  useEffect(() => {
    if (portfoliosMemoryCache) {
      setPortfolios(portfoliosMemoryCache.portfolios);
      setPage(portfoliosMemoryCache.page);
      setTotal(portfoliosMemoryCache.total);
      setLoading(false);
      return;
    }
    loadPortfolios(false);
  }, [loadPortfolios]);

  useEffect(() => {
    if (loading) return;
    portfoliosMemoryCache = {
      portfolios,
      total,
      page,
    };
  }, [loading, page, portfolios, total]);

  const deletePortfolio = async (portfolioId: string) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setPortfolios(prev => {
          return prev.filter(p => p.id !== portfolioId);
        });
        setTotal((current) => Math.max(0, current - 1));
        return true;
      } else {
        console.error('Error deleting portfolio:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      return false;
    }
  };

  const duplicatePortfolio = async (portfolioId: string) => {
    try {
      const originalPortfolio = portfolios.find(p => p.id === portfolioId);
      if (!originalPortfolio) return false;

      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${originalPortfolio.title} (Copy)`,
          content: { sections: [] }, // list API omits content; duplicate starts fresh
          template: originalPortfolio.template,
          isPublic: false,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPortfolios(prev => {
          return [result.data, ...prev];
        });
        setTotal((current) => current + 1);
        return true;
      } else {
        console.error('Error duplicating portfolio:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error duplicating portfolio:', error);
      return false;
    }
  };

  const createPortfolio = async (title: string, content?: unknown) => {
    try {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: content || {},
          template: 'default',
          isPublic: false,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPortfolios(prev => {
          return [result.data, ...prev];
        });
        setTotal((current) => current + 1);
        return result.data;
      } else {
        console.error('Error creating portfolio:', result.error);
        return null;
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
      return null;
    }
  };

  const updatePortfolio = async (portfolioId: string, updates: Partial<Portfolio>) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (result.success) {
        setPortfolios(prev => {
          return prev.map(p => p.id === portfolioId ? result.data : p);
        });
        return result.data;
      } else {
        console.error('Error updating portfolio:', result.error);
        return null;
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
      return null;
    }
  };

  const getPortfolioStats = () => {
    return {
      total: portfolios.length,
      recentlyUpdated: portfolios.filter(p => {
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return new Date(p.updatedAt) > dayAgo;
      }).length,
      sectionsCount: portfolios.reduce((total, p) => total + p.sectionCount, 0)
    };
  };

  return {
    portfolios,
    total,
    page,
    hasMore: portfolios.length < total,
    loading,
    loadingMore,
    loadPortfolios,
    loadMore,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    duplicatePortfolio,
    getPortfolioStats,
    refetch: () => loadPortfolios(true)
  };
};