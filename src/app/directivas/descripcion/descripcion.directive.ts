import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDescripcion]'
})
export class DescripcionDirective {
  @Input('appDescripcion') appDescripcion: String;

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event'])
  keyEvent(e: KeyboardEvent) {
    var char = e.char || String.fromCharCode(e.charCode);
    if (!/^[A-Za-zÑñÁÉÍÓÚÜáéíóúü0-9 ,.#°-]$/i.test(char)) {
      e.preventDefault();
      return false;
    }else{

    }
  }

}
