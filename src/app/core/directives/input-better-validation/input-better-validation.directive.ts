import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[bsInputBetterValidation]',
})
export class InputBetterValidationDirective {
  private inputFocused = false;
  @Input() formSubmitted = false;
  @Input() helperElement!: HTMLParagraphElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostBinding('class.ng-dirty') get ngDirty() {
    const isTouched = this.el.nativeElement.classList.contains('ng-touched');
    const isInValid = this.el.nativeElement.classList.contains('ng-invalid');
    const isFocused = this.el.nativeElement.classList.contains(
      'p-inputwrapper-focus'
    );

    const isDirty =
      (this.formSubmitted || isTouched) && isInValid && !this.inputFocused;
    if (isDirty && !isFocused) {
      this.renderer.setStyle(this.helperElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.helperElement, 'display', 'none');
    }

    return isDirty;
  }

  @HostListener('focus', ['$event.target'])
  onFocus() {
    this.inputFocused = true;
  }

  @HostListener('blur', ['$event.target'])
  onBlur() {
    this.inputFocused = false;
  }
}
