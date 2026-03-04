import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// GET /api/portfolios/public/[slug] - Get public portfolio by slug
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;

    // Find portfolio by customSlug or slug
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        OR: [
          { customSlug: slug },
          { slug: slug },
        ],
        isPublic: true, // Only return public portfolios
      },
      select: {
        id: true,
        title: true,
        content: true,
        viewCount: true,
        publishedAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!portfolio) {
      return NextResponse.json({
        error: 'Portfolio not found or not published'
      }, { status: 404 });
    }

    // Note: viewCount is intentionally NOT incremented here.
    // The canonical view counter lives in the SSR page at /p/[slug]/page.tsx,
    // which is the actual entry point for all public portfolio visitors.
    // Incrementing here too would double-count any views if this route is ever used.

    return NextResponse.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
