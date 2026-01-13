/**
 * ============================================================================
 * USAGE EXAMPLES - HOW TO USE ATOMIC DESIGN COMPONENTS
 * ============================================================================
 * 
 * This file shows real-world examples of how to use Atomic Design components
 * together to build complete features.
 * 
 * These examples demonstrate:
 * 1. How atoms are used in molecules
 * 2. How molecules are used in organisms
 * 3. How organisms are used in pages
 * 4. How to compose components together
 */

// ============================================================================
// EXAMPLE 1: Using Button Atom in a Simple Component
// ============================================================================

import { Component } from '@angular/core';

@Component({
  selector: 'app-simple-example',
  template: `
    <!-- Basic button usage -->
    <app-button (clicked)="handleClick()">
      Click Me
    </app-button>
    
    <!-- Button with different types -->
    <app-button type="primary" (clicked)="save()">Save</app-button>
    <app-button type="danger" (clicked)="delete()">Delete</app-button>
    <app-button type="secondary" (clicked)="cancel()">Cancel</app-button>
    
    <!-- Button with icon -->
    <app-button type="primary" icon="fa fa-search" (clicked)="search()">
      Search
    </app-button>
    
    <!-- Loading button -->
    <app-button [loading]="isSaving" (clicked)="save()">
      Save Changes
    </app-button>
    
    <!-- Disabled button -->
    <app-button [disabled]="!isValid" (clicked)="submit()">
      Submit
    </app-button>
    
    <!-- Full width button -->
    <app-button [fullWidth]="true" type="primary" (clicked)="submit()">
      Submit Form
    </app-button>
  `
})
export class SimpleExampleComponent {
  isSaving = false;
  isValid = true;
  
  handleClick() {
    console.log('Button clicked!');
  }
  
  save() {
    this.isSaving = true;
    // Simulate async operation
    setTimeout(() => {
      this.isSaving = false;
    }, 2000);
  }
  
  delete() {
    console.log('Delete clicked');
  }
  
  cancel() {
    console.log('Cancel clicked');
  }
  
  search() {
    console.log('Search clicked');
  }
  
  submit() {
    console.log('Submit clicked');
  }
}

// ============================================================================
// EXAMPLE 2: Using Search Form Molecule in a Component
// ============================================================================

import { Component } from '@angular/core';

@Component({
  selector: 'app-search-example',
  template: `
    <!-- Basic search form -->
    <app-search-form-molecule
      (search)="onSearch($event)"
      (clear)="onClear()">
    </app-search-form-molecule>
    
    <!-- Search form with custom placeholder -->
    <app-search-form-molecule
      placeholder="Search users by name..."
      buttonText="Find Users"
      (search)="searchUsers($event)">
    </app-search-form-molecule>
    
    <!-- Search form with initial value -->
    <app-search-form-molecule
      [initialValue]="savedSearchQuery"
      (search)="onSearch($event)"
      (valueChange)="onSearchValueChange($event)">
    </app-search-form-molecule>
    
    <!-- Display search results -->
    <div *ngIf="searchResults.length > 0">
      <h3>Search Results:</h3>
      <ul>
        <li *ngFor="let result of searchResults">{{ result.name }}</li>
      </ul>
    </div>
  `
})
export class SearchExampleComponent {
  savedSearchQuery = 'John';
  searchResults: any[] = [];
  
  onSearch(query: string) {
    console.log('Searching for:', query);
    // Perform search logic
    this.searchResults = [
      { name: 'John Doe' },
      { name: 'John Smith' }
    ];
  }
  
  onClear() {
    console.log('Search cleared');
    this.searchResults = [];
  }
  
  searchUsers(query: string) {
    console.log('Searching users:', query);
  }
  
  onSearchValueChange(query: string) {
    console.log('Search value changed:', query);
    // Real-time search as user types
  }
}

