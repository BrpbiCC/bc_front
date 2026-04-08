import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target', '$event'])
  public onClick(targetElement: EventTarget | null, event: Event): void {
    if (!targetElement || !(targetElement instanceof HTMLElement)) {
      return;
    }
    
    const target = event.target as HTMLElement;
    if (target.closest('.btn-filters-dropdown')) {
      return;
    }
    
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
