/**
 * Button Atom Component
 * 
 * Basic button building block - the smallest reusable component.
 * 
 * @example
 * ```html
 * <app-button type="primary" size="medium" (clicked)="handleClick()">
 *   Click Me
 * </app-button>
 * ```
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

export type ButtonType = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  templateUrl: './button.atom.html',
  styleUrls: ['./button.atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonAtomComponent {
  @Input() type: ButtonType = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon?: string;
  @Input() fullWidth: boolean = false;
  @Input() ariaLabel?: string;
  
  @Output() clicked = new EventEmitter<void>();
  
  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
  
  get buttonClasses(): string {
    return [
      `btn-${this.type}`,
      `btn-${this.size}`,
      this.fullWidth ? 'btn-full-width' : '',
      this.disabled ? 'btn-disabled' : '',
      this.loading ? 'btn-loading' : ''
    ].filter(Boolean).join(' ');
  }
}


