import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-pinned-cell',
  templateUrl: './pinned-cell.component.html'
})
export class PinnedCellComponent implements ICellRendererAngularComp {
  public params: any;
  public value: any;
  public class: string;
  public style: any;

  agInit(params: any): void {
    this.params = params;
    this.value = params.value;
    this.class = this.params.class ? this.params.class : '';
    this.style = this.params.style ? this.params.style : {};
  }

  refresh(): boolean {
    return false;
  }
}