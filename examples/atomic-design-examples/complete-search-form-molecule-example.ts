/**
 * ============================================================================
 * COMPLETE SEARCH FORM MOLECULE EXAMPLE
 * ============================================================================
 * 
 * This is a complete example of a Search Form Molecule component.
 * A Molecule combines 2-5 atoms to create a functional unit.
 * 
 * WHAT IS A MOLECULE?
 * - Combines multiple atoms (Input + Button in this case)
 * - Has a single, clear purpose (search functionality)
 * - Reusable across different contexts
 * - May have simple state management
 * 
 * COMPOSITION:
 * This molecule is made of:
 * - InputAtomComponent (for search input)
 * - ButtonAtomComponent (for search and clear actions)
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Basic search form:
 *    <app-search-form-molecule
 *      (search)="onSearch($event)"
 *      (clear)="onClear()">
 *    </app-search-form-molecule>
 * 
 * 2. With custom placeholder and button text:
 *    <app-search-form-molecule
 *      placeholder="Search users..."
 *      buttonText="Find"
 *      (search)="searchUsers($event)">
 *    </app-search-form-molecule>
 * 
 * 3. With initial value:
 *    <app-search-form-molecule
 *      [initialValue]="savedSearchQuery"
 *      (search)="onSearch($event)">
 *    </app-search-form-molecule>
 * 
 * 4. With debounced value changes:
 *    <app-search-form-molecule
 *      [debounceTime]="500"
 *      (valueChange)="onSearchValueChange($event)">
 *    </app-search-form-molecule>
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * SearchFormMoleculeComponent - Combines Input and Button atoms
 * 
 * This component is a MOLECULE because:
 * 1. It combines InputAtomComponent and ButtonAtomComponent
 * 2. It has a single purpose: provide search functionality
 * 3. It manages simple form state
 * 4. It's reusable across different features
 */
@Component({
  selector: 'app-search-form-molecule',
  templateUrl: './search-form.molecule.html',
  styleUrls: ['./search-form.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormMoleculeComponent implements OnInit, OnDestroy {
  /**
   * Placeholder text for the search input
   * Default: 'Search...'
   */
  @Input() placeholder: string = 'Search...';

  /**
   * Text for the search button
   * Default: 'Search'
   */
  @Input() buttonText: string = 'Search';

  /**
   * Initial search value (useful for restoring saved searches)
   */
  @Input() initialValue: string = '';

  /**
   * Debounce time in milliseconds for value changes
   * Prevents excessive emissions while user is typing
   * Default: 300ms
   */
  @Input() debounceTime: number = 300;

  /**
   * Whether to show the clear button
   * Default: true
   */
  @Input() showClearButton: boolean = true;

  /**
   * Emitted when user clicks search button or presses Enter
   * Emits the search query string
   */
  @Output() search = new EventEmitter<string>();

  /**
   * Emitted when user clicks clear button
   */
  @Output() clear = new EventEmitter<void>();

  /**
   * Emitted on every value change (debounced)
   * Useful for real-time search as user types
   */
  @Output() valueChange = new EventEmitter<string>();

  /**
   * Reactive form group for the search input
   */
  searchForm: FormGroup;

  /**
   * Subject for managing component lifecycle
   * Used to unsubscribe from observables on destroy
   */
  private destroy$ = new Subject<void>();

  /**
   * Constructor - Initializes the form
   */
  constructor(private fb: FormBuilder) {
    // Create reactive form with single 'query' control
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  /**
   * Lifecycle hook - Sets up value change subscription
   */
  ngOnInit(): void {
    // Set initial value if provided
    if (this.initialValue) {
      this.searchForm.patchValue({ query: this.initialValue });
    }

    // Subscribe to form value changes with debounce
    // This emits valueChange event as user types (after debounce)
    this.searchForm.get('query')?.valueChanges.pipe(
      debounceTime(this.debounceTime),        // Wait for user to stop typing
      distinctUntilChanged(),                  // Only emit if value actually changed
      takeUntil(this.destroy$)                 // Unsubscribe on component destroy
    ).subscribe(query => {
      this.valueChange.emit(query);
    });
  }

  /**
   * Lifecycle hook - Cleans up subscriptions
   */
  ngOnDestroy(): void {
    this.destroy$.next();      // Signal to complete all subscriptions
    this.destroy$.complete();  // Complete the subject
  }

  /**
   * Handles form submission (Enter key or button click)
   * Emits search event with trimmed query
   */
  onSubmit(): void {
    const query = this.searchForm.get('query')?.value?.trim();
    if (query) {
      this.search.emit(query);
    }
  }

  /**
   * Handles clear button click
   * Resets form and emits clear event
   */
  onClear(): void {
    this.searchForm.reset();
    this.clear.emit();
  }

  /**
   * Computed property: Whether form has a value
   * Used to conditionally show clear button
   */
  get hasValue(): boolean {
    return !!this.searchForm.get('query')?.value;
  }
}


