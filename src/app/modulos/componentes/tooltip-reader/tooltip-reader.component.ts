import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-tooltip-reader',
  templateUrl: './tooltip-reader.component.html'
})
export class TooltipReaderComponent implements IHeaderAngularComp {

  public params: any;
  public class: string = "";
  public tooltip: string = "";
  public text: string = "";
  public ascSort: boolean = false;
  public descSort: boolean = false;
  public noSort: boolean = false;
  public generalClass: string = "";

  constructor() { }

  agInit(params: any): void {
    this.params = params;
    this.class = params.class ? params.class : "";
    this.tooltip = params.tooltip ? params.tooltip : "";
    this.text = params.text ? params.text : "";
    this.generalClass = params.column && params.column.colDef && params.column.colDef.headerClass ? params.column.colDef.headerClass : '';
    params.enableSorting ? params.column.addEventListener('sortChanged', this.onSortChanged.bind(this)) : null;
  }

  onSortChanged() {
    this.ascSort = this.descSort = this.noSort = false;
    if (this.params.column.isSortAscending()) {
      this.ascSort = true;
    } else if (this.params.column.isSortDescending()) {
      this.descSort = true;
    } else {
      this.noSort = true;
    }
  }

  ordenarColumna(event) {
    if (this.params.enableSorting) {
      this.ascSort = this.descSort = this.noSort = false;
      if (this.params.column.isSortAscending()) {
        this.onSortRequested('desc', event);
        this.descSort = true;
      } else if (this.params.column.isSortDescending()) {
        this.onSortRequested('', event);
        this.noSort = true;
      } else {
        this.onSortRequested('asc', event);
        this.ascSort = true;
      }
    }
  }

  onSortRequested(order, event) {
    this.params.setSort(order, event.shiftKey);
  }
}
