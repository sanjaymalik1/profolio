/**
 * Central registry for all portfolio templates.
 * Single source of truth for template IDs, names, descriptions, and metadata.
 *
 * To add a new template:
 * 1. Add an entry here
 * 2. Add the component to src/components/templates/
 * 3. Handle it in EditorCanvas, PortfolioRenderer, and the API
 */

export interface TemplateDefinition {
    /** Unique template identifier used in DB, URLs, and API */
    id: string;
    /** Default portfolio title when using this template */
    defaultTitle: string;
    /** Display name shown in the UI */
    label: string;
    /** Short description shown in template cards */
    description: string;
    /** Tailwind bg class for the preview thumbnail */
    previewBg: string;
    /** Highlight color for the hover overlay on preview */
    hoverOverlay: string;
    /** Button style for the "Use Template" CTA */
    ctaStyle: string;
    /** Optional badge shown on the card (e.g. "Recommended") */
    badge?: string;
}

export const TEMPLATE_REGISTRY: TemplateDefinition[] = [
    {
        id: 'dark-professional',
        defaultTitle: 'Dark Professional Portfolio',
        label: 'Dark Professional',
        description: 'Best for developers',
        previewBg: 'bg-slate-700',
        hoverOverlay: 'bg-slate-900/10',
        ctaStyle: 'bg-white text-slate-900 hover:bg-white shadow-lg',
        badge: 'Recommended',
    },
    {
        id: 'elegant-monochrome',
        defaultTitle: 'Elegant Monochrome Portfolio',
        label: 'Elegant Monochrome',
        description: 'Business & consulting',
        previewBg: 'bg-slate-50',
        hoverOverlay: 'bg-slate-900/5',
        ctaStyle: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg',
    },
    {
        id: 'warm-minimalist',
        defaultTitle: 'Warm Minimalist Portfolio',
        label: 'Warm Minimalist',
        description: 'Freelancers & creators',
        previewBg: 'bg-amber-50/50',
        hoverOverlay: 'bg-slate-900/5',
        ctaStyle: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg',
    },
];

/** Blank canvas — listed separately since it has no templateId */
export const BLANK_TEMPLATE: Omit<TemplateDefinition, 'id'> & { id: null } = {
    id: null,
    defaultTitle: 'Untitled Portfolio',
    label: 'Blank Canvas',
    description: 'Full control',
    previewBg: 'bg-slate-50',
    hoverOverlay: 'bg-slate-900/5',
    ctaStyle: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg',
};

/** Lookup a template display name by ID — used when creating from a template */
export function getTemplateName(templateId: string): string {
    return TEMPLATE_REGISTRY.find((t) => t.id === templateId)?.defaultTitle ?? 'Untitled Portfolio';
}
