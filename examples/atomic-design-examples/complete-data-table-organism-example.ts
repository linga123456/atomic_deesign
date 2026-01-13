/**
 * ============================================================================
 * COMPLETE DATA TABLE ORGANISM EXAMPLE
 * ============================================================================
 * 
 * This is a complete example of a Data Table Organism component.
 * An Organism combines molecules and atoms to create complex, feature-rich components.
 * 
 * WHAT IS AN ORGANISM?
 * - Combines multiple molecules and atoms
 * - Contains business logic
 * - Often feature-specific
 * - Can be quite complex
 * - Interacts with services
 * 
 * COMPOSITION:
 * This organism is made of:
 * - SearchFormMoleculeComponent (for searching)
 * - FilterGroupMoleculeComponent (for filtering)
 * - ag-Grid (third-party, wrapped via adapter)
 * - ButtonAtomComponent (for actions)
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Basic data table:
 *    <app-data-table-organism
 *      [data]="data$ | async"
 *      [config]="{ columns: columnDefs }"
 *      (rowSelected)="onRowSelected($event)">
 *    </app-data-table-organism>
 * 
 * 2. With search and filters:
 *    <app-data-table-organism
 *      [data]="data"
 *      [config]="{
 *        columns: columnDefs,
 *        enableSearch: true,
 *        enableFilters: true
 *      }"
 *      [loading]="isLoading"
 *      (searchChanged)="onSearch($event)"
 *      (filterChanged)="onFilter($event)">
 *    </app-data-table-organism>
 * 
 * 3. With initial search/filter values:
 *    <app-data-table-organism
 *      [data]="data"
 *      [config]="tableConfig"
 *      [initialSearch]="savedSearch"
 *      [initialFilter]="savedFilter"
 *      (rowSelected)="handleSelection($event)">
 *    </app-data-table-organism>
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { GridAdapterService } from '../../../core/services/grid-adapter.service';

/**
 * Configuration interface for the data table
 */
export interface TableConfig {
  /** Column definitions for ag-Grid */
  columns: ColDef[];
  /** Enable search functionality */
  enableSearch?: boolean;
  /** Enable filter functionality */
  enableFilters?: boolean;
  /** Enable pagination (future feature) */
  enablePagination?: boolean;
  /** Page size if pagination enabled */
  pageSize?: number;
}

/**
 * DataTableOrganismComponent - Complex table component
 * 
 * This component is an ORGANISM because:
 * 1. It combines SearchFormMolecule, FilterGroupMolecule, and ag-Grid
 * 2. It contains business logic (search, filter, selection)
 * 3. It interacts with GridAdapterService
 * 4. It manages complex state (grid API, forms, selections)
 * 5. It's feature-rich and reusable
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
   * Array of row objects
   */
  @Input() data: any[] = [];

  /**
   * Table configuration
   * Defines columns, enabled features, etc.
   */
  @Input() config: TableConfig = { columns: [] };

  /**
   * Loading state
   * Shows loading overlay when true
   */
  @Input() loading: boolean = false;

  /**
   * Initial search value
   * Pre-fills search form if provided
   */
  @Input() initialSearch?: string;

  /**
   * Initial filter value
   * Pre-fills filter form if provided
   */
  @Input() initialFilter?: any;

  /**
   * Emitted when rows are selected
   * Emits array of selected row data
   */
  @Output() rowSelected = new EventEmitter<any[]>();

  /**
   * Emitted when a row is clicked
   * Emits the clicked row data
   */
  @Output() rowClicked = new EventEmitter<any>();

  /**
   * Emitted when search query changes
   * Emits the search query string
   */
  @Output() searchChanged = new EventEmitter<string>();

  /**
   * Emitted when filter value changes
   * Emits the filter value
   */
  @Output() filterChanged = new EventEmitter<any>();

  /**
   * Emitted when export is requested
   */
  @Output() exportRequested = new EventEmitter<void>();

  /**
   * ag-Grid API instance
   * Used to interact with grid programmatically
   */
  private gridApi?: GridApi;

  /**
   * Subject for managing component lifecycle
   */
  private destroy$ = new Subject<void>();

  /**
   * Search form group
   * Manages search input state
   */
  searchForm: FormGroup;

  /**
   * Filter form group
   * Manages filter selection state
   */
  filterForm: FormGroup;

  /**
   * Constructor - Initializes forms and injects services
   */
  constructor(
    private fb: FormBuilder,
    private gridAdapter: GridAdapterService // Adapter service for ag-Grid (migration-friendly)
  ) {
    // Initialize reactive forms
    this.searchForm = this.fb.group({ query: [''] });
    this.filterForm = this.fb.group({ filter: [''] });
  }

  /**
   * Lifecycle hook - Sets up form subscriptions
   */
  ngOnInit(): void {
    // Set initial values if provided
    if (this.initialSearch) {
      this.searchForm.patchValue({ query: this.initialSearch });
    }
    if (this.initialFilter) {
      this.filterForm.patchValue({ filter: this.initialFilter });
    }

    // Subscribe to search form changes with debounce
    // Emits searchChanged event when user types (after debounce)
    this.searchForm.get('query')?.valueChanges.pipe(
      debounceTime(300),              // Wait 300ms after user stops typing
      distinctUntilChanged(),         // Only emit if value changed
      takeUntil(this.destroy$)        // Unsubscribe on destroy
    ).subscribe(query => {
      this.searchChanged.emit(query);
    });

    // Subscribe to filter form changes
    // Emits filterChanged event immediately when filter changes
    this.filterForm.get('filter')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(filter => {
      this.filterChanged.emit(filter);
    });
  }

  /**
   * Lifecycle hook - Cleans up subscriptions
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Called when ag-Grid is ready
   * Stores grid API reference and applies default options
   */
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    
    // Apply default grid options via adapter service
    // This abstracts ag-Grid version-specific APIs (migration-friendly)
    const defaultOptions = this.gridAdapter.getDefaultGridOptions();
    params.api.updateGridOptions(defaultOptions);
  }

  /**
   * Called when row selection changes
   * Gets selected rows via adapter and emits to parent
   */
  onSelectionChanged(event: any): void {
    // Use adapter service to get selection (migration-friendly)
    const selection = this.gridAdapter.getSelection(event.api);
    this.rowSelected.emit(selection.selectedRows);
  }

  /**
   * Called when a row is clicked
   * Emits the clicked row data to parent
   */
  onRowClicked(event: any): void {
    this.rowClicked.emit(event.data);
  }

  /**
   * Handles clear search action
   * Resets search form
   */
  onClearSearch(): void {
    this.searchForm.reset();
  }

  /**
   * Handles export action
   * Exports grid data to CSV via adapter service
   */
  onExport(): void {
    if (this.gridApi) {
      // Use adapter service for export (migration-friendly)
      this.gridAdapter.exportToCsv(this.gridApi, 'table-export');
      this.exportRequested.emit();
    }
  }

  /**
   * Refreshes the grid
   * Updates grid cells via adapter service
   */
  refreshGrid(): void {
    if (this.gridApi) {
      this.gridAdapter.refreshData(this.gridApi);
    }
  }

  /**
   * Computed property: Grid options for ag-Grid
   * Combines column definitions, row data, and event handlers
   */
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


