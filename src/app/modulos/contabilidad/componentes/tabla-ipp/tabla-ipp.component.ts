import { Component, OnInit, Input } from '@angular/core';
import { GridApi } from 'ag-grid';
import { LS } from '../../../../constantes/app-constants';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { HotkeysService } from 'angular2-hotkeys';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-tabla-ipp',
  templateUrl: './tabla-ipp.component.html',
  styleUrls: ['./tabla-ipp.component.css']
})
export class TablaIppComponent implements OnInit {

  @Input() columnas;
  @Input() listadoResultado;
  @Input() tamanio;
  @Input() filasTiempo: FilasTiempo = new FilasTiempo();
  public isScreamMd: boolean = true;
  public constantes: any = LS;
  public estilos: any = {};
  public filtroGlobal: string ="";
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
    private filasService: FilasResolve,
    public utilService: UtilService,
    private atajoService: HotkeysService
  ) { }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.definirAtajos();
    this.iniciarAgGrid();
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - ' + this.tamanio + ')'
    }
  }

  definirAtajos() {
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.columnas;
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      toolTip: TooltipReaderComponent
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.redimencionarColumnas();
    this.actualizarFilas();
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  onFilterChanged() {
    this.actualizarFilas();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

}
