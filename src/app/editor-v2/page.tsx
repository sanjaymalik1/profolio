import { Suspense } from 'react';
import EditorV2Client from './EditorV2Client';
import { EditorLoadingSkeleton } from './EditorLoadingSkeleton';

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoadingSkeleton />}>
      <EditorV2Client />
    </Suspense>
  );
}