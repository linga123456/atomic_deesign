/**
 * Search Form Molecule Component
 * 
 * Combines Input atom and Button atom to create a search form.
 * This is a molecule - a simple combination of atoms.
 * 
 * @example
 * ```html
 * <app-search-form-molecule
 *   placeholder="Search users..."
 *   buttonText="Search"
 *   (search)="onSearch($event)"
 *   (clear)="onClear()">
 * </app-search-form-molecule>
 * ```
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-form-molecule',
  templateUrl: './search-form.molecule.html',
  styleUrls: ['./search-form.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormMoleculeComponent implements OnInit {
  @Input() placeholder: string = 'Search...';
  @Input() buttonText: string = 'Search';
  @Input() initialValue: string = '';
  @Input() debounceTime: number = 300;
  @Input() showClearButton: boolean = true;
  
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<string>();
  
  searchForm: FormGroup;
  private destroy$ = new Subject<void>();
  
  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }
  
  ngOnInit(): void {
    if (this.initialValue) {
      this.searchForm.patchValue({ query: this.initialValue });
    }
    
    // Emit value changes with debounce
    this.searchForm.get('query')?.valueChanges.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.valueChange.emit(query);
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onSubmit(): void {
    const query = this.searchForm.get('query')?.value?.trim();
    if (query) {
      this.search.emit(query);
    }
  }
  
  onClear(): void {
    this.searchForm.reset();
    this.clear.emit();
  }
  
  get hasValue(): boolean {
    return !!this.searchForm.get('query')?.value;
  }
}


