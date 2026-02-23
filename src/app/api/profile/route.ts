import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user-helpers';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure user exists in database (creates if doesn't exist)
    const user = await getOrCreateUser(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Try to find existing profile using user's database ID
    let profile = await prisma.profile.findUnique({
      where: { userId: user.id }, // Use database user.id (ObjectId)
      include: {
        user: {
          select: {
            id: true,
            clerkUserId: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    });

    // If profile doesn't exist, create it
    if (!profile) {
      console.log('[Profile API] Creating new profile for user.id:', user.id);
      try {
        profile = await prisma.profile.create({
          data: {
            userId: user.id, // Use database user.id (ObjectId)
          },
          include: {
            user: {
              select: {
                id: true,
                clerkUserId: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              }
            }
          }
        });
        console.log('[Profile API] Profile created successfully:', profile.id);
      } catch (createError) {
        console.error('[Profile API] Failed to create profile:', createError);
        throw createError;
      }
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });

  } catch (error) {
    console.error('[Profile API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure user exists in database
    const user = await getOrCreateUser(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Failed to create user' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      bio,
      phone,
      location,
      website,
      linkedin,
      github,
      twitter,
    } = body;

    // Use upsert to handle case where profile doesn't exist yet
    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id }, // Use database user.id (ObjectId)
      update: {
        firstName,
        lastName,
        bio,
        phone,
        location,
        website,
        linkedin,
        github,
        twitter,
      },
      create: {
        userId: user.id, // Use database user.id (ObjectId)
        firstName,
        lastName,
        bio,
        phone,
        location,
        website,
        linkedin,
        github,
        twitter,
      },
      include: {
        user: {
          select: {
            id: true,
            clerkUserId: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}