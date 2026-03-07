import { NextResponse } from 'next/server';
import { parseResumeWithGemini } from '@/lib/gemini';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
    try {
        // Basic auth check
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
        }

        // Validate type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or image.' }, { status: 400 });
        }

        // Convert file to base64
        const buffer = await file.arrayBuffer();
        const base64Data = Buffer.from(buffer).toString('base64');

        // Parse it!
        const parsedData = await parseResumeWithGemini(base64Data, file.type);

        return NextResponse.json({ data: parsedData });

    } catch (error: any) {
        console.error('Resume parsing error:', error);

        // Check for specific API errors
        if (error?.message?.includes('GEMINI_API_KEY')) {
            return NextResponse.json({ error: 'Server configuration error: Gemini API key missing' }, { status: 500 });
        }

        return NextResponse.json(
            { error: 'Failed to process resume. Please try again.' },
            { status: 500 }
        );
    }
}
