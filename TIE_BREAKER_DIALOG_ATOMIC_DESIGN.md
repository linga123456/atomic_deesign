# Tie-Breaker Dialog - Atomic Design
## Implementation Guide for Development Team

**Document Version**: 1.0  
**Target Audience**: Development Lead & Team  
**Feature**: Tie-Breaker Ordering Dialog  
**Priority**: High  
**Estimated Effort**: 3-5 days

---

## Executive Summary

### What We're Building
A dialog component that allows administrators to set tie-breaker ordering for lenders. When multiple lenders offer the same final fee for unsolicited bids, the system uses this order to determine priority.

### Key Components
- **1 Organism**: TieBreakerDialogOrganism (complete dialog with ag-Grid)
- **6-7 Atoms**: Button (or TieBreakerButton), DragHandle, Label, NumberDisplay, IconButton, InstructionText
- **2 Molecules**: DialogHeader, DialogActions
- **1 Cell Renderer**: DragHandleCellRenderer (for ag-Grid)

**Note**: TieBreakerButton can be either:
- Just ButtonAtom used directly (recommended)
- Or TieBreakerButtonAtom if needed for reusability

### Technical Stack
- **Angular**: 11.x
- **ag-Grid**: 24.x (with row dragging)
- **Pattern**: Atomic Design + Migration-Friendly

### Business Value
- Enables priority-based lender selection when fees match
- Improves bid allocation fairness
- Provides administrative control over lender preferences

---

## Quick Reference for Dev Lead

### Component Count
- **Atoms**: 6 components
- **Molecules**: 3 components  
- **Cell Renderers**: 1 component
- **Organisms**: 1 component
- **Total**: 11 components

### File Structure
```
features/lender-management/
├── molecules/
│   └── tie-breaker-button/
├── organisms/
│   └── tie-breaker-dialog/
├── cell-renderers/
│   └── drag-handle-cell-renderer/
└── services/
    └── lender.service.ts
```

### Dependencies
- ag-grid-angular: ^24.0.0
- ag-grid-community: ^24.0.0
- GridAdapterService (existing)

### API Endpoints Required
- `GET /api/lenders` - Get all lenders
- `PUT /api/lenders/tie-breaker-order` - Save tie-breaker order

---

---

## Business Context

### Feature Overview
When requesting unsolicited bids for a security, if multiple lenders offer the same final fee, the system needs a way to prioritize which lender gets the bid. The tie-breaker ordering allows administrators to set a preference order for lenders.

### Business Flow
1. **User Action**: Administrator clicks "Set tie-breaker ordering" button on Lender Management screen
2. **Dialog Opens**: Shows all lenders with current tie-breaker order (1, 2, 3...)
3. **User Reorders**: Drags and drops lenders to set preferred order
4. **Save**: Tie-breaker order is persisted to database
5. **Usage**: When unsolicited bids are requested and fees match, system uses tie-breaker order to prioritize lenders

### Feature Requirements
- ✅ Button on Lender Management screen to open dialog
- ✅ Dialog showing all lenders with tie-breaker numbers (1, 2, 3...)
- ✅ Drag-and-drop functionality to reorder lenders
- ✅ Save button to persist tie-breaker order to database
- ✅ Cancel button to close without saving
- ✅ Display current tie-breaker order
- ✅ Handle pagination/scroll (shows "X of Y" lenders)

---

## Atomic Design Breakdown

### Component Hierarchy

```
LenderManagementPage (PAGE)
  └── ButtonAtom (ATOM) - "Set tie-breaker ordering" button
      └── Opens TieBreakerDialogOrganism
      
      OR (if reusable needed):
      
  └── TieBreakerButtonAtom (ATOM) - Wrapper for consistency
      └── ButtonAtom (ATOM) - "Set tie-breaker ordering" button
          └── Opens TieBreakerDialogOrganism

TieBreakerDialogOrganism (ORGANISM)
  ├── DialogHeaderMolecule (MOLECULE)
  │   ├── LabelAtom (ATOM) - "Lender tie-breaker ordering"
  │   └── IconButtonAtom (ATOM) - Close (X) button
  ├── InstructionTextAtom (ATOM)
  │   └── "Drag and drop rows to set the preferred lender when the final fees are equal."
  ├── ag-Grid (Third-party, wrapped via GridAdapterService)
  │   └── Columns:
  │       ├── Drag Handle Column
  │       │   └── DragHandleCellRenderer (uses DragHandleAtom)
  │       ├── Name Column
  │       │   └── Lender name (LabelAtom)
  │       └── Tie Breaker Column
  │           └── Tie-breaker number (NumberDisplayAtom) - 1, 2, 3...
  └── DialogActionsMolecule (MOLECULE)
      ├── ButtonAtom (ATOM) - "Cancel"
      └── ButtonAtom (ATOM) - "Save"
```

