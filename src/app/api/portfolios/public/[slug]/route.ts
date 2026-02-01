import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/portfolios/public/[slug] - Get public portfolio by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

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

    // Increment view count
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ 
      success: true, 
      data: portfolio 
    });
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
