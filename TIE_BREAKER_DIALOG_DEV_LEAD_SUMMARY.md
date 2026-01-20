# Tie-Breaker Dialog - Dev Lead Summary
## Quick Reference for Development Lead

This is a concise summary of the Tie-Breaker Dialog feature for quick reference.

---

## Feature Overview

**What**: Dialog to set tie-breaker ordering for lenders when final fees match in unsolicited bids.

**Why**: When multiple lenders offer the same fee, system needs a way to prioritize which lender gets the bid.

**Where**: Lender Management screen → "Set tie-breaker ordering" button → Dialog opens

---

## Component Breakdown

### Quick Stats
- **Total Components**: 10-11 (depending on button approach)
- **Atoms**: 6-7 (ButtonAtom or TieBreakerButtonAtom)
- **Molecules**: 2 (DialogHeader, DialogActions)
- **Cell Renderers**: 1
- **Organisms**: 1
- **Estimated Effort**: 3-5 days

**Note**: TieBreakerButton is just ButtonAtom with specific props - use ButtonAtom directly (no need for separate molecule)

### Component List

| Level | Component | Location | Status |
|-------|-----------|----------|--------|
| Atom | ButtonAtom | `shared/atoms/button/` | Check if exists | **Use directly for tie-breaker button** |
| Atom | DragHandleAtom | `shared/atoms/drag-handle/` | New | For drag handle icon |
| Atom | LabelAtom | `shared/atoms/label/` | Check if exists | For text labels |
| Atom | NumberDisplayAtom | `shared/atoms/number-display/` | New | For tie-breaker numbers |
| Atom | IconButtonAtom | `shared/atoms/icon-button/` | Check if exists | For close button |
| Atom | InstructionTextAtom | `shared/atoms/instruction-text/` | New | For instruction text |
| Molecule | DialogHeaderMolecule | `shared/molecules/dialog-header/` | Check if exists | Title + close button |
| Molecule | DialogActionsMolecule | `shared/molecules/dialog-actions/` | Check if exists | Cancel + Save buttons |
| Cell Renderer | DragHandleCellRenderer | `features/lender-management/cell-renderers/` | New | For ag-Grid drag column |
| Organism | TieBreakerDialogOrganism | `features/lender-management/organisms/` | New | Complete dialog |

---

## Technical Stack

- **Framework**: Angular 11
- **Grid Library**: ag-Grid 24.x
- **Pattern**: Atomic Design
- **Migration-Friendly**: Yes (all patterns applied)

---

## API Requirements

### Endpoints Needed

1. **GET /api/lenders**
   - Returns: `Lender[]`
   - Purpose: Load all lenders for dialog

2. **PUT /api/lenders/tie-breaker-order**
   - Request: `{ id: string, tieBreakerOrder: number }[]`
   - Response: `void`
   - Purpose: Persist tie-breaker order

---

## Implementation Phases

### Phase 1: Atoms (Day 1)
- Create/verify 6 atoms
- Focus: DragHandleAtom, NumberDisplayAtom, InstructionTextAtom

### Phase 2: Molecules (Day 1-2)
- Create 3 molecules
- Reuse existing if available

### Phase 3: Cell Renderer (Day 2)
- Create DragHandleCellRenderer for ag-Grid

### Phase 4: Organism (Day 2-3)
- Create TieBreakerDialogOrganism
- Integrate ag-Grid with row dragging
- Implement drag-drop logic

### Phase 5: Service & Integration (Day 3-4)
- Update LenderService
- Integrate in parent component
- API integration

### Phase 6: Testing (Day 4-5)
- Unit tests
- Integration tests
- E2E tests

---

## Key Technical Decisions

1. **Use ag-Grid** (not custom drag-drop) - Already in project, consistent UI
2. **Row Dragging** - Use ag-Grid's `rowDragManaged: true`
3. **Grid Adapter** - Use existing GridAdapterService for migration-friendly code
4. **Minimal Payload** - Only send id + tieBreakerOrder to API
5. **Default Order** - Assign 1, 2, 3... if not set

---

## Dependencies

### Existing (Already in Project)
- ✅ ag-grid-angular: ^24.0.0
- ✅ ag-grid-community: ^24.0.0
- ✅ GridAdapterService

### New (May Need)
- None - all dependencies already available

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| ag-Grid row dragging not working | High | Test early, have fallback plan |
| Performance with 97+ lenders | Medium | Use ag-Grid virtualization (already enabled) |
| API endpoint not ready | High | Mock API for development |
| Browser compatibility | Low | ag-Grid handles this |

---

## Success Criteria

- [ ] Dialog opens from button click
- [ ] All lenders displayed in ag-Grid
- [ ] Drag-and-drop reorders lenders
- [ ] Tie-breaker numbers update (1, 2, 3...)
- [ ] Save persists to database
- [ ] Cancel resets order
- [ ] Works with 97+ lenders (performance)
- [ ] Unit tests pass
- [ ] Integration tests pass

---

## Questions for Dev Lead

1. **API Endpoints**: Are `/api/lenders` and `/api/lenders/tie-breaker-order` ready?
2. **Existing Components**: Do DialogHeaderMolecule and DialogActionsMolecule exist?
3. **Styling**: Use existing dialog styles or create new?
4. **Error Handling**: What error handling pattern to use?
5. **Notifications**: What notification service for success/error messages?

---

## Next Steps

1. **Review this document** with team
2. **Verify API endpoints** are ready
3. **Check existing components** (atoms, molecules)
4. **Assign tasks** based on phases
5. **Start with Phase 1** (Atoms)

---

**For detailed implementation guide, see**: [TIE_BREAKER_DIALOG_ATOMIC_DESIGN.md](./TIE_BREAKER_DIALOG_ATOMIC_DESIGN.md)