### Visual Structure

```
┌─────────────────────────────────────────────────────────┐
│  Lender Management Screen                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │  [Set tie-breaker ordering] ← Button (Molecule)   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                    │
                    │ Click
                    ▼
┌─────────────────────────────────────────────────────────┐
│  Tie-Breaker Dialog (Organism)                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Lender tie-breaker ordering        [X]          │  │ ← Header (Molecule)
│  │  Drag and drop rows to set...                    │  │ ← Instruction (Atom)
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  [≡] BlackRock Advisors (UK) Limited    1  │  │  │
│  │  │  [≡] BNY Mellon                          2  │  │  │
│  │  │  [≡] JPMORGAN CHASE                      3  │  │  │ ← ag-Grid Rows
│  │  │  [≡] Citibank N.A.                       4  │  │  │
│  │  │  ... (scrollable, shows X of Y)          │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                    [Cancel]  [Save]                │  │ ← Actions (Molecule)
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Atoms

### 1. ButtonAtom
**Purpose**: Basic button for actions

**Props**:
- `type`: 'primary' | 'secondary' | 'danger'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `loading`: boolean
- `icon?`: string
- `text`: string

**Usage**:
```html
<app-button 
  type="primary" 
  text="Set Tie-Breaker"
  icon="settings"
  (clicked)="openDialog()">
