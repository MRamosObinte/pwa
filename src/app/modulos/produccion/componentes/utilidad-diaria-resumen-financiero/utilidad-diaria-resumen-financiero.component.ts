import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { UtilidadDiariaService } from '../../consultas/utilidad-diaria/utilidad-diaria.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { LS } from '../../../../constantes/app-constants';

@Component({
  selector: 'app-utilidad-diaria-resumen-financiero',
  templateUrl: './utilidad-diaria-resumen-financiero.component.html',
  styleUrls: ['./utilidad-diaria-resumen-financiero.component.css']
})
export class UtilidadDiariaResumenFinancieroComponent implements OnInit {

  @Input() listaResumenFinanciero
  //
  public innerWidth: number;
  public isScreamMd: boolean = true;
  //
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public constantes: any = {};
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;

  constructor(
    private utilidadDiariaService: UtilidadDiariaService,
    private filasService: FilasResolve
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.iniciarAgGrid();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.utilidadDiariaService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = this.innerWidth <= 576 ? false : true; this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }
}
