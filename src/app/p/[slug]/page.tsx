import React from 'react';
import { prisma } from '@/lib/prisma';
import { EditorSection } from '@/types/editor';
import Link from 'next/link';
import { PortfolioRenderer } from './PortfolioRenderer';

interface Portfolio {
  id: string;
  title: string;
  content: {
    sections: EditorSection[];
  };
}

async function getPortfolio(slug: string): Promise<Portfolio | null> {
  try {
    // Find portfolio by customSlug or slug
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        OR: [
          { customSlug: slug },
          { slug: slug },
        ],
        isPublic: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    if (!portfolio) {
      return null;
    }

    // Increment view count
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { viewCount: { increment: 1 } },
    });

    return portfolio as Portfolio;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-lg text-gray-600 mb-6">Portfolio not found</p>
          <Link
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const sections = portfolio.content?.sections || [];

  return <PortfolioRenderer sections={sections} />;
}
