# Atomic Design - Team Implementation Guide
## Quick Reference for Daily Development

This is your go-to guide for implementing Atomic Design in your Angular 11 project.

---

## 🎯 The Five Levels - Quick Reference

| Level | What | Example | File Naming |
|-------|------|---------|-------------|
| **Atom** | Basic building block | Button, Input, Label | `button.atom.ts` |
| **Molecule** | 2-5 atoms combined | SearchForm, CardHeader | `search-form.molecule.ts` |
| **Organism** | Complex component | DataTable, Header | `data-table.organism.ts` |
| **Template** | Page layout | Dashboard, Detail | `dashboard.template.ts` |
| **Page** | Specific instance | DataGridPage | `data-grid-page.component.ts` |

---

## 📁 Where to Put Components

```
src/app/
├── shared/
│   ├── atoms/          ← Basic UI elements (buttons, inputs)
│   ├── molecules/      ← Simple groups (search forms, card headers)
│   ├── organisms/      ← Complex components (data tables, headers)
│   └── templates/      ← Page layouts (dashboard, detail)
│
└── features/
    └── [feature-name]/
        ├── pages/      ← Specific pages with real data
        └── organisms/  ← Feature-specific organisms
```

---

## ✅ Component Creation Checklist

### Before Creating a Component:

- [ ] **Identify the level**: Atom, Molecule, Organism, Template, or Page?
- [ ] **Check if it exists**: Look in shared/atoms, molecules, organisms first
- [ ] **Plan dependencies**: What will this component use?
- [ ] **Choose location**: shared/ or features/[feature]/

### When Creating:

- [ ] **Naming**: Use correct suffix (`.atom.ts`, `.molecule.ts`, etc.)
- [ ] **OnPush**: Always use `ChangeDetectionStrategy.OnPush`
- [ ] **Inputs/Outputs**: Define clear interface
- [ ] **Documentation**: Add JSDoc comments with examples
- [ ] **Barrel export**: Add to index.ts if in shared/

### After Creating:

- [ ] **Test**: Write unit tests
- [ ] **Document**: Update component documentation
- [ ] **Review**: Code review for Atomic Design compliance

---

## 🔍 Decision Guide: Which Level?

### Is it a basic UI element? → **ATOM**
- ✅ Button, Input, Label, Icon, Badge, Spinner
- ✅ Single responsibility
- ✅ No business logic
- ✅ Highly reusable

**Example:**
```typescript
// shared/atoms/button/button.atom.ts
@Component({
  selector: 'app-button',
  // ...
})
export class ButtonAtomComponent {
  @Input() type: 'primary' | 'secondary';
  @Output() clicked = new EventEmitter();
}
```

### Does it combine 2-5 atoms? → **MOLECULE**
- ✅ SearchForm (Input + Button)
- ✅ CardHeader (Icon + Label + Button)
- ✅ FilterGroup (Label + Select)
- ✅ NavigationItem (Icon + Label)

**Example:**
```typescript
// shared/molecules/search-form/search-form.molecule.ts
@Component({
  selector: 'app-search-form-molecule',
  // ...
})
export class SearchFormMoleculeComponent {
  // Uses app-input and app-button atoms
}
```

### Is it complex and feature-specific? → **ORGANISM**
- ✅ DataTable (SearchForm + Filters + Grid)
- ✅ Header (Logo + Navigation + UserMenu)
- ✅ StreamingGrid (Status + Grid + Controls)
- ✅ May contain business logic

**Example:**
```typescript
// shared/organisms/data-table/data-table.organism.ts
@Component({
  selector: 'app-data-table-organism',
  // ...
})
export class DataTableOrganismComponent {
  // Uses SearchFormMolecule, FilterGroupMolecule, ag-Grid
  // Contains business logic
}
```

### Does it define page layout? → **TEMPLATE**
- ✅ Dashboard layout (Header + Sidebar + Main)
- ✅ Detail layout (Header + Content + Actions)
- ✅ List layout (Header + Filters + List)
- ✅ No real data, just structure

**Example:**
```typescript
// shared/templates/dashboard/dashboard.template.ts
@Component({
  selector: 'app-dashboard-template',
  // ...
})
export class DashboardTemplateComponent {
  // Defines layout structure
  // Uses content projection (ng-content)
}
```

