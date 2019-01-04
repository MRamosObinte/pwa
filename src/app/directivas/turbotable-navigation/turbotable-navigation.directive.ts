import { Directive, OnInit, ElementRef, HostListener } from '@angular/core';
import { Table } from 'primeng/table';

@Directive({
  selector: '[appTurbotableNavigation]'
})
export class TurbotableNavigationDirective implements OnInit {

  constructor(private table: Table, private el: ElementRef<HTMLElement>) { }

  ngOnInit() {
    this.el.nativeElement.tabIndex = 1;
  }

  @HostListener('keydown.ArrowUp', ['$event']) ArrowUp($event: KeyboardEvent) {
    this.table.selection = this.getItemNav(-1);
    this.table.selectionChange.emit(this.table.selection);
    this.table.onRowSelect.emit({ originalEvent: $event, data: this.table.selection, type: 'row' });
    event.preventDefault();
  }

  @HostListener('keydown.ArrowDown', ['$event']) ArrowDown($event: KeyboardEvent) {
    this.table.selection = this.getItemNav(1);
    this.table.selectionChange.emit(this.table.selection);
    this.table.onRowSelect.emit({ originalEvent: $event, data: this.table.selection, type: 'row' });
    event.preventDefault();
  }

  getItemNav(num) {
    if (!this.table.selection) { return; }
    if (this.table.filteredValue) {
      var index = this.table.filteredValue.indexOf(this.table.selection);
      var len = this.table.filteredValue.length;
      var selIndex = 0;
      if (num > 0) {
        selIndex = index === (len - 1) ? len - 1 : index + 1;
        this.enfocarFila(selIndex);
        return this.table.filteredValue[selIndex];
      }
      selIndex = index === 0 ? 0 : index - 1;
      this.enfocarFila(selIndex);
      return this.table.filteredValue[selIndex];
    } else {
      var index = this.table.value.indexOf(this.table.selection);
      var len = this.table.value.length;
      if (num > 0) {
        selIndex = index === (len - 1) ? len - 1 : index + 1;
        this.enfocarFila(selIndex);
        return this.table.value[selIndex];
      }
      selIndex = index === 0 ? 0 : index - 1;
      this.enfocarFila(selIndex);
      return this.table.value[selIndex];
    }
  }

  enfocarFila(selIndex: number) {
    let element: NodeListOf<HTMLElement> = this.el.nativeElement.querySelectorAll("tr[tabindex='" + selIndex + "']") as NodeListOf<HTMLElement>;
    element && element.length > 0 ? element[0].focus() : null;
  }
}