// ============================================================================
// EXAMPLE 3: Using Data Table Organism in a Page Component
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ColDef } from 'ag-grid-community';
import { GridAdapterService } from '../../../core/services/grid-adapter.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-data-grid-page',
  template: `
    <app-dashboard-template>
      <!-- 
        Data Table Organism: Complete table with search, filters, and grid
        This organism combines multiple molecules and atoms
      -->
      <app-data-table-organism
        [data]="data$ | async"
        [config]="tableConfig"
        [loading]="loading"
        [initialSearch]="savedSearch"
        [initialFilter]="savedFilter"
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
  savedFilter = null;
  
  // Column definitions for ag-Grid
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'status', headerName: 'Status', width: 150 }
  ];
  
  // Table configuration
  tableConfig = {
    columns: this.columnDefs,
    enableSearch: true,
    enableFilters: true,
    enablePagination: false
  };
  
  constructor(
    private dataService: DataService,
    private gridAdapter: GridAdapterService
  ) {
    this.data$ = this.dataService.getData();
  }
  
  ngOnInit(): void {
    // Load initial data
    this.loadData();
  }
  
  loadData(): void {
    this.loading = true;
    this.data$ = this.dataService.getData();
    // Simulate loading
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  
  onSearch(query: string): void {
    console.log('Search query:', query);
    this.savedSearch = query;
    // Filter data based on search
    this.data$ = this.dataService.search(query);
  }
  
  onFilter(filter: any): void {
    console.log('Filter value:', filter);
    this.savedFilter = filter;
    // Filter data based on filter
    this.data$ = this.dataService.filter(filter);
  }
  
  onRowSelected(rows: any[]): void {
    console.log('Selected rows:', rows);
    // Handle row selection
  }
  
  onRowClicked(row: any): void {
    console.log('Row clicked:', row);
    // Navigate to detail page, show modal, etc.
  }
}

// ============================================================================
// EXAMPLE 4: Building a Complete Feature with All Levels
// ============================================================================

/**
 * This example shows how all Atomic Design levels work together:
 * 
 * Page (DataGridPageComponent)
 *   └── Template (DashboardTemplateComponent)
 *       └── Organism (DataTableOrganismComponent)
 *           ├── Molecule (SearchFormMoleculeComponent)
 *           │   ├── Atom (InputAtomComponent)
 *           │   └── Atom (ButtonAtomComponent)
 *           ├── Molecule (FilterGroupMoleculeComponent)
 *           │   ├── Atom (LabelAtomComponent)
 *           │   └── Atom (SelectAtomComponent)
 *           └── ag-Grid (Third-party, wrapped)
 */

@Component({
  selector: 'app-complete-feature-example',
  template: `
    <!-- 
      PAGE LEVEL: Specific page with real data
      Uses template for layout
    -->
    <app-dashboard-template>
      
      <!-- 
        ORGANISM LEVEL: Complex component with business logic
        Combines multiple molecules and atoms
      -->
      <app-data-table-organism
        [data]="tableData"
        [config]="tableConfig"
        [loading]="isLoading"
        (rowSelected)="handleSelection($event)"
        (searchChanged)="handleSearch($event)"
        (filterChanged)="handleFilter($event)">
      </app-data-table-organism>
      
      <!-- 
        Additional organisms can be added here
        Each organism is self-contained and reusable
      -->
      <app-chart-organism
        [data]="chartData"
        (dataPointClicked)="handleChartClick($event)">
      </app-chart-organism>
      
    </app-dashboard-template>
  `
})
export class CompleteFeatureExampleComponent {
  tableData: any[] = [];
  chartData: any[] = [];
  isLoading = false;
  
  tableConfig = {
    columns: [
      { field: 'id', headerName: 'ID' },
      { field: 'name', headerName: 'Name' }
    ],
    enableSearch: true,
    enableFilters: true
  };
  
  handleSelection(rows: any[]): void {
    console.log('Rows selected:', rows);
  }
  
  handleSearch(query: string): void {
    console.log('Search:', query);
  }
  
  handleFilter(filter: any): void {
    console.log('Filter:', filter);
  }
  
  handleChartClick(point: any): void {
    console.log('Chart point clicked:', point);
  }
}

// ============================================================================
// EXAMPLE 5: Creating Custom Molecules from Atoms
// ============================================================================

/**
 * This example shows how to create a new molecule by combining atoms
 */

@Component({
  selector: 'app-custom-molecule-example',
  template: `
    <!-- 
      Custom Card Molecule: Combines Label, Icon, and Button atoms
      This is a MOLECULE because it combines multiple atoms
    -->
    <div class="card-molecule">
      <!-- Label Atom: Card title -->
      <app-label size="large">{{ title }}</app-label>
      
      <!-- Icon Atom: Status indicator -->
      <app-icon [name]="icon" [class]="iconClass"></app-icon>
      
      <!-- Button Atom: Action button -->
      <app-button
        type="primary"
        size="small"
        (clicked)="onAction()">
        {{ actionText }}
      </app-button>
    </div>
  `
})
export class CustomMoleculeExampleComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() iconClass: string = '';
  @Input() actionText: string = 'Action';
  @Output() action = new EventEmitter<void>();
  
  onAction(): void {
    this.action.emit();
  }
}