### Is it a specific page with real data? → **PAGE**
- ✅ DataGridPage (uses DashboardTemplate + DataTable)
- ✅ UserDetailPage (uses DetailTemplate + UserForm)
- ✅ Contains business logic and connects to services

**Example:**
```typescript
// features/data-grid/pages/data-grid-page.component.ts
@Component({
  selector: 'app-data-grid-page',
  // ...
})
export class DataGridPageComponent {
  // Uses DashboardTemplate
  // Uses DataTableOrganism
  // Connects to services
  // Contains page-level logic
}
```

---

## 📝 Naming Conventions

### Files:
- Atom: `button.atom.ts`, `input.atom.ts`
- Molecule: `search-form.molecule.ts`, `card-header.molecule.ts`
- Organism: `data-table.organism.ts`, `header.organism.ts`
- Template: `dashboard.template.ts`, `detail.template.ts`
- Page: `data-grid-page.component.ts` (or `data-grid.page.ts`)

### Selectors:
- Atom: `app-button`, `app-input`
- Molecule: `app-search-form-molecule`, `app-card-header-molecule`
- Organism: `app-data-table-organism`, `app-header-organism`
- Template: `app-dashboard-template`, `app-detail-template`
- Page: `app-data-grid-page`

### Classes:
- Atom: `ButtonAtomComponent`, `InputAtomComponent`
- Molecule: `SearchFormMoleculeComponent`, `CardHeaderMoleculeComponent`
- Organism: `DataTableOrganismComponent`, `HeaderOrganismComponent`
- Template: `DashboardTemplateComponent`, `DetailTemplateComponent`
- Page: `DataGridPageComponent`, `UserDetailPageComponent`

---

## 📖 Complete Examples

### Example 1: Using Button Atom

```typescript
// In any component template
@Component({
  template: `
    <!-- Basic button -->
    <app-button (clicked)="handleClick()">Click Me</app-button>
    
    <!-- Primary button with icon -->
    <app-button type="primary" icon="fa fa-save" (clicked)="save()">
      Save
    </app-button>
    
    <!-- Disabled button -->
    <app-button [disabled]="!isValid" (clicked)="submit()">
      Submit
    </app-button>
    
    <!-- Loading button -->
    <app-button [loading]="isSaving" (clicked)="save()">
      Save Changes
    </app-button>
  `
})
export class ExampleComponent {
  isValid = true;
  isSaving = false;
  
  handleClick() {
    console.log('Button clicked!');
  }
  
  save() {
    this.isSaving = true;
    // Simulate async operation
    setTimeout(() => this.isSaving = false, 2000);
  }
}
```

### Example 2: Using Search Form Molecule

```typescript
@Component({
  template: `
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
    
    <!-- With initial value -->
    <app-search-form-molecule
      [initialValue]="savedQuery"
      (search)="onSearch($event)">
    </app-search-form-molecule>
  `
})
export class SearchExampleComponent {
  savedQuery = 'John';
  searchResults: any[] = [];
  
  onSearch(query: string) {
    console.log('Searching for:', query);
    // Perform search
    this.searchResults = this.filterData(query);
  }
  
  onClear() {
    this.searchResults = [];
  }
  
  searchUsers(query: string) {
    // Search users logic
  }
  
  private filterData(query: string): any[] {
    // Filter logic
    return [];
  }
}
```

### Example 3: Using Data Table Organism in a Page

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ColDef } from 'ag-grid-community';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-data-grid-page',
  template: `
    <app-dashboard-template>
      <!-- Data Table Organism with all features -->
      <app-data-table-organism
        [data]="data$ | async"
        [config]="tableConfig"
        [loading]="loading"
        [initialSearch]="savedSearch"
        (rowSelected)="onRowSelected($event)"
        (rowClicked)="onRowClicked($event)"
        (searchChanged)="onSearch($event)"
        (filterChanged)="onFilter($event)">
      </app-data-table-organism>
    </app-dashboard-template>
  `
})
export class DataGridPageComponent implements OnInit {
  data$: Observable<any[]>;
  loading = false;
  savedSearch = '';
  
