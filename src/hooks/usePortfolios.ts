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

let portfoliosInFlightRequest: Promise<Portfolio[]> | null = null;
let portfoliosMemoryCache: Portfolio[] | null = null;

export const usePortfolios = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => portfoliosMemoryCache ?? []);
  const [loading, setLoading] = useState(() => portfoliosMemoryCache === null);

  const loadPortfolios = useCallback(async (force = false) => {
    if (!force && portfoliosMemoryCache) {
      setPortfolios(portfoliosMemoryCache);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      if (!portfoliosInFlightRequest) {
        portfoliosInFlightRequest = (async () => {
          const response = await fetch('/api/portfolios', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache'
            }
          });

          // Handle auth errors gracefully
          if (response.status === 401) {
            console.warn('[usePortfolios] Unauthorized - user not signed in');
            return [];
          }

          if (response.status === 403) {
            console.warn('[usePortfolios] Forbidden - insufficient permissions');
            return [];
          }

          const result = await response.json();

          if (result.success && result.data) {
            return result.data as Portfolio[];
          }

          console.error('[usePortfolios] Error loading portfolios:', result.error || 'Unknown error');
          return [];
        })();
      }

      const loadedPortfolios = await portfoliosInFlightRequest;
      portfoliosMemoryCache = loadedPortfolios;
      setPortfolios(loadedPortfolios);
    } catch (error) {
      console.error('[usePortfolios] Failed to fetch portfolios:', error);
      portfoliosMemoryCache = [];
      setPortfolios([]);
    } finally {
      portfoliosInFlightRequest = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (portfoliosMemoryCache) {
      setPortfolios(portfoliosMemoryCache);
      setLoading(false);
      return;
    }
    loadPortfolios(false);
  }, [loadPortfolios]);

  const deletePortfolio = async (portfolioId: string) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setPortfolios(prev => {
          const next = prev.filter(p => p.id !== portfolioId);
          portfoliosMemoryCache = next;
          return next;
        });
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
          const next = [result.data, ...prev];
          portfoliosMemoryCache = next;
          return next;
        });
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
          const next = [result.data, ...prev];
          portfoliosMemoryCache = next;
          return next;
        });
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
          const next = prev.map(p => p.id === portfolioId ? result.data : p);
          portfoliosMemoryCache = next;
          return next;
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
    loading,
    loadPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    duplicatePortfolio,
    getPortfolioStats,
    refetch: () => loadPortfolios(true)
  };
};