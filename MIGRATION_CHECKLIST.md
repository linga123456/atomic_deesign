# Migration-Friendly Development Checklist

Use this checklist when implementing new features to ensure code is migration-ready.

## Pre-Development

- [ ] **Feature Analysis**: Identify all dependencies (Angular, ag-grid, r-socket, etc.)
- [ ] **Version Compatibility**: Verify all dependencies are compatible with Angular 11
- [ ] **Abstraction Plan**: Plan abstraction layers for third-party libraries
- [ ] **Module Structure**: Plan feature-based module organization

## During Development

### Angular Patterns

- [ ] **Constructor Injection**: All dependencies injected via constructor
- [ ] **OnPush Strategy**: Using `ChangeDetectionStrategy.OnPush` where possible
- [ ] **Reactive Forms**: Using reactive forms instead of template-driven
- [ ] **Observable Patterns**: Using `async` pipe and `takeUntil` for subscriptions
- [ ] **No Deprecated APIs**: Avoiding deprecated Angular APIs
- [ ] **Type Safety**: Using TypeScript interfaces and types throughout

### ag-Grid Implementation

- [ ] **Adapter Service**: Using `GridAdapterService` for all grid operations
- [ ] **Wrapper Component**: Grid wrapped in custom component (if reusable)
- [ ] **Config Service**: Grid configuration centralized in service
- [ ] **No Direct API**: No direct `gridApi` usage in components
- [ ] **Version-Specific Code**: Version-specific code isolated in adapter

### r-Socket Streaming

- [ ] **Streaming Service**: Using `StreamingService` for all stream operations
- [ ] **Observable Interface**: Streams exposed as RxJS observables
- [ ] **Error Handling**: Proper error handling and reconnection logic
- [ ] **Lifecycle Management**: Proper connection cleanup in `ngOnDestroy`
- [ ] **Batch Updates**: Batching stream updates for performance

### Code Organization

- [ ] **Feature Modules**: Code organized by feature, not by type
- [ ] **Barrel Exports**: Using index.ts for clean imports
- [ ] **Separate Models**: Models/interfaces in separate files
- [ ] **Service Layer**: Business logic in services, not components
- [ ] **Shared Code**: Shared code in `shared` folder

### Testing

- [ ] **Unit Tests**: Unit tests for services and business logic
- [ ] **Mockable Dependencies**: Dependencies easily mockable
- [ ] **Test Coverage**: Critical paths have test coverage
- [ ] **Integration Tests**: Integration tests for key workflows

## Post-Development

- [ ] **Documentation**: Code documented with comments
- [ ] **Version Notes**: Version-specific workarounds documented
- [ ] **Migration Notes**: Notes added for future migration considerations
- [ ] **Code Review**: Code reviewed for migration-friendliness
- [ ] **Dependency Audit**: Dependencies reviewed and documented

## Code Review Questions

Ask these questions during code review:

1. **Abstraction**: Is third-party library usage abstracted?
2. **Dependencies**: Are dependencies injected, not imported directly?
3. **Observables**: Are observables properly managed (unsubscribed)?
4. **Performance**: Is OnPush used where appropriate?
5. **Testing**: Is the code testable?
6. **Migration**: Will this code be easy to migrate?

## Red Flags

Watch out for these patterns that make migration harder:

- ❌ Direct third-party API usage in components
- ❌ Module-level service access
- ❌ Memory leaks (unsubscribed observables)
- ❌ Version-specific workarounds without documentation
- ❌ Tightly coupled code
- ❌ No abstraction layers
- ❌ Deprecated Angular patterns
- ❌ Mixed change detection strategies without reason

## Success Criteria

Code is migration-ready when:

- ✅ All third-party libraries abstracted
- ✅ Dependencies injected via constructor
- ✅ Observables properly managed
- ✅ Code organized by feature
- ✅ Tests in place
- ✅ Documentation complete
- ✅ No deprecated patterns
- ✅ Version-specific code isolated


