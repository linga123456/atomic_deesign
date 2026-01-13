# Atomic Design Visual Guide
## Component Hierarchy and Relationships

This visual guide helps you understand how components relate to each other in Atomic Design.

---

## 📊 Component Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    PAGES                                 │
│  (Specific instances with real data)                     │
│  - DataGridPageComponent                                 │
│  - UserDetailPageComponent                               │
│  - SettingsPageComponent                                 │
└──────────────────┬──────────────────────────────────────┘
                   │ uses
                   ▼
┌─────────────────────────────────────────────────────────┐
│                  TEMPLATES                               │
│  (Page layouts without real content)                     │
│  - DashboardTemplateComponent                           │
│  - DetailTemplateComponent                               │
│  - ListTemplateComponent                                 │
└──────────────────┬──────────────────────────────────────┘
                   │ uses
                   ▼
┌─────────────────────────────────────────────────────────┐
│                  ORGANISMS                                │
│  (Complex components with business logic)                │
│  - DataTableOrganismComponent                            │
│  - StreamingGridOrganismComponent                        │
│  - HeaderOrganismComponent                               │
└──────────────────┬──────────────────────────────────────┘
                   │ uses
                   ▼
┌─────────────────────────────────────────────────────────┐
│                  MOLECULES                               │
│  (Simple combinations of atoms)                          │
│  - SearchFormMoleculeComponent                           │
│  - CardHeaderMoleculeComponent                           │
│  - FilterGroupMoleculeComponent                          │
└──────────────────┬──────────────────────────────────────┘
                   │ uses
                   ▼
┌─────────────────────────────────────────────────────────┐
│                    ATOMS                                  │
│  (Basic building blocks)                                 │
│  - ButtonAtomComponent                                   │
│  - InputAtomComponent                                    │
│  - LabelAtomComponent                                    │
│  - IconAtomComponent                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Real-World Example: Data Grid Page

```
DataGridPageComponent (PAGE)
    │
    ├──► DashboardTemplateComponent (TEMPLATE)
    │       │
    │       ├──► HeaderOrganismComponent (ORGANISM)
    │       │       │
    │       │       ├──► LogoAtomComponent (ATOM)
    │       │       ├──► NavigationMoleculeComponent (MOLECULE)
    │       │       │       ├──► IconAtomComponent (ATOM)
    │       │       │       └──► LabelAtomComponent (ATOM)
    │       │       └──► UserMenuMoleculeComponent (MOLECULE)
    │       │               ├──► AvatarAtomComponent (ATOM)
    │       │               └──► DropdownAtomComponent (ATOM)
    │       │
    │       └──► DataTableOrganismComponent (ORGANISM)
    │               │
    │               ├──► SearchFormMoleculeComponent (MOLECULE)
    │               │       ├──► InputAtomComponent (ATOM)
    │               │       └──► ButtonAtomComponent (ATOM)
    │               │
    │               ├──► FilterGroupMoleculeComponent (MOLECULE)
    │               │       ├──► LabelAtomComponent (ATOM)
    │               │       └──► SelectAtomComponent (ATOM)
    │               │
    │               └──► ag-Grid (Third-party, wrapped)
```

---

## 🎨 Component Composition Examples

### Example 1: Search Form Molecule

```
SearchFormMoleculeComponent (MOLECULE)
    │
    ├──► InputAtomComponent (ATOM)
    │       - type: "text"
    │       - placeholder: "Search..."
    │
    └──► ButtonAtomComponent (ATOM)
            - type: "primary"
            - text: "Search"
```

**Code:**
```html
<app-search-form-molecule>
  <app-input placeholder="Search..."></app-input>
  <app-button type="primary">Search</app-button>
</app-search-form-molecule>
```

### Example 2: Card Header Molecule

```
CardHeaderMoleculeComponent (MOLECULE)
    │
    ├──► IconAtomComponent (ATOM)
    │       - name: "user"
    │
    ├──► LabelAtomComponent (ATOM)
    │       - text: "User Profile"
    │
    └──► ButtonAtomComponent (ATOM)
            - type: "secondary"
            - text: "Edit"
```

### Example 3: Data Table Organism

