# Quick Reference: Migration-Friendly Patterns

## 🎯 Core Principles

1. **Abstract Third-Party Libraries** → Easier to swap implementations
2. **Constructor Injection** → Standard DI pattern
3. **Observable Management** → Use `async` pipe + `takeUntil`
4. **OnPush Strategy** → Better performance, migration-friendly
5. **Feature Modules** → Organize by feature, not type

---

## 📋 Common Patterns

### Service Injection
```typescript
// ✅ GOOD
constructor(private service: MyService) {}

// ❌ BAD
constructor() {
  this.service = AppModule.injector.get(MyService);
}
```

### Observable Subscription
```typescript
// ✅ GOOD - Using async pipe
<div *ngFor="let item of data$ | async">

// ✅ GOOD - Using takeUntil
ngOnInit() {
  this.service.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe();
}

// ❌ BAD - Not unsubscribing
ngOnInit() {
  this.service.getData().subscribe(); // Memory leak!
}
```

### Change Detection
```typescript
// ✅ GOOD
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// ❌ BAD (unless necessary)
@Component({
  changeDetection: ChangeDetectionStrategy.Default
})
```

### ag-Grid Usage
```typescript
// ✅ GOOD - Using adapter
this.gridAdapter.getSelectedRows(this.gridApi);

// ❌ BAD - Direct API
this.gridApi.getSelectedRows();
```

### r-Socket Usage
```typescript
// ✅ GOOD - Using service
this.streamingService.subscribeToTopic('my-topic')
  .subscribe(data => { /* handle */ });

// ❌ BAD - Direct r-socket
this.rsocket.requestStream().subscribe();
```

---

## 🏗️ Project Structure

```
src/app/
├── features/
│   ├── data-grid/          # Feature module
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   └── *.module.ts
│   └── streaming/
│       ├── services/
│       └── models/
├── core/                   # Singleton services
│   ├── services/
│   └── guards/
└── shared/                 # Shared components
    ├── components/
    └── pipes/
```

---

## 🔧 Service Templates

### Generic Service Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}
  
  getData(): Observable<Data[]> {
    return this.http.get<Data[]>('/api/data').pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  private handleError(error: any): Observable<Data[]> {
    this.logger.error('Error', error);
    return of([]);
  }
}
```

### Component with Cleanup
```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## 📦 Dependency Management

### Pin Versions
```json
{
  "dependencies": {
    "ag-grid-angular": "24.0.0",
    "ag-grid-community": "24.0.0"
  }
}
```

### Document Constraints
```json
{
  "//": "ag-grid 24 is last version compatible with Angular 11"
}
```

---

## ✅ Pre-Commit Checklist

- [ ] All dependencies injected via constructor
- [ ] Observables unsubscribed (async pipe or takeUntil)
- [ ] Third-party libraries abstracted
- [ ] OnPush used where possible
- [ ] Code organized by feature
- [ ] No deprecated patterns
- [ ] Version-specific code documented

---

## 🚨 Red Flags

- Direct third-party API in components
- Unsubscribed observables
- Module-level service access
- No abstraction layers
- Deprecated Angular patterns

---

## 📚 File Locations

- **Guidelines**: `MIGRATION_FRIENDLY_GUIDELINES.md`
- **Examples**: `examples/` folder
- **Checklist**: `MIGRATION_CHECKLIST.md`
- **Quick Reference**: This file


