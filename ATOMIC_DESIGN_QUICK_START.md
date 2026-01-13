# Atomic Design Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Understand the Hierarchy

```
Page (Real content)
  ↓
Template (Layout)
  ↓
Organism (Complex component)
  ↓
Molecule (Simple group)
  ↓
Atom (Basic block)
```

### Step 2: Create Your First Atom

**Example: Button Atom**

```typescript
// shared/atoms/button/button.atom.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * ButtonAtomComponent - A basic button building block
 * 
 * This is an ATOM because:
 * - It's a single, indivisible UI element
 * - It has no dependencies on other custom components
 * - It can be used anywhere in the application
 * 
 * Usage:
 * <app-button type="primary" (clicked)="handleClick()">Click Me</app-button>
 */
@Component({
  selector: 'app-button',
  templateUrl: './button.atom.html',
  styleUrls: ['./button.atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonAtomComponent {
  /**
   * Button style type
   * - primary: Main action (blue)
   * - secondary: Secondary action (gray)
   */
  @Input() type: 'primary' | 'secondary' = 'primary';
  
  /**
   * Button size
   * - small: Compact button
   * - medium: Standard button (default)
   * - large: Prominent button
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  
  /**
   * Whether the button is disabled
   */
  @Input() disabled: boolean = false;
  
  /**
   * Event emitted when button is clicked
   */
  @Output() clicked = new EventEmitter<void>();
  
  /**
   * Handles button click
   */
  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
```

**Template (button.atom.html):**
```html
<button
  [class]="'btn btn-' + type + ' btn-' + size"
  [disabled]="disabled"
  (click)="onClick()"
  type="button">
  <ng-content></ng-content>
</button>
```

**Usage Examples:**
```html
<!-- Basic button -->
<app-button (clicked)="handleClick()">Click Me</app-button>

<!-- Primary button with icon -->
<app-button type="primary" (clicked)="save()">Save</app-button>

<!-- Disabled button -->
<app-button [disabled]="true">Cannot Click</app-button>
```

### Step 3: Create Your First Molecule

**Example: Search Form Molecule**

```typescript
// shared/molecules/search-form/search-form.molecule.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * SearchFormMoleculeComponent - Combines Input and Button atoms
 * 
 * This is a MOLECULE because:
 * - It combines InputAtomComponent and ButtonAtomComponent
 * - It has a single purpose: provide search functionality
 * - It's reusable across different features
 * 
 * Composition:
 * - InputAtomComponent (for search input)
 * - ButtonAtomComponent (for search action)
 * 
 * Usage:
 * <app-search-form-molecule
 *   (search)="onSearch($event)"
 *   (clear)="onClear()">
 * </app-search-form-molecule>
 */
@Component({
  selector: 'app-search-form-molecule',
  templateUrl: './search-form.molecule.html',
  styleUrls: ['./search-form.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormMoleculeComponent {
  /**
   * Placeholder text for the search input
   */
  @Input() placeholder: string = 'Search...';
  
  /**
   * Text for the search button
   */
  @Input() buttonText: string = 'Search';
  
  /**
   * Emitted when user searches
   */
  @Output() search = new EventEmitter<string>();
  
  /**
   * Emitted when user clears search
   */
  @Output() clear = new EventEmitter<void>();
  
  /**
   * Reactive form for search input
   */
  searchForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }
  
  /**
   * Handles form submission
   */
  onSubmit(): void {
    const query = this.searchForm.get('query')?.value?.trim();
    if (query) {
      this.search.emit(query);
    }
  }
  
  /**
   * Handles clear action
   */
  onClear(): void {
    this.searchForm.reset();
    this.clear.emit();
  }
}
```

**Template (search-form.molecule.html):**
```html
<form [formGroup]="searchForm" (ngSubmit)="onSubmit()" class="search-form">
  <!-- Input Atom: The search input field -->
  <app-input
    formControlName="query"
    [placeholder]="placeholder"
    class="search-input">
  </app-input>
  
  <!-- Button Atom: Search button -->
  <app-button
    type="primary"
    (clicked)="onSubmit()">
    {{ buttonText }}
  </app-button>
  
  <!-- Button Atom: Clear button (shown when there's a value) -->
  <app-button
    *ngIf="searchForm.get('query')?.value"
    type="secondary"
    size="small"
    (clicked)="onClear()">
    Clear
  </app-button>
</form>
```

**Usage Examples:**
```html
<!-- Basic search form -->
<app-search-form-molecule
  (search)="onSearch($event)"
  (clear)="onClear()">
</app-search-form-molecule>

<!-- With custom placeholder -->
<app-search-form-molecule
  placeholder="Search users..."
  buttonText="Find"
  (search)="searchUsers($event)">
</app-search-form-molecule>
```

### Step 4: Create Your First Organism

**Example: Data Table Organism**

```typescript
// shared/organisms/data-table/data-table.organism.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { GridAdapterService } from '../../../core/services/grid-adapter.service';

/**
 * DataTableOrganismComponent - Complex table component
 * 
 * This is an ORGANISM because:
 * - It combines SearchFormMolecule, FilterGroupMolecule, and ag-Grid
 * - It contains business logic (search, filter, selection)
 * - It interacts with services (GridAdapterService)
 * - It manages complex state
 * 
 * Composition:
 * - SearchFormMoleculeComponent (for searching)
 * - FilterGroupMoleculeComponent (for filtering)
 * - ag-Grid (third-party, wrapped via adapter)
 * 
 * Usage:
 * <app-data-table-organism
 *   [data]="data$ | async"
 *   [config]="{ columns: columnDefs }"
 *   (rowSelected)="onRowSelected($event)">
 * </app-data-table-organism>
 */
@Component({
  selector: 'app-data-table-organism',
  templateUrl: './data-table.organism.html',
  styleUrls: ['./data-table.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableOrganismComponent implements OnInit, OnDestroy {
  /**
   * Table data to display
   */
  @Input() data: any[] = [];
  
  /**
   * Table configuration (columns, features)
   */
  @Input() config: { columns: ColDef[]; enableSearch?: boolean } = { columns: [] };
  
  /**
   * Loading state
   */
  @Input() loading: boolean = false;
  
  /**
   * Emitted when rows are selected
   */
  @Output() rowSelected = new EventEmitter<any[]>();
  
  /**
   * Emitted when search query changes
   */
  @Output() searchChanged = new EventEmitter<string>();
  
  private gridApi?: GridApi;
  private destroy$ = new Subject<void>();
  searchForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private gridAdapter: GridAdapterService // Adapter service (migration-friendly)
  ) {
    this.searchForm = this.fb.group({ query: [''] });
  }
  
  ngOnInit(): void {
    // Subscribe to search form changes
    this.searchForm.get('query')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.searchChanged.emit(query);
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    // Apply default options via adapter (migration-friendly)
    const options = this.gridAdapter.getDefaultGridOptions();
    params.api.updateGridOptions(options);
  }
  
  onSelectionChanged(event: any): void {
    const selection = this.gridAdapter.getSelection(event.api);
    this.rowSelected.emit(selection.selectedRows);
  }
}
```

**Template (data-table.organism.html):**
```html
<div class="data-table-organism">
  <!-- Search Form Molecule: For searching -->
  <app-search-form-molecule
    *ngIf="config.enableSearch"
    [formControl]="searchForm.get('query')"
    (search)="searchChanged.emit($event)"
    class="table-search">
  </app-search-form-molecule>
  
  <!-- ag-Grid: For displaying data -->
  <ag-grid-angular
    class="ag-theme-alpine"
    [rowData]="data"
    [columnDefs]="config.columns"
    (gridReady)="onGridReady($event)"
    (selectionChanged)="onSelectionChanged($event)"
    style="height: 500px; width: 100%;">
  </ag-grid-angular>
</div>
```

**Usage Examples:**
```html
<!-- Basic data table -->
<app-data-table-organism
  [data]="data$ | async"
  [config]="{ columns: columnDefs }"
  (rowSelected)="onRowSelected($event)">
</app-data-table-organism>

<!-- With search enabled -->
<app-data-table-organism
  [data]="data"
  [config]="{
    columns: columnDefs,
    enableSearch: true
  }"
  [loading]="isLoading"
  (searchChanged)="onSearch($event)">
</app-data-table-organism>
```