```
DataTableOrganismComponent (ORGANISM)
    │
    ├──► SearchFormMoleculeComponent (MOLECULE)
    │       ├──► InputAtomComponent
    │       └──► ButtonAtomComponent
    │
    ├──► FilterGroupMoleculeComponent (MOLECULE)
    │       ├──► LabelAtomComponent
    │       └──► SelectAtomComponent
    │
    └──► ag-Grid (wrapped)
            - Uses GridAdapterService
```

---

## 📁 Folder Structure Visualization

```
src/app/
│
├── shared/                          # Shared across features
│   │
│   ├── atoms/                       # LEVEL 1: Basic blocks
│   │   ├── button/
│   │   │   ├── button.atom.ts      ◄─── ButtonAtomComponent
│   │   │   ├── button.atom.html
│   │   │   └── button.atom.scss
│   │   │
│   │   ├── input/
│   │   │   └── input.atom.ts       ◄─── InputAtomComponent
│   │   │
│   │   └── label/
│   │       └── label.atom.ts       ◄─── LabelAtomComponent
│   │
│   ├── molecules/                   # LEVEL 2: Simple groups
│   │   ├── search-form/
│   │   │   └── search-form.molecule.ts  ◄─── Uses: Input + Button
│   │   │
│   │   └── card-header/
│   │       └── card-header.molecule.ts  ◄─── Uses: Icon + Label + Button
│   │
│   ├── organisms/                   # LEVEL 3: Complex components
│   │   ├── data-table/
│   │   │   └── data-table.organism.ts   ◄─── Uses: SearchForm + FilterGroup + Grid
│   │   │
│   │   └── header/
│   │       └── header.organism.ts      ◄─── Uses: Logo + Navigation + UserMenu
│   │
│   └── templates/                   # LEVEL 4: Page layouts
│       ├── dashboard/
│       │   └── dashboard.template.ts   ◄─── Uses: Header + Sidebar + Main
│       │
│       └── detail/
│           └── detail.template.ts       ◄─── Uses: Header + Content + Actions
│
└── features/                        # Feature-specific
    │
    └── data-grid/
        │
        ├── pages/                   # LEVEL 5: Specific pages
        │   └── data-grid-page.component.ts  ◄─── Uses: DashboardTemplate + DataTable
        │
        └── organisms/               # Feature-specific organisms
            └── streaming-grid/
                └── streaming-grid.organism.ts  ◄─── Uses: CardHeader + Grid + Status
```

---

## 🔀 Data Flow Example

### Streaming Grid Page Flow

```
┌─────────────────────────────────────────────────────────────┐
│  StreamingGridPageComponent (PAGE)                          │
│  - Contains business logic                                   │
│  - Connects to services                                      │
│  - Manages page-level state                                  │
└──────────────┬───────────────────────────────────────────────┘
               │
               │ provides data & config
               ▼
┌─────────────────────────────────────────────────────────────┐
│  StreamingGridOrganismComponent (ORGANISM)                   │
│  - Handles streaming logic                                   │
│  - Manages grid state                                        │
│  - Uses StreamingService                                     │
└──────────────┬───────────────────────────────────────────────┘
               │
               │ uses
               ▼
┌─────────────────────────────────────────────────────────────┐
│  CardHeaderMoleculeComponent (MOLECULE)                      │
│  - Displays title and status                                 │
│  - Shows action button                                       │
└──────────────┬───────────────────────────────────────────────┘
               │
               │ uses
               ▼
┌─────────────────────────────────────────────────────────────┐
│  LabelAtomComponent (ATOM)                                  │
│  ButtonAtomComponent (ATOM)                                  │
│  IconAtomComponent (ATOM)                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Decision Flowchart

```
                    Start: Need a new component?
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Is it a basic UI    │
                    │ element?            │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              YES   │                     │ NO
                    ▼                     ▼
            ┌──────────────┐    ┌──────────────────┐
            │ Create ATOM  │    │ Does it combine  │
            │              │    │ 2-5 atoms?       │
            │ - Button     │    └────────┬─────────┘
            │ - Input      │             │
            │ - Label      │    ┌────────┴─────────┐
            └──────────────┘    │                  │
                         YES    │                  │ NO
                                ▼                  ▼
                        ┌──────────────┐  ┌──────────────────┐
                        │ Create       │  │ Is it complex &  │
                        │ MOLECULE     │  │ feature-specific?│
                        │              │  └────────┬─────────┘
                        │ - SearchForm │          │
                        │ - CardHeader │  ┌───────┴────────┐
                        └──────────────┘  │                │
                                   YES    │                │ NO
                                          ▼                ▼
                                  ┌──────────────┐  ┌──────────────┐
                                  │ Create       │  │ Does it      │
                                  │ ORGANISM     │  │ define page  │
                                  │              │  │ layout?      │
                                  │ - DataTable  │  └──────┬───────┘
                                  │ - Header    │         │
                                  └──────────────┘  ┌──────┴───────┐
                                                    │              │
                                             YES    │              │ NO
                                                    ▼              ▼
                                            ┌──────────────┐  ┌──────────────┐
                                            │ Create       │  │ Create       │
                                            │ TEMPLATE      │  │ PAGE         │
                                            │              │  │              │
                                            │ - Dashboard  │  │ - DataGrid   │
                                            │ - Detail     │  │ - UserDetail  │
                                            └──────────────┘  └──────────────┘
