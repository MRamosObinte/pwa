import { Component, OnInit, Input, HostListener } from '@angular/core';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { BanListaConciliacionBancariaTO } from '../../../../entidadesTO/banco/BanListaConciliacionBancariaTO';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ConciliacionBancariaService } from '../../transacciones/conciliacion-bancaria/conciliacion-bancaria.service';

@Component({
  selector: 'app-tabla-conciliacion-bancaria-credito',
  templateUrl: './tabla-conciliacion-bancaria-credito.component.html',
  styleUrls: ['./tabla-conciliacion-bancaria-credito.component.css']
})
export class TablaConciliacionBancariaCreditoComponent implements OnInit {

  @Input() listaConciliacionBancariaCredito;

  creditoSeleccionado: BanListaConciliacionBancariaTO = new BanListaConciliacionBancariaTO();


  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public screamXS: boolean = true;
  public innerWidth: number;
  public filtroGlobal = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();

  constructor(
    private filasService: FilasResolve,
    private conciliacionBancariaService: ConciliacionBancariaService,
  ) { }

  ngOnInit() {
    this.iniciarAgGrid();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.conciliacionBancariaService.generarColumnasConciliacionDebito();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {};
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.creditoSeleccionado = fila ? fila.data : null;
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
