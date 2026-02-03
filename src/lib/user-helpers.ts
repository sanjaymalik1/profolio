import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Get or create a user in the database from Clerk userId
 * This ensures that when a new user signs in with Clerk,
 * they are automatically added to our database
 */
export async function getOrCreateUser(userId: string) {
  try {
    // Check if user exists by id (which is clerkId)
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Get Clerk user data
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        console.error('[getOrCreateUser] Failed to get Clerk user data for userId:', userId);
        return null;
      }

      console.log('[getOrCreateUser] Creating new user:', {
        id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
      });

      // Create user in database with Clerk userId as primary key
      user = await prisma.user.create({
        data: {
          id: userId, // Clerk userId
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
          image: clerkUser.imageUrl || null,
          role: clerkUser.publicMetadata?.role === 'ADMIN' ? 'ADMIN' : 'USER',
        },
      });

      console.log('[getOrCreateUser] User created successfully:', user.id);
    }

    return user;
  } catch (error) {
    console.error('[getOrCreateUser] Error:', error);
    throw error;
  }
}
