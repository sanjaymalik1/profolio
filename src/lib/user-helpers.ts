import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Get a user from the database by their Clerk userId.
 *
 * Primary path: user exists (created by the Clerk webhook at /api/webhooks/clerk).
 * Fallback path: user not found → create them now. This handles:
 *   - Users who signed up before the webhook was configured / reachable
 *   - Any gap period where the webhook missed a signup
 *
 * Once the webhook is reliably active, the fallback path never triggers
 * but is kept as a safety net.
 */
export async function getUser(clerkUserId: string) {
  try {
    // Fast path: user exists (expected case once webhook is active)
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (existingUser) {
      return existingUser;
    }

    // Fallback: user slipped through (webhook misconfigured, wrong port, etc.)
    console.warn(`[getUser] Fallback: user not in DB, creating lazily for: ${clerkUserId}`);

    const clerkUser = await currentUser();
    if (!clerkUser) {
      console.error('[getUser] Could not fetch Clerk user data for:', clerkUserId);
      return null;
    }

    const primaryEmail =
      clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
        ?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? '';

    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;
    const role = clerkUser.publicMetadata?.role === 'ADMIN' ? 'ADMIN' : 'USER';

    // Upsert avoids race condition if two API calls arrive simultaneously
    return await prisma.user.upsert({
      where: { clerkUserId },
      create: { clerkUserId, email: primaryEmail, name, image: clerkUser.imageUrl, role },
      update: { email: primaryEmail, name, image: clerkUser.imageUrl, role },
    });
  } catch (error) {
    console.error('[getUser] Error:', error);
    throw error;
  }
}
