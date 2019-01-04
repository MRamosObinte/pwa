import { Directive, HostListener, Input, ElementRef, Renderer, AfterViewInit, OnChanges } from '@angular/core';
import { EventEmitter, Output } from '@angular/core'

@Directive({
  selector: '[appRowSelector]'
})
export class RowSelectorDirective implements AfterViewInit, OnChanges {
  @Input('appRowSelector') indexSelect: number;
  @Input('appIndexLimit') indexLimit: number;
  @Input('value') value: Array<any>;
  @Output() updateIndex: EventEmitter<any> = new EventEmitter();
  @Output() updateFiltro: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnChanges(changes) {
    if (changes.indexSelect) {
      this.enfocarFila();
    }
    if(changes.value && this.value != null){
      this.updateFiltro.emit(true);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 38: {
        if (this.indexSelect === 0) {
          return;
        }
        this.indexSelect--;
        this.updateIndex.emit(this.indexSelect);
        event.preventDefault();
        break;
      }
      case 40: {
        if (this.indexSelect === this.indexLimit - 1) {
          return;
        }
        this.indexSelect++;
        this.updateIndex.emit(this.indexSelect);
        event.preventDefault();
        break;
      }
    }
  }

  enfocarFila() {
    var element = this.el.nativeElement.querySelectorAll("tr[tabindex='" + this.indexSelect + "']");
    element && element.length > 0 ? element[0].focus() : null;
  }

  ngAfterViewInit() {
    if (this.indexLimit > 0) {
      var element = this.el.nativeElement.querySelectorAll("tr[tabindex='0']");
      element && element.length > 0 ? element[0].focus() : null;
    }
  }
}
