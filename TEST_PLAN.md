# Inline Editing Integration Test Plan

## Quick Validation Test (5 minutes)

### Test in Browser:

1. **Start Dev Server**
   ```bash
   npm run dev
   ```

2. **Create/Open Portfolio**
   - Go to dashboard
   - Click "Create New Portfolio" or open existing one
   - Editor should load

3. **Test HeroSection Inline Editing**

   **Text Editing:**
   - Click on "Your Name" text
   - Should see focus ring (blue border)
   - Start typing → text should update immediately
   - Click away → change should persist
   - Check save indicator → should show "Saving..." then "Saved"

   **Undo/Redo:**
   - Make a text edit
   - Press `Cmd+Z` (Mac) or `Ctrl+Z` (Windows)
   - Text should revert to previous value
   - Press `Cmd+Shift+Z` → should redo

   **Image Editing:**
   - Hover over profile image → should see "Change" and "Remove" buttons
   - Click "Change" → file picker should open
   - Select image → should update immediately

   **Contextual Toolbar:**
   - Click and select some text (drag to select)
   - Floating toolbar should appear above selection
   - Try alignment buttons → section alignment should change
   - Try color picker → text color should change

4. **Verify Other Sections Unchanged**
   - Add "About" section
   - Click on it → PropertyPanel should show form (old behavior)
   - Should NOT have inline editing

5. **Check Public View**
   - Publish portfolio
   - Open public link (e.g., `/p/your-slug`)
   - Text should be static (not editable)
   - No editor UI visible
   - Animations should work

---

## Expected Behavior

### ✅ Success Indicators:
- Text becomes editable on click
- Changes save automatically after 3 seconds
- Undo/redo works (Cmd+Z, Cmd+Shift+Z)
- Save indicator updates: "Unsaved" → "Saving..." → "Saved"
- Public view has no editor artifacts

### ❌ Failure Indicators:
- Text not editable when clicked
- Changes don't save
- Undo/redo doesn't work
- Errors in browser console
- Public view shows editor UI

---

## Debug Steps (If Issues)

### Issue: Text not editable
1. Check browser console for errors
2. Verify `onDataChange` prop is passed to HeroSection
3. Check that `inlineEditMode` is true in editor

### Issue: Changes don't save
1. Check Network tab → should see PUT request to `/api/portfolios/[id]`
2. Verify `hasUnsavedChanges` is set to true after edit
3. Check usePortfolioPersistence hook is active

### Issue: Undo doesn't work
1. Check that `state.past` array grows after edit
2. Verify keyboard shortcuts are bound (check browser console)
3. Test undo button in toolbar (if visible)

### Issue: Toolbar doesn't appear
1. Check that text selection triggers `onFocus` callback
2. Verify `selectedField` state is set
3. Check `toolbarVisible` state is true

---

## Console Commands (For Debugging)

Open browser console and run:

```javascript
// Check editor state
window.__EDITOR_STATE__ // (if exposed)

// Check if undo/redo works
console.log('Past length:', state.past.length);
console.log('Future length:', state.future.length);

// Force autosave (if needed)
// Should happen automatically after 3 seconds
```

---

## Files Changed (Reference)

1. **HeroSection.tsx** - Inline editing integration
2. **EditorCanvas.tsx** - Pass onChange callbacks
3. **EditableText.tsx** - Contenteditable component
4. **EditableImage.tsx** - Image upload component
5. **ContextualToolbar.tsx** - Styling toolbar
6. **popover.tsx** - UI primitive (new)

---

## Rollback Plan (If Needed)

If inline editing breaks something critical:

1. Revert HeroSection changes:
   ```bash
   git checkout HEAD -- src/components/portfolio/sections/HeroSection.tsx
   ```

2. Revert EditorCanvas changes:
   ```bash
   git checkout HEAD -- src/components/editor/EditorCanvas.tsx
   ```

3. The new inline components won't break anything (they're not used elsewhere)

---

## Performance Check

Monitor these metrics:

- **Initial Load**: Should be same as before
- **Typing Latency**: Should feel instant (< 50ms)
- **Save Time**: Should debounce (3 seconds after last edit)
- **Undo/Redo Speed**: Should be instant (< 100ms)

If performance degrades:
- Check if deep cloning is happening too frequently
- Verify debounce is working (not saving on every keystroke)
- Consider React.memo for expensive components

---

## Next Actions

**If tests pass:**
1. ✅ Mark HeroSection inline editing as stable
2. ✅ Begin migrating AboutSection (same pattern)
3. ✅ Document lessons learned

**If tests fail:**
1. ❌ Debug issues (use debug steps above)
2. ❌ Fix bugs
3. ❌ Re-test until stable

---

## Success Criteria (Must All Pass)

- [ ] Text editing works (click → type → save)
- [ ] Undo/redo works (Cmd+Z, Cmd+Shift+Z)
- [ ] Autosave works (debounced, no flicker)
- [ ] Toolbar works (appears on selection, changes styling)
- [ ] Image editing works (upload, change, remove)
- [ ] Public view is clean (no editor UI)
- [ ] Other sections unchanged (still use PropertyPanel)
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Performance is acceptable

---

Once all criteria pass, inline editing for HeroSection is **production-ready**.
