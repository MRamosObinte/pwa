import { Component, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { UtilService } from '../../../serviciosgenerales/util.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mask-calendar',
  templateUrl: './mask-calendar.component.html'
})
export class MaskCalendarComponent implements ICellEditorAngularComp, AfterViewInit {

  private params: any;
  public value: string;
  public name: string;
  public required: boolean = false;
  public placeholder: string = "DD/MM/YYYY";
  public es: object = {};
  public conGuiones: boolean = false;


  @ViewChild('calendar', { read: ViewContainerRef }) public calendar;

  constructor(private utilService: UtilService) {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
  }

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.name = this.params.name + '_' + params.rowIndex;
    this.conGuiones = this.params.conGuiones ? true : false;
  }

  getValue(): any {
    if (this.conGuiones) {
      let date: Date = moment(this.value, 'DD-MM-YYYY').toDate();
      try {
        return new DatePipe('en-US').transform(date, 'dd-MM-yyyy');
      } catch (error) {
        return null;
      }
    } else {
      let date: Date = moment(this.value, 'DD/MM/YYYY').toDate();
      try {
        return new DatePipe('en-US').transform(date, 'dd/MM/yyyy');
      } catch (error) {
        return null;
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calendar.element.nativeElement.focus();
    })
  }

}
