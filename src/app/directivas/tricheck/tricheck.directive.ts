import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appTricheck]'
})
export class TricheckDirective implements OnChanges {
  @Input('appTricheck') public appTricheck: boolean;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes) {
    if (changes.appTricheck) {
      if (changes.appTricheck.currentValue === null) {
        this.el.nativeElement.indeterminate = true;
      }else{
        this.el.nativeElement.indeterminate = false;
      }
    }
  }
}
