import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[bsClearInput]',
})
export class ClearInputDirective {
  @Input() targetControl!: AbstractControl<unknown> | null;

  @Input() targetInput!: any;

  @HostBinding('class.pointer') pointer = true;
  @HostBinding('class.block')
  get show() {
    return this.targetControl?.value;
  }
  @HostBinding('class.hidden') get hide() {
    return !this.show;
  }

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement) {
    const notInput = this.targetInput.input; // for p-password
    const hasInputfieldViewChildProp = this.targetInput.inputfieldViewChild; // for p-calendar
    if (notInput) {
      notInput.nativeElement.focus();
    } else if (hasInputfieldViewChildProp) {
      hasInputfieldViewChildProp.nativeElement.focus();
    } else {
      this.targetInput.focus();
    }
    this.targetControl?.setValue(null);
  }
}
