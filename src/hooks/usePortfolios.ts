"use client";

import { useState, useEffect } from 'react';

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  template: string;
  isPublic: boolean;
  content: any;
  createdAt: string;
  updatedAt: string;
}

export const usePortfolios = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolios');
      
      // Handle auth errors gracefully
      if (response.status === 401) {
        console.warn('[usePortfolios] Unauthorized - user not signed in');
        setPortfolios([]);
        setLoading(false);
        return;
      }
      
      if (response.status === 403) {
        console.warn('[usePortfolios] Forbidden - insufficient permissions');
        setPortfolios([]);
        setLoading(false);
        return;
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setPortfolios(result.data);
      } else {
        console.error('[usePortfolios] Error loading portfolios:', result.error || 'Unknown error');
        setPortfolios([]);
      }
    } catch (error) {
      console.error('[usePortfolios] Failed to fetch portfolios:', error);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const deletePortfolio = async (portfolioId: string) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
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
          content: originalPortfolio.content,
          template: originalPortfolio.template,
          isPublic: false,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setPortfolios(prev => [result.data, ...prev]);
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

  const createPortfolio = async (title: string, content?: any) => {
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
        setPortfolios(prev => [result.data, ...prev]);
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
        setPortfolios(prev => 
          prev.map(p => p.id === portfolioId ? result.data : p)
        );
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
      sectionsCount: portfolios.reduce((total, p) => {
        return total + (p.content?.sections?.length || 0);
      }, 0)
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
    refetch: loadPortfolios
  };
};