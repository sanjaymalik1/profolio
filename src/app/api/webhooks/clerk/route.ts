import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

// Clerk webhook event types we care about
type ClerkUserEvent = {
    type: 'user.created' | 'user.updated' | 'user.deleted';
    data: {
        id: string;
        email_addresses: { email_address: string; id: string }[];
        primary_email_address_id: string;
        first_name: string | null;
        last_name: string | null;
        image_url: string | null;
        public_metadata: { role?: string };
        deleted?: boolean;
    };
};

export async function POST(req: Request) {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('[Clerk Webhook] CLERK_WEBHOOK_SECRET is not set');
        return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Get Svix signature headers for verification
    const headerPayload = await headers();
    const svixId = headerPayload.get('svix-id');
    const svixTimestamp = headerPayload.get('svix-timestamp');
    const svixSignature = headerPayload.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
    }

    // Verify the webhook signature — rejects spoofed/tampered requests
    let event: ClerkUserEvent;
    try {
        const payload = await req.text();
        const wh = new Webhook(webhookSecret);
        event = wh.verify(payload, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
        }) as ClerkUserEvent;
    } catch (err) {
        console.error('[Clerk Webhook] Signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { type, data } = event;
    console.log(`[Clerk Webhook] Received event: ${type} for user: ${data.id}`);

    try {
        switch (type) {
            case 'user.created': {
                // Find primary email
                const primaryEmail = data.email_addresses.find(
                    (e) => e.id === data.primary_email_address_id
                )?.email_address ?? data.email_addresses[0]?.email_address ?? '';

                const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || null;
                const role = data.public_metadata?.role === 'ADMIN' ? 'ADMIN' : 'USER';

                // Upsert: handles edge case where user was created lazily before webhook was active
                await prisma.user.upsert({
                    where: { clerkUserId: data.id },
                    create: {
                        clerkUserId: data.id,
                        email: primaryEmail,
                        name,
                        image: data.image_url,
                        role,
                    },
                    update: {
                        email: primaryEmail,
                        name,
                        image: data.image_url,
                        role,
                    },
                });

                console.log(`[Clerk Webhook] User created/synced: ${data.id}`);
                break;
            }

            case 'user.updated': {
                const primaryEmail = data.email_addresses.find(
                    (e) => e.id === data.primary_email_address_id
                )?.email_address ?? data.email_addresses[0]?.email_address ?? '';

                const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || null;
                const role = data.public_metadata?.role === 'ADMIN' ? 'ADMIN' : 'USER';

                // Update if exists — if user predates the webhook, they'll be caught by getUser's
                // graceful null handling until they next make an API call
                await prisma.user.updateMany({
                    where: { clerkUserId: data.id },
                    data: {
                        email: primaryEmail,
                        name,
                        image: data.image_url,
                        role,
                    },
                });

                console.log(`[Clerk Webhook] User updated: ${data.id}`);
                break;
            }

            case 'user.deleted': {
                // MongoDB does NOT enforce referential integrity — Prisma's
                // onDelete: Cascade in schema.prisma is a no-op for MongoDB.
                // Must manually delete related documents first, then the user.
                const userToDelete = await prisma.user.findUnique({
                    where: { clerkUserId: data.id },
                    select: { id: true },
                });

                if (userToDelete) {
                    await prisma.portfolio.deleteMany({ where: { userId: userToDelete.id } });
                    await prisma.profile.deleteMany({ where: { userId: userToDelete.id } });
                    await prisma.user.delete({ where: { id: userToDelete.id } });
                    console.log(`[Clerk Webhook] User + portfolios + profile deleted: ${data.id}`);
                } else {
                    console.warn(`[Clerk Webhook] user.deleted: no DB record found for ${data.id}, skipping.`);
                }
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error(`[Clerk Webhook] Error handling ${type}:`, error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
