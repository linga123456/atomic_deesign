/**
 * Example: Integration of Streaming Data with ag-Grid
 * 
 * This demonstrates how to integrate Kafka stream (via r-socket) with ag-Grid
 * in a migration-friendly way using the adapter services.
 */

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, map, scan, debounceTime, bufferTime } from 'rxjs/operators';
import { GridApi, ColumnApi, GridReadyEvent, ColDef } from 'ag-grid-community';

import { StreamingService, StreamMessage } from './streaming-service.example';
import { GridAdapterService, GridSelection } from './grid-adapter-service.example';

@Component({
  selector: 'app-streaming-grid',
  templateUrl: './streaming-grid.component.html',
  styleUrls: ['./streaming-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamingGridComponent implements OnInit, OnDestroy {
  // Grid state
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;
  
  // Data streams
  public rowData$ = new BehaviorSubject<any[]>([]);
  public columnDefs: ColDef[] = [];
  
  // Connection status
  public isConnected$ = this.streamingService.connectionStatus;
  
  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();
  
  // Batch updates for performance
  private updateQueue$ = new Subject<any>();
  
  constructor(
    private streamingService: StreamingService,
    private gridAdapter: GridAdapterService
  ) {
    this.initializeColumnDefs();
    this.setupBatchUpdates();
  }
  
  ngOnInit(): void {
    this.connectToStream();
    this.subscribeToStream();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.streamingService.disconnect();
  }
  
  /**
   * Grid ready event handler
   */
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    
    // Apply default grid options
    const defaultOptions = this.gridAdapter.getDefaultGridOptions();
    params.api.updateGridOptions(defaultOptions);
  }
  
  /**
   * Selection changed handler
   */
  onSelectionChanged(event: any): void {
    const selection = this.gridAdapter.handleSelectionChanged(event);
    console.log('Selected rows:', selection.selectedCount);
    // Handle selection logic here
  }
  
  /**
   * Connect to Kafka stream
   */
  private connectToStream(): void {
    const config = {
      url: 'ws://your-kafka-stream-url',
      reconnectAttempts: 5,
      reconnectDelay: 1000
    };
    
    this.streamingService.connect(config)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (connected) => {
          console.log('Connected to stream:', connected);
        },
        error: (error) => {
          console.error('Failed to connect:', error);
        }
      });
  }
  
  /**
   * Subscribe to stream and update grid
   */
  private subscribeToStream(): void {
    // Subscribe to specific topic
    const topic = 'your-kafka-topic';
    
    this.streamingService.subscribeToTopic(topic)
      .pipe(
        takeUntil(this.destroy$),
        // Debounce to prevent overwhelming UI
        debounceTime(50)
      )
      .subscribe({
        next: (data) => {
          // Queue update for batching
          this.updateQueue$.next(data);
        },
        error: (error) => {
          console.error('Stream error:', error);
        }
      });
  }
  
  /**
   * Setup batch updates for better performance
   */
  private setupBatchUpdates(): void {
    this.updateQueue$.pipe(
      // Buffer updates for 100ms
      bufferTime(100),
      // Only process if there are updates
      map(updates => updates.filter(u => u !== null)),
      takeUntil(this.destroy$)
    ).subscribe(updates => {
      if (updates.length > 0) {
        this.processBatchUpdates(updates);
      }
    });
  }
  
  /**
   * Process batched updates
   */
  private processBatchUpdates(updates: any[]): void {
    if (!this.gridApi) {
      return;
    }
    
    // Merge updates (deduplicate by ID if applicable)
    const mergedUpdates = this.mergeUpdates(updates);
    
    // Apply updates to grid using adapter
    this.gridAdapter.updateRows(this.gridApi, mergedUpdates);
    
    // Or if these are new rows:
    // this.gridAdapter.addRows(this.gridApi, mergedUpdates);
    
    // Update local state
    const currentData = this.rowData$.value;
    const updatedData = this.applyUpdatesToData(currentData, mergedUpdates);
    this.rowData$.next(updatedData);
  }
  
  /**
   * Merge updates (deduplicate, combine, etc.)
   */
  private mergeUpdates(updates: any[]): any[] {
    // Example: Deduplicate by ID
    const updateMap = new Map();
    
    updates.forEach(update => {
      const id = update.id || update.key;
      if (id) {
        // Keep latest update for each ID
        updateMap.set(id, update);
      } else {
        // If no ID, add as new
        updateMap.set(Date.now() + Math.random(), update);
      }
    });
    
    return Array.from(updateMap.values());
  }
  
  /**
   * Apply updates to existing data
   */
  private applyUpdatesToData(currentData: any[], updates: any[]): any[] {
    const dataMap = new Map(
      currentData.map(item => [item.id || item.key, item])
    );
    
    updates.forEach(update => {
      const id = update.id || update.key;
      if (dataMap.has(id)) {
        // Update existing
        dataMap.set(id, { ...dataMap.get(id), ...update });
      } else {
        // Add new
        dataMap.set(id, update);
      }
    });
    
    return Array.from(dataMap.values());
  }
  
  /**
   * Initialize column definitions
   */
  private initializeColumnDefs(): void {
    this.columnDefs = [
      this.gridAdapter.createColumnDef('id', 'ID', {
        width: 100,
        pinned: 'left'
      }),
      this.gridAdapter.createColumnDef('timestamp', 'Timestamp', {
        width: 180,
        valueFormatter: (params) => {
          return new Date(params.value).toLocaleString();
        }
      }),
      this.gridAdapter.createColumnDef('value', 'Value', {
        width: 150,
        editable: false
      }),
      this.gridAdapter.createColumnDef('status', 'Status', {
        width: 120,
        cellRenderer: (params: any) => {
          return `<span class="status-${params.value}">${params.value}</span>`;
        }
      })
    ];
    
    // Apply default column settings
    this.columnDefs = this.gridAdapter.applyColumnDefaults(this.columnDefs);
  }
  
  /**
   * Manual refresh
   */
  refreshGrid(): void {
    if (this.gridApi) {
      this.gridAdapter.refreshData(this.gridApi);
    }
  }
  
  /**
   * Export selected rows
   */
  exportSelected(): void {
    if (this.gridApi) {
      this.gridAdapter.exportSelectedToCsv(this.gridApi, 'streaming-data');
    }
  }
  
  /**
   * Apply filter
   */
  applyFilter(column: string, value: any): void {
    if (this.gridApi) {
      this.gridAdapter.applyFilter(this.gridApi, {
        column,
        filterType: 'text',
        filterValue: value
      });
    }
  }
  
  /**
   * Clear filters
   */
  clearFilters(): void {
    if (this.gridApi) {
      this.gridAdapter.clearFilters(this.gridApi);
    }
  }
}


