import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements OnInit, OnChanges {

  @Input('rowData') rowData: any[];
  @Input('columnDefs') columnDefs: any[];
  @Input('components') components: any;
  @Input('context') context: any;
  @Input('frameworkComponents') frameworkComponents: any;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    //Si los parametros no son nulos 
    if (changes.columnDefs && this.columnDefs) {

    }
    if (changes.rowData && this.rowData) {

    }
  }

}
