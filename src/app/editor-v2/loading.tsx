import { EditorLoadingSkeleton } from './EditorLoadingSkeleton';

// Next.js convention: shows instantly during navigation to the editor
// before the editor page component and its data finish loading.
export default function EditorLoading() {
    return <EditorLoadingSkeleton />;
}
