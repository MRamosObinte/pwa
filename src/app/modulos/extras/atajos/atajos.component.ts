import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid';
import { AtajosService } from './atajos.service';
import { FilasTiempo } from '../../../enums/FilasTiempo';
import { LS } from '../../../constantes/app-constants';
import { FilasResolve } from '../../../serviciosgenerales/filas.resolve';

@Component({
  selector: 'app-atajos',
  templateUrl: './atajos.component.html'
})
export class AtajosComponent implements OnInit {

  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public cargando: boolean = false;
  public constantes: any = LS;

  public atajos: Array<any> = new Array();
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public rowClassRules;

  constructor(
    private filasService: FilasResolve,
    private atajosService: AtajosService
  ) { }

  ngOnInit() {
    this.atajos = this.atajosService.obtenerAtajos();
    this.iniciarAgGrid();
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.rowClassRules = {
      'color-oscuro': function (params) {
        return params.data.titulo;
      }
    };
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  generarColumnas(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.ATAJOS,
        field: 'atajo',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.COMANDO,
        field: 'comando',
        width: 200,
        minWidth: 200
      }
    );
    return columnas;
  }
  //#endregion

}
