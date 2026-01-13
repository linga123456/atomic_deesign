/**
 * Example: Migration-Friendly ag-Grid Adapter Service
 * 
 * This service abstracts ag-grid version-specific APIs, making it easier to:
 * 1. Migrate to newer ag-grid versions
 * 2. Update grid behavior in one place
 * 3. Test grid logic without actual grid instance
 */

import { Injectable } from '@angular/core';
import { GridApi, ColumnApi, GridOptions, ColDef, RowNode, SelectionChangedEvent } from 'ag-grid-community';

export interface GridSelection {
  selectedRows: any[];
  selectedNodes: RowNode[];
  selectedCount: number;
}

export interface GridFilter {
  column: string;
  filterType: string;
  filterValue: any;
}

@Injectable({ providedIn: 'root' })
export class GridAdapterService {
  
  /**
   * Get default grid options compatible with ag-grid 24
   * When migrating, update only this method
   */
  getDefaultGridOptions(): GridOptions {
    return {
      // Use features compatible with ag-grid 24+
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        floatingFilter: true,
        enableRowGroup: false,
        enablePivot: false,
        enableValue: false
      },
      rowSelection: 'multiple',
      animateRows: true,
      enableRangeSelection: true,
      suppressRowClickSelection: false,
      // Use modern ag-grid features that work in 24+
      sideBar: {
        toolPanels: ['columns', 'filters'],
        defaultToolPanel: 'columns'
      },
      // Performance optimizations
      rowBuffer: 10,
      debounceVerticalScrollbar: true,
      suppressScrollOnNewData: false
    };
  }
  
  /**
   * Get selected rows from grid API
   * Abstracts version-specific selection API
   */
  getSelectedRows(gridApi: GridApi): any[] {
    if (!gridApi) {
      return [];
    }
    
    // ag-grid 24+ compatible
    return gridApi.getSelectedRows();
  }
  
  /**
   * Get selected nodes from grid API
   */
  getSelectedNodes(gridApi: GridApi): RowNode[] {
    if (!gridApi) {
      return [];
    }
    
    return gridApi.getSelectedNodes();
  }
  
  /**
   * Get comprehensive selection information
   */
  getSelection(gridApi: GridApi): GridSelection {
    const selectedRows = this.getSelectedRows(gridApi);
    const selectedNodes = this.getSelectedNodes(gridApi);
    
    return {
      selectedRows,
      selectedNodes,
      selectedCount: selectedRows.length
    };
  }
  
  /**
   * Select all rows
   */
  selectAll(gridApi: GridApi): void {
    if (!gridApi) {
      return;
    }
    
    gridApi.selectAll();
  }
  
  /**
   * Deselect all rows
   */
  deselectAll(gridApi: GridApi): void {
    if (!gridApi) {
      return;
    }
    
    gridApi.deselectAll();
  }
  
  /**
   * Select rows by condition
   */
  selectRowsByCondition(
    gridApi: GridApi,
    condition: (row: any) => boolean
  ): void {
    if (!gridApi) {
      return;
    }
    
    gridApi.forEachNode(node => {
      if (condition(node.data)) {
        node.setSelected(true);
      }
    });
  }
  
  /**
   * Apply filter to grid
   * Abstracts filter API differences
   */
  applyFilter(gridApi: GridApi, filter: GridFilter): void {
    if (!gridApi) {
      return;
    }
    
    const filterModel = {
      [filter.column]: {
        filterType: filter.filterType,
        type: 'equals', // or 'contains', 'startsWith', etc.
        filter: filter.filterValue
      }
    };
    
    gridApi.setFilterModel(filterModel);
  }
  
  /**
   * Clear all filters
   */
  clearFilters(gridApi: GridApi): void {
    if (!gridApi) {
      return;
    }
    
    gridApi.setFilterModel(null);
  }
  
  /**
   * Refresh grid data
   */
  refreshData(gridApi: GridApi): void {
    if (!gridApi) {
      return;
    }
    
    // Refresh cells
    gridApi.refreshCells();
    
    // Or refresh entire view
    // gridApi.refreshInfiniteCache();
  }
  
  /**
   * Update row data
   * Use this instead of direct rowData assignment
   */
  updateRowData(gridApi: GridApi, newData: any[]): void {
    if (!gridApi) {
      return;
    }
    
    // For ag-grid 24+, use transaction update for better performance
    gridApi.setRowData(newData);
    
    // Or for large updates, use transaction:
    // gridApi.applyTransaction({ add: newData });
  }
  
  /**
   * Add rows to existing data
   */
  addRows(gridApi: GridApi, newRows: any[]): void {
    if (!gridApi) {
      return;
    }
    
    gridApi.applyTransaction({ add: newRows });
  }
  
  /**
   * Update specific rows
   */
  updateRows(gridApi: GridApi, updatedRows: any[]): void {
    if (!gridApi) {
      return;
    }
    
    gridApi.applyTransaction({ update: updatedRows });
  }
  
  /**
   * Remove rows
   */
  removeRows(gridApi: GridApi, rowsToRemove: any[]): void {
    if (!gridApi) {
      return;
    }
    
    gridApi.applyTransaction({ remove: rowsToRemove });
  }
  
  /**
   * Export grid data to CSV
   */
  exportToCsv(gridApi: GridApi, fileName?: string): void {
    if (!gridApi) {
      return;
    }
    
    const params = {
      fileName: fileName || 'grid-export',
      onlySelected: false
    };
    
    gridApi.exportDataAsCsv(params);
  }
  
  /**
   * Export selected rows to CSV
   */
  exportSelectedToCsv(gridApi: GridApi, fileName?: string): void {
    if (!gridApi) {
      return;
    }
    
    const params = {
      fileName: fileName || 'grid-selected-export',
      onlySelected: true
    };
    
    gridApi.exportDataAsCsv(params);
  }
  
  /**
   * Get visible row count
   */
  getVisibleRowCount(gridApi: GridApi): number {
    if (!gridApi) {
      return 0;
    }
    
    return gridApi.getDisplayedRowCount();
  }
  
  /**
   * Scroll to specific row
   */
  scrollToRow(gridApi: GridApi, rowIndex: number): void {
    if (!gridApi) {
      return;
    }
    
    gridApi.ensureIndexVisible(rowIndex, 'middle');
  }
  
  /**
   * Get column definitions with defaults applied
   */
  applyColumnDefaults(columnDefs: ColDef[]): ColDef[] {
    const defaultColDef = this.getDefaultGridOptions().defaultColDef;
    
    return columnDefs.map(colDef => ({
      ...defaultColDef,
      ...colDef
    }));
  }
  
  /**
   * Create column definition with type safety
   */
  createColumnDef(
    field: string,
    headerName: string,
    options?: Partial<ColDef>
  ): ColDef {
    return {
      field,
      headerName,
      ...options
    };
  }
  
  /**
   * Handle selection changed event
   * Normalizes event data for easier consumption
   */
  handleSelectionChanged(event: SelectionChangedEvent): GridSelection {
    const api = event.api;
    return this.getSelection(api);
  }
}


