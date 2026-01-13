/**
 * Data Table Organism Component
 * 
 * Complex component combining multiple molecules and atoms:
 * - Search Form Molecule
 * - Filter Group Molecule
 * - ag-Grid
 * - Pagination (if needed)
 * 
 * This organism handles business logic and coordinates between molecules.
 * 
 * @example
 * ```html
 * <app-data-table-organism
 *   [data]="data$ | async"
 *   [config]="tableConfig"
 *   [loading]="loading"
 *   (rowSelected)="onRowSelected($event)"
 *   (searchChanged)="onSearch($event)">
 * </app-data-table-organism>
 * ```
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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
  pageSize?: number;
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
  @Input() initialSearch?: string;
  @Input() initialFilter?: any;
  
  @Output() rowSelected = new EventEmitter<any[]>();
  @Output() rowClicked = new EventEmitter<any>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() filterChanged = new EventEmitter<any>();
  @Output() exportRequested = new EventEmitter<void>();
  
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
    // Set initial values
    if (this.initialSearch) {
      this.searchForm.patchValue({ query: this.initialSearch });
    }
    if (this.initialFilter) {
      this.filterForm.patchValue({ filter: this.initialFilter });
    }
    
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
  
  onExport(): void {
    if (this.gridApi) {
      this.gridAdapter.exportToCsv(this.gridApi, 'table-export');
      this.exportRequested.emit();
    }
  }
  
  refreshGrid(): void {
    if (this.gridApi) {
      this.gridAdapter.refreshData(this.gridApi);
    }
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


