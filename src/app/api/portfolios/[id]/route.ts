import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user-helpers';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/portfolios/[id] - Get specific portfolio
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get user from database
    const user = await getOrCreateUser(userId);
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      }, { status: 404 });
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: { 
        id: id,
        userId: user.id // Use database user.id (ObjectId)
      },
    });

    if (!portfolio) {
      return NextResponse.json({ 
        success: false,
        error: 'Portfolio not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: portfolio 
    });
  } catch (error) {
    console.error('[Portfolio API GET] Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch portfolio' 
    }, { status: 500 });
  }
}

// PUT /api/portfolios/[id] - Update portfolio
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get user from database
    const user = await getOrCreateUser(userId);
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, template, isPublic } = body;

    // Check if portfolio exists and belongs to user
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: { 
        id: id,
        userId: user.id // Use database user.id (ObjectId)
      },
    });

    if (!existingPortfolio) {
      return NextResponse.json({ 
        success: false,
        error: 'Portfolio not found' 
      }, { status: 404 });
    }

    // Update slug if title changed
    let slug = existingPortfolio.slug;
    if (title && title !== existingPortfolio.title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      let newSlug = baseSlug;
      let counter = 1;
      
      // Ensure unique slug (excluding current portfolio)
      while (await prisma.portfolio.findFirst({ 
        where: { 
          slug: newSlug,
          id: { not: id }
        } 
      })) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      slug = newSlug;
    }

    // If portfolio is published and content is being updated, update lastPublishedAt
    const updateData: any = {
      ...(title && { title }),
      ...(content && { content }),
      ...(template && { template }),
      ...(typeof isPublic === 'boolean' && { isPublic }),
      slug,
    };

    // Update lastPublishedAt if portfolio is public and content changed
    if (existingPortfolio.isPublic && content) {
      updateData.lastPublishedAt = new Date();
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedPortfolio 
    });
  } catch (error) {
    console.error('[Portfolio API PUT] Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update portfolio' 
    }, { status: 500 });
  }
}

// DELETE /api/portfolios/[id] - Delete portfolio
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get user from database
    const user = await getOrCreateUser(userId);
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      }, { status: 404 });
    }

    // Check if portfolio exists and belongs to user
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: { 
        id: id,
        userId: user.id // Use database user.id (ObjectId)
      },
    });

    if (!existingPortfolio) {
      return NextResponse.json({ 
        success: false,
        error: 'Portfolio not found' 
      }, { status: 404 });
    }

    await prisma.portfolio.delete({
      where: { id: id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Portfolio deleted successfully' 
    });
  } catch (error) {
    console.error('[Portfolio API DELETE] Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete portfolio' 
    }, { status: 500 });
  }
}