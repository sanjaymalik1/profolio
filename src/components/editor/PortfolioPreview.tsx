"use client";

import React from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  EyeOff,
  Maximize2,
  RotateCcw
} from 'lucide-react';

// Import portfolio section components
import HeroSection from '@/components/portfolio/sections/HeroSection';
import AboutSection from '@/components/portfolio/sections/AboutSection';
import SkillsSection from '@/components/portfolio/sections/SkillsSection';
import ProjectsSection from '@/components/portfolio/sections/ProjectsSection';
import ContactSection from '@/components/portfolio/sections/ContactSection';

// Import template components
import { DarkProfessionalTemplate } from '@/components/templates/DarkProfessionalTemplate';
import { ElegantMonochromeTemplate } from '@/components/templates/ElegantMonochromeTemplate';
import { WarmMinimalistTemplate } from '@/components/templates/WarmMinimalistTemplate';

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

export const PortfolioPreview: React.FC = () => {
  const { state } = useEditor();
  const [previewDevice, setPreviewDevice] = React.useState<PreviewDevice>('desktop');
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(true);
  const previewContainerRef = React.useRef<HTMLDivElement>(null);

  // Handle fullscreen toggle
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!previewContainerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await previewContainerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const getDeviceStyles = () => {
    switch (previewDevice) {
      case 'mobile':
        return {
          width: '375px',
          minHeight: '667px',
          transform: 'scale(0.8)',
          transformOrigin: 'top left'
        };
      case 'tablet':
        return {
          width: '768px',
          minHeight: '1024px',
          transform: 'scale(0.7)',
          transformOrigin: 'top left'
        };
      case 'desktop':
      default:
        return {
          width: '100%',
          minHeight: '100vh',
          transform: 'scale(1)',
          transformOrigin: 'top left'
        };
    }
  };

  const renderSection = (section: any) => {
    const commonProps = {
      data: section.data,
      styling: {
        backgroundColor: 'transparent',
        textColor: 'inherit',
        padding: { top: '4rem', bottom: '4rem', left: '2rem', right: '2rem' },
        margin: { top: '0', bottom: '0' },
        alignment: 'center' as const,
        layout: 'default' as const,
        animation: { type: 'fade' as const, delay: 0, duration: 800 }
      },
      isEditing: true  // Set to true to disable animations in editor preview
    };

    switch (section.type) {
      case 'template':
        // Render entire template component in preview
        if (section.data.templateId === 'dark-professional') {
          return <DarkProfessionalTemplate key={section.id} data={section.data.templateData} isPreview={true} />;
        }
        if (section.data.templateId === 'elegant-monochrome') {
          return <ElegantMonochromeTemplate key={section.id} data={section.data.templateData} isPreview={true} />;
        }
        if (section.data.templateId === 'warm-minimalist') {
          return <WarmMinimalistTemplate key={section.id} data={section.data.templateData} isPreview={true} />;
        }
        return (
          <div key={section.id} className="min-h-[400px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Template Not Found</p>
              <p className="text-sm">
                Template "{section.data.templateId}" is not available for preview.
              </p>
            </div>
          </div>
        );
      case 'hero':
        return <HeroSection key={section.id} {...commonProps} />;
      case 'about':
        return <AboutSection key={section.id} {...commonProps} />;
      case 'skills':
        return <SkillsSection key={section.id} {...commonProps} />;
      case 'projects':
        return <ProjectsSection key={section.id} {...commonProps} />;
      case 'contact':
        return <ContactSection key={section.id} {...commonProps} />;
      default:
        return (
          <div key={section.id} className="min-h-[400px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Preview Not Available</p>
              <p className="text-sm">
                {section.type} section preview is not implemented yet.
              </p>
            </div>
          </div>
        );
    }
  };

  if (!showPreview) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <EyeOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Preview Hidden</h3>
          <Button onClick={() => setShowPreview(true)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Show Preview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Preview Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Eye className="w-3 h-3 mr-1" />
            Live Preview
          </Badge>
          <span className="text-sm text-gray-600">
            {state.sections.length} sections
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Toggle */}
          <div className="flex items-center border rounded-lg bg-white">
            <Button
              variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewDevice('desktop')}
              className="rounded-r-none"
            >
              <Monitor size={16} />
            </Button>
            <Button
              variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewDevice('tablet')}
              className="rounded-none border-x"
            >
              <Tablet size={16} />
            </Button>
            <Button
              variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewDevice('mobile')}
              className="rounded-l-none"
            >
              <Smartphone size={16} />
            </Button>
          </div>

          {/* Preview Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <Maximize2 size={16} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(false)}
          >
            <EyeOff size={16} />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div ref={previewContainerRef} className="flex-1 overflow-auto bg-gradient-to-b from-gray-50 to-white">
        <div className="p-6 flex justify-center">
          <div 
            style={getDeviceStyles()}
            className={`bg-white shadow-2xl transition-all duration-300 ${
              previewDevice !== 'desktop' ? 'border rounded-lg' : ''
            }`}
          >
            {/* Portfolio Sections - Static preview with no interactions */}
            {state.sections.length > 0 ? (
              <div className="w-full [&_*]:pointer-events-none [&_*]:!transition-none [&_*]:!animation-none">
                {state.sections.map((section) => renderSection(section))}
              </div>
            ) : (
              <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2">No Sections Added</h3>
                  <p className="text-sm mb-4">
                    Drag sections from the palette to start building your portfolio
                  </p>
                  <Badge variant="outline">
                    Preview will update in real-time
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="px-4 py-2 border-t bg-gray-50 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>
            Device: {previewDevice} • Sections: {state.sections.length}
          </span>
          <span>
            Updates automatically as you edit
          </span>
        </div>
      </div>
    </div>
  );
};