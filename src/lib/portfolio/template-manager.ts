import { PortfolioTemplate, TemplateCategory, Portfolio, PortfolioSection, SectionData } from '@/types/portfolio';
import { portfolioTemplates } from './templates';

// ===============================
// TEMPLATE REGISTRY & UTILITIES
// ===============================

export class TemplateManager {
  private static instance: TemplateManager;
  private templates: Map<string, PortfolioTemplate> = new Map();

  private constructor() {
    this.loadTemplates();
  }

  public static getInstance(): TemplateManager {
    if (!TemplateManager.instance) {
      TemplateManager.instance = new TemplateManager();
    }
    return TemplateManager.instance;
  }

  private loadTemplates(): void {
    portfolioTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Get all templates
  public getAllTemplates(): PortfolioTemplate[] {
    return Array.from(this.templates.values()).sort((a, b) => {
      // Sort by popularity first, then by name
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  // Get templates by category
  public getTemplatesByCategory(category: TemplateCategory): PortfolioTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }

  // Get popular templates
  public getPopularTemplates(): PortfolioTemplate[] {
    return this.getAllTemplates().filter(template => template.isPopular);
  }

  // Get free templates
  public getFreeTemplates(): PortfolioTemplate[] {
    return this.getAllTemplates().filter(template => !template.isPremium);
  }

  // Get premium templates
  public getPremiumTemplates(): PortfolioTemplate[] {
    return this.getAllTemplates().filter(template => template.isPremium);
  }

  // Get template by ID
  public getTemplateById(id: string): PortfolioTemplate | null {
    return this.templates.get(id) || null;
  }

  // Search templates
  public searchTemplates(query: string): PortfolioTemplate[] {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return this.getAllTemplates();

    return this.getAllTemplates().filter(template => {
      return (
        template.name.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        template.category.toLowerCase().includes(searchTerm)
      );
    });
  }

  // Get templates by difficulty
  public getTemplatesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): PortfolioTemplate[] {
    return this.getAllTemplates().filter(template => template.difficulty === difficulty);
  }

  // Get categories with count
  public getCategoriesWithCount(): Array<{category: TemplateCategory, count: number}> {
    const categoryCount = new Map<TemplateCategory, number>();
    
    this.getAllTemplates().forEach(template => {
      const currentCount = categoryCount.get(template.category) || 0;
      categoryCount.set(template.category, currentCount + 1);
    });

    return Array.from(categoryCount.entries()).map(([category, count]) => ({
      category,
      count
    })).sort((a, b) => b.count - a.count);
  }

  // Create portfolio from template
  public createPortfolioFromTemplate(
    templateId: string, 
    userId: string, 
    title: string,
    customizations?: Partial<Portfolio>
  ): Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'> | null {
    const template = this.getTemplateById(templateId);
    if (!template) return null;

    const slug = this.generateSlug(title, userId);
    const now = new Date().toISOString();

    return {
      userId,
      title,
      slug,
      templateId,
      sections: this.cloneSections(template.sections),
      customizations: {
        colorScheme: {},
        typography: {},
        layout: {},
        customCSS: '',
        ...customizations?.customizations
      },
      settings: {
        seo: {
          title: title,
          description: `${title} - Professional Portfolio`,
          keywords: template.tags,
          ogImage: ''
        },
        analytics: {
          trackingEnabled: false
        },
        domain: {
          subdomain: slug
        },
        privacy: {
          passwordProtected: false,
          allowDownload: true,
          allowComments: false
        },
        ...customizations?.settings
      },
      metadata: {
        views: 0,
        version: 1,
        backups: []
      },
      isPublic: false,
      isPublished: false,
      ...customizations
    };
  }

  // Clone sections with new IDs
  private cloneSections(sections: PortfolioSection[]): PortfolioSection[] {
    return sections.map(section => ({
      ...section,
      id: this.generateSectionId(section.type),
      data: this.cloneData(section.data)
    }));
  }

  // Deep clone section data
  private cloneData(data: SectionData): SectionData {
    return JSON.parse(JSON.stringify(data)) as SectionData;
  }

  // Generate unique section ID
  private generateSectionId(type: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${type}-${timestamp}-${random}`;
  }

  // Generate portfolio slug
  private generateSlug(title: string, userId: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const userIdShort = userId.slice(-4);
    const timestamp = Date.now().toString(36);
    
    return `${baseSlug}-${userIdShort}-${timestamp}`;
  }
}

// ===============================
// TEMPLATE VALIDATION
// ===============================

export interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class TemplateValidator {
  public static validateTemplate(template: PortfolioTemplate): TemplateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!template.id || template.id.trim() === '') {
      errors.push('Template ID is required');
    }

    if (!template.name || template.name.trim() === '') {
      errors.push('Template name is required');
    }

    if (!template.description || template.description.trim() === '') {
      errors.push('Template description is required');
    }

    if (!template.thumbnail) {
      errors.push('Template thumbnail is required');
    }

    // Sections validation
    if (!template.sections || template.sections.length === 0) {
      errors.push('Template must have at least one section');
    } else {
      template.sections.forEach((section, index) => {
        if (!section.id) {
          errors.push(`Section ${index + 1} is missing an ID`);
        }
        if (!section.type) {
          errors.push(`Section ${index + 1} is missing a type`);
        }
        if (section.order < 0) {
          errors.push(`Section ${index + 1} has invalid order`);
        }
      });

      // Check for duplicate section IDs
      const sectionIds = template.sections.map(s => s.id);
      const duplicateIds = sectionIds.filter((id, index) => sectionIds.indexOf(id) !== index);
      if (duplicateIds.length > 0) {
        errors.push(`Duplicate section IDs found: ${duplicateIds.join(', ')}`);
      }
    }

    // Color scheme validation
    if (!template.colorScheme.primary) {
      errors.push('Primary color is required');
    }

    if (!template.colorScheme.background) {
      errors.push('Background color is required');
    }

    // Typography validation
    if (!template.typography.fontFamily.heading) {
      errors.push('Heading font family is required');
    }

    if (!template.typography.fontFamily.body) {
      errors.push('Body font family is required');
    }

    // Warnings for best practices
    if (template.sections.length < 3) {
      warnings.push('Templates with fewer than 3 sections may feel incomplete');
    }

    if (template.tags.length === 0) {
      warnings.push('Adding tags helps with template discovery');
    }

    if (template.previewImages.length === 0) {
      warnings.push('Preview images help users understand the template better');
    }

    if (!template.estimatedTime) {
      warnings.push('Estimated completion time helps users plan their work');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  public static validateAllTemplates(): Map<string, TemplateValidationResult> {
    const results = new Map<string, TemplateValidationResult>();
    
    portfolioTemplates.forEach(template => {
      const validation = this.validateTemplate(template);
      results.set(template.id, validation);
    });

    return results;
  }
}

// ===============================
// TEMPLATE FILTERS & SORTING
// ===============================

export interface TemplateFilters {
  category?: TemplateCategory[];
  difficulty?: ('beginner' | 'intermediate' | 'advanced')[];
  isPremium?: boolean;
  isPopular?: boolean;
  tags?: string[];
  priceRange?: 'free' | 'premium' | 'all';
}

export interface TemplateSortOptions {
  sortBy: 'name' | 'popularity' | 'difficulty' | 'created' | 'updated';
  sortOrder: 'asc' | 'desc';
}

export class TemplateFilter {
  public static filterTemplates(
    templates: PortfolioTemplate[],
    filters: TemplateFilters
  ): PortfolioTemplate[] {
    let filtered = [...templates];

    // Filter by category
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(template => 
        filters.category!.includes(template.category)
      );
    }

    // Filter by difficulty
    if (filters.difficulty && filters.difficulty.length > 0) {
      filtered = filtered.filter(template => 
        filters.difficulty!.includes(template.difficulty)
      );
    }

    // Filter by premium status
    if (filters.isPremium !== undefined) {
      filtered = filtered.filter(template => 
        template.isPremium === filters.isPremium
      );
    }

    // Filter by popularity
    if (filters.isPopular !== undefined) {
      filtered = filtered.filter(template => 
        template.isPopular === filters.isPopular
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'free':
          filtered = filtered.filter(template => !template.isPremium);
          break;
        case 'premium':
          filtered = filtered.filter(template => template.isPremium);
          break;
        // 'all' doesn't filter anything
      }
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(template =>
        filters.tags!.some(tag => 
          template.tags.some(templateTag => 
            templateTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    return filtered;
  }

  public static sortTemplates(
    templates: PortfolioTemplate[],
    sortOptions: TemplateSortOptions
  ): PortfolioTemplate[] {
    const sorted = [...templates];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortOptions.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'popularity':
          comparison = (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
          break;
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }

      return sortOptions.sortOrder === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }
}

// ===============================
// EXPORTS
// ===============================

export const templateManager = TemplateManager.getInstance();