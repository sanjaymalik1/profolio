import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/user-helpers';

const DEFAULT_LIMIT = 4;
const MAX_LIMIT = 12;
const DASHBOARD_CACHE_TTL_MS = 8_000;

type PortfolioListResponse = {
  success: true;
  data: Array<{
    id: string;
    title: string;
    slug: string;
    customSlug: string | null;
    template: string;
    isPublic: boolean;
    content: { sections: unknown[] } | null;
    sectionCount: number;
    viewCount: number;
    lastPublishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
};

type CacheEntry = {
  expiresAt: number;
  payload: PortfolioListResponse;
};

const dashboardListCache = new Map<string, CacheEntry>();

function cacheKey(userId: string, page: number, limit: number) {
  return `${userId}:${page}:${limit}`;
}

function pruneExpiredDashboardCache() {
  const now = Date.now();
  for (const [key, entry] of dashboardListCache.entries()) {
    if (entry.expiresAt <= now) {
      dashboardListCache.delete(key);
    }
  }
}

function clearDashboardCacheForUser(userId: string) {
  const prefix = `${userId}:`;
  for (const key of dashboardListCache.keys()) {
    if (key.startsWith(prefix)) {
      dashboardListCache.delete(key);
    }
  }
}

function extractPreviewSections(content: unknown): { sections: unknown[] } | null {
  const sections = (content as { sections?: unknown[] } | null | undefined)?.sections;
  if (!Array.isArray(sections)) return null;

  // Keep only section fields needed by dashboard preview renderer.
  const normalizedSections = sections.map((section) => {
    if (!section || typeof section !== 'object') return section;
    const typedSection = section as Record<string, unknown>;
    return {
      id: typedSection.id,
      type: typedSection.type,
      data: typedSection.data,
      styling: typedSection.styling,
      isEditable: typedSection.isEditable,
      order: typedSection.order,
    };
  });

  return { sections: normalizedSections };
}

// GET /api/portfolios - Get user's portfolios
export async function GET(request: NextRequest) {
  const apiStart = Date.now();
  const shouldLogPerf = process.env.NODE_ENV !== 'production';

  try {
    const pageParam = request.nextUrl.searchParams.get('page');
    const limitParam = request.nextUrl.searchParams.get('limit');
    const forceRefresh = request.nextUrl.searchParams.get('fresh') === '1';

    const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1);
    const parsedLimit = Number.parseInt(limitParam ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
    const limit = Math.min(MAX_LIMIT, Math.max(1, parsedLimit));
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

    pruneExpiredDashboardCache();
    const key = cacheKey(user.id, page, limit);
    if (!forceRefresh) {
      const cached = dashboardListCache.get(key);
      if (cached && cached.expiresAt > Date.now()) {
        if (shouldLogPerf) {
          console.info(`[Portfolios API GET] cache hit page=${page} limit=${limit} count=${cached.payload.data.length} total=${Date.now() - apiStart}ms`);
        }
        return NextResponse.json(cached.payload, {
          headers: {
            'Cache-Control': 'private, max-age=8, stale-while-revalidate=30',
            Vary: 'Cookie',
          },
        });
      }
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

    // Keep processing minimal and preview-oriented.
    const transformStart = Date.now();
    const portfolioList = portfolios.map((portfolio) => {
      const sections = (portfolio.content as { sections?: unknown[] } | null)?.sections;
      const sectionCount = Array.isArray(sections) ? sections.length : 0;
      return {
        id: portfolio.id,
        title: portfolio.title,
        slug: portfolio.slug,
        customSlug: portfolio.customSlug,
        template: portfolio.template,
        isPublic: portfolio.isPublic,
        content: extractPreviewSections(portfolio.content),
        sectionCount,
        viewCount: portfolio.viewCount,
        lastPublishedAt: portfolio.lastPublishedAt,
        createdAt: portfolio.createdAt,
        updatedAt: portfolio.updatedAt,
      };
    });

    const transformDuration = Date.now() - transformStart;

    const payload: PortfolioListResponse = {
      success: true,
      data: portfolioList,
      total,
    };

    dashboardListCache.set(key, {
      expiresAt: Date.now() + DASHBOARD_CACHE_TTL_MS,
      payload,
    });

    if (shouldLogPerf) {
      console.info(
        `[Portfolios API GET] page=${page} limit=${limit} count=${portfolioList.length} totalCount=${total} query=${queryDuration}ms transform=${transformDuration}ms total=${Date.now() - apiStart}ms`
      );
    }

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'private, max-age=8, stale-while-revalidate=30',
        Vary: 'Cookie',
      },
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

    clearDashboardCacheForUser(user.id);

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