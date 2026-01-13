# Atomic Design Guidelines for Angular
## Complete Guide for Team Implementation

This document provides comprehensive guidelines for implementing Atomic Design principles in Angular 11 projects, integrated with migration-friendly practices.

---

## Table of Contents

1. [What is Atomic Design?](#what-is-atomic-design)
2. [Atomic Design Hierarchy](#atomic-design-hierarchy)
3. [Folder Structure](#folder-structure)
4. [Naming Conventions](#naming-conventions)
5. [Atoms - Implementation Guide](#atoms)
6. [Molecules - Implementation Guide](#molecules)
7. [Organisms - Implementation Guide](#organisms)
8. [Templates - Implementation Guide](#templates)
9. [Pages - Implementation Guide](#pages)
10. [Integration with Existing Patterns](#integration-with-existing-patterns)
11. [Best Practices](#best-practices)
12. [Migration Considerations](#migration-considerations)

---

## What is Atomic Design?

Atomic Design is a methodology for creating design systems by breaking down interfaces into fundamental building blocks that work together.

### The Five Levels:

1. **Atoms** - Basic building blocks (buttons, inputs, labels)
2. **Molecules** - Simple combinations of atoms (search form, card header)
3. **Organisms** - Complex components (header, data table, sidebar)
4. **Templates** - Page-level layouts without real content
5. **Pages** - Specific instances of templates with real content

### Benefits:

- ✅ **Reusability**: Components can be reused across the application
- ✅ **Consistency**: Design patterns are consistent
- ✅ **Maintainability**: Changes in one place affect all usages
- ✅ **Testability**: Smaller components are easier to test
- ✅ **Scalability**: Easy to add new components following the pattern

### Real-World Example:

Let's say you're building a user management page. Here's how Atomic Design breaks it down:

```
UserManagementPage (PAGE)
  └── DashboardTemplate (TEMPLATE)
      └── UserTableOrganism (ORGANISM)
          ├── SearchFormMolecule (MOLECULE)
          │   ├── InputAtom (ATOM) ← "Search users..."
          │   └── ButtonAtom (ATOM) ← "Search"
          ├── FilterGroupMolecule (MOLECULE)
          │   ├── LabelAtom (ATOM) ← "Filter by:"
          │   └── SelectAtom (ATOM) ← Dropdown
          └── ag-Grid (Third-party, wrapped)
              └── Row with: IconAtom + LabelAtom + ButtonAtom
```

**Why this structure?**
- **Atoms** (Button, Input) can be reused in many places
- **Molecules** (SearchForm) combine atoms for a specific purpose
- **Organisms** (UserTable) combine molecules for complex functionality
- **Templates** (Dashboard) define the page layout
- **Pages** (UserManagementPage) use templates with real data

---

## Atomic Design Hierarchy

```
Pages (Specific instances)
    ↓
Templates (Layout structure)
    ↓
Organisms (Complex components)
    ↓
Molecules (Simple component groups)
    ↓
Atoms (Basic building blocks)
```

---

## Folder Structure

```
src/
├── app/
│   ├── features/                    # Feature modules
│   │   ├── data-grid/
│   │   │   ├── pages/              # Pages (specific instances)
│   │   │   │   └── data-grid-page.component.ts
│   │   │   ├── templates/          # Templates (layouts)
│   │   │   │   └── grid-layout.template.ts
│   │   │   └── organisms/          # Organisms (complex components)
│   │   │       └── streaming-grid.organism.ts
│   │   └── streaming/
│   │       └── organisms/
│   │           └── connection-status.organism.ts
│   │
│   └── shared/                      # Shared components
│       ├── atoms/                   # Atoms (basic building blocks)
│       │   ├── button/
│       │   │   ├── button.atom.ts
│       │   │   ├── button.atom.html
│       │   │   └── button.atom.scss
│       │   ├── input/
│       │   ├── label/
│       │   └── icon/
│       │
│       ├── molecules/               # Molecules (simple groups)
│       │   ├── search-form/
│       │   │   ├── search-form.molecule.ts
│       │   │   ├── search-form.molecule.html
│       │   │   └── search-form.molecule.scss
│       │   ├── card-header/
│       │   └── filter-group/
│       │
│       ├── organisms/               # Organisms (complex components)
│       │   ├── header/
│       │   ├── sidebar/
│       │   └── data-table/
│       │
│       └── templates/               # Templates (page layouts)
│           ├── dashboard.template.ts
│           └── detail.template.ts
```

---

## Naming Conventions

### Component Naming

- **Atoms**: `[name].atom.ts` (e.g., `button.atom.ts`)
- **Molecules**: `[name].molecule.ts` (e.g., `search-form.molecule.ts`)
- **Organisms**: `[name].organism.ts` (e.g., `data-table.organism.ts`)
- **Templates**: `[name].template.ts` (e.g., `dashboard.template.ts`)
- **Pages**: `[name].page.ts` or `[name]-page.component.ts` (e.g., `data-grid-page.component.ts`)

### Selector Naming

- **Atoms**: `app-[name]` (e.g., `app-button`, `app-input`)
- **Molecules**: `app-[name]-molecule` (e.g., `app-search-form-molecule`)
- **Organisms**: `app-[name]-organism` (e.g., `app-data-table-organism`)
- **Templates**: `app-[name]-template` (e.g., `app-dashboard-template`)
- **Pages**: `app-[name]-page` (e.g., `app-data-grid-page`)

### Class Naming

- **Atoms**: `[Name]AtomComponent` (e.g., `ButtonAtomComponent`)
- **Molecules**: `[Name]MoleculeComponent` (e.g., `SearchFormMoleculeComponent`)
- **Organisms**: `[Name]OrganismComponent` (e.g., `DataTableOrganismComponent`)
- **Templates**: `[Name]TemplateComponent` (e.g., `DashboardTemplateComponent`)
- **Pages**: `[Name]PageComponent` (e.g., `DataGridPageComponent`)

---

## Atoms

**Definition**: Basic building blocks that cannot be broken down further.

**Characteristics**:
- Single responsibility
- No business logic
- Highly reusable
- Styling only (no complex state)
- Can have simple props/inputs

### Examples:
- Buttons
- Inputs
- Labels
- Icons
- Badges
- Spinners

### Implementation Example: Button Atom

```typescript
// shared/atoms/button/button.atom.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

export type ButtonType = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  templateUrl: './button.atom.html',
  styleUrls: ['./button.atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonAtomComponent {
  @Input() type: ButtonType = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon?: string;
  @Input() fullWidth: boolean = false;
  
  @Output() clicked = new EventEmitter<void>();
  
  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
  
  get buttonClasses(): string {
    return [
      `btn-${this.type}`,
      `btn-${this.size}`,
      this.fullWidth ? 'btn-full-width' : '',
      this.disabled ? 'btn-disabled' : '',
      this.loading ? 'btn-loading' : ''
    ].filter(Boolean).join(' ');
  }
}
```

```html
<!-- shared/atoms/button/button.atom.html -->
<button
  [class]="buttonClasses"
  [disabled]="disabled || loading"
  (click)="onClick()"
  type="button">
  <span *ngIf="loading" class="spinner"></span>
  <i *ngIf="icon && !loading" [class]="icon"></i>
  <ng-content></ng-content>
</button>
```

```scss
// shared/atoms/button/button.atom.scss
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  
  &.btn-primary {
    background-color: #007bff;
    color: white;
    
    &:hover:not(.btn-disabled) {
      background-color: #0056b3;
    }
  }
  
  &.btn-secondary {
    background-color: #6c757d;
    color: white;
    
    &:hover:not(.btn-disabled) {
      background-color: #545b62;
    }
  }
  
  &.btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  &.btn-medium {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
  
  &.btn-large {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }
  
  &.btn-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &.btn-loading {
    cursor: wait;
  }
  
  &.btn-full-width {
    width: 100%;
  }
}
```

### Implementation Example: Input Atom

```typescript
// shared/atoms/input/input.atom.ts
import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.atom.html',
  styleUrls: ['./input.atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAtomComponent),
      multi: true
    }
  ]
})
export class InputAtomComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() label?: string;
  @Input() error?: string;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  
  value: string = '';
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }
  
  onBlur(): void {
    this.onTouched();
  }
  
  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
```

```html
<!-- shared/atoms/input/input.atom.html -->
<div class="input-wrapper">
  <label *ngIf="label" class="input-label">
    {{ label }}
    <span *ngIf="required" class="required">*</span>
  </label>
  <input
    [type]="type"
    [value]="value"
    [placeholder]="placeholder"
    [disabled]="disabled"
    [readonly]="readonly"
    [class.error]="!!error"
    (input)="onInput($event)"
    (blur)="onBlur()"
    class="input-field" />
  <span *ngIf="error" class="error-message">{{ error }}</span>
</div>
```

### Implementation Example: Label Atom

```typescript
// shared/atoms/label/label.atom.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.atom.html',
  styleUrls: ['./label.atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelAtomComponent {
  @Input() for?: string;
  @Input() required: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
```

```html
<!-- shared/atoms/label/label.atom.html -->
<label [for]="for" [class]="'label-' + size">
  <ng-content></ng-content>
  <span *ngIf="required" class="required">*</span>
</label>
```

### Atom Best Practices

✅ **DO**:
- Keep atoms simple and focused
- Use OnPush change detection
- Make them form-control compatible (ControlValueAccessor)
- Provide clear input/output interfaces
- Use TypeScript types for props

❌ **DON'T**:
- Add business logic
- Make atoms depend on other atoms directly
- Create atoms that are too specific
- Mix styling with complex state

---

## Molecules

**Definition**: Simple combinations of atoms that form a functional unit.

**Characteristics**:
- Combine 2-5 atoms
- Have a single, clear purpose
- May have simple state
- Reusable across different contexts
- Still relatively simple

### Examples:
- Search form (input + button)
- Card header (label + icon + button)
- Filter group (label + input + select)
- Navigation item (icon + label)
- Status badge (icon + label)

### Implementation Example: Search Form Molecule

**What is this?** A search form that combines an Input atom and Button atoms.

**Why is it a Molecule?** It combines 2-5 atoms (Input + Button) to create a functional unit with a single purpose: search functionality.

**Complete Example with Comments:**

```typescript
// shared/molecules/search-form/search-form.molecule.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * SearchFormMoleculeComponent - Combines Input and Button atoms
 * 
 * This component is a MOLECULE because:
 * 1. It combines InputAtomComponent and ButtonAtomComponent
 * 2. It has a single purpose: provide search functionality
 * 3. It manages simple form state
 * 4. It's reusable across different features
 * 
 * COMPOSITION:
 * - InputAtomComponent (for search input)
 * - ButtonAtomComponent (for search and clear actions)
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Basic search form:
 *    <app-search-form-molecule
 *      (search)="onSearch($event)"
 *      (clear)="onClear()">
 *    </app-search-form-molecule>
 * 
 * 2. With custom placeholder:
 *    <app-search-form-molecule
 *      placeholder="Search users..."
 *      buttonText="Find"
 *      (search)="searchUsers($event)">
 *    </app-search-form-molecule>
 * 
 * 3. With initial value (restore saved search):
 *    <app-search-form-molecule
 *      [initialValue]="savedSearchQuery"
 *      (search)="onSearch($event)">
 *    </app-search-form-molecule>
 */
@Component({
  selector: 'app-search-form-molecule',
  templateUrl: './search-form.molecule.html',
  styleUrls: ['./search-form.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormMoleculeComponent implements OnInit, OnDestroy {
  /**
   * Placeholder text for the search input
   * Default: 'Search...'
   */
  @Input() placeholder: string = 'Search...';

  /**
   * Text for the search button
   * Default: 'Search'
   */
  @Input() buttonText: string = 'Search';

  /**
   * Initial search value (useful for restoring saved searches)
   */
  @Input() initialValue: string = '';

  /**
   * Debounce time in milliseconds for value changes
   * Prevents excessive emissions while user is typing
   * Default: 300ms
   */
  @Input() debounceTime: number = 300;

  /**
   * Emitted when user clicks search button or presses Enter
   * Emits the search query string
   */
  @Output() search = new EventEmitter<string>();

  /**
   * Emitted when user clicks clear button
   */
  @Output() clear = new EventEmitter<void>();

  /**
   * Emitted on every value change (debounced)
   * Useful for real-time search as user types
   */
  @Output() valueChange = new EventEmitter<string>();

  /**
   * Reactive form group for the search input
   */
  searchForm: FormGroup;

  /**
   * Subject for managing component lifecycle
   */
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    // Create reactive form with single 'query' control
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  ngOnInit(): void {
    // Set initial value if provided
    if (this.initialValue) {
      this.searchForm.patchValue({ query: this.initialValue });
    }

    // Subscribe to form value changes with debounce
    // This emits valueChange event as user types (after debounce)
    this.searchForm.get('query')?.valueChanges.pipe(
      debounceTime(this.debounceTime),        // Wait for user to stop typing
      distinctUntilChanged(),                  // Only emit if value actually changed
      takeUntil(this.destroy$)                 // Unsubscribe on component destroy
    ).subscribe(query => {
      this.valueChange.emit(query);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles form submission (Enter key or button click)
   * Emits search event with trimmed query
   */
  onSubmit(): void {
    const query = this.searchForm.get('query')?.value?.trim();
    if (query) {
      this.search.emit(query);
    }
  }

  /**
   * Handles clear button click
   * Resets form and emits clear event
   */
  onClear(): void {
    this.searchForm.reset();
    this.clear.emit();
  }

  /**
   * Computed property: Whether form has a value
   * Used to conditionally show clear button
   */
  get hasValue(): boolean {
    return !!this.searchForm.get('query')?.value;
  }
}
```

```html
<!-- shared/molecules/search-form/search-form.molecule.html -->
<form [formGroup]="searchForm" (ngSubmit)="onSubmit()" class="search-form">
  <app-input
    formControlName="query"
    [placeholder]="placeholder"
    class="search-input">
  </app-input>
  <div class="search-actions">
    <app-button
      type="primary"
      (clicked)="onSubmit()">
      {{ buttonText }}
    </app-button>
    <app-button
      *ngIf="searchForm.get('query')?.value"
      type="secondary"
      (clicked)="onClear()">
      Clear
    </app-button>
  </div>
</form>
```

### Implementation Example: Card Header Molecule

```typescript
// shared/molecules/card-header/card-header.molecule.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-card-header-molecule',
  templateUrl: './card-header.molecule.html',
  styleUrls: ['./card-header.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardHeaderMoleculeComponent {
  @Input() title: string = '';
  @Input() icon?: string;
  @Input() showAction: boolean = false;
  @Input() actionText: string = 'Action';
  
  @Output() actionClicked = new EventEmitter<void>();
}
```

```html
<!-- shared/molecules/card-header/card-header.molecule.html -->
<div class="card-header">
  <div class="header-content">
    <i *ngIf="icon" [class]="icon" class="header-icon"></i>
    <app-label size="large">{{ title }}</app-label>
  </div>
  <app-button
    *ngIf="showAction"
    type="secondary"
    size="small"
    (clicked)="actionClicked.emit()">
    {{ actionText }}
  </app-button>
</div>
```

### Implementation Example: Filter Group Molecule

```typescript
// shared/molecules/filter-group/filter-group.molecule.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface FilterOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-filter-group-molecule',
  templateUrl: './filter-group.molecule.html',
  styleUrls: ['./filter-group.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterGroupMoleculeComponent {
  @Input() label: string = '';
  @Input() options: FilterOption[] = [];
  @Input() initialValue?: any;
  
  @Output() filterChange = new EventEmitter<any>();
  
  filterForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      filter: ['']
    });
  }
  
  ngOnChanges(): void {
    if (this.initialValue !== undefined) {
      this.filterForm.patchValue({ filter: this.initialValue });
    }
  }
  
  onFilterChange(): void {
    const value = this.filterForm.get('filter')?.value;
    this.filterChange.emit(value);
  }
}
```

```html
<!-- shared/molecules/filter-group/filter-group.molecule.html -->
<div class="filter-group">
  <app-label [for]="'filter-' + label">{{ label }}</app-label>
  <select
    [id]="'filter-' + label"
    [formControl]="filterForm.get('filter')"
    (change)="onFilterChange()"
    class="filter-select">
    <option value="">All</option>
    <option *ngFor="let option of options" [value]="option.value">
      {{ option.label }}
    </option>
  </select>
</div>
```

### Molecule Best Practices

✅ **DO**:
- Combine atoms logically
- Keep molecules focused on a single purpose
- Use reactive forms for form molecules
- Emit events for user interactions
- Keep state simple

❌ **DON'T**:
- Create molecules that are too complex
- Mix multiple unrelated atoms
- Add business logic (keep it in organisms/pages)
- Create molecules that depend on specific features

---

## Organisms

**Definition**: Complex components that combine molecules and atoms to form distinct sections of an interface.

**Characteristics**:
- Combine multiple molecules and atoms
- May contain business logic
- Often feature-specific
- Can be quite complex
- May interact with services

### Examples:
- Header (logo + navigation + user menu)
- Data table (search + filters + grid + pagination)
- Sidebar (navigation items + filters)
- Streaming grid (connection status + grid + controls)

### Implementation Example: Data Table Organism

```typescript
// shared/organisms/data-table/data-table.organism.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { GridAdapterService } from '../../../core/services/grid-adapter.service';

export interface TableConfig {
  columns: ColDef[];
  enableSearch?: boolean;
  enableFilters?: boolean;
  enablePagination?: boolean;
}

@Component({
  selector: 'app-data-table-organism',
  templateUrl: './data-table.organism.html',
  styleUrls: ['./data-table.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableOrganismComponent implements OnInit, OnDestroy {
  @Input() data: any[] = [];
  @Input() config: TableConfig = { columns: [] };
  @Input() loading: boolean = false;
  
  @Output() rowSelected = new EventEmitter<any[]>();
  @Output() rowClicked = new EventEmitter<any>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() filterChanged = new EventEmitter<any>();
  
  private gridApi?: GridApi;
  private destroy$ = new Subject<void>();
  
  searchForm: FormGroup;
  filterForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private gridAdapter: GridAdapterService
  ) {
    this.searchForm = this.fb.group({ query: [''] });
    this.filterForm = this.fb.group({ filter: [''] });
  }
  
  ngOnInit(): void {
    // Debounce search
    this.searchForm.get('query')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.searchChanged.emit(query);
    });
    
    // Filter changes
    this.filterForm.get('filter')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(filter => {
      this.filterChanged.emit(filter);
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    const defaultOptions = this.gridAdapter.getDefaultGridOptions();
    params.api.updateGridOptions(defaultOptions);
  }
  
  onSelectionChanged(event: any): void {
    const selection = this.gridAdapter.getSelection(event.api);
    this.rowSelected.emit(selection.selectedRows);
  }
  
  onRowClicked(event: any): void {
    this.rowClicked.emit(event.data);
  }
  
  onClearSearch(): void {
    this.searchForm.reset();
  }
  
  get gridOptions(): any {
    return {
      columnDefs: this.config.columns,
      rowData: this.data,
      rowSelection: 'multiple',
      onSelectionChanged: (event: any) => this.onSelectionChanged(event),
      onRowClicked: (event: any) => this.onRowClicked(event)
    };
  }
}
```

```html
<!-- shared/organisms/data-table/data-table.organism.html -->
<div class="data-table-organism">
  <!-- Search and Filters Section -->
  <div class="table-controls" *ngIf="config.enableSearch || config.enableFilters">
    <app-search-form-molecule
      *ngIf="config.enableSearch"
      [formControl]="searchForm.get('query')"
      (search)="searchChanged.emit($event)"
      (clear)="onClearSearch()"
      class="table-search">
    </app-search-form-molecule>
    
    <app-filter-group-molecule
      *ngIf="config.enableFilters"
      [formControl]="filterForm.get('filter')"
      (filterChange)="filterChanged.emit($event)"
      class="table-filter">
    </app-filter-group-molecule>
  </div>
  
  <!-- Grid Section -->
  <div class="table-grid" [class.loading]="loading">
    <ag-grid-angular
      *ngIf="!loading"
      class="ag-theme-alpine"
      [rowData]="data"
      [columnDefs]="config.columns"
      [gridOptions]="gridOptions"
      (gridReady)="onGridReady($event)"
      style="height: 500px; width: 100%;">
    </ag-grid-angular>
    
    <div *ngIf="loading" class="loading-overlay">
      <span>Loading...</span>
    </div>
  </div>
</div>
```

### Implementation Example: Streaming Grid Organism

```typescript
// features/data-grid/organisms/streaming-grid/streaming-grid.organism.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, debounceTime, bufferTime, map, filter } from 'rxjs/operators';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { StreamingService } from '../../../../core/services/streaming.service';
import { GridAdapterService } from '../../../../core/services/grid-adapter.service';

@Component({
  selector: 'app-streaming-grid-organism',
  templateUrl: './streaming-grid.organism.html',
  styleUrls: ['./streaming-grid.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamingGridOrganismComponent implements OnInit, OnDestroy {
  @Input() topic: string = '';
  @Input() columns: ColDef[] = [];
  @Input() streamUrl: string = '';
  
  @Output() rowSelected = new EventEmitter<any[]>();
  @Output() connectionStatusChanged = new EventEmitter<boolean>();
  
  private gridApi?: GridApi;
  private destroy$ = new Subject<void>();
  private updateQueue$ = new Subject<any>();
  
  rowData$ = new BehaviorSubject<any[]>([]);
  isConnected$ = this.streamingService.connectionStatus;
  
  constructor(
    private streamingService: StreamingService,
    private gridAdapter: GridAdapterService
  ) {}
  
  ngOnInit(): void {
    this.connectToStream();
    this.subscribeToStream();
    this.setupBatchUpdates();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.streamingService.disconnect();
  }
  
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    const defaultOptions = this.gridAdapter.getDefaultGridOptions();
    params.api.updateGridOptions(defaultOptions);
  }
  
  onSelectionChanged(event: any): void {
    const selection = this.gridAdapter.getSelection(event.api);
    this.rowSelected.emit(selection.selectedRows);
  }
  
  private connectToStream(): void {
    this.streamingService.connect({
      url: this.streamUrl,
      reconnectAttempts: 5
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (connected) => {
        this.connectionStatusChanged.emit(connected);
      },
      error: (error) => {
        console.error('Connection error:', error);
      }
    });
  }
  
  private subscribeToStream(): void {
    this.streamingService.subscribeToTopic(this.topic)
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(50)
      )
      .subscribe({
        next: (data) => {
          this.updateQueue$.next(data);
        },
        error: (error) => {
          console.error('Stream error:', error);
        }
      });
  }
  
  private setupBatchUpdates(): void {
    this.updateQueue$.pipe(
      bufferTime(100),
      map(updates => updates.filter(u => u !== null)),
      takeUntil(this.destroy$)
    ).subscribe(updates => {
      if (updates.length > 0 && this.gridApi) {
        const merged = this.mergeUpdates(updates);
        this.gridAdapter.updateRows(this.gridApi, merged);
        const current = this.rowData$.value;
        this.rowData$.next([...current, ...merged]);
      }
    });
  }
  
  private mergeUpdates(updates: any[]): any[] {
    const map = new Map();
    updates.forEach(update => {
      const id = update.id || Date.now();
      map.set(id, update);
    });
    return Array.from(map.values());
  }
}
```

```html
<!-- features/data-grid/organisms/streaming-grid/streaming-grid.organism.html -->
<div class="streaming-grid-organism">
  <!-- Connection Status Molecule -->
  <app-card-header-molecule
    title="Streaming Data"
    [showAction]="true"
    actionText="Refresh"
    (actionClicked)="refreshGrid()">
    <div class="connection-status" slot="status">
      <span [class.connected]="isConnected$ | async">
        {{ (isConnected$ | async) ? '● Connected' : '○ Disconnected' }}
      </span>
    </div>
  </app-card-header-molecule>
  
  <!-- Grid -->
  <ag-grid-angular
    class="ag-theme-alpine"
    [rowData]="rowData$ | async"
    [columnDefs]="columns"
    (gridReady)="onGridReady($event)"
    (selectionChanged)="onSelectionChanged($event)"
    style="height: 600px; width: 100%;">
  </ag-grid-angular>
</div>
```

### Organism Best Practices

✅ **DO**:
- Combine molecules and atoms logically
- Include business logic when needed
- Interact with services
- Handle complex state
- Emit events for parent components
- Use OnPush with proper state management

❌ **DON'T**:
- Create organisms that are too generic
- Mix unrelated functionality
- Access services directly in templates
- Create tight coupling between organisms

---

## Templates

**Definition**: Page-level layouts that define the structure without real content.

**Characteristics**:
- Define layout structure
- Place organisms in positions
- No real data (use placeholders)
- Reusable across different pages
- Define wireframe structure

### Examples:
- Dashboard template (header + sidebar + main content)
- Detail template (header + content + actions)
- List template (header + filters + list + pagination)

### Implementation Example: Dashboard Template

```typescript
// shared/templates/dashboard/dashboard.template.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dashboard-template',
  templateUrl: './dashboard.template.html',
  styleUrls: ['./dashboard.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardTemplateComponent {
  // Template doesn't contain business logic
  // It just defines the layout structure
}
```

```html
<!-- shared/templates/dashboard/dashboard.template.html -->
<div class="dashboard-template">
  <!-- Header Organism -->
  <app-header-organism class="template-header"></app-header-organism>
  
  <div class="template-body">
    <!-- Sidebar Organism -->
    <app-sidebar-organism class="template-sidebar"></app-sidebar-organism>
    
    <!-- Main Content Area -->
    <main class="template-main">
      <ng-content></ng-content>
    </main>
  </div>
  
  <!-- Footer (if needed) -->
  <app-footer-organism class="template-footer"></app-footer-organism>
</div>
```

### Implementation Example: Detail Template

```typescript
// shared/templates/detail/detail.template.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-detail-template',
  templateUrl: './detail.template.html',
  styleUrls: ['./detail.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailTemplateComponent {
  @Input() title: string = '';
  @Input() showBackButton: boolean = true;
}
```

```html
<!-- shared/templates/detail/detail.template.html -->
<div class="detail-template">
  <!-- Header with title and actions -->
  <app-card-header-molecule
    [title]="title"
    [showAction]="showBackButton"
    actionText="Back"
    (actionClicked)="goBack()"
    class="detail-header">
  </app-card-header-molecule>
  
  <!-- Content Area -->
  <div class="detail-content">
    <ng-content></ng-content>
  </div>
  
  <!-- Actions Area -->
  <div class="detail-actions">
    <ng-content select="[slot=actions]"></ng-content>
  </div>
</div>
```

### Template Best Practices

✅ **DO**:
- Define clear layout structure
- Use content projection (ng-content)
- Keep templates simple
- Make templates reusable
- Use CSS Grid/Flexbox for layouts

❌ **DON'T**:
- Add business logic
- Include real data
- Create too many template variations
- Make templates too specific

---

## Pages

**Definition**: Specific instances of templates with real content and data.

**Characteristics**:
- Use templates for layout
- Contain real data
- Include business logic
- Connect to services
- Route-specific

### Examples:
- Data grid page (uses dashboard template + streaming grid organism)
- User detail page (uses detail template + user form organism)
- Settings page (uses dashboard template + settings organisms)

### Implementation Example: Data Grid Page

```typescript
// features/data-grid/pages/data-grid-page/data-grid-page.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColDef } from 'ag-grid-community';
import { DataService } from '../../../core/services/data.service';
import { GridAdapterService } from '../../../core/services/grid-adapter.service';

@Component({
  selector: 'app-data-grid-page',
  templateUrl: './data-grid-page.component.html',
  styleUrls: ['./data-grid-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  data: any[] = [];
  loading: boolean = false;
  searchQuery: string = '';
  filterValue: any = null;
  
  columns: ColDef[] = [
    this.gridAdapter.createColumnDef('id', 'ID', { width: 100 }),
    this.gridAdapter.createColumnDef('name', 'Name', { width: 200 }),
    this.gridAdapter.createColumnDef('status', 'Status', { width: 150 }),
    this.gridAdapter.createColumnDef('timestamp', 'Timestamp', { width: 180 })
  ];
  
  constructor(
    private dataService: DataService,
    private gridAdapter: GridAdapterService
  ) {}
  
  ngOnInit(): void {
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadData(): void {
    this.loading = true;
    this.dataService.getData(this.searchQuery, this.filterValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.loading = false;
        }
      });
  }
  
  onSearch(query: string): void {
    this.searchQuery = query;
    this.loadData();
  }
  
  onFilter(filter: any): void {
    this.filterValue = filter;
    this.loadData();
  }
  
  onRowSelected(rows: any[]): void {
    console.log('Selected rows:', rows);
    // Handle selection
  }
}
```

```html
<!-- features/data-grid/pages/data-grid-page/data-grid-page.component.html -->
<app-dashboard-template>
  <app-data-table-organism
    [data]="data"
    [config]="{
      columns: columns,
      enableSearch: true,
      enableFilters: true
    }"
    [loading]="loading"
    (searchChanged)="onSearch($event)"
    (filterChanged)="onFilter($event)"
    (rowSelected)="onRowSelected($event)">
  </app-data-table-organism>
</app-dashboard-template>
```

### Implementation Example: Streaming Grid Page

```typescript
// features/data-grid/pages/streaming-grid-page/streaming-grid-page.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColDef } from 'ag-grid-community';
import { GridAdapterService } from '../../../core/services/grid-adapter.service';

@Component({
  selector: 'app-streaming-grid-page',
  templateUrl: './streaming-grid-page.component.html',
  styleUrls: ['./streaming-grid-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamingGridPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  columns: ColDef[] = [
    this.gridAdapter.createColumnDef('id', 'ID', { width: 100 }),
    this.gridAdapter.createColumnDef('value', 'Value', { width: 200 }),
    this.gridAdapter.createColumnDef('timestamp', 'Timestamp', { width: 180 })
  ];
  
  constructor(private gridAdapter: GridAdapterService) {}
  
  ngOnInit(): void {
    // Page initialization
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onRowSelected(rows: any[]): void {
    console.log('Selected rows:', rows);
  }
  
  onConnectionStatusChanged(connected: boolean): void {
    console.log('Connection status:', connected);
  }
}
```

```html
<!-- features/data-grid/pages/streaming-grid-page/streaming-grid-page.component.html -->
<app-dashboard-template>
  <app-streaming-grid-organism
    topic="kafka-topic-name"
    streamUrl="ws://your-stream-url"
    [columns]="columns"
    (rowSelected)="onRowSelected($event)"
    (connectionStatusChanged)="onConnectionStatusChanged($event)">
  </app-streaming-grid-organism>
</app-dashboard-template>
```

### Page Best Practices

✅ **DO**:
- Use templates for layout
- Connect to services
- Handle business logic
- Manage page-level state
- Use routing
- Handle errors

❌ **DON'T**:
- Duplicate layout code
- Mix presentation with business logic in components
- Create pages without templates
- Access DOM directly

---

## Integration with Existing Patterns

### Combining Atomic Design with Migration-Friendly Patterns

**All Atomic Design components MUST follow migration-friendly patterns.** Here's how:

#### Example 1: Migration-Friendly Atom

```typescript
// ✅ GOOD: Migration-friendly atom
@Component({
  selector: 'app-button',
  templateUrl: './button.atom.html',
  styleUrls: ['./button.atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ OnPush
})
export class ButtonAtomComponent {
  // ✅ Constructor injection (if needed)
  constructor() {}
  
  // ✅ Clear inputs/outputs
  @Input() type: ButtonType = 'primary';
  @Output() clicked = new EventEmitter<void>();
  
  // ✅ No business logic (dumb component)
  onClick(): void {
    this.clicked.emit();
  }
}
```

#### Example 2: Migration-Friendly Molecule with Forms

```typescript
// ✅ GOOD: Migration-friendly molecule
@Component({
  selector: 'app-search-form-molecule',
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ OnPush
})
export class SearchFormMoleculeComponent implements OnInit, OnDestroy {
  // ✅ Reactive forms (not template-driven)
  searchForm: FormGroup;
  
  // ✅ Constructor injection
  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }
  
  // ✅ Observable management with takeUntil
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.searchForm.get('query')?.valueChanges.pipe(
      takeUntil(this.destroy$) // ✅ Proper cleanup
    ).subscribe();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### Example 3: Migration-Friendly Organism with Services

```typescript
// ✅ GOOD: Migration-friendly organism
@Component({
  selector: 'app-data-table-organism',
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ OnPush
})
export class DataTableOrganismComponent implements OnInit, OnDestroy {
  // ✅ Constructor injection
  constructor(
    private gridAdapter: GridAdapterService, // ✅ Adapter service
    private fb: FormBuilder
  ) {}
  
  // ✅ Observable management
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    // ✅ Using async pipe in template instead of subscription
    // Template: <div *ngFor="let item of data$ | async">
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onGridReady(params: GridReadyEvent): void {
    // ✅ Using adapter service (not direct API)
    const options = this.gridAdapter.getDefaultGridOptions();
    params.api.updateGridOptions(options);
  }
}
```

#### Example 4: Migration-Friendly Service

```typescript
// ✅ GOOD: Migration-friendly service
@Injectable({ providedIn: 'root' }) // ✅ Tree-shakeable
export class GridAdapterService {
  // ✅ Constructor injection
  constructor() {}
  
  getDefaultGridOptions(): GridOptions {
    // Abstracted grid configuration
    return { /* ... */ };
  }
}
```

### Using Adapter Services in Organisms

```typescript
// Organism uses adapter service (migration-friendly)
export class DataTableOrganismComponent {
  constructor(
    private gridAdapter: GridAdapterService // ✅ Abstracted
  ) {}
  
  onGridReady(params: GridReadyEvent): void {
    const options = this.gridAdapter.getDefaultGridOptions(); // ✅
    params.api.updateGridOptions(options);
  }
}
```

### Using Streaming Service in Organisms

```typescript
// Organism uses streaming service (migration-friendly)
export class StreamingGridOrganismComponent {
  constructor(
    private streamingService: StreamingService // ✅ Abstracted
  ) {}
  
  ngOnInit(): void {
    this.streamingService.connect(config) // ✅
      .subscribe();
  }
}
```

---

## Best Practices

### 1. Component Hierarchy

```
Page
  └── Template
      └── Organism
          └── Molecule
              └── Atom
```

### 2. Import Strategy

```typescript
// ✅ GOOD: Import from shared
import { ButtonAtomComponent } from '@shared/atoms/button';
import { SearchFormMoleculeComponent } from '@shared/molecules/search-form';

// ❌ BAD: Relative imports across levels
import { ButtonAtomComponent } from '../../../../shared/atoms/button';
```

### 3. Barrel Exports

```typescript
// shared/atoms/index.ts
export * from './button/button.atom';
export * from './input/input.atom';
export * from './label/label.atom';

// Usage
import { ButtonAtomComponent, InputAtomComponent } from '@shared/atoms';
```

### 4. Testing Strategy

```typescript
// Test atoms in isolation
describe('ButtonAtomComponent', () => {
  it('should emit click event', () => {
    // Test atom behavior
  });
});

// Test molecules with mocked atoms
describe('SearchFormMoleculeComponent', () => {
  it('should emit search query', () => {
    // Test molecule behavior
  });
});

// Test organisms with mocked molecules
describe('DataTableOrganismComponent', () => {
  it('should handle row selection', () => {
    // Test organism behavior
  });
});
```

### 5. Documentation

```typescript
/**
 * Button Atom Component
 * 
 * Basic button building block for the design system.
 * 
 * @example
 * <app-button type="primary" (clicked)="handleClick()">
 *   Click Me
 * </app-button>
 * 
 * @inputs
 * - type: ButtonType - Button style (primary, secondary, danger, success)
 * - size: ButtonSize - Button size (small, medium, large)
 * - disabled: boolean - Disable button
 * 
 * @outputs
 * - clicked: EventEmitter<void> - Emitted when button is clicked
 */
@Component({...})
export class ButtonAtomComponent {...}
```

---

## Migration Considerations

### Complete Migration-Friendly Patterns Checklist

All Atomic Design components MUST follow these migration-friendly patterns:

#### ✅ 1. OnPush Change Detection Strategy
**Why**: Better performance, migration-friendly, works with all Angular versions

```typescript
// ✅ GOOD: All Atomic Design components use OnPush
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Required
})
export class ButtonAtomComponent {}
```

**Applied to**: All Atoms, Molecules, Organisms, Templates, Pages

#### ✅ 2. Constructor Injection
**Why**: Standard DI pattern, no module-level dependencies

```typescript
// ✅ GOOD: Constructor injection
export class DataTableOrganismComponent {
  constructor(
    private gridAdapter: GridAdapterService,  // ✅ Constructor injection
    private streamingService: StreamingService
  ) {}
}

// ❌ BAD: Module-level access
export class DataTableOrganismComponent {
  constructor() {
    this.service = AppModule.injector.get(MyService); // ❌ Don't do this
  }
}
```

**Applied to**: All components that need services

#### ✅ 3. Observable Management
**Why**: Prevents memory leaks, works with async pipe

```typescript
// ✅ GOOD: Using takeUntil pattern
export class SearchFormMoleculeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    this.formControl.valueChanges.pipe(
      takeUntil(this.destroy$) // ✅ Unsubscribe on destroy
    ).subscribe();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ✅ GOOD: Using async pipe in templates
@Component({
  template: `
    <div *ngFor="let item of data$ | async">{{ item.name }}</div>
  `
})
export class MyComponent {
  data$ = this.service.getData(); // ✅ Observable, not subscription
}
```

**Applied to**: All components with observables

#### ✅ 4. Adapter Services for Third-Party Libraries
**Why**: Abstracts version-specific APIs, easier migration

```typescript
// ✅ GOOD: Using adapter service
export class DataTableOrganismComponent {
  constructor(
    private gridAdapter: GridAdapterService // ✅ Abstracted
  ) {}
  
  onGridReady(params: GridReadyEvent): void {
    // Use adapter instead of direct API
    const options = this.gridAdapter.getDefaultGridOptions(); // ✅
    params.api.updateGridOptions(options);
  }
}

// ❌ BAD: Direct API usage
export class DataTableOrganismComponent {
  onGridReady(params: GridReadyEvent): void {
    // Direct API - harder to migrate
    params.api.selectAll(); // ❌ Version-specific
  }
}
```

**Applied to**: Organisms using ag-grid, r-socket, or other third-party libraries

#### ✅ 5. Reactive Forms (Not Template-Driven)
**Why**: More testable, migration-friendly

```typescript
// ✅ GOOD: Reactive forms
export class SearchFormMoleculeComponent {
  searchForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      query: ['', Validators.required]
    });
  }
}

// ❌ BAD: Template-driven forms
// <form #searchForm="ngForm"> <!-- ❌ Avoid -->
```

**Applied to**: Molecules and Organisms with forms

#### ✅ 6. ControlValueAccessor for Form Controls
**Why**: Makes atoms compatible with reactive forms

```typescript
// ✅ GOOD: Atom implements ControlValueAccessor
@Component({
  selector: 'app-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAtomComponent),
      multi: true
    }
  ]
})
export class InputAtomComponent implements ControlValueAccessor {
  // Implementation allows use in reactive forms
  // <app-input formControlName="query"></app-input> ✅
}
```

**Applied to**: Atoms used in forms (Input, Select, etc.)

#### ✅ 7. providedIn: 'root' for Services
**Why**: Tree-shakeable, migration-friendly

```typescript
// ✅ GOOD: Services use providedIn: 'root'
@Injectable({ providedIn: 'root' })
export class GridAdapterService {
  // Service is tree-shakeable and singleton
}

// ❌ BAD: Module providers
@NgModule({
  providers: [GridAdapterService] // ❌ Not tree-shakeable
})
```

**Applied to**: All services (adapters, utilities, etc.)

#### ✅ 8. Feature-Based Organization
**Why**: Easier to migrate, better structure

```
✅ GOOD Structure:
src/app/
├── shared/
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
└── features/
    └── data-grid/
        ├── pages/
        └── organisms/

❌ BAD Structure:
src/app/
├── components/  # ❌ Not organized by feature
├── services/
└── models/
```

**Applied to**: Entire project structure

#### ✅ 9. Smart/Dumb Component Pattern
**Why**: Better separation of concerns, easier testing

```typescript
// ✅ GOOD: Smart component (Page/Organism)
@Component({
  selector: 'app-data-grid-page',
  template: `
    <app-data-table-organism
      [data]="data$ | async"
      (rowSelected)="onRowSelected($event)">
    </app-data-table-organism>
  `
})
export class DataGridPageComponent {
  data$ = this.dataService.getData(); // ✅ Business logic here
  
  onRowSelected(rows: any[]) {
    // Handle selection logic
  }
}

// ✅ GOOD: Dumb component (Atom/Molecule)
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonAtomComponent {
  @Input() type: ButtonType = 'primary'; // ✅ Just props
  @Output() clicked = new EventEmitter<void>(); // ✅ Just events
  // No business logic
}
```

**Applied to**: All component levels

#### ✅ 10. No Deprecated Patterns
**Why**: Avoid patterns that will break in future versions

```typescript
// ❌ AVOID: Deprecated patterns
// - Module-level service access
// - Template-driven forms (use reactive forms)
// - Direct DOM manipulation (use ViewChild/ElementRef properly)
// - Mixing change detection strategies unnecessarily
```

**Applied to**: All components

### Angular 11 Compatibility

All examples use patterns compatible with Angular 11:
- ✅ OnPush change detection
- ✅ Constructor injection
- ✅ Reactive forms
- ✅ RxJS operators (takeUntil, async pipe)
- ✅ ControlValueAccessor for form controls
- ✅ providedIn: 'root' for services
- ✅ Feature-based organization
- ✅ Smart/Dumb component pattern
- ✅ Adapter services for third-party libraries
- ✅ No deprecated patterns

### Future Migration Path

When migrating to newer Angular versions:

1. **Atoms/Molecules**: Minimal changes (already using modern patterns)
   - Already using OnPush ✅
   - Already using constructor injection ✅
   - Can easily convert to standalone components (Angular 14+)

2. **Organisms**: May need updates for new ag-grid/r-socket APIs
   - Adapter services make this easier ✅
   - Only need to update adapter, not all organisms

3. **Templates**: Should remain mostly unchanged
   - Layout structure stays the same ✅

4. **Pages**: May benefit from standalone components (Angular 14+)
   - Can convert to standalone if desired
   - Current structure works fine

### Version-Specific Notes

- **Angular 11**: All patterns work as shown ✅
- **Angular 12+**: Can use same patterns ✅
- **Angular 14+**: Can consider standalone components for atoms/molecules
- **Angular 15+**: Can use new control flow syntax if desired (optional)

### Migration Checklist for Atomic Design Components

When creating any Atomic Design component, verify:

- [ ] Uses `ChangeDetectionStrategy.OnPush`
- [ ] Uses constructor injection (no module-level access)
- [ ] Manages observables properly (takeUntil or async pipe)
- [ ] Uses adapter services for third-party libraries (if applicable)
- [ ] Uses reactive forms (if form component)
- [ ] Implements ControlValueAccessor (if form control atom)
- [ ] Services use `providedIn: 'root'`
- [ ] Follows feature-based organization
- [ ] Separates smart/dumb concerns
- [ ] Avoids deprecated patterns

---

## Checklist for New Components

When creating a new component, ask:

### For Atoms:
- [ ] Is it a basic building block?
- [ ] Does it have a single responsibility?
- [ ] Is it highly reusable?
- [ ] Does it use OnPush?
- [ ] Is it form-control compatible (if needed)?

### For Molecules:
- [ ] Does it combine 2-5 atoms?
- [ ] Does it have a single, clear purpose?
- [ ] Is it reusable across contexts?
- [ ] Does it use reactive forms (if form)?

### For Organisms:
- [ ] Does it combine molecules and atoms?
- [ ] Does it handle business logic?
- [ ] Does it interact with services?
- [ ] Is it feature-specific?
- [ ] Does it use adapter services?

### For Templates:
- [ ] Does it define layout structure?
- [ ] Does it use content projection?
- [ ] Is it reusable?
- [ ] Does it avoid business logic?

### For Pages:
- [ ] Does it use a template?
- [ ] Does it contain real data?
- [ ] Does it connect to services?
- [ ] Does it handle routing?

---

## Summary

Atomic Design in Angular provides:

1. **Clear Structure**: Easy to understand component hierarchy
2. **Reusability**: Components can be reused across the app
3. **Maintainability**: Changes in one place affect all usages
4. **Testability**: Smaller components are easier to test
5. **Scalability**: Easy to add new components following patterns
6. **Migration-Friendly**: Works with existing migration guidelines

Remember: Start small with atoms, build up to molecules, then organisms, and finally pages!