### Step 5: Create Your First Page

```typescript
// features/data-grid/pages/data-grid-page.component.ts
@Component({
  selector: 'app-data-grid-page',
  templateUrl: './data-grid-page.component.html'
})
export class DataGridPageComponent {
  data$ = this.dataService.getData();
  
  // Uses app-dashboard-template and app-data-table-organism
}
```

---

## 📁 Folder Structure Quick Reference

```
src/app/
├── shared/
│   ├── atoms/              # Basic building blocks
│   │   ├── button/
│   │   ├── input/
│   │   └── label/
│   ├── molecules/          # Simple combinations
│   │   ├── search-form/
│   │   └── card-header/
│   ├── organisms/          # Complex components
│   │   ├── data-table/
│   │   └── header/
│   └── templates/          # Page layouts
│       └── dashboard/
└── features/
    └── data-grid/
        ├── pages/          # Specific pages
        └── organisms/      # Feature-specific organisms
```

---

## 🎯 Decision Tree: Which Level?

### Is it a basic UI element? → **Atom**
- Button, Input, Label, Icon, Badge

### Does it combine 2-5 atoms? → **Molecule**
- Search form (input + button)
- Card header (label + icon + button)
- Filter group (label + select)

### Is it a complex, feature-specific component? → **Organism**
- Data table (search + filters + grid)
- Header (logo + nav + user menu)
- Streaming grid (status + grid + controls)

### Does it define page layout? → **Template**
- Dashboard layout
- Detail page layout
- List page layout

### Is it a specific page with real data? → **Page**
- Data grid page
- User detail page
- Settings page

---

## ✅ Quick Checklist

### For Every Component:

- [ ] Named correctly (`*.atom.ts`, `*.molecule.ts`, etc.)
- [ ] Uses OnPush change detection
- [ ] Has clear inputs/outputs
- [ ] Uses constructor injection
- [ ] Properly unsubscribes observables
- [ ] Documented with comments

### For Atoms:

- [ ] Single responsibility
- [ ] Highly reusable
- [ ] No business logic
- [ ] Form-control compatible (if needed)

### For Molecules:

- [ ] Combines 2-5 atoms
- [ ] Single clear purpose
- [ ] Uses reactive forms (if form)
- [ ] Emits events for interactions

### For Organisms:

- [ ] Combines molecules/atoms
- [ ] May contain business logic
- [ ] Interacts with services
- [ ] Uses adapter services (for ag-grid, etc.)

---

## 🔗 Integration with Migration Guidelines

All Atomic Design components follow migration-friendly patterns:

✅ **OnPush** change detection  
✅ **Constructor injection**  
✅ **Observable management** (async pipe, takeUntil)  
✅ **Adapter services** for third-party libraries  
✅ **Feature-based organization**

---

## 📚 Next Steps

1. **Read**: `ATOMIC_DESIGN_GUIDELINES.md` for complete details
2. **Review**: `examples/atomic-design-examples/` for code samples
3. **Start**: Create your first atom
4. **Build**: Progressively build molecules → organisms → pages

---

## 💡 Pro Tips

1. **Start Small**: Begin with atoms, build up gradually
2. **Reuse**: Don't duplicate - reuse existing atoms/molecules
3. **Document**: Comment your components with examples
4. **Test**: Test atoms in isolation, molecules with mocked atoms
5. **Consistency**: Follow naming conventions strictly

---

## 🆘 Common Questions

**Q: Can an organism use another organism?**  
A: Generally no. Organisms should use molecules and atoms. If you need to reuse an organism, consider if it should be a template instead.

**Q: Where do services go?**  
A: Services go in `core/services/` or `features/[feature]/services/`. Components use them via constructor injection.

**Q: Can I skip molecules?**  
A: Technically yes, but it's better to have molecules for reusability. If you're combining atoms, create a molecule.

**Q: How do I handle state?**  
A: Simple state in components, complex state in services. Use RxJS observables for reactive state.

---

**Remember**: Atomic Design is about building a design system. Start with atoms and build up!