  // Column definitions
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 }
  ];
  
  // Table configuration
  tableConfig = {
    columns: this.columnDefs,
    enableSearch: true,
    enableFilters: true
  };
  
  constructor(private dataService: DataService) {
    this.data$ = this.dataService.getData();
  }
  
  ngOnInit(): void {
    this.loadData();
  }
  
  loadData(): void {
    this.loading = true;
    this.data$ = this.dataService.getData();
    setTimeout(() => this.loading = false, 1000);
  }
  
  onSearch(query: string): void {
    this.savedSearch = query;
    this.data$ = this.dataService.search(query);
  }
  
  onFilter(filter: any): void {
    this.data$ = this.dataService.filter(filter);
  }
  
  onRowSelected(rows: any[]): void {
    console.log('Selected:', rows);
  }
  
  onRowClicked(row: any): void {
    console.log('Clicked:', row);
    // Navigate to detail, show modal, etc.
  }
}
```

### Example 4: Complete Feature with All Levels

```typescript
/**
 * This example shows how all Atomic Design levels work together:
 * 
 * Page (UserManagementPageComponent)
 *   └── Template (DashboardTemplateComponent)
 *       └── Organism (UserTableOrganismComponent)
 *           ├── Molecule (SearchFormMoleculeComponent)
 *           │   ├── Atom (InputAtomComponent)
 *           │   └── Atom (ButtonAtomComponent)
 *           ├── Molecule (FilterGroupMoleculeComponent)
 *           │   ├── Atom (LabelAtomComponent)
 *           │   └── Atom (SelectAtomComponent)
 *           └── ag-Grid (Third-party, wrapped)
 */

@Component({
  selector: 'app-user-management-page',
  template: `
    <!-- PAGE: Specific page with real data -->
    <app-dashboard-template>
      
      <!-- ORGANISM: Complex component with business logic -->
      <app-user-table-organism
        [users]="users$ | async"
        [config]="tableConfig"
        (userSelected)="handleUserSelection($event)"
        (userDeleted)="handleUserDeletion($event)">
      </app-user-table-organism>
      
    </app-dashboard-template>
  `
})
export class UserManagementPageComponent {
  users$ = this.userService.getUsers();
  
  tableConfig = {
    columns: [
      { field: 'id', headerName: 'ID' },
      { field: 'name', headerName: 'Name' },
      { field: 'email', headerName: 'Email' }
    ],
    enableSearch: true,
    enableFilters: true
  };
  
  constructor(private userService: UserService) {}
  
  handleUserSelection(users: any[]): void {
    console.log('Users selected:', users);
  }
  
  handleUserDeletion(user: any): void {
    console.log('User deleted:', user);
  }
}
```

---

## 🎨 Code Templates

### Atom Template

```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-[name]',
  templateUrl: './[name].atom.html',
  styleUrls: ['./[name].atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [Name]AtomComponent {
  @Input() // Define inputs
  @Output() // Define outputs
  
  // Simple logic only, no business logic
}
```

### Molecule Template

```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-[name]-molecule',
  templateUrl: './[name].molecule.html',
  styleUrls: ['./[name].molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [Name]MoleculeComponent {
  @Input() // Define inputs
  @Output() // Define outputs
  
  // Uses atoms
  // May have simple form logic
}
```

### Organism Template

```typescript
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-[name]-organism',
  templateUrl: './[name].organism.html',
  styleUrls: ['./[name].organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [Name]OrganismComponent implements OnInit, OnDestroy {
  @Input() // Define inputs
  @Output() // Define outputs
  
  private destroy$ = new Subject<void>();
  
  constructor(
    // Inject services
  ) {}
  
  ngOnInit(): void {
    // Initialize
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Uses molecules and atoms
  // Contains business logic
}
```

---

## 🔗 Integration with Services

### Using Adapter Services (Migration-Friendly)

```typescript
// In Organism
export class DataTableOrganismComponent {
  constructor(
    private gridAdapter: GridAdapterService,  // ✅ Abstracted
    private streamingService: StreamingService // ✅ Abstracted
  ) {}
}
```

### Using Feature Services

```typescript
// In Page
export class DataGridPageComponent {
  constructor(
    private dataService: DataService,  // Feature service
    private gridAdapter: GridAdapterService
  ) {}
}
```

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T:

1. **Skip levels**: Don't create an organism that should be a molecule
2. **Mix levels**: Don't put atoms in organisms folder
3. **Duplicate**: Don't create a new button if one exists
4. **Business logic in atoms**: Atoms should be pure UI
5. **Direct API access**: Use adapter services for third-party libraries
6. **Tight coupling**: Don't make components depend on specific features
7. **No OnPush**: Always use OnPush change detection
8. **Unsubscribed observables**: Always use takeUntil or async pipe

### ✅ DO:

1. **Reuse**: Always check if component exists first
2. **Abstract**: Use adapter services for third-party libraries
3. **Document**: Add JSDoc comments with examples
4. **Test**: Write unit tests for each component
5. **OnPush**: Always use OnPush change detection
6. **Clean up**: Always unsubscribe observables
7. **Type safety**: Use TypeScript interfaces
8. **Follow naming**: Use correct suffixes and conventions

---

## 📚 Documentation Requirements

### Every Component Should Have:

```typescript
/**
 * [Component Name] [Level]
 * 
 * [Brief description of what this component does]
 * 
 * @example
 * ```html
 * <app-component-name [input]="value" (output)="handler()">
 *   Content
 * </app-component-name>
 * ```
 * 
 * @inputs
 * - inputName: type - Description
 * 
 * @outputs
 * - outputName: EventEmitter<type> - Description
 * 
 * @uses
 * - ComponentName - What it uses
 */
@Component({...})
export class ComponentName {}
```

---

## 🧪 Testing Strategy

### Atoms:
- Test in isolation
- Test inputs/outputs
- Test styling variants

### Molecules:
- Test with mocked atoms
- Test form logic (if form)
- Test event emissions

### Organisms:
- Test with mocked molecules
- Test business logic
- Test service interactions

### Templates:
- Test layout structure
- Test content projection

### Pages:
- Test with mocked templates/organisms
- Test service integration
- Test routing

---

## 🔄 Migration Considerations

All Atomic Design components follow migration-friendly patterns:

✅ **OnPush** change detection  
✅ **Constructor injection**  
✅ **Observable management** (async pipe, takeUntil)  
✅ **Adapter services** for third-party libraries  
✅ **Feature-based organization**

When migrating Angular versions:
- **Atoms/Molecules**: Minimal changes needed
- **Organisms**: May need updates for new APIs
- **Templates**: Should remain mostly unchanged
- **Pages**: May benefit from standalone components (Angular 14+)

---

## 📖 Additional Resources

- **Full Guide**: `ATOMIC_DESIGN_GUIDELINES.md`
- **Quick Start**: `ATOMIC_DESIGN_QUICK_START.md`
- **Visual Guide**: `ATOMIC_DESIGN_VISUAL_GUIDE.md`
- **Examples**: `examples/atomic-design-examples/`
- **Migration Guidelines**: `MIGRATION_FRIENDLY_GUIDELINES.md`

---

## 🆘 Need Help?

1. **Check the guides**: Start with `ATOMIC_DESIGN_QUICK_START.md`
2. **Review examples**: Look at `examples/atomic-design-examples/`
3. **Ask the team**: Discuss component level decisions
4. **Code review**: Get feedback on component structure

---

## ✅ Daily Checklist

Before committing code:

- [ ] Component is in the correct folder (atoms/molecules/organisms/templates/pages)
- [ ] Component has correct naming (`.atom.ts`, `.molecule.ts`, etc.)
- [ ] Component uses OnPush change detection
- [ ] Component has clear inputs/outputs
- [ ] Component is documented with JSDoc
- [ ] Component follows migration-friendly patterns
- [ ] Component is added to barrel export (if in shared/)
- [ ] Tests are written
- [ ] No direct third-party API usage (uses adapter services)
- [ ] Observables are properly managed (takeUntil or async pipe)

---

**Remember**: Start with atoms, build up to molecules, then organisms, templates, and finally pages. Reuse existing components whenever possible!

