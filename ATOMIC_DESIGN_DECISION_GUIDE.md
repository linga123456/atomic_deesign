# Atomic Design Decision Guide
## When to Use Atom vs Molecule vs Organism

This guide helps you decide which Atomic Design level to use for your components.

---

## Quick Decision Tree

```
Is it a basic UI element that can't be broken down?
  YES → ATOM
  NO ↓
  
Does it combine 2-5 atoms for a single purpose?
  YES → MOLECULE
  NO ↓
  
Is it a complex component with business logic?
  YES → ORGANISM
```

---

## Atoms

### Definition
**Atoms are the smallest reusable components.** They cannot be broken down further and have no dependencies on other custom components.

### Characteristics
- ✅ Single, indivisible UI element
- ✅ No dependencies on other custom components
- ✅ Highly reusable
- ✅ No business logic
- ✅ Can have simple props/inputs

### Examples
- Button
- Input
- Label
- Icon
- Badge
- Checkbox

### When to Create an Atom
- You need a basic UI element
- It's a single, indivisible component
- It will be reused across the application
- It has no dependencies on other custom components

### ❌ Common Mistake: Creating a Molecule for a Single Atom

**BAD Example:**
```typescript
// ❌ DON'T: Creating a molecule for just one atom
@Component({
  selector: 'app-tie-breaker-button-molecule',  // ❌ Molecule
  template: `
    <app-button text="Set Tie-Breaker"></app-button>  // Just one atom!
  `
})
export class TieBreakerButtonMoleculeComponent {}
```

**GOOD Example:**
```typescript
// ✅ DO: Use the atom directly
<app-button 
  text="Set Tie-Breaker"
  icon="settings"
  (clicked)="openDialog()">
</app-button>
```

---

## Molecules

### Definition
**Molecules combine 2-5 atoms** to create a functional unit with a single, clear purpose.

### Characteristics
- ✅ Combines 2-5 atoms
- ✅ Has a single, clear purpose
- ✅ May have simple state
- ✅ Reusable across different contexts
- ✅ Still relatively simple

### Examples
- SearchForm = InputAtom + ButtonAtom
- CardHeader = LabelAtom + IconAtom + ButtonAtom
- FilterGroup = LabelAtom + SelectAtom
- NavigationItem = IconAtom + LabelAtom

### When to Create a Molecule
- You need to combine 2-5 atoms
- They work together for a single purpose
- The combination will be reused
- It's still relatively simple

### ✅ Good Molecule Example

```typescript
// ✅ GOOD: Combines multiple atoms
@Component({
  selector: 'app-search-form-molecule',
  template: `
    <app-input placeholder="Search..."></app-input>  <!-- Atom 1 -->
    <app-button text="Search"></app-button>            <!-- Atom 2 -->
  `
})
export class SearchFormMoleculeComponent {}
```

---

## Organisms

### Definition
**Organisms combine molecules and atoms** to create complex, feature-rich components that may contain business logic.

### Characteristics
- ✅ Combines multiple molecules and atoms
- ✅ May contain business logic
- ✅ Often feature-specific
- ✅ Can be quite complex
- ✅ May interact with services

### Examples
- DataTable = SearchFormMolecule + FilterGroupMolecule + ag-Grid
- Header = LogoAtom + NavigationMolecule + UserMenuMolecule
- TieBreakerDialog = DialogHeaderMolecule + ag-Grid + DialogActionsMolecule

### When to Create an Organism
- You need a complex, feature-rich component
- It combines multiple molecules
- It contains business logic
- It interacts with services
- It's feature-specific

---

## Decision Examples

### Example 1: Tie-Breaker Button

**Question**: Should TieBreakerButton be an Atom or Molecule?

**Analysis**:
- It's just a ButtonAtom with specific props (text, icon, type)
- No combination of multiple atoms
- Just one atom with predefined values

**Decision**: ✅ **Use ButtonAtom directly** (not a Molecule)

```html
<!-- ✅ CORRECT: Use atom directly -->
<app-button 
  type="secondary"
  size="small"
  text="Set tie-breaker ordering"
  icon="settings"
  (clicked)="openDialog()">
</app-button>
```

---

### Example 2: Search Form

**Question**: Should SearchForm be an Atom or Molecule?

**Analysis**:
- Combines InputAtom + ButtonAtom (2 atoms)
- Has a single purpose: search functionality
- Works together as a unit

**Decision**: ✅ **Molecule**

```typescript
// ✅ CORRECT: Molecule (combines 2 atoms)
@Component({
  selector: 'app-search-form-molecule',
  template: `
    <app-input></app-input>      <!-- Atom 1 -->
    <app-button></app-button>    <!-- Atom 2 -->
  `
})
export class SearchFormMoleculeComponent {}
```

---

### Example 3: Data Table

**Question**: Should DataTable be a Molecule or Organism?

**Analysis**:
- Combines SearchFormMolecule + FilterGroupMolecule + ag-Grid
- Contains business logic (sorting, filtering, selection)
- Interacts with services
- Complex component

**Decision**: ✅ **Organism**

```typescript
// ✅ CORRECT: Organism (combines molecules + business logic)
@Component({
  selector: 'app-data-table-organism',
  template: `
    <app-search-form-molecule></app-search-form-molecule>  <!-- Molecule 1 -->
    <app-filter-group-molecule></app-filter-group-molecule> <!-- Molecule 2 -->
    <ag-grid-angular></ag-grid-angular>                     <!-- Third-party -->
  `
})
export class DataTableOrganismComponent {
  // Business logic here
}
```

---

## Rules of Thumb

### Atom Rules
- ✅ Single UI element
- ✅ No custom component dependencies
- ✅ Highly reusable
- ✅ No business logic

### Molecule Rules
- ✅ Combines 2-5 atoms
- ✅ Single purpose
- ✅ Simple state (if any)
- ✅ No business logic

### Organism Rules
- ✅ Combines molecules + atoms
- ✅ May have business logic
- ✅ Interacts with services
- ✅ Feature-specific

---

## Common Mistakes

### ❌ Mistake 1: Molecule for Single Atom
```typescript
// ❌ BAD
@Component({
  selector: 'app-save-button-molecule',  // Just wraps ButtonAtom
  template: `<app-button text="Save"></app-button>`
})
```

**Fix**: Use ButtonAtom directly

### ❌ Mistake 2: Atom with Business Logic
```typescript
// ❌ BAD
@Component({
  selector: 'app-user-button-atom',
  template: `<app-button></app-button>`
})
export class UserButtonAtomComponent {
  constructor(private userService: UserService) {}  // ❌ Business logic in atom
}
```

**Fix**: Move to Organism or use service in parent

### ❌ Mistake 3: Organism Too Simple
```typescript
// ❌ BAD: Too simple for organism
@Component({
  selector: 'app-simple-form-organism',  // Should be molecule
  template: `
    <app-input></app-input>
    <app-button></app-button>
  `
})
```

**Fix**: Make it a Molecule

---

## Checklist

### Before Creating a Component, Ask:

1. **Is it a basic UI element?** → Atom
2. **Does it combine 2-5 atoms?** → Molecule
3. **Is it complex with business logic?** → Organism
4. **Does it interact with services?** → Organism
5. **Is it feature-specific?** → Organism

---

## Summary

| If you have... | Then create... |
|----------------|----------------|
| Single UI element | **Atom** |
| 2-5 atoms working together | **Molecule** |
| Molecules + business logic | **Organism** |
| Just one atom with props | **Use Atom directly** (don't create wrapper) |

---

**Remember**: Don't create a Molecule just to wrap a single Atom. Use the Atom directly!

