import { Directive, ElementRef, OnChanges, Input, SimpleChanges, Attribute, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements OnChanges, AfterViewInit {
  @Input('appFocus') appFocus: boolean;

  constructor(
    private el: ElementRef,
    @Attribute('isAutocomple') public isAutocomple: string//No es obligatorio
  ) { }

  isAutocomplete() {
    if (!this.isAutocomple) return false;
    return this.isAutocomple === 'true' ? true : false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.appFocus && this.appFocus){
      this.el.nativeElement.focus();
    }
  }

  ngAfterViewInit() {
    //Si el componente es autocomplete busca el input y enfoca
    if (this.appFocus && this.isAutocomple) {
      let inputAutocomplete = this.el.nativeElement.getElementsByTagName('input');
      if(inputAutocomplete){
        inputAutocomplete[0].focus();
      }
    }
  }
}
