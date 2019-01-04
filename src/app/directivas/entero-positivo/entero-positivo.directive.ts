import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appEnteroPositivo]'
})
export class EnteroPositivoDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) keypress(event: KeyboardEvent) {
    if (!(event.charCode >= 48 && event.charCode <= 57)) {
      event.preventDefault();
    }
  }
}
