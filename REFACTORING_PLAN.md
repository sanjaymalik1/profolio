# Portfolio Editor Refactoring Plan

## Goal: Framer + Notion Level Quality

### Phase 1: Inline Editing Core (CURRENT)
- [ ] Create inline editable primitives (EditableText, EditableImage)
- [ ] Refactor HeroSection to support inline editing
- [ ] Create contextual toolbar component
- [ ] Remove PropertyPanel dependency

### Phase 2: Undo/Redo Determinism
- [ ] Implement command pattern for all mutations
- [ ] Granular history tracking (text changes, style changes separately)
- [ ] Test undo/redo for every action type
- [ ] Add keyboard shortcuts

### Phase 3: Autosave State Management
- [ ] Refactor to command-based change detection
- [ ] Remove effect dependency on state.sections
- [ ] Implement proper save state machine
- [ ] Test no-flicker guarantee

### Phase 4: Editor UX Polish
- [ ] Minimal, calm design
- [ ] Smooth transitions
- [ ] Contextual controls only
- [ ] Remove clutter

### Phase 5: Public View Cleanup
- [ ] Remove ALL editor artifacts
- [ ] Zero helper text, no animations hints
- [ ] Production-grade clean output

### Phase 6: End-to-End Flow Validation
- [ ] Create → DB immediately
- [ ] Editor loads from DB
- [ ] Inline editing works
- [ ] Autosave persists
- [ ] Publish generates stable link
- [ ] No fragile states

## Architecture Decisions

### Inline Editing Pattern
- Each section component has two render modes:
  - **View Mode**: Final rendered output (public portfolios)
  - **Edit Mode**: Inline editable with contentEditable, controlled inputs
- No separate forms, all editing happens in-canvas

### Contextual Toolbar
- Floating toolbar appears when user selects text/element
- Shows relevant styling options (font, size, color, alignment)
- Similar to Notion's toolbar or Framer's property inspector

### Command Pattern for Undo/Redo
- Every mutation becomes a Command object
- Commands are invertible (can undo)
- History stack stores commands, not full state snapshots
- More efficient, more reliable

### Autosave Architecture
- Commands trigger change events
- Debounced save watches command queue
- Save state only changes on real user mutations
- One source of truth: database

## Breaking Changes (NONE for Data)
- Existing portfolios work without migration
- Data schema unchanged
- API contracts preserved
- Only UI/UX changes

## Success Criteria
- [ ] User can edit all text inline (click → type)
- [ ] User can change all visual properties (font, color, spacing)
- [ ] Undo/redo never fails
- [ ] Autosave feels invisible
- [ ] Public portfolios are clean (zero editor artifacts)
- [ ] Flow is rock-solid (create → edit → save → publish)
