import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/user-helpers';

// GET /api/portfolios - Get user's portfolios
export async function GET(request: NextRequest) {
  const apiStart = Date.now();
  const shouldLogPerf = process.env.NODE_ENV !== 'production';

  try {
    const pageParam = request.nextUrl.searchParams.get('page');
    const limitParam = request.nextUrl.searchParams.get('limit');

    const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1);
    const limit = Math.max(1, Number.parseInt(limitParam ?? '50', 10) || 50);
    const skip = (page - 1) * limit;

    const authStart = Date.now();
    const { userId } = await auth();

    if (shouldLogPerf) {
      console.info(`[Portfolios API GET] auth() completed in ${Date.now() - authStart}ms`);
    }

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Please sign in'
      }, { status: 401 });
    }

    // Ensure user exists in database
    const userLookupStart = Date.now();
    const user = await getUser(userId);

    if (shouldLogPerf) {
      console.info(`[Portfolios API GET] getUser() completed in ${Date.now() - userLookupStart}ms`);
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Fetch portfolios for dashboard cards. Keep query simple and index-friendly.
    const queryStart = Date.now();
    const [portfolios, total] = await prisma.$transaction([
      prisma.portfolio.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
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
      }),
      prisma.portfolio.count({ where: { userId: user.id } }),
    ]);

    const queryDuration = Date.now() - queryStart;

    // Keep processing minimal: preserve DB payload and only add sectionCount.
    const transformStart = Date.now();
    const portfolioList = portfolios.map((portfolio) => {
      const sectionCount = (portfolio.content as { sections?: unknown[] } | null)?.sections?.length ?? 0;
      return {
        ...portfolio,
        sectionCount,
      };
    });

    const transformDuration = Date.now() - transformStart;

    if (shouldLogPerf) {
      const contentBytes = portfolioList.reduce((total, portfolio) => {
        if (!portfolio.content) return total;
        try {
          return total + Buffer.byteLength(JSON.stringify(portfolio.content), 'utf8');
        } catch {
          return total;
        }
      }, 0);

      const responseBody = { success: true, data: portfolioList };
      const responseBytes = Buffer.byteLength(JSON.stringify(responseBody), 'utf8');

      console.info(
        `[Portfolios API GET] page=${page} limit=${limit} count=${portfolioList.length} totalCount=${total} query=${queryDuration}ms transform=${transformDuration}ms contentBytes=${contentBytes} responseBytes=${responseBytes} total=${Date.now() - apiStart}ms`
      );
    }

    return NextResponse.json({
      success: true,
      data: portfolioList,
      portfolios: portfolioList,
      total
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
    const user = await getUser(userId);

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