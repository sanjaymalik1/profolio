import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Get or create a user in the database from Clerk userId
 * This ensures that when a new user signs in with Clerk,
 * they are automatically added to our database
 */
export async function getOrCreateUser(clerkUserId: string) {
  try {
    // Check if user exists by clerkUserId
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId },
    });

    if (!user) {
      // Get Clerk user data
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        console.error('[getOrCreateUser] Failed to get Clerk user data for clerkUserId:', clerkUserId);
        return null;
      }

      const userEmail = clerkUser.emailAddresses[0]?.emailAddress || '';

      console.log('[getOrCreateUser] User not found by clerkUserId, checking by email:', userEmail);

      // Check if user exists with this email (might be from different auth or import)
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (existingUserByEmail) {
        console.log('[getOrCreateUser] User exists with email, updating clerkUserId:', {
          userId: existingUserByEmail.id,
          clerkUserId: clerkUserId,
          email: userEmail,
        });
        
        // Update existing user with Clerk userId
        user = await prisma.user.update({
          where: { id: existingUserByEmail.id },
          data: {
            clerkUserId: clerkUserId,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
            image: clerkUser.imageUrl || null,
            role: clerkUser.publicMetadata?.role === 'ADMIN' ? 'ADMIN' : 'USER',
          },
        });
        console.log('[getOrCreateUser] User updated successfully:', user.id);
      } else {
        console.log('[getOrCreateUser] Creating new user:', {
          clerkUserId: clerkUserId,
          email: userEmail,
        });

        // Create new user with Clerk data
        user = await prisma.user.create({
          data: {
            clerkUserId: clerkUserId,
            email: userEmail,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
            image: clerkUser.imageUrl || null,
            role: clerkUser.publicMetadata?.role === 'ADMIN' ? 'ADMIN' : 'USER',
          },
        });

        console.log('[getOrCreateUser] User created successfully:', user.id);
      }
    }

    return user;
  } catch (error) {
    console.error('[getOrCreateUser] Error:', error);
    throw error;
  }
}
