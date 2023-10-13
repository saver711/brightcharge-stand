import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { NgModel } from '@angular/forms';

export const alphaNumericConst = {
  alphanumeric: /\s/g,
  numeric: /[^0-9.]*/g,
};

@Directive({
  selector: '[bsAlphaNumeric]',
  providers: [NgModel],
})
export class AlphaNumericDirective {
  @Input() bsAlphaNumeric: 'alphanumeric' | 'numeric' = 'alphanumeric';
  @Output() alphaNumericChange: EventEmitter<object> = new EventEmitter();

  constructor(private boundedElement: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this.boundedElement.nativeElement.value as string;
    this.boundedElement.nativeElement.value = initialValue.replace(
      alphaNumericConst[this.bsAlphaNumeric],
      ''
    );
    if (initialValue !== this.boundedElement.nativeElement.value) {
      this.alphaNumericChange.emit({
        value: this.boundedElement.nativeElement.value,
        type: 'appAlphaNumeric',
      });
      event.stopPropagation();
    }
  }
}
