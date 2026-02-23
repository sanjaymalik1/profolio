import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user-helpers';

// GET /api/portfolios - Get user's portfolios
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized - Please sign in' 
      }, { status: 401 });
    }

    // Ensure user exists in database
    const user = await getOrCreateUser(userId);
    
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      }, { status: 404 });
    }

    // Query portfolios by database user.id
    const portfolios = await prisma.portfolio.findMany({
      where: { userId: user.id }, // Use database user.id (ObjectId)
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        customSlug: true,
        template: true,
        isPublic: true,
        content: true,
        viewCount: true,
        lastPublishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: portfolios 
    });
  } catch (error) {
    console.error('[Portfolios API GET] Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to load portfolios' 
    }, { status: 500 });
  }
}

// POST /api/portfolios - Create new portfolio
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized - Please sign in' 
      }, { status: 401 });
    }

    // Ensure user exists in database
    const user = await getOrCreateUser(userId);

    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, template = 'default', isPublic = false } = body;

    if (!title) {
      return NextResponse.json({ 
        success: false,
        error: 'Title is required' 
      }, { status: 400 });
    }

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure unique slug
    while (await prisma.portfolio.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        userId: user.id, // Use database user.id (ObjectId)
        title,
        slug,
        template,
        isPublic,
        content: content || {},
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: portfolio 
    });
  } catch (error) {
    console.error('[Portfolios API POST] Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create portfolio' 
    }, { status: 500 });
  }
}