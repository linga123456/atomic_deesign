# Migration-Friendly Development Guidelines
## Angular 11 → Future Versions

This document provides guidelines for developing new features in Angular 11 that will ease future migration to newer Angular versions.

---

## Table of Contents
1. [Angular Core Patterns](#angular-core-patterns)
2. [Dependency Injection](#dependency-injection)
3. [Component Architecture](#component-architecture)
4. [RxJS Best Practices](#rxjs-best-practices)
5. [ag-Grid Considerations](#ag-grid-considerations)
6. [r-Socket Streaming Patterns](#r-socket-streaming-patterns)
7. [Code Organization](#code-organization)
8. [Testing Strategy](#testing-strategy)
9. [Dependency Management](#dependency-management)

---

## Angular Core Patterns

### ✅ DO: Use Modern Patterns (Compatible with Angular 11+)

#### 1. Standalone Components Pattern (Prepare for Future)
Even though Angular 11 doesn't support standalone components, structure your code as if they were:

```typescript
// ✅ GOOD: Self-contained component with clear dependencies
@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent {
  // All dependencies injected in constructor
  // No module-level dependencies
  // Clear input/output boundaries
}
```

#### 2. Avoid Module-Level Dependencies
```typescript
// ❌ BAD: Module-level service access
export class MyComponent {
  constructor() {
    this.service = AppModule.injector.get(MyService);
  }
}

// ✅ GOOD: Constructor injection
export class MyComponent {
  constructor(private myService: MyService) {}
}
```

#### 3. Use OnPush Change Detection Strategy
```typescript
// ✅ GOOD: Better performance, migration-friendly
@Component({
  selector: 'app-component',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {
  // Use immutable data patterns
  // Use async pipe for observables
}
```

---

## Dependency Injection

### ✅ DO: Use Constructor Injection
```typescript
// ✅ GOOD: Standard DI pattern
@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}
}
```

### ❌ AVOID: InjectionToken with Factory Functions (unless necessary)
```typescript
// ❌ AVOID: Complex injection patterns that may break
export const MY_TOKEN = new InjectionToken('my-token', {
  providedIn: 'root',
  factory: () => complexFactory()
});
```

### ✅ DO: Use providedIn: 'root' for Services
```typescript
// ✅ GOOD: Tree-shakeable, migration-friendly
@Injectable({ providedIn: 'root' })
export class MyService {}
```

---

## Component Architecture

### ✅ DO: Use Smart/Dumb Component Pattern
```typescript
// ✅ SMART Component: Handles data and business logic
@Component({
  selector: 'app-grid-container',
  template: `
    <app-data-grid
      [data]="data$ | async"
      [config]="gridConfig"
      (rowSelected)="onRowSelected($event)"
    ></app-data-grid>
  `
})
export class GridContainerComponent {
  data$ = this.dataService.getData();
  
  constructor(private dataService: DataService) {}
  
  onRowSelected(row: any) {
    // Business logic here
  }
}

// ✅ DUMB Component: Pure presentation
@Component({
  selector: 'app-data-grid',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridComponent {
  @Input() data: any[];
  @Input() config: GridOptions;
  @Output() rowSelected = new EventEmitter();
}
```

### ✅ DO: Use Reactive Forms (Not Template-Driven)
```typescript
// ✅ GOOD: More testable, migration-friendly
export class FormComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  constructor(private fb: FormBuilder) {}
}
```

---

## RxJS Best Practices

### ✅ DO: Use Modern RxJS Operators
```typescript
// ✅ GOOD: Use pipe() instead of chaining
this.data$ = this.service.getData().pipe(
  map(data => data.items),
  filter(items => items.length > 0),
  catchError(error => {
    this.handleError(error);
    return of([]);
  })
);
```

### ✅ DO: Always Unsubscribe
```typescript
// ✅ GOOD: Use takeUntil pattern
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Handle data
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ✅ ALTERNATIVE: Use async pipe (preferred)
// In template: <div *ngFor="let item of data$ | async">
```

### ✅ DO: Use shareReplay for Expensive Operations
```typescript
// ✅ GOOD: Cache and share observables
private dataCache$ = this.http.get('/api/data').pipe(
  shareReplay(1)
);
```

---

## ag-Grid Considerations

### ✅ DO: Abstract ag-Grid Configuration
```typescript
// ✅ GOOD: Centralized grid configuration
@Injectable({ providedIn: 'root' })
export class GridConfigService {
  getDefaultConfig(): GridOptions {
    return {
      columnDefs: [],
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true
      },
      rowSelection: 'multiple',
      animateRows: true,
      // Use features compatible with ag-grid 24+
    };
  }
  
  getColumnDefs(type: string): ColDef[] {
    // Return column definitions based on type
    // This makes it easier to update when migrating ag-grid
  }
}
```

### ✅ DO: Create Wrapper Components
```typescript
// ✅ GOOD: Abstract ag-grid behind your own component
@Component({
  selector: 'app-custom-grid',
  template: `
    <ag-grid-angular
      [rowData]="rowData"
      [columnDefs]="columnDefs"
      [gridOptions]="gridOptions"
      (gridReady)="onGridReady($event)"
      class="ag-theme-alpine"
    ></ag-grid-angular>
  `
})
export class CustomGridComponent {
  @Input() rowData: any[];
  @Input() columnDefs: ColDef[];
  @Input() gridOptions: GridOptions = {};
  
  @Output() rowSelected = new EventEmitter();
  @Output() cellClicked = new EventEmitter();
  
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  
  // Expose only the methods you need
  refreshData() {
    this.gridApi?.refreshCells();
  }
}
```

### ✅ DO: Version-Specific Compatibility Layer
```typescript
// ✅ GOOD: Create adapter for ag-grid version differences
@Injectable({ providedIn: 'root' })
export class GridAdapterService {
  // Abstract version-specific APIs
  getSelectedRows(gridApi: GridApi): any[] {
    // ag-grid 24+ compatible
    return gridApi.getSelectedRows();
  }
  
  // When migrating, update only this service
}
```

### ❌ AVOID: Direct ag-Grid API Usage in Components
```typescript
// ❌ BAD: Direct API usage scattered everywhere
export class MyComponent {
  onGridReady(params: GridReadyEvent) {
    params.api.selectAll();
    params.api.setFilterModel({});
    // Hard to migrate when API changes
  }
}

// ✅ GOOD: Use adapter service
export class MyComponent {
  constructor(private gridAdapter: GridAdapterService) {}
  
  onGridReady(params: GridReadyEvent) {
    this.gridAdapter.selectAllRows(params.api);
  }
}
```

---

## r-Socket Streaming Patterns

### ✅ DO: Create Abstraction Layer for r-Socket
```typescript
// ✅ GOOD: Abstract r-socket behind service
@Injectable({ providedIn: 'root' })
export class StreamingService {
  private rsocket: RSocketClient;
  private dataSubject = new Subject<any>();
  public data$ = this.dataSubject.asObservable();
  
  constructor() {
    this.initializeConnection();
  }
  
  private initializeConnection() {
    // r-socket initialization
    // Abstract the connection logic
  }
  
  subscribeToTopic(topic: string): Observable<any> {
    // Return observable instead of exposing r-socket directly
    return this.data$.pipe(
      filter(data => data.topic === topic),
      map(data => data.payload)
    );
  }
  
  // When migrating to different streaming solution,
  // update only this service
}
```

### ✅ DO: Use RxJS Operators for Stream Processing
```typescript
// ✅ GOOD: Process streams with RxJS
export class DataProcessorService {
  processStream(stream$: Observable<any>): Observable<ProcessedData> {
    return stream$.pipe(
      debounceTime(100), // Prevent overwhelming UI
      distinctUntilChanged(),
      map(this.transformData),
      catchError(error => {
        this.handleStreamError(error);
        return EMPTY;
      })
    );
  }
  
  private transformData(raw: any): ProcessedData {
    // Transformation logic
  }
}
```

### ✅ DO: Handle Connection Lifecycle
```typescript
// ✅ GOOD: Proper connection management
@Injectable({ providedIn: 'root' })
export class KafkaStreamService implements OnDestroy {
  private connection$: Subscription;
  private reconnect$ = new Subject<void>();
  
  connect() {
    this.connection$ = this.establishConnection().pipe(
      retryWhen(errors =>
        errors.pipe(
          delay(1000),
          take(5),
          tap(() => this.reconnect$.next())
        )
      )
    ).subscribe();
  }
  
  ngOnDestroy() {
    this.connection$?.unsubscribe();
  }
}
```

### ✅ DO: Buffer and Batch Updates
```typescript
// ✅ GOOD: Batch updates for performance
export class GridUpdateService {
  private updateQueue$ = new Subject<any>();
  
  constructor() {
    // Batch updates every 100ms
    this.updateQueue$.pipe(
      bufferTime(100),
      filter(updates => updates.length > 0),
      map(updates => this.mergeUpdates(updates))
    ).subscribe(merged => {
      this.applyToGrid(merged);
    });
  }
  
  queueUpdate(update: any) {
    this.updateQueue$.next(update);
  }
}
```

---

## Code Organization

### ✅ DO: Feature-Based Structure
```
src/
├── app/
│   ├── features/
│   │   ├── data-grid/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── data-grid.module.ts
│   │   │   └── data-grid.routes.ts
│   │   └── streaming/
│   │       ├── services/
│   │       ├── models/
│   │       └── streaming.module.ts
│   ├── core/
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   └── shared/
│       ├── components/
│       ├── directives/
│       └── pipes/
```

### ✅ DO: Use Barrel Exports
```typescript
// ✅ GOOD: features/data-grid/index.ts
export * from './components';
export * from './services';
export * from './models';
```

### ✅ DO: Separate Models/Interfaces
```typescript
// ✅ GOOD: Separate model files
// models/grid-config.model.ts
export interface GridConfig {
  columns: ColumnDef[];
  options: GridOptions;
}

// models/stream-message.model.ts
export interface StreamMessage {
  topic: string;
  payload: any;
  timestamp: number;
}
```

---

## Testing Strategy

### ✅ DO: Write Testable Code
```typescript
// ✅ GOOD: Testable service
@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}
  
  getData(): Observable<Data[]> {
    return this.http.get<Data[]>('/api/data').pipe(
      tap(data => this.logger.log('Data received', data)),
      catchError(error => this.handleError(error))
    );
  }
  
  private handleError(error: any): Observable<Data[]> {
    this.logger.error('Error fetching data', error);
    return of([]);
  }
}
```

### ✅ DO: Use Dependency Injection in Tests
```typescript
// ✅ GOOD: Easy to mock
describe('DataService', () => {
  let service: DataService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  
  beforeEach(() => {
    httpMock = jasmine.createSpyObj('HttpClient', ['get']);
    service = new DataService(httpMock, mockLogger);
  });
});
```

---

## Dependency Management

### ✅ DO: Pin Dependency Versions
```json
// ✅ GOOD: package.json
{
  "dependencies": {
    "ag-grid-angular": "24.0.0",
    "ag-grid-community": "24.0.0",
    "@rsocket/core": "^0.0.20",
    "@rsocket/rsocket-js": "^0.0.20"
  },
  "devDependencies": {
    "@angular/core": "~11.2.0"
  }
}
```

### ✅ DO: Document Version Constraints
```json
// ✅ GOOD: Document why versions are pinned
{
  "//": "ag-grid 24 is last version compatible with Angular 11",
  "//": "Consider upgrading to ag-grid 28+ when migrating to Angular 15+"
}
```

### ✅ DO: Create Compatibility Matrix
```markdown
## Dependency Compatibility Matrix

| Angular | ag-Grid | r-Socket | Status |
|---------|---------|----------|--------|
| 11      | 24      | 0.0.20   | Current |
| 15      | 28+     | 0.0.20+  | Future  |
```

---

## Migration Checklist for New Features

When implementing new features, ask:

- [ ] Is this code using deprecated Angular patterns?
- [ ] Are dependencies injected via constructor?
- [ ] Are observables properly unsubscribed?
- [ ] Is ag-grid usage abstracted behind a service/component?
- [ ] Is r-socket usage abstracted behind a service?
- [ ] Are models/interfaces in separate files?
- [ ] Is the code organized in a feature-based structure?
- [ ] Are there unit tests for critical logic?
- [ ] Is the code using OnPush change detection where possible?
- [ ] Are there any version-specific workarounds documented?

---

## Key Principles Summary

1. **Abstraction**: Abstract third-party libraries (ag-grid, r-socket) behind your own services/components
2. **Dependency Injection**: Always use constructor injection
3. **Observables**: Use RxJS properly with async pipe and takeUntil
4. **OnPush**: Use OnPush change detection strategy
5. **Feature Modules**: Organize code by feature, not by type
6. **Type Safety**: Use TypeScript interfaces and types
7. **Testing**: Write testable code with clear dependencies
8. **Documentation**: Document version-specific workarounds

---

## Future Migration Path

When resources become available:

1. **Phase 1**: Update Angular to 12, then 13, then 14 (incremental)
2. **Phase 2**: Update ag-grid to latest compatible version
3. **Phase 3**: Refactor abstracted layers if needed
4. **Phase 4**: Update to Angular 15+ and latest ag-grid
5. **Phase 5**: Consider standalone components if migrating to Angular 14+

The abstraction layers you build now will make these migrations much easier!

---

## Additional Resources

- [Angular Update Guide](https://update.angular.io/)
- [ag-Grid Migration Guide](https://www.ag-grid.com/angular-data-grid/upgrading-to-ag-grid-28/)
- [RxJS Best Practices](https://rxjs.dev/guide/overview)