```

---

## 📋 Component Relationship Matrix

| Component Level | Can Use | Cannot Use | Example |
|----------------|---------|-----------|---------|
| **Atom** | Nothing (standalone) | Other components | Button, Input |
| **Molecule** | Atoms | Other molecules, organisms | SearchForm (Input + Button) |
| **Organism** | Atoms, Molecules | Other organisms, templates | DataTable (SearchForm + Grid) |
| **Template** | Organisms, Molecules, Atoms | Other templates, pages | Dashboard (Header + Sidebar) |
| **Page** | Templates, Organisms, Molecules, Atoms | Other pages | DataGridPage (Dashboard + DataTable) |

---

## 🎨 Visual Component Tree

### Complete Example: Dashboard with Data Table

```
app-dashboard-page (PAGE)
│
├── app-dashboard-template (TEMPLATE)
│   │
│   ├── app-header-organism (ORGANISM)
│   │   │
│   │   ├── app-logo-atom (ATOM)
│   │   │
│   │   ├── app-navigation-molecule (MOLECULE)
│   │   │   ├── app-icon-atom (ATOM)
│   │   │   └── app-label-atom (ATOM)
│   │   │
│   │   └── app-user-menu-molecule (MOLECULE)
│   │       ├── app-avatar-atom (ATOM)
│   │       └── app-dropdown-atom (ATOM)
│   │
│   ├── app-sidebar-organism (ORGANISM)
│   │   └── app-nav-item-molecule (MOLECULE) × N
│   │       ├── app-icon-atom (ATOM)
│   │       └── app-label-atom (ATOM)
│   │
│   └── app-data-table-organism (ORGANISM)
│       │
│       ├── app-search-form-molecule (MOLECULE)
│       │   ├── app-input-atom (ATOM)
│       │   └── app-button-atom (ATOM)
│       │
│       ├── app-filter-group-molecule (MOLECULE)
│       │   ├── app-label-atom (ATOM)
│       │   └── app-select-atom (ATOM)
│       │
│       └── ag-grid-angular (Third-party, wrapped)
```

---

## 💡 Key Takeaways

1. **Atoms** are the foundation - build them first
2. **Molecules** combine atoms for simple functionality
3. **Organisms** are complex, feature-specific components
4. **Templates** define page structure
5. **Pages** are specific instances with real data
6. **Always build up** - never skip levels unnecessarily
7. **Reuse** - don't duplicate components
8. **Test** - test atoms in isolation, build up

---

## 🔍 Quick Reference

| Need | Create | Uses |
|------|--------|------|
| Basic UI element | **Atom** | Nothing |
| Search form | **Molecule** | Input + Button atoms |
| Data table | **Organism** | SearchForm + FilterGroup molecules + Grid |
| Page layout | **Template** | Header + Sidebar organisms |
| Specific page | **Page** | Template + Organisms |

---

**Remember**: Start with atoms, build up to molecules, then organisms, templates, and finally pages!


