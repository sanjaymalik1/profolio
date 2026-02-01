"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useEditor, useEditorActions } from '@/contexts/EditorContext';
import { EditorState } from '@/types/editor';

interface SavedPortfolio {
  id: string;
  title: string;
  data: EditorState;
  createdAt: string;
  updatedAt: string;
}

export const usePortfolioPersistence = () => {
  const { state } = useEditor();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [savedPortfolios, setSavedPortfolios] = useState<SavedPortfolio[]>([]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const autoSaveTimer = setTimeout(() => {
      if (state.sections.length > 0) {
        // Only auto-save if there's already a current portfolio (don't create new ones automatically)
        const currentPortfolio = JSON.parse(localStorage.getItem('current_portfolio') || 'null');
        const isValidObjectId = currentPortfolio?.id && 
          typeof currentPortfolio.id === 'string' && 
          /^[0-9a-fA-F]{24}$/.test(currentPortfolio.id);
        
        if (currentPortfolio && isValidObjectId) {
          autoSave();
        }
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [state, autoSaveEnabled]);

  // Load saved portfolios from localStorage on mount and clear invalid data
  useEffect(() => {
    // Clear any old localStorage data with invalid IDs
    const currentPortfolio = JSON.parse(localStorage.getItem('current_portfolio') || 'null');
    if (currentPortfolio && currentPortfolio.id && !/^[0-9a-fA-F]{24}$/.test(currentPortfolio.id)) {
      localStorage.removeItem('current_portfolio');
    }
    
    loadSavedPortfolios();
  }, []);

  const generateId = () => {
    return 'portfolio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const saveToDatabase = useCallback(async (title: string = 'Untitled Portfolio') => {
    setIsSaving(true);
    try {
      // Check if we're updating an existing portfolio
      const currentPortfolio = JSON.parse(localStorage.getItem('current_portfolio') || 'null');
      
      // Check if current portfolio has a valid MongoDB ObjectID (24 hex characters)
      const isValidObjectId = currentPortfolio?.id && 
        typeof currentPortfolio.id === 'string' && 
        /^[0-9a-fA-F]{24}$/.test(currentPortfolio.id);
      
      if (currentPortfolio && isValidObjectId) {
        // Update existing portfolio
        const response = await fetch(`/api/portfolios/${currentPortfolio.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content: state,
          }),
        });

        const result = await response.json();
        
        // Handle unauthenticated users
        if (response.status === 401) {
          throw new Error('Please sign in to save portfolios');
        }
        
        if (result.success) {
          const updatedPortfolio = {
            id: result.data.id,
            title: result.data.title,
            data: JSON.parse(JSON.stringify(result.data.content)), // Deep clone content
            createdAt: result.data.createdAt,
            updatedAt: result.data.updatedAt
          };
          
          localStorage.setItem('current_portfolio', JSON.stringify(updatedPortfolio));
          setLastSaved(new Date());
          return result.data.id;
        } else {
          throw new Error(result.error);
        }
      } else {
        // Create new portfolio (either no current portfolio or invalid ID)
        const response = await fetch('/api/portfolios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content: state,
            template: 'default',
            isPublic: false,
          }),
        });

        const result = await response.json();
        
        // Handle unauthenticated users
        if (response.status === 401) {
          throw new Error('Please sign in to save portfolios');
        }
        
        if (result.success) {
          const newPortfolio = {
            id: result.data.id,
            title: result.data.title,
            data: JSON.parse(JSON.stringify(result.data.content)), // Deep clone content
            createdAt: result.data.createdAt,
            updatedAt: result.data.updatedAt
          };
          
          localStorage.setItem('current_portfolio', JSON.stringify(newPortfolio));
          setLastSaved(new Date());
          return result.data.id;
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error('Failed to save portfolio:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [state]);

  const autoSave = useCallback(async () => {
    try {
      // Get current portfolio from localStorage
      const currentPortfolio = JSON.parse(localStorage.getItem('current_portfolio') || 'null');
      
      // Check if current portfolio has a valid MongoDB ObjectID
      const isValidObjectId = currentPortfolio?.id && 
        typeof currentPortfolio.id === 'string' && 
        /^[0-9a-fA-F]{24}$/.test(currentPortfolio.id);
      
      if (currentPortfolio && isValidObjectId) {
        // Update existing portfolio via API
        const response = await fetch(`/api/portfolios/${currentPortfolio.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: state,
          }),
        });

        const result = await response.json();
        
        // Silently fail auto-save for unauthenticated users
        if (response.status === 401) {
          return;
        }
        
        if (result.success) {
          const updatedPortfolio = {
            id: result.data.id,
            title: result.data.title,
            data: JSON.parse(JSON.stringify(result.data.content)), // Deep clone content
            createdAt: result.data.createdAt,
            updatedAt: result.data.updatedAt
          };
          
          localStorage.setItem('current_portfolio', JSON.stringify(updatedPortfolio));
          setLastSaved(new Date());
        }
      } else if (state.sections.length > 0) {
        // Create new auto-save portfolio
        await saveToDatabase('Auto-saved Portfolio');
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [state, saveToDatabase]);

  const loadFromDatabase = useCallback(async (portfolioId: string) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`);
      const result = await response.json();
      
      if (result.success) {
        const portfolio = {
          id: result.data.id,
          title: result.data.title,
          data: JSON.parse(JSON.stringify(result.data.content)), // Deep clone the content
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt
        };
        
        // Update current portfolio in localStorage for session management
        localStorage.setItem('current_portfolio', JSON.stringify(portfolio));
        return portfolio.data;
      }
      
      throw new Error(result.error || 'Portfolio not found');
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      throw error;
    }
  }, []);

  const loadSavedPortfolios = useCallback(async () => {
    try {
      const response = await fetch('/api/portfolios');
      
      // Handle unauthenticated users gracefully
      if (response.status === 401) {
        setSavedPortfolios([]);
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        const portfolios = result.data.map((p: any) => ({
          id: p.id,
          title: p.title,
          data: JSON.parse(JSON.stringify(p.content)), // Deep clone content
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }));
        setSavedPortfolios(portfolios);
      } else {
        console.error('Failed to load saved portfolios:', result.error);
        setSavedPortfolios([]);
      }
    } catch (error) {
      console.error('Failed to load saved portfolios:', error);
      setSavedPortfolios([]);
    }
  }, []);

  const deletePortfolio = useCallback(async (portfolioId: string) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSavedPortfolios(prev => prev.filter(p => p.id !== portfolioId));
        
        // If this was the current portfolio, clear it
        const currentPortfolio = JSON.parse(localStorage.getItem('current_portfolio') || 'null');
        if (currentPortfolio && currentPortfolio.id === portfolioId) {
          localStorage.removeItem('current_portfolio');
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to delete portfolio:', error);
      throw error;
    }
  }, []);

  const exportPortfolio = useCallback(async (format: 'json' | 'html' = 'json') => {
    try {
      if (format === 'json') {
        const exportData = {
          title: 'Portfolio Export',
          exportedAt: new Date().toISOString(),
          data: state
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (format === 'html') {
        // For HTML export, we would need to generate a static HTML file
        // This is a simplified version - in a real app, you'd render the portfolio to HTML
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Export</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .section { margin-bottom: 2rem; padding: 1rem; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>Portfolio Export</h1>
    <p>Exported on: ${new Date().toLocaleString()}</p>
    ${state.sections.map(section => `
        <div class="section">
            <h2>${section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section</h2>
            <pre>${JSON.stringify(section.data, null, 2)}</pre>
        </div>
    `).join('')}
</body>
</html>`;

        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(htmlBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-${Date.now()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }, [state]);

  const importPortfolio = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      if (importData.data && importData.data.sections) {
        return importData.data;
      }
      
      throw new Error('Invalid portfolio file format');
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }, []);

  const getCurrentPortfolio = useCallback(() => {
    try {
      const currentPortfolio = JSON.parse(localStorage.getItem('current_portfolio') || 'null');
      return currentPortfolio;
    } catch (error) {
      return null;
    }
  }, []);

  const startNewPortfolio = useCallback(() => {
    // Clear current portfolio session
    localStorage.removeItem('current_portfolio');
    // Optionally, you could dispatch a reset action to the editor context here
    // For now, we'll rely on the component to handle the reset
  }, []);

  return {
    // State
    isSaving,
    lastSaved,
    autoSaveEnabled,
    savedPortfolios,
    
    // Actions
    saveToDatabase,
    loadFromDatabase,
    deletePortfolio,
    exportPortfolio,
    importPortfolio,
    getCurrentPortfolio,
    startNewPortfolio,
    loadSavedPortfolios,
    
    // Settings
    setAutoSaveEnabled
  };
};