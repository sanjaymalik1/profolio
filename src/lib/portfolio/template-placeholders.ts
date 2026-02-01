// Template placeholder generator for development
// This will be replaced with actual template screenshots in production

export const generateTemplatePlaceholder = (templateId: string, width: number = 400, height: number = 300) => {
  const colors = {
    'dark-professional': { bg: '#0F172A', accent: '#3B82F6' },
    'elegant-monochrome': { bg: '#374151', accent: '#6366F1' },
    'warm-minimalist': { bg: '#DC2626', accent: '#F59E0B' }
  };

  const templateColor = colors[templateId as keyof typeof colors] || { bg: '#6B7280', accent: '#9CA3AF' };
  
  // Generate SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-${templateId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${templateColor.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${templateColor.accent};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg-${templateId})"/>
      
      <!-- Header mockup -->
      <rect x="20" y="20" width="360" height="40" rx="8" fill="rgba(255,255,255,0.2)"/>
      <circle cx="40" cy="40" r="8" fill="rgba(255,255,255,0.4)"/>
      <rect x="60" y="35" width="120" height="10" rx="5" fill="rgba(255,255,255,0.4)"/>
      
      <!-- Content sections mockup -->
      <rect x="20" y="80" width="360" height="60" rx="8" fill="rgba(255,255,255,0.15)"/>
      <rect x="30" y="90" width="200" height="8" rx="4" fill="rgba(255,255,255,0.5)"/>
      <rect x="30" y="105" width="150" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
      <rect x="30" y="118" width="180" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
      
      <rect x="20" y="160" width="360" height="80" rx="8" fill="rgba(255,255,255,0.15)"/>
      <rect x="30" y="170" width="100" height="8" rx="4" fill="rgba(255,255,255,0.5)"/>
      <rect x="30" y="185" width="80" height="20" rx="4" fill="rgba(255,255,255,0.2)"/>
      <rect x="120" y="185" width="80" height="20" rx="4" fill="rgba(255,255,255,0.2)"/>
      <rect x="210" y="185" width="80" height="20" rx="4" fill="rgba(255,255,255,0.2)"/>
      <rect x="30" y="215" width="320" height="15" rx="4" fill="rgba(255,255,255,0.1)"/>
      
      <!-- Template name overlay -->
      <rect x="0" y="250" width="400" height="50" fill="rgba(0,0,0,0.3)"/>
      <text x="200" y="275" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="600">
        ${templateId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

// Export template placeholders as a map
export const templatePlaceholders = {
  'dark-professional': '/templates/dark-professional-thumb.jpg',
  'elegant-monochrome': '/templates/elegant-monochrome-thumb.jpg',
  'warm-minimalist': '/templates/warm-minimalist-thumb.jpg'
};