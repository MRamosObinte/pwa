import { Directive, HostListener, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[ngModel][appLowercase]'
})
export class LowercaseDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  constructor(
    private el: ElementRef
  ) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      if (String(this.el.nativeElement.value).trim() === "") {
        event.preventDefault();
      }
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (!event.ctrlKey && !event.shiftKey && !event.metaKey && !event.altKey) {//Teclas que no modifican
      var start = this.el.nativeElement.selectionStart;
      var end = this.el.nativeElement.selectionEnd;
      this.el.nativeElement.value = this.el.nativeElement.value.toLowerCase();
      this.ngModelChange.emit(this.el.nativeElement.value);
      this.el.nativeElement.setSelectionRange(start, end);
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: KeyboardEvent) {
    this.value = this.el.nativeElement.value.toLowerCase();
    this.ngModelChange.emit(this.value);
  }
}
