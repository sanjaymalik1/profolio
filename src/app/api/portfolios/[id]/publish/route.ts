import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// POST /api/portfolios/[id]/publish - Publish/unpublish a portfolio
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = params;
    const body = await request.json();
    const { isPublic, customSlug } = body;

    // Verify portfolio belongs to user
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    if (portfolio.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {
      isPublic,
      updatedAt: new Date(),
    };

    // If publishing for the first time, set publishedAt
    if (isPublic && !portfolio.publishedAt) {
      updateData.publishedAt = new Date();
    }

    // Set lastPublishedAt whenever publishing/updating
    if (isPublic) {
      updateData.lastPublishedAt = new Date();
    }

    // If unpublishing, clear publishedAt and lastPublishedAt
    if (!isPublic) {
      updateData.publishedAt = null;
      updateData.lastPublishedAt = null;
    }

    // Handle custom slug
    if (customSlug) {
      // Validate custom slug format
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(customSlug)) {
        return NextResponse.json({ 
          error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.' 
        }, { status: 400 });
      }

      // Check if custom slug is already taken by another portfolio
      const existingPortfolio = await prisma.portfolio.findFirst({
        where: {
          customSlug,
          id: { not: id },
        },
      });

      if (existingPortfolio) {
        return NextResponse.json({ 
          error: 'This custom URL is already taken' 
        }, { status: 400 });
      }

      updateData.customSlug = customSlug;
    }

    // Update portfolio
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        slug: true,
        customSlug: true,
        isPublic: true,
        publishedAt: true,
        viewCount: true,
        updatedAt: true,
      },
    });

    // Generate public URL
    const publicSlug = updatedPortfolio.customSlug || updatedPortfolio.slug;
    const publicUrl = isPublic ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/p/${publicSlug}` : null;

    return NextResponse.json({ 
      success: true, 
      data: {
        ...updatedPortfolio,
        publicUrl,
      }
    });
  } catch (error) {
    console.error('Error publishing portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
