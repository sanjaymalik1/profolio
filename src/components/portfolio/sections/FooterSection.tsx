"use client";

import React from 'react';
import { FooterData, SectionStyling } from '@/types/portfolio';

interface FooterSectionProps {
  data: FooterData;
  styling?: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<FooterData>) => void;
  onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

const container = 'max-w-5xl mx-auto px-6';

export default function FooterSection({
  data,
  isPublicView = false
}: FooterSectionProps) {
  const year = new Date().getFullYear();
  const copyrightText = data.copyrightText || `© ${year} ${data.name}. All rights reserved.`;

  return (
    <footer className="border-t border-slate-100 py-8 px-6 bg-white">
      <div className={`${container} flex flex-col items-center justify-between gap-4 sm:flex-row`}>
        <p className="text-xs text-slate-400">
          {copyrightText}
        </p>

        {data.links && data.links.length > 0 && (
          <div className="flex items-center gap-4">
            {data.links.map((link, idx) => (
              <a
                key={idx}
                href={(!isPublicView && link.href.startsWith('#')) ? undefined : link.href}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
