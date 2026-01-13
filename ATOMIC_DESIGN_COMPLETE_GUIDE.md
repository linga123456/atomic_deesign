# Atomic Design Complete Guide for Angular
## Comprehensive Implementation Guide for Teams

This is the **complete, single source of truth** for implementing Atomic Design in Angular 11 projects with migration-friendly practices.

> 📖 **For visual diagrams and component trees**, see: [ATOMIC_DESIGN_VISUAL_GUIDE.md](./ATOMIC_DESIGN_VISUAL_GUIDE.md)  
> 💻 **For complete code examples**, see: [examples/atomic-design-examples/](./examples/atomic-design-examples/)

---

## Table of Contents

1. [Quick Start (5 Minutes)](#quick-start-5-minutes)
2. [What is Atomic Design?](#what-is-atomic-design)
3. [The Five Levels Explained](#the-five-levels-explained)
4. [Project Structure](#project-structure)
5. [Naming Conventions](#naming-conventions)
6. [Atoms - Complete Guide](#atoms-complete-guide)
7. [Molecules - Complete Guide](#molecules-complete-guide)
8. [Organisms - Complete Guide](#organisms-complete-guide)
9. [Templates - Complete Guide](#templates-complete-guide)
10. [Pages - Complete Guide](#pages-complete-guide)
11. [Migration-Friendly Patterns](#migration-friendly-patterns)
12. [Best Practices](#best-practices)
13. [Daily Checklists](#daily-checklists)
14. [Common Questions](#common-questions)

---

## Quick Start (5 Minutes)

### Step 1: Understand the Hierarchy

```
Page (Real content with data)
  ↓ uses
Template (Layout structure)
  ↓ uses
Organism (Complex component)
  ↓ uses
Molecule (Simple group of atoms)
  ↓ uses
Atom (Basic building block)
```

### Step 2: Decision Tree

**Is it a basic UI element?** → **ATOM** (Button, Input, Label)  
**Does it combine 2-5 atoms?** → **MOLECULE** (SearchForm = Input + Button)  
**Is it complex and feature-specific?** → **ORGANISM** (DataTable = SearchForm + Grid)  
**Does it define page layout?** → **TEMPLATE** (Dashboard = Header + Sidebar + Main)  
**Is it a specific page with real data?** → **PAGE** (DataGridPage = Template + Organisms)

### Step 3: Folder Structure

```
src/app/
├── shared/
│   ├── atoms/          # Basic building blocks
│   ├── molecules/      # Simple combinations
│   ├── organisms/      # Complex components
│   └── templates/      # Page layouts
└── features/
    └── [feature]/
        ├── pages/      # Specific pages
        └── organisms/  # Feature-specific organisms
```

### Step 4: Naming Convention

- **Files**: `button.atom.ts`, `search-form.molecule.ts`, `data-table.organism.ts`
- **Selectors**: `app-button`, `app-search-form-molecule`, `app-data-table-organism`
- **Classes**: `ButtonAtomComponent`, `SearchFormMoleculeComponent`, `DataTableOrganismComponent`

### Step 5: Create Your First Component

**Example: Button Atom (Placeholder)**

```typescript
// shared/atoms/button/button.atom.ts
@Component({
  selector: 'app-button',
  templateUrl: './button.atom.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonAtomComponent {
  @Input() type: 'primary' | 'secondary' = 'primary';
  @Output() clicked = new EventEmitter<void>();
  
  onClick() {
    this.clicked.emit();
  }
}
```

> 💻 **Complete example**: See [examples/atomic-design-examples/complete-button-atom-example.ts](./examples/atomic-design-examples/complete-button-atom-example.ts)

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
- ✅ **Migration-Friendly**: Works with Angular migration guidelines

### Real-World Example:

```
UserManagementPage (PAGE)
  └── DashboardTemplate (TEMPLATE)
      └── UserTableOrganism (ORGANISM)
          ├── SearchFormMolecule (MOLECULE)
          │   ├── InputAtom (ATOM)
          │   └── ButtonAtom (ATOM)
          └── FilterGroupMolecule (MOLECULE)
              ├── LabelAtom (ATOM)
              └── SelectAtom (ATOM)
```

---

## The Five Levels Explained

### 1. Atoms

**Definition**: Basic building blocks that cannot be broken down further.

**Characteristics**:
- Single responsibility
- No business logic
- Highly reusable
- Styling only (no complex state)
- Can have simple props/inputs

**Examples**: Button, Input, Label, Icon, Badge, Spinner

**When to create**: When you need a basic UI element that will be reused.

---

### 2. Molecules

**Definition**: Simple combinations of atoms that form a functional unit.

**Characteristics**:
- Combine 2-5 atoms
- Have a single, clear purpose
- May have simple state
- Reusable across different contexts
- Still relatively simple

**Examples**: Search form (input + button), Card header (label + icon + button), Filter group (label + select)

**When to create**: When you need to combine atoms for a specific purpose.

---

### 3. Organisms

**Definition**: Complex components that combine molecules and atoms to form distinct sections of an interface.

**Characteristics**:
- Combine multiple molecules and atoms
- May contain business logic
- Often feature-specific
- Can be quite complex
- May interact with services

**Examples**: Header (logo + navigation + user menu), Data table (search + filters + grid), Streaming grid (status + grid + controls)

**When to create**: When you need a complex, feature-rich component.

---

### 4. Templates

**Definition**: Page-level layouts that define the structure without real content.

**Characteristics**:
- Define layout structure
- Place organisms in positions
- No real data (use placeholders)
- Reusable across different pages
- Define wireframe structure

**Examples**: Dashboard template (header + sidebar + main), Detail template (header + content + actions)

**When to create**: When you need to define a reusable page layout.

---

### 5. Pages

**Definition**: Specific instances of templates with real content and data.

**Characteristics**:
- Use templates for layout
- Contain real data
- Include business logic
- Connect to services
- Route-specific

**Examples**: Data grid page (uses dashboard template + streaming grid organism), User detail page (uses detail template + user form organism)

**When to create**: When you need a specific page with real data and routing.

---

## Project Structure

### Complete Folder Structure

```
src/
├── app/
│   ├── features/                    # Feature modules
│   │   ├── data-grid/
│   │   │   ├── pages/              # Pages (specific instances)
│   │   │   │   └── data-grid-page.component.ts
│   │   │   └── organisms/          # Feature-specific organisms
│   │   │       └── streaming-grid.organism.ts
│   │   └── streaming/
│   │       └── organisms/
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
│
└── core/                            # Core services
    └── services/
        ├── grid-adapter.service.ts
        └── streaming.service.ts
```

### Barrel Exports

Create `index.ts` files for clean imports:

```typescript
// shared/atoms/index.ts
export * from './button/button.atom';
export * from './input/input.atom';
export * from './label/label.atom';

// Usage
import { ButtonAtomComponent, InputAtomComponent } from '@shared/atoms';
```

---

## Naming Conventions

### Component Files

| Level | File Naming | Example |
|-------|-------------|---------|
| **Atom** | `[name].atom.ts` | `button.atom.ts` |
| **Molecule** | `[name].molecule.ts` | `search-form.molecule.ts` |
| **Organism** | `[name].organism.ts` | `data-table.organism.ts` |
| **Template** | `[name].template.ts` | `dashboard.template.ts` |
| **Page** | `[name]-page.component.ts` or `[name].page.ts` | `data-grid-page.component.ts` |

### Component Selectors

| Level | Selector Pattern | Example |
|-------|------------------|---------|
| **Atom** | `app-[name]` | `app-button` |
| **Molecule** | `app-[name]-molecule` | `app-search-form-molecule` |
| **Organism** | `app-[name]-organism` | `app-data-table-organism` |
| **Template** | `app-[name]-template` | `app-dashboard-template` |
| **Page** | `app-[name]-page` | `app-data-grid-page` |

### Component Classes

| Level | Class Naming | Example |
|-------|--------------|---------|
| **Atom** | `[Name]AtomComponent` | `ButtonAtomComponent` |
| **Molecule** | `[Name]MoleculeComponent` | `SearchFormMoleculeComponent` |
| **Organism** | `[Name]OrganismComponent` | `DataTableOrganismComponent` |
| **Template** | `[Name]TemplateComponent` | `DashboardTemplateComponent` |
| **Page** | `[Name]PageComponent` | `DataGridPageComponent` |

---

## Atoms - Complete Guide

### What is an Atom?

Atoms are the smallest reusable components. They cannot be broken down further and have no dependencies on other custom components.

### Atom Characteristics

- ✅ Single responsibility
- ✅ No business logic
- ✅ Highly reusable
- ✅ Styling only (no complex state)
- ✅ Can have simple props/inputs
- ✅ Uses OnPush change detection
- ✅ May implement ControlValueAccessor (if form control)

### Atom Examples

- Button, Input, Label, Icon, Badge, Spinner, Checkbox, Radio

### Atom Template (Placeholder)

```typescript
// shared/atoms/[name]/[name].atom.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-[name]',
  templateUrl: './[name].atom.html',
  styleUrls: ['./[name].atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Required
})
export class [Name]AtomComponent {
  // Define inputs
  @Input() prop1: string = '';
  @Input() prop2?: boolean;
  
  // Define outputs
  @Output() action = new EventEmitter<void>();
  
  // Simple logic only, no business logic
  handleAction() {
    this.action.emit();
  }
}
```

> 💻 **Complete examples**: 
> - [Button Atom](./examples/atomic-design-examples/complete-button-atom-example.ts)
> - [Input Atom](./examples/atomic-design-examples/complete-button-atom-example.ts) (see ATOMIC_DESIGN_GUIDELINES.md for Input example)

### Atom Best Practices

✅ **DO**:
- Keep atoms simple and focused
- Use OnPush change detection
- Make them form-control compatible (ControlValueAccessor) if used in forms
- Provide clear input/output interfaces
- Use TypeScript types for props

❌ **DON'T**:
- Add business logic
- Make atoms depend on other atoms directly
- Create atoms that are too specific
- Mix styling with complex state

### Atom Checklist

- [ ] Is it a basic building block?
- [ ] Does it have a single responsibility?
- [ ] Is it highly reusable?
- [ ] Does it use OnPush?
- [ ] Is it form-control compatible (if needed)?
- [ ] No business logic?

---

## Molecules - Complete Guide

### What is a Molecule?

Molecules combine 2-5 atoms to create a functional unit with a single, clear purpose.

### Molecule Characteristics

- ✅ Combines 2-5 atoms
- ✅ Has a single, clear purpose
- ✅ May have simple state
- ✅ Reusable across different contexts
- ✅ Still relatively simple
- ✅ Uses reactive forms (if form)
- ✅ Uses OnPush change detection

### Molecule Examples

- Search form (input + button), Card header (label + icon + button), Filter group (label + select), Navigation item (icon + label)

### Molecule Template (Placeholder)

```typescript
// shared/molecules/[name]/[name].molecule.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-[name]-molecule',
  templateUrl: './[name].molecule.html',
  styleUrls: ['./[name].molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Required
})
export class [Name]MoleculeComponent implements OnInit, OnDestroy {
  @Input() config: any = {};
  @Output() action = new EventEmitter<any>();
  
  form: FormGroup; // If form molecule
  private destroy$ = new Subject<void>();
  
  constructor(private fb: FormBuilder) {
    // Initialize form if needed
    this.form = this.fb.group({});
  }
  
  ngOnInit() {
    // Subscribe to form changes if needed
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  handleAction() {
    this.action.emit(this.form.value);
  }
}
```

**Template (placeholder):**
```html
<!-- shared/molecules/[name]/[name].molecule.html -->
<div class="[name]-molecule">
  <!-- Use atoms here -->
  <app-atom1 [prop]="value"></app-atom1>
  <app-atom2 (action)="handleAction()"></app-atom2>
</div>
```

> 💻 **Complete example**: [Search Form Molecule](./examples/atomic-design-examples/complete-search-form-molecule-example.ts)

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

### Molecule Checklist

- [ ] Does it combine 2-5 atoms?
- [ ] Does it have a single, clear purpose?
- [ ] Is it reusable across contexts?
- [ ] Does it use reactive forms (if form)?
- [ ] Does it use OnPush?
- [ ] No business logic?

---

## Organisms - Complete Guide

### What is an Organism?

Organisms combine molecules and atoms to create complex, feature-rich components that may contain business logic.

### Organism Characteristics

- ✅ Combines multiple molecules and atoms
- ✅ May contain business logic
- ✅ Often feature-specific
- ✅ Can be quite complex
- ✅ May interact with services
- ✅ Uses adapter services for third-party libraries
- ✅ Uses OnPush change detection

### Organism Examples

- Header (logo + navigation + user menu), Data table (search + filters + grid), Streaming grid (status + grid + controls), Sidebar (navigation items + filters)

### Organism Template (Placeholder)

```typescript
// shared/organisms/[name]/[name].organism.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridAdapterService } from '../../../core/services/grid-adapter.service'; // If using ag-grid

@Component({
  selector: 'app-[name]-organism',
  templateUrl: './[name].organism.html',
  styleUrls: ['./[name].organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Required
})
export class [Name]OrganismComponent implements OnInit, OnDestroy {
  @Input() data: any[] = [];
  @Input() config: any = {};
  @Output() action = new EventEmitter<any>();
  
  private destroy$ = new Subject<void>();
  form: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private adapterService: AdapterService // ✅ Use adapter services
  ) {
    this.form = this.fb.group({});
  }
  
  ngOnInit() {
    // Business logic here
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  handleAction() {
    // Business logic
    this.action.emit();
  }
}
```

**Template (placeholder):**
```html
<!-- shared/organisms/[name]/[name].organism.html -->
<div class="[name]-organism">
  <!-- Use molecules and atoms -->
  <app-molecule1 [config]="config" (action)="handleAction()"></app-molecule1>
  <app-molecule2></app-molecule2>
  <app-atom1></app-atom1>
</div>
```

> 💻 **Complete example**: [Data Table Organism](./examples/atomic-design-examples/complete-data-table-organism-example.ts)

### Organism Best Practices

✅ **DO**:
- Combine molecules and atoms logically
- Include business logic when needed
- Interact with services
- Handle complex state
- Emit events for parent components
- Use OnPush with proper state management
- Use adapter services for third-party libraries

❌ **DON'T**:
- Create organisms that are too generic
- Mix unrelated functionality
- Access services directly in templates
- Create tight coupling between organisms

### Organism Checklist

- [ ] Does it combine molecules and atoms?
- [ ] Does it handle business logic?
- [ ] Does it interact with services?
- [ ] Is it feature-specific?
- [ ] Does it use adapter services (if third-party)?
- [ ] Does it use OnPush?

---

## Templates - Complete Guide

### What is a Template?

Templates define page-level layouts without real content. They use content projection to place organisms in positions.

### Template Characteristics

- ✅ Define layout structure
- ✅ Place organisms in positions
- ✅ No real data (use placeholders)
- ✅ Reusable across different pages
- ✅ Define wireframe structure
- ✅ Use content projection (ng-content)
- ✅ Uses OnPush change detection

### Template Examples

- Dashboard template (header + sidebar + main), Detail template (header + content + actions), List template (header + filters + list)

### Template Template (Placeholder)

```typescript
// shared/templates/[name]/[name].template.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-[name]-template',
  templateUrl: './[name].template.html',
  styleUrls: ['./[name].template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Required
})
export class [Name]TemplateComponent {
  @Input() title?: string;
  // Template doesn't contain business logic
  // It just defines the layout structure
}
```

**Template (placeholder):**
```html
<!-- shared/templates/[name]/[name].template.html -->
<div class="[name]-template">
  <!-- Use organisms for layout -->
  <app-header-organism class="template-header"></app-header-organism>
  
  <div class="template-body">
    <app-sidebar-organism class="template-sidebar"></app-sidebar-organism>
    <main class="template-main">
      <ng-content></ng-content> <!-- Content projection -->
    </main>
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

### Template Checklist

- [ ] Does it define layout structure?
- [ ] Does it use content projection?
- [ ] Is it reusable?
- [ ] Does it avoid business logic?
- [ ] Does it use OnPush?

---

## Pages - Complete Guide

### What is a Page?

Pages are specific instances of templates with real content, data, and business logic. They connect to services and handle routing.

### Page Characteristics

- ✅ Use templates for layout
- ✅ Contain real data
- ✅ Include business logic
- ✅ Connect to services
- ✅ Route-specific
- ✅ Handle errors
- ✅ Uses OnPush change detection

### Page Examples

- Data grid page (uses dashboard template + streaming grid organism), User detail page (uses detail template + user form organism), Settings page (uses dashboard template + settings organisms)

### Page Template (Placeholder)

```typescript
// features/[feature]/pages/[name]-page/[name]-page.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-[name]-page',
  templateUrl: './[name]-page.component.html',
  styleUrls: ['./[name]-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Required
})
export class [Name]PageComponent implements OnInit, OnDestroy {
  data$ = this.dataService.getData(); // ✅ Use observables with async pipe
  loading = false;
  private destroy$ = new Subject<void>();
  
  constructor(
    private dataService: DataService // ✅ Constructor injection
  ) {}
  
  ngOnInit() {
    // Page initialization
    this.loadData();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadData() {
    this.loading = true;
    // Load data logic
  }
  
  handleAction(action: any) {
    // Handle actions
  }
}
```

**Template (placeholder):**
```html
<!-- features/[feature]/pages/[name]-page/[name]-page.component.html -->
<app-dashboard-template>
  <!-- Use organisms with real data -->
  <app-data-table-organism
    [data]="data$ | async"
    [loading]="loading"
    (action)="handleAction($event)">
  </app-data-table-organism>
</app-dashboard-template>
```

> 💻 **Complete examples**: See [usage-examples.ts](./examples/atomic-design-examples/usage-examples.ts)

### Page Best Practices

✅ **DO**:
- Use templates for layout
- Connect to services
- Handle business logic
- Manage page-level state
- Use routing
- Handle errors
- Use async pipe for observables

❌ **DON'T**:
- Duplicate layout code
- Mix presentation with business logic in components
- Create pages without templates
- Access DOM directly

### Page Checklist

- [ ] Does it use a template?
- [ ] Does it contain real data?
- [ ] Does it connect to services?
- [ ] Does it handle routing?
- [ ] Does it use OnPush?
- [ ] Does it use async pipe for observables?

---

## Migration-Friendly Patterns

**All Atomic Design components MUST follow these patterns for easy migration:**

### 1. OnPush Change Detection ✅

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Required
})
```

### 2. Constructor Injection ✅

```typescript
constructor(
  private service: MyService // ✅ Constructor injection
) {}
```

### 3. Observable Management ✅

```typescript
// Pattern A: takeUntil
private destroy$ = new Subject<void>();
this.service.getData().pipe(takeUntil(this.destroy$)).subscribe();

// Pattern B: async pipe (preferred)
data$ = this.service.getData();
// Template: <div *ngFor="let item of data$ | async">
```

### 4. Adapter Services ✅

```typescript
constructor(
  private gridAdapter: GridAdapterService // ✅ Abstracted
) {}
```

### 5. Reactive Forms ✅

```typescript
form: FormGroup;
constructor(private fb: FormBuilder) {
  this.form = this.fb.group({});
}
```

### 6. providedIn: 'root' for Services ✅

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {}
```

### 7. Feature-Based Organization ✅

```
src/app/
├── shared/     # Shared components
└── features/   # Feature modules
```

### 8. Smart/Dumb Pattern ✅

- **Smart** (Pages/Organisms): Business logic
- **Dumb** (Atoms/Molecules): Just props and events

### 9. ControlValueAccessor (for form atoms) ✅

```typescript
@Component({
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputAtomComponent),
    multi: true
  }]
})
export class InputAtomComponent implements ControlValueAccessor {}
```

### 10. No Deprecated Patterns ✅

Avoid: Module-level access, template-driven forms, direct DOM manipulation

> 📖 **Complete migration guide**: See [MIGRATION_FRIENDLY_GUIDELINES.md](./MIGRATION_FRIENDLY_GUIDELINES.md)

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

// ❌ BAD: Relative imports
import { ButtonAtomComponent } from '../../../../shared/atoms/button';
```

### 3. Testing Strategy

- **Atoms**: Test in isolation
- **Molecules**: Test with mocked atoms
- **Organisms**: Test with mocked molecules
- **Pages**: Test with mocked templates/organisms

### 4. Documentation

```typescript
/**
 * Component Name
 * 
 * Brief description
 * 
 * @example
 * <app-component [prop]="value" (action)="handler()">
 * 
 * @inputs
 * - prop: type - Description
 * 
 * @outputs
 * - action: EventEmitter<type> - Description
 */
@Component({...})
export class ComponentName {}
```

---

## Daily Checklists

### Before Creating a Component

- [ ] Identify the level (Atom/Molecule/Organism/Template/Page)
- [ ] Check if it exists (look in shared/ first)
- [ ] Plan dependencies
- [ ] Choose location (shared/ or features/[feature]/)

### When Creating

- [ ] Use correct naming (`.atom.ts`, `.molecule.ts`, etc.)
- [ ] Use OnPush change detection
- [ ] Define clear inputs/outputs
- [ ] Add JSDoc comments
- [ ] Use constructor injection
- [ ] Manage observables properly (takeUntil or async pipe)

### After Creating

- [ ] Write unit tests
- [ ] Update documentation
- [ ] Add to barrel export (if in shared/)
- [ ] Code review for Atomic Design compliance

### Migration Checklist

- [ ] Uses OnPush?
- [ ] Uses constructor injection?
- [ ] Manages observables properly?
- [ ] Uses adapter services (if third-party)?
- [ ] Uses reactive forms (if form)?
- [ ] Services use providedIn: 'root'?
- [ ] Follows feature-based organization?
- [ ] No deprecated patterns?

---

## Common Questions

### Q: Can an organism use another organism?

**A**: Generally no. Organisms should use molecules and atoms. If you need to reuse an organism, consider if it should be a template instead.

### Q: Where do services go?

**A**: Services go in `core/services/` or `features/[feature]/services/`. Components use them via constructor injection.

### Q: Can I skip molecules?

**A**: Technically yes, but it's better to have molecules for reusability. If you're combining atoms, create a molecule.

### Q: How do I handle state?

**A**: Simple state in components, complex state in services. Use RxJS observables for reactive state.

### Q: What about routing?

**A**: Routing is handled at the Page level. Pages are route-specific components.

### Q: Can atoms have business logic?

**A**: No. Atoms should be pure UI components. Business logic goes in organisms or pages.

### Q: How do I test Atomic Design components?

**A**: Test atoms in isolation, molecules with mocked atoms, organisms with mocked molecules, pages with mocked templates/organisms.

---

## Summary

Atomic Design in Angular provides:

1. **Clear Structure**: Easy to understand component hierarchy
2. **Reusability**: Components can be reused across the app
3. **Maintainability**: Changes in one place affect all usages
4. **Testability**: Smaller components are easier to test
5. **Scalability**: Easy to add new components following patterns
6. **Migration-Friendly**: Works with Angular migration guidelines

### Key Principles

- Start with atoms, build up to molecules, then organisms, templates, and pages
- Always use OnPush change detection
- Always use constructor injection
- Always manage observables properly
- Always use adapter services for third-party libraries
- Always follow migration-friendly patterns

### Next Steps

1. Read the [Visual Guide](./ATOMIC_DESIGN_VISUAL_GUIDE.md) for diagrams
2. Review [Complete Examples](./examples/atomic-design-examples/) for code
3. Start creating your first atom
4. Build up to molecules, then organisms
5. Create templates and pages

---

**Remember**: Start small with atoms, build up to molecules, then organisms, templates, and finally pages!


