import { AppSistemaService } from './../../../../serviciosgenerales/app-sistema.service';
import { SaldoConsolidadoSueldoPagarService } from './saldo-consolidado-sueldo-pagar.service';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { ArchivoService } from './../../../../serviciosgenerales/archivo.service';
import { HotkeysService } from 'angular2-hotkeys/src/hotkeys.service';
import { FilasResolve } from './../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from './../../../../enums/FilasTiempo';
import { RhListaSaldoConsolidadoSueldosPorPagarTO } from './../../../../entidadesTO/rrhh/RhListaSaldoConsolidadoSueldosPorPagarTO';
import { PermisosEmpresaMenuTO } from './../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { Hotkey } from 'angular2-hotkeys/src/hotkey.model';
import { Component, OnInit, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';

@Component({
  selector: 'app-saldo-consolidado-sueldo-pagar',
  templateUrl: './saldo-consolidado-sueldo-pagar.component.html',
  styleUrls: ['./saldo-consolidado-sueldo-pagar.component.css']
})
export class SaldoConsolidadoSueldoPagarComponent implements OnInit {
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaResultado: Array<RhListaSaldoConsolidadoSueldosPorPagarTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaHasta: Date;
  public fechaActual: Date;
  public es: object = {};
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public screamXS: boolean = true;
  public filtroGlobal = "";

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private archivoService: ArchivoService,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private saldoConsolidadoSueldoPagarService: SaldoConsolidadoSueldoPagarService
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['saldosConsolidadosSueldosPorPagar'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtgajosTeclado();
    this.obtenerFechaActual();
  }

  ngOnInit() {
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  generarAtgajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarSaldoConsSueldoPagar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarSaldoConsSueldoPagar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarSaldoConsSueldoPagar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirSaldoConsSueldoPagar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  obtenerFechaActual() {
    this.sistemaService.getFechaActual(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaHasta = data;
        this.fechaActual = data;
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas(0, 0);
  }

  //Operaciones
  buscarSaldoConsSueldoPagar() {
    this.cargando = true;
    this.filtroGlobal = "";
    this.filasTiempo.iniciarContador();
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta)
    };
    this.saldoConsolidadoSueldoPagarService.listaRhSaldoConsolidadoSueldosPorPagarTO(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarRhSaldoConsolidadoSueldosPorPagarTO(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirSaldoConsSueldoPagar() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        listaSaldoConsolidadoSueldosPorPagarTO: this.listaResultado
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteSaldoConsolidadoSueldosPorPagar", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoSaldoConsSueldoPagar.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarSaldoConsSueldoPagar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        listaSaldoConsolidadoSueldosPorPagarTO: this.listaResultado
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteSaldoConsolidadoSueldosPorPagar", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoSaldoConsSueldoPagar_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.saldoConsolidadoSueldoPagarService.generarColumnas();
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
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
