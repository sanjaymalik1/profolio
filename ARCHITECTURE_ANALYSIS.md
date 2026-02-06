# Editor Architecture Analysis

## Current State: Form-Driven Architecture

### Flow:
1. User opens editor → Sees EditorCanvas with sections
2. User clicks section → `selectSection(id)` called
3. PropertyPanel appears on right with form inputs (HeroPropertyForm, etc.)
4. User edits in form → `updateSectionData(id, newData)` called
5. Section re-renders with new data

### Problems:
❌ **Disconnected**: Editing happens away from the content  
❌ **Complex**: Separate forms for each section type  
❌ **Inflexible**: Can't add inline styling, requires form updates  
❌ **Un-Notion-like**: Notion/Framer edit in-place, not in sidebars  

---

## Target State: Inline Block-Based Architecture

### Flow:
1. User opens editor → Sees sections rendered with inline editing enabled
2. User clicks text → Text becomes editable (contentEditable)
3. User selects text → Contextual toolbar appears (formatting options)
4. User edits → Changes tracked in real-time → Undo/redo stack updated
5. Changes auto-save after debounce

### Benefits:
✅ **Direct**: Edit where you see the content  
✅ **Simple**: No separate forms needed  
✅ **Flexible**: Add styling controls dynamically  
✅ **Framer-like**: True WYSIWYG experience  

---

## Implementation Strategy

### Option A: Gradual Refactor (RECOMMENDED)
Keep both systems working, migrate section by section:

1. **Phase 1**: Add inline editing to HeroSection
   - Keep PropertyPanel as fallback
   - HeroSection detects if it's in edit mode
   - Text fields use EditableText component
   - Images use EditableImage component

2. **Phase 2**: Add contextual toolbar
   - Toolbar appears on text selection
   - Apply styles directly to sections

3. **Phase 3**: Migrate other sections
   - AboutSection → inline editing
   - ProjectsSection → inline editing
   - etc.

4. **Phase 4**: Remove PropertyPanel entirely
   - Once all sections support inline editing
   - Clean up old form components

### Option B: Big Bang Rewrite (RISKY)
Replace everything at once - higher risk, more disruption.

---

## Decision: Option A (Gradual)

### Why:
- Existing portfolios keep working
- Can test inline editing incrementally
- Lower risk of introducing bugs
- Can fall back if issues arise

### Next Steps:
1. Create `HeroSectionInline.tsx` - inline editable version
2. Add mode prop to toggle between form-driven and inline
3. Test with real portfolio data
4. Migrate other sections once pattern is validated

---

## Key Architectural Principles

### 1. Separation of Concerns
- **View Mode**: Clean render (public portfolios)
- **Edit Mode**: Inline editing enabled (editor)
- **Form Mode**: Fallback for complex properties (optional)

### 2. State Management
- Sections own their editing state locally
- Global state (EditorContext) only for structure (add/remove/reorder)
- Content changes bubble up through callbacks

### 3. Undo/Redo Strategy
- Track changes at content level (text changes, style changes)
- Use command pattern (invertible operations)
- Don't snapshot entire state (too expensive)

### 4. Autosave Trigger
- Debounce on content changes (not state snapshots)
- Only save when user makes a change
- Never flicker the save state

---

## Current Architecture Audit

### Files to Keep:
- ✅ `EditorContext.tsx` - State management core
- ✅ `EditorCanvas.tsx` - Section container
- ✅ Section components (HeroSection.tsx, etc.)
- ✅ `usePortfolioPersistence.ts` - Autosave logic

### Files to Refactor:
- 🔄 `PropertyPanel.tsx` - Will become optional/removed
- 🔄 Property forms - Will be replaced by inline editing

### Files to Add:
- ✨ `EditableText.tsx` - Inline text editing (DONE)
- ✨ `EditableImage.tsx` - Inline image editing (DONE)
- ✨ `ContextualToolbar.tsx` - Formatting toolbar (DONE)
- ✨ `HeroSectionInline.tsx` - Refactored HeroSection (TODO)

---

## Data Compatibility

### Existing Data Structure (PRESERVE):
```json
{
  "sections": [
    {
      "id": "hero-123",
      "type": "hero",
      "data": {
        "fullName": "John Doe",
        "title": "Developer",
        "bio": "...",
        "profileImage": "https://..."
      },
      "styling": {
        "backgroundColor": "#fff",
        "textColor": "#000"
      }
    }
  ]
}
```

### No Schema Changes Needed
- Inline editing reads/writes same data structure
- Only UI/UX changes, not data format
- Backward compatible with existing portfolios

---

## Success Metrics

### Before (Form-Driven):
- ❌ 5+ clicks to edit hero text
- ❌ Context switching (canvas → sidebar)
- ❌ Can't see changes while editing
- ❌ Undo/redo unreliable (snapshots entire state)

### After (Inline):
- ✅ 1 click to edit (click text → type)
- ✅ Edit in context (WYSIWYG)
- ✅ See changes immediately
- ✅ Undo/redo granular (text-level changes)

---

## Risk Mitigation

### Risk: Breaking existing portfolios
**Mitigation**: Data schema unchanged, only UI changes

### Risk: Inline editing bugs
**Mitigation**: Keep PropertyPanel as fallback initially

### Risk: Performance with large portfolios
**Mitigation**: Virtualize sections if needed, debounce saves

### Risk: Undo/redo complexity
**Mitigation**: Use proven command pattern, test extensively

---

## Timeline Estimate

- **Phase 1** (Inline HeroSection): 2-3 hours
- **Phase 2** (Contextual Toolbar): 1-2 hours
- **Phase 3** (Migrate other sections): 3-4 hours
- **Phase 4** (Remove PropertyPanel): 1 hour
- **Testing & Polish**: 2-3 hours

**Total**: ~10-15 hours of focused work

---

## Conclusion

The refactor is necessary and achievable. By using a gradual migration strategy, we minimize risk while moving toward a production-grade inline editing experience that matches Framer + Notion quality standards.

**Next Action**: Implement `HeroSectionInline.tsx` as proof of concept.