</app-button>
```

**Location**: `shared/atoms/button/`

> 💻 **Complete example**: See [examples/atomic-design-examples/complete-button-atom-example.ts](./examples/atomic-design-examples/complete-button-atom-example.ts)

---

### 2. DragHandleAtom
**Purpose**: Icon/button for drag operations (used in ag-Grid cell renderer)

**Props**:
- `disabled`: boolean

**Usage**:
```html
<app-drag-handle></app-drag-handle>
```

**Location**: `shared/atoms/drag-handle/`

**Implementation (Placeholder)**:
```typescript
@Component({
  selector: 'app-drag-handle',
  template: `
    <div class="drag-handle" [class.disabled]="disabled">
      <app-icon name="drag-indicator"></app-icon>
    </div>
  `,
  styles: [`
    .drag-handle {
      cursor: move;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
    }
    .drag-handle.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragHandleAtomComponent {
  @Input() disabled: boolean = false;
}
```

---

### 3. LabelAtom
**Purpose**: Text label

**Props**:
- `text`: string
- `size`: 'small' | 'medium' | 'large'
- `bold?`: boolean

**Usage**:
```html
<app-label text="Lender tie-breaker ordering" size="large" [bold]="true"></app-label>
<app-label text="BlackRock Advisors (UK) Limited" size="medium"></app-label>
```

**Location**: `shared/atoms/label/`

---

### 4. NumberDisplayAtom
**Purpose**: Display tie-breaker number

**Props**:
- `value`: number
- `format?`: 'number' | 'ordinal'

**Usage**:
```html
<app-number-display [value]="1" format="number"></app-number-display>
```

**Location**: `shared/atoms/number-display/`

**Implementation (Placeholder)**:
```typescript
@Component({
  selector: 'app-number-display',
  template: `<span class="number-display">{{ displayValue }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberDisplayAtomComponent {
  @Input() value: number = 0;
  @Input() format: 'number' | 'ordinal' = 'number';
  
  get displayValue(): string {
    return this.format === 'ordinal' 
      ? `${this.value}${this.getOrdinalSuffix(this.value)}`
      : this.value.toString();
  }
  
  private getOrdinalSuffix(n: number): string {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  }
}
```

---

### 5. IconButtonAtom
**Purpose**: Icon-only button (for close button)

**Props**:
- `icon`: string
- `disabled`: boolean
- `tooltip?`: string

**Usage**:
```html
<app-icon-button 
  icon="close" 
  tooltip="Close"
  (clicked)="onClose()">
</app-icon-button>
```

**Location**: `shared/atoms/icon-button/`

---

### 6. InstructionTextAtom
**Purpose**: Instruction text

**Props**:
- `text`: string

**Usage**:
```html
<app-instruction-text 
  text="Drag and drop rows to set the preferred lender when the final fees are equal.">
</app-instruction-text>
```

**Location**: `shared/atoms/instruction-text/`

---

## Molecules

### 1. Tie-Breaker Button - Use ButtonAtom Directly

**Why NOT a Molecule:**

In Atomic Design:
- **Molecule** = Combines 2-5 atoms (e.g., SearchForm = InputAtom + ButtonAtom)
- **Atom** = Single, indivisible component (e.g., ButtonAtom)

The Tie-Breaker button is just a **ButtonAtom** with specific props:
- Text: "Set tie-breaker ordering"
- Icon: settings/gear
- Type: secondary
- Size: small

**Since it's only ONE atom (ButtonAtom), it should NOT be a Molecule.**

**Decision**: Use ButtonAtom directly - no need for a wrapper component.

**Recommended Approach**: Use ButtonAtom directly

```html
<!-- In Lender Management Component -->
<app-button
  type="secondary"
  size="small"
  text="Set tie-breaker ordering"
  icon="settings"
  (clicked)="openTieBreakerDialog()">
</app-button>
```

**Why this is better:**
- ✅ Simpler - no extra component
- ✅ Follows Atomic Design - ButtonAtom is already an atom
- ✅ More flexible - easy to change props
- ✅ Less code to maintain

**Only create TieBreakerButtonAtom if:**
- You need this exact button in 3+ places
- You need to add business logic (e.g., permission checks)
- You need to combine with other atoms (then it becomes a Molecule)

---

### 2. DragHandleCellRenderer (ag-Grid Cell Renderer)
**Purpose**: Cell renderer for drag handle column in ag-Grid

**Note**: This is an ag-Grid cell renderer component, not a standalone molecule. It's used within ag-Grid column definitions.

**Implementation (Placeholder)**:
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ICellRendererAngularComp, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-drag-handle-cell-renderer',
  template: `
    <app-drag-handle></app-drag-handle>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragHandleCellRendererComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  
  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
```

**Location**: `features/lender-management/cell-renderers/drag-handle-cell-renderer/`

**Note**: This cell renderer is used in ag-Grid column definitions, not as a standalone component.

---

### 3. DialogHeaderMolecule
**Purpose**: Dialog header with title and close button

**Props**:
- `title`: string

**Events**:
- `close`: EventEmitter<void>

**Composition**:
- LabelAtom (title)
- IconButtonAtom (close)

**Usage**:
```html
<app-dialog-header-molecule
  title="Lender tie-breaker ordering"
  (close)="onClose()">
</app-dialog-header-molecule>
```

**Location**: `shared/molecules/dialog-header/`

**Implementation (Placeholder)**:
```typescript
@Component({
  selector: 'app-dialog-header-molecule',
  template: `
    <div class="dialog-header">
      <app-label [text]="title" size="large" [bold]="true"></app-label>
      <app-icon-button 
        icon="close" 
        tooltip="Close"
        (clicked)="onClose()">
      </app-icon-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogHeaderMoleculeComponent {
  @Input() title: string = '';
  
  @Output() close = new EventEmitter<void>();
  
  onClose() {
    this.close.emit();
  }
}
```

---

### 4. DialogActionsMolecule
**Purpose**: Dialog action buttons (Cancel and Save)

**Props**:
- `loading`: boolean
- `saveLabel`: string
- `cancelLabel`: string

**Events**:
- `save`: EventEmitter<void>
- `cancel`: EventEmitter<void>

**Composition**:
- ButtonAtom × 2

**Usage**:
```html
<app-dialog-actions-molecule
  [loading]="isSaving"
  saveLabel="Save"
  cancelLabel="Cancel"
  (save)="onSave()"
  (cancel)="onCancel()">
</app-dialog-actions-molecule>
```

**Location**: `shared/molecules/dialog-actions/`

**Implementation (Placeholder)**:
```typescript
@Component({
  selector: 'app-dialog-actions-molecule',
  template: `
    <div class="dialog-actions">
      <app-button
        type="secondary"
        [text]="cancelLabel"
        [disabled]="loading"
        (clicked)="onCancel()">
      </app-button>
      <app-button
        type="primary"
        [text]="saveLabel"
        [loading]="loading"
        [disabled]="loading"
        (clicked)="onSave()">
      </app-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogActionsMoleculeComponent {
  @Input() loading: boolean = false;
  @Input() saveLabel: string = 'Save';
  @Input() cancelLabel: string = 'Cancel';
  
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  onSave() {
    this.save.emit();
  }
  
  onCancel() {
    this.cancel.emit();
  }
}
```

---

## Organisms

### TieBreakerDialogOrganism
**Purpose**: Complete tie-breaker dialog with ag-Grid for drag-drop reordering

**Props**:
- `lenders`: Lender[]
- `visible`: boolean
- `loading`: boolean

**Events**:
- `save`: EventEmitter<Lender[]>
- `cancel`: EventEmitter<void>
- `close`: EventEmitter<void>

**Composition**:
- DialogHeaderMolecule
- InstructionTextAtom
- ag-Grid (with row dragging enabled)
- DialogActionsMolecule

**Usage**:
```html
<app-tie-breaker-dialog-organism
  [lenders]="allLenders"
  [visible]="showDialog"
  [loading]="isSaving"
  (save)="onSave($event)"
  (cancel)="onCancel()"
  (close)="onClose()">
</app-tie-breaker-dialog-organism>
```

**Location**: `features/lender-management/organisms/tie-breaker-dialog/`

**Implementation (Placeholder)**:
```typescript
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GridApi, GridReadyEvent, ColDef, RowDragEndEvent } from 'ag-grid-community';
import { GridAdapterService } from '../../../core/services/grid-adapter.service';

interface Lender {
  id: string;
  name: string;
  tieBreakerOrder: number;
}

@Component({
  selector: 'app-tie-breaker-dialog-organism',
  templateUrl: './tie-breaker-dialog.organism.html',
  styleUrls: ['./tie-breaker-dialog.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TieBreakerDialogOrganismComponent implements OnInit {
  @Input() lenders: Lender[] = [];
  @Input() visible: boolean = false;
  @Input() loading: boolean = false;
  
  @Output() save = new EventEmitter<Lender[]>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  
  private gridApi?: GridApi;
  orderedLenders: Lender[] = [];
  
  // Column definitions for ag-Grid
  columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'dragHandle',
      width: 50,
      cellRenderer: DragHandleCellRendererComponent,  // Custom cell renderer for drag handle
      suppressMovable: true,
      lockPosition: true,
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      pinned: 'left'  // Pin drag handle column to left
    },
    {
      headerName: 'Lender Name',
      field: 'name',
      flex: 1,
      sortable: false,
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      headerName: 'Tie Breaker',
      field: 'tieBreakerOrder',
      width: 120,
      sortable: false,
      // Display tie-breaker number (1, 2, 3...) - update after drag
      cellRenderer: (params: any) => {
        return params.value || params.node.rowIndex + 1;
      },
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    }
  ];
  
  gridOptions = {
    rowData: this.orderedLenders,
    columnDefs: this.columnDefs,
    rowDragManaged: true,  // Enable ag-Grid row dragging
    animateRows: true,     // Smooth animation when rows move
    suppressRowClickSelection: true,
    suppressCellFocus: true,
    onRowDragEnd: (event: RowDragEndEvent) => this.onRowDragEnd(event)
  };
  
  constructor(private gridAdapter: GridAdapterService) {}
  
  ngOnInit() {
    // Initialize with current lenders, sorted by tie-breaker order
    // If no tie-breaker order exists, assign default 1, 2, 3...
    this.orderedLenders = [...this.lenders]
      .sort((a, b) => (a.tieBreakerOrder || 0) - (b.tieBreakerOrder || 0))
      .map((lender, index) => ({
        ...lender,
        tieBreakerOrder: lender.tieBreakerOrder || index + 1
      }));
    
    // Update grid options with ordered lenders
    this.gridOptions.rowData = this.orderedLenders;
  }
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    
    // Apply default grid options via adapter (migration-friendly)
    const defaultOptions = this.gridAdapter.getDefaultGridOptions();
    params.api.updateGridOptions(defaultOptions);
    
    // Set row data
    params.api.setRowData(this.orderedLenders);
  }
  
  onRowDragEnd(event: RowDragEndEvent) {
    if (!event.over || !this.gridApi) {
      return;
    }
    
    // Get all row data in current order
    const allRowData: Lender[] = [];
    this.gridApi.forEachNode(node => {
      if (node.data) {
        allRowData.push(node.data);
      }
    });
    
    // Update tie-breaker order based on new position (1, 2, 3...)
    allRowData.forEach((lender, index) => {
      lender.tieBreakerOrder = index + 1;
    });
    
    // Update tie-breaker column display
    this.gridApi.refreshCells({ columns: ['tieBreakerOrder'] });
    
    this.orderedLenders = allRowData;
  }
  
  onSave() {
    // Emit ordered lenders with updated tie-breaker order
    this.save.emit(this.orderedLenders);
  }
  
  onCancel() {
    // Reset to original order
    this.orderedLenders = [...this.lenders]
      .sort((a, b) => (a.tieBreakerOrder || 0) - (b.tieBreakerOrder || 0))
      .map((lender, index) => ({
        ...lender,
        tieBreakerOrder: lender.tieBreakerOrder || index + 1
      }));
    
    // Reset grid data
    if (this.gridApi) {
      this.gridApi.setRowData(this.orderedLenders);
    }
    
    this.cancel.emit();
  }
  
  onClose() {
    this.close.emit();
  }
}
```

**Template (tie-breaker-dialog.organism.html)**:
```html
<div class="tie-breaker-dialog-overlay" *ngIf="visible" (click)="onClose()">
  <div class="tie-breaker-dialog" (click)="$event.stopPropagation()">
    
    <!-- Dialog Header -->
    <app-dialog-header-molecule
      title="Lender tie-breaker ordering"
      (close)="onClose()">
    </app-dialog-header-molecule>
    
    <!-- Instruction Text -->
    <app-instruction-text 
      text="Drag and drop rows to set the preferred lender when the final fees are equal.">
    </app-instruction-text>
    
    <!-- ag-Grid with Row Dragging -->
    <ag-grid-angular
      class="ag-theme-alpine tie-breaker-grid"
      [rowData]="orderedLenders"
      [columnDefs]="columnDefs"
      [gridOptions]="gridOptions"
      (gridReady)="onGridReady($event)"
      style="height: 400px; width: 100%;">
    </ag-grid-angular>
    
    <!-- Dialog Actions -->
    <app-dialog-actions-molecule
      [loading]="loading"
      saveLabel="Save"
      cancelLabel="Cancel"
      (save)="onSave()"
      (cancel)="onCancel()">
    </app-dialog-actions-molecule>
    
  </div>
</div>
```

---

## Business Logic Flow

### Complete User Journey

```
1. User on Lender Management Screen
   ↓
2. Clicks "Set tie-breaker ordering" button
   ↓
3. Dialog opens with all lenders
   - Shows current tie-breaker order (1, 2, 3...)
   - If no order exists, assigns default 1, 2, 3...
   ↓
4. User drags and drops lenders to reorder
   - ag-Grid handles drag-drop
   - Tie-breaker numbers update automatically (1, 2, 3...)
   ↓
5. User clicks "Save"
   - Validates order
   - Calls API to persist tie-breaker order
   - Shows success message
   - Closes dialog
   ↓
6. When unsolicited bids requested:
   - System checks for fee matches
   - If fees match, uses tie-breaker order to prioritize
   - Lender with lower tie-breaker number gets priority
```

### Integration with Unsolicited Bids

```typescript
// In AvailabilityService or BidService
getUnsolicitedBids(security: Security): Observable<Bid[]> {
  return this.http.get<Bid[]>(`/api/bids/unsolicited/${security.id}`)
    .pipe(
      map(bids => {
        // Group bids by final fee
        const bidsByFee = this.groupByFee(bids);
        
        // For each fee group, if multiple lenders have same fee
        return bidsByFee.map(feeGroup => {
          if (feeGroup.bids.length > 1) {
            // Use tie-breaker order to prioritize
            return this.applyTieBreakerOrder(feeGroup.bids);
          }
          return feeGroup.bids;
        }).flat();
      })
    );
}

private applyTieBreakerOrder(bids: Bid[]): Bid[] {
  // Get tie-breaker order from LenderService
  const tieBreakerOrder = this.lenderService.getTieBreakerOrder();
  
  // Sort bids by tie-breaker order (lower number = higher priority)
  return bids.sort((a, b) => {
    const orderA = tieBreakerOrder.find(l => l.id === a.lenderId)?.tieBreakerOrder || 999;
    const orderB = tieBreakerOrder.find(l => l.id === b.lenderId)?.tieBreakerOrder || 999;
    return orderA - orderB;
  });
}
```

---

## Usage in Parent Component

### Example: Integration in Lender Management Screen

```typescript
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LenderService } from '../services/lender.service';

interface Lender {
  id: string;
  name: string;
  tieBreakerOrder: number;
}

@Component({
  selector: 'app-lender-management',
  template: `
    <!-- Lender Management Content -->
    <div class="lender-management-content">
      <!-- Other lender management UI -->
      
    <!-- Button to open tie-breaker dialog -->
    <!-- Option 1: Use ButtonAtom directly (Recommended) -->
    <app-button
      type="secondary"
      size="small"
      text="Set tie-breaker ordering"
      icon="settings"
      (clicked)="openTieBreakerDialog()">
    </app-button>
    
    <!-- Option 2: Use TieBreakerButtonAtom if created for reusability -->
    <!-- <app-tie-breaker-button-atom (clicked)="openTieBreakerDialog()"></app-tie-breaker-button-atom> -->
    </div>
    
    <!-- Tie-Breaker Dialog -->
    <app-tie-breaker-dialog-organism
      [lenders]="allLenders"
      [visible]="showTieBreakerDialog"
      [loading]="isSaving"
      (save)="onSaveTieBreaker($event)"
      (cancel)="onCancelTieBreaker()"
      (close)="onCloseTieBreaker()">
    </app-tie-breaker-dialog-organism>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LenderManagementComponent implements OnInit {
  allLenders: Lender[] = [];
  showTieBreakerDialog: boolean = false;
  isSaving: boolean = false;
  
  constructor(private lenderService: LenderService) {}
  
  ngOnInit() {
    this.loadLenders();
  }
  
  loadLenders() {
    this.lenderService.getLenders().subscribe(lenders => {
      this.allLenders = lenders;
    });
  }
  
  openTieBreakerDialog() {
    this.showTieBreakerDialog = true;
  }
  
  onSaveTieBreaker(orderedLenders: Lender[]) {
    this.isSaving = true;
    
    // Persist tie-breaker order to database
    this.lenderService.updateTieBreakerOrder(orderedLenders).subscribe({
      next: () => {
        this.isSaving = false;
        this.showTieBreakerDialog = false;
        // Refresh lenders to show updated order
        this.loadLenders();
        // Show success notification
        this.showSuccessMessage('Tie-breaker order saved successfully');
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error saving tie-breaker order:', error);
        this.showErrorMessage('Failed to save tie-breaker order');
      }
    });
  }
  
  onCancelTieBreaker() {
    this.showTieBreakerDialog = false;
  }
  
  onCloseTieBreaker() {
    this.showTieBreakerDialog = false;
  }
  
  private showSuccessMessage(message: string) {
    // Show success notification
  }
  
  private showErrorMessage(message: string) {
    // Show error notification
  }
}
```

---

## Services

### LenderService
**Location**: `features/lender-management/services/lender.service.ts`

**Purpose**: Manages lender data and tie-breaker order operations

**Methods**:
```typescript
@Injectable({ providedIn: 'root' })
export class LenderService {
  private tieBreakerOrderCache: Lender[] = [];
  
  constructor(private http: HttpClient) {}
  
  /**
   * Get all lenders
   * Used to populate the dialog with lender list
   */
  getLenders(): Observable<Lender[]> {
    return this.http.get<Lender[]>('/api/lenders').pipe(
      tap(lenders => {
        // Cache lenders for quick access
        this.tieBreakerOrderCache = lenders;
      })
    );
  }
  
  /**
   * Update tie-breaker order for lenders
   * Persists the order to database
   * 
   * @param lenders - Array of lenders with updated tieBreakerOrder
   * @returns Observable<void>
   */
  updateTieBreakerOrder(lenders: Lender[]): Observable<void> {
    // Only send id and tieBreakerOrder to minimize payload
    const payload = lenders.map(lender => ({
      id: lender.id,
      tieBreakerOrder: lender.tieBreakerOrder
    }));
    
    return this.http.put<void>('/api/lenders/tie-breaker-order', payload).pipe(
      tap(() => {
        // Update cache after successful save
        this.tieBreakerOrderCache = lenders;
      })
    );
  }
  
  /**
   * Get current tie-breaker order
   * Used when processing unsolicited bids
   * 
   * @returns Array of lenders sorted by tie-breaker order
   */
  getTieBreakerOrder(): Lender[] {
    return [...this.tieBreakerOrderCache]
      .sort((a, b) => (a.tieBreakerOrder || 999) - (b.tieBreakerOrder || 999));
  }
  
  /**
   * Get lender by ID with tie-breaker order
   * Used to determine priority when fees match
   */
  getLenderTieBreakerOrder(lenderId: string): number {
    const lender = this.tieBreakerOrderCache.find(l => l.id === lenderId);
    return lender?.tieBreakerOrder || 999; // Default to low priority if not found
  }
}
```

### API Endpoints

**Get All Lenders**:
```
GET /api/lenders
Response: Lender[]
```

**Update Tie-Breaker Order**:
```
PUT /api/lenders/tie-breaker-order
Request Body: { id: string, tieBreakerOrder: number }[]
Response: void
```

---

## Data Models

### Lender Interface
```typescript
/**
 * Lender entity with tie-breaker ordering support
 */
export interface Lender {
  id: string;
  name: string;
  tieBreakerOrder: number; // 1, 2, 3, ... (lower number = higher priority)
  // ... other lender properties (balance, collateral types, etc.)
}

/**
 * Payload for updating tie-breaker order
 * Only sends minimal data needed for persistence
 */
export interface TieBreakerOrderUpdate {
  id: string;
  tieBreakerOrder: number;
}
```

### Business Rules

1. **Tie-Breaker Order**:
   - Lower number = Higher priority
   - Example: Lender with tie-breaker 1 gets priority over lender with tie-breaker 2
   - Default order: 1, 2, 3... if not set

2. **When Fees Match**:
   - System checks tie-breaker order
   - Lender with lower tie-breaker number wins
   - If tie-breaker order not set, uses default order

3. **Persistence**:
   - Only tie-breaker order is saved, not entire lender object
   - Order is persisted immediately on Save
   - Cancel discards changes and resets to original order

---

## Implementation Checklist

### Phase 1: Atoms (Basic Building Blocks)
- [ ] **ButtonAtom** - Basic button component
  - [ ] Props: type, size, disabled, loading, icon, text
  - [ ] Event: clicked
  - [ ] Location: `shared/atoms/button/`
  - [ ] **Note**: Use this directly for "Set tie-breaker ordering" button
  - [ ] **OR** Create TieBreakerButtonAtom if needed for reusability
  
- [ ] **DragHandleAtom** - Drag handle icon
  - [ ] Props: disabled
  - [ ] Location: `shared/atoms/drag-handle/`
  
- [ ] **LabelAtom** - Text label component
  - [ ] Props: text, size, bold
  - [ ] Location: `shared/atoms/label/`
  
- [ ] **NumberDisplayAtom** - Number display component
  - [ ] Props: value, format
  - [ ] Location: `shared/atoms/number-display/`
  
- [ ] **IconButtonAtom** - Icon-only button
  - [ ] Props: icon, disabled, tooltip
  - [ ] Location: `shared/atoms/icon-button/`
  
- [ ] **InstructionTextAtom** - Instruction text
  - [ ] Props: text
  - [ ] Location: `shared/atoms/instruction-text/`

---

### Phase 2: Molecules (Simple Combinations)
- [ ] **DialogHeaderMolecule** - Dialog header
  - [ ] Uses: LabelAtom, IconButtonAtom
  - [ ] Props: title
  - [ ] Event: close
  - [ ] Location: `shared/molecules/dialog-header/`
  
- [ ] **DialogActionsMolecule** - Dialog action buttons
  - [ ] Uses: ButtonAtom × 2
  - [ ] Props: loading, saveLabel, cancelLabel
  - [ ] Events: save, cancel
  - [ ] Location: `shared/molecules/dialog-actions/`

---

### Phase 3: Cell Renderers (for ag-Grid)
- [ ] **DragHandleCellRenderer** - ag-Grid cell renderer for drag handle
  - [ ] Uses: DragHandleAtom
  - [ ] Implements: ICellRendererAngularComp
  - [ ] Location: `features/lender-management/cell-renderers/drag-handle-cell-renderer/`

---

### Phase 4: Organisms (Complex Components)
- [ ] **TieBreakerDialogOrganism** - Complete dialog with ag-Grid
  - [ ] Uses: DialogHeaderMolecule, InstructionTextAtom, ag-Grid, DialogActionsMolecule
  - [ ] Props: lenders, visible, loading
  - [ ] Events: save, cancel, close
  - [ ] Features:
    - [ ] ag-Grid with row dragging enabled
    - [ ] Column definitions (drag handle, lender name, tie-breaker)
    - [ ] Row drag end handler
    - [ ] Default tie-breaker order (1, 2, 3...)
    - [ ] Save/Cancel functionality
  - [ ] Location: `features/lender-management/organisms/tie-breaker-dialog/`

---

### Phase 5: Services & Data
- [ ] **LenderService** - Service for lender operations
  - [ ] Method: `getLenders(): Observable<Lender[]>`
  - [ ] Method: `updateTieBreakerOrder(lenders: Lender[]): Observable<void>`
  - [ ] Uses: `providedIn: 'root'`
  - [ ] Location: `features/lender-management/services/lender.service.ts`
  
- [ ] **Lender Interface** - Data model
  - [ ] Properties: id, name, tieBreakerOrder
  - [ ] Location: `features/lender-management/models/lender.model.ts`

---

### Phase 6: Integration
- [ ] **Parent Component Integration**
  - [ ] Add ButtonAtom (or TieBreakerButtonAtom) to parent component
  - [ ] Add TieBreakerDialogOrganism to parent component
  - [ ] Implement open/close dialog logic
  - [ ] Implement save handler (calls LenderService)
  - [ ] Implement cancel handler
  - [ ] Handle loading states
  
- [ ] **Module Setup**
  - [ ] Import AgGridModule
  - [ ] Declare all components
  - [ ] Export TieBreakerDialogOrganism if needed

---

### Phase 7: Testing
- [ ] **Unit Tests**
  - [ ] Atoms: ButtonAtom, DragHandleAtom, LabelAtom, NumberDisplayAtom, IconButtonAtom, InstructionTextAtom
  - [ ] Molecules: TieBreakerButtonMolecule, DialogHeaderMolecule, DialogActionsMolecule
  - [ ] Cell Renderer: DragHandleCellRenderer
  - [ ] Organism: TieBreakerDialogOrganism
  - [ ] Service: LenderService
  
- [ ] **Integration Tests**
  - [ ] Dialog open/close flow
  - [ ] Row drag and reorder
  - [ ] Save tie-breaker order
  - [ ] Cancel resets order
  - [ ] API integration

---

### Phase 8: Polish & Documentation
- [ ] **Styling**
  - [ ] Dialog overlay and modal styling
  - [ ] ag-Grid theme customization
  - [ ] Drag handle styling
  - [ ] Responsive design
  
- [ ] **Documentation**
  - [ ] Component JSDoc comments
  - [ ] Usage examples
  - [ ] API documentation
  
- [ ] **Error Handling**
  - [ ] API error handling
  - [ ] Loading states
  - [ ] User feedback (success/error messages)

---

## Dependencies

### Required Packages
```json
{
  "dependencies": {
    "ag-grid-angular": "^24.0.0",
    "ag-grid-community": "^24.0.0"
  }
}
```

### Module Imports
```typescript
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  imports: [
    AgGridModule,
    // ... other imports
  ],
  declarations: [
    TieBreakerDialogOrganismComponent,
    DragHandleCellRendererComponent,
    // ... other components
  ]
})
export class LenderManagementModule {}
```

---

## Migration-Friendly Considerations

All components follow migration-friendly patterns:

✅ **OnPush Change Detection** - All components  
✅ **Constructor Injection** - All services  
✅ **Observable Management** - Use async pipe or takeUntil  
✅ **Type Safety** - TypeScript interfaces throughout  
✅ **Feature-Based Organization** - All in `features/lender-management/`  

---

## Technical Specifications

### ag-Grid Configuration

**Row Dragging Setup**:
```typescript
gridOptions = {
  rowDragManaged: true,      // Enable row dragging
  animateRows: true,         // Smooth animation
  suppressRowClickSelection: true,
  onRowDragEnd: (event) => this.onRowDragEnd(event)
};
```

**Column Definitions**:
- **Drag Handle Column**: 50px width, pinned left, custom cell renderer
- **Name Column**: Flex 1, shows lender name
- **Tie Breaker Column**: 120px width, shows order number (1, 2, 3...)

### Key Implementation Points

1. **Default Tie-Breaker Order**: 
   - If lenders don't have a tie-breaker order, assign 1, 2, 3... based on current order
   - Sort by existing `tieBreakerOrder` if present, otherwise use array index

2. **ag-Grid Row Dragging**: 
   - Use ag-Grid's built-in `rowDragManaged: true` for drag-and-drop
   - Handle `onRowDragEnd` event to update order

3. **Update Order**: 
   - After row drag, update `tieBreakerOrder` to match new position (1, 2, 3...)
   - Refresh grid cells to show updated numbers

4. **Grid Adapter**: 
   - Use GridAdapterService for migration-friendly ag-Grid operations
   - Abstract version-specific APIs

5. **Persistence**: 
   - Save only the tie-breaker order (id + tieBreakerOrder), not entire lender objects
   - Minimize payload size

6. **Cancel Behavior**: 
   - Reset to original order when canceling
   - Don't persist changes

7. **Cell Renderer**: 
   - Use custom cell renderer for drag handle column
   - Implements `ICellRendererAngularComp`

8. **Pagination/Scroll**:
   - ag-Grid handles scrolling automatically
   - Show "X of Y" indicator if needed (can use ag-Grid's status bar)

### Error Handling

- **API Errors**: Show error message, keep dialog open
- **Validation**: Ensure all lenders have tie-breaker order before save
- **Loading States**: Disable buttons during save operation
- **Network Issues**: Retry logic or show appropriate error

---

## Implementation Order

Follow this order for smooth implementation:

1. **Phase 1: Atoms** → Create all basic building blocks first
2. **Phase 2: Molecules** → Combine atoms into functional units
3. **Phase 3: Cell Renderers** → Create ag-Grid cell renderer
4. **Phase 4: Organisms** → Build the complete dialog
5. **Phase 5: Services** → Implement data layer
6. **Phase 6: Integration** → Wire everything together
7. **Phase 7: Testing** → Ensure quality
8. **Phase 8: Polish** → Final touches

---

## Quick Start

**For immediate implementation:**

1. Check if atoms exist in `shared/atoms/` - reuse if available
2. Create missing atoms (DragHandleAtom, NumberDisplayAtom, etc.)
3. Build TieBreakerButtonMolecule
4. Create TieBreakerDialogOrganism with ag-Grid
5. Implement LenderService.updateTieBreakerOrder()
6. Integrate in parent component

---

**Remember**: Start with atoms, build up to molecules, then the organism. Use placeholder code snippets as starting points!

