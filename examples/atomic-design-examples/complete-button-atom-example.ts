/**
 * ============================================================================
 * COMPLETE BUTTON ATOM EXAMPLE
 * ============================================================================
 * 
 * This is a complete, self-explanatory example of a Button Atom component.
 * An Atom is the smallest reusable component in Atomic Design.
 * 
 * WHAT IS AN ATOM?
 * - Basic building block that cannot be broken down further
 * - Single responsibility (just renders a button)
 * - No business logic
 * - Highly reusable across the application
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Basic button:
 *    <app-button (clicked)="handleClick()">Click Me</app-button>
 * 
 * 2. Primary button with icon:
 *    <app-button type="primary" icon="fa fa-search" (clicked)="search()">
 *      Search
 *    </app-button>
 * 
 * 3. Disabled button:
 *    <app-button [disabled]="true">Cannot Click</app-button>
 * 
 * 4. Loading button:
 *    <app-button [loading]="isLoading" (clicked)="save()">Save</app-button>
 * 
 * 5. Full width button:
 *    <app-button [fullWidth]="true" type="primary">Submit</app-button>
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * Button type variants - defines the visual style
 */
export type ButtonType = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';

/**
 * Button size variants - defines the size
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * ButtonAtomComponent - A basic button building block
 * 
 * This component is an ATOM because:
 * 1. It's a single, indivisible UI element
 * 2. It has no dependencies on other custom components
 * 3. It can be used anywhere in the application
 * 4. It has a single, clear purpose: render a clickable button
 */
@Component({
  selector: 'app-button',
  templateUrl: './button.atom.html',
  styleUrls: ['./button.atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Better performance, migration-friendly
})
export class ButtonAtomComponent {
  /**
   * Button style type
   * - primary: Main action (blue)
   * - secondary: Secondary action (gray)
   * - danger: Destructive action (red)
   * - success: Success action (green)
   * - warning: Warning action (orange)
   */
  @Input() type: ButtonType = 'primary';

  /**
   * Button size
   * - small: Compact button
   * - medium: Standard button (default)
   * - large: Prominent button
   */
  @Input() size: ButtonSize = 'medium';

  /**
   * Whether the button is disabled
   * Disabled buttons cannot be clicked and have reduced opacity
   */
  @Input() disabled: boolean = false;

  /**
   * Whether the button is in loading state
   * Shows a spinner and prevents clicks
   */
  @Input() loading: boolean = false;

  /**
   * Optional icon class (e.g., 'fa fa-search', 'material-icons')
   * Icon appears before the button text
   */
  @Input() icon?: string;

  /**
   * Whether button should take full width of container
   */
  @Input() fullWidth: boolean = false;

  /**
   * Accessibility label for screen readers
   */
  @Input() ariaLabel?: string;

  /**
   * Event emitted when button is clicked
   * Only emits if button is not disabled or loading
   */
  @Output() clicked = new EventEmitter<void>();

  /**
   * Handles button click
   * Prevents emission if button is disabled or loading
   */
  onClick(): void {
    // Only emit if button is interactive
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }

  /**
   * Dynamically generates CSS classes for the button
   * Combines type, size, and state classes
   * 
   * Example output: "btn-primary btn-medium btn-full-width"
   */
  get buttonClasses(): string {
    return [
      `btn-${this.type}`,           // Style class (btn-primary, btn-secondary, etc.)
      `btn-${this.size}`,            // Size class (btn-small, btn-medium, etc.)
      this.fullWidth ? 'btn-full-width' : '',  // Full width class if needed
      this.disabled ? 'btn-disabled' : '',      // Disabled state class
      this.loading ? 'btn-loading' : ''         // Loading state class
    ].filter(Boolean).join(' ');    // Remove empty strings and join with spaces
  }
}


