import { Component, OnInit, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { UtilidadesPrecalculadasService } from './utilidades-precalculadas.service';
import { RhFunUtilidadesCalcularTO } from '../../../../entidadesTO/rrhh/RhFunUtilidadesCalcularTO';
import { RhUtilidadesPeriodoTO } from '../../../../entidadesTO/rrhh/RhUtilidadesPeriodoTO';
import { PeriodoUtilidadService } from '../../archivo/periodo-utilidad/periodo-utilidad.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-utilidades-precalculadas',
  templateUrl: './utilidades-precalculadas.component.html'
})
export class UtilidadesPrecalculadasComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaResultado: Array<RhFunUtilidadesCalcularTO> = [];
  public listaPeriodos: Array<RhUtilidadesPeriodoTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public periodoSeleccionado: RhUtilidadesPeriodoTO = new RhUtilidadesPeriodoTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
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
    private periodoUtilidadesService: PeriodoUtilidadService,
    private sectorService: SectorService,
    private utilidadesPrecalculadasService: UtilidadesPrecalculadasService
  ) {
    this.listaEmpresas = this.route.snapshot.data['utilidadesPreCalculo'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtgajosTeclado();
  }

  ngOnInit() {
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.periodoSeleccionado = null;
    this.listarSectores();
    this.listarPeriodos();
    this.limpiarResultado();
  }

  generarAtgajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarUtilidades') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarUtilidades') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarUtilidades') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirUtilidades') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  listarSectores() {
    this.limpiarResultado();
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  listarPeriodos() {
    this.limpiarResultado();
    this.listaPeriodos = [];
    this.cargando = true;
    this.periodoUtilidadesService.listaRhUtilidadesPeriodoTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarRhUtilidadesPeriodoTO(data) {
    this.listaPeriodos = data;
    if (this.listaPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.utiDescripcion ? this.listaPeriodos.find(item => item.utiDescripcion === this.periodoSeleccionado.utiDescripcion) : this.listaPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas(0, 0);
  }

  //Operaciones
  buscarUtilidades(form: NgForm) {
    this.limpiarResultado();
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.filasTiempo.iniciarContador();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        desde: this.periodoSeleccionado ? this.periodoSeleccionado.utiDesde : null,
        hasta: this.periodoSeleccionado ? this.periodoSeleccionado.utiHasta : null
      };
      this.utilidadesPrecalculadasService.listautilidadesPrecalculadas(parametro, this, LS.KEY_EMPRESA_SELECT)
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarutilidadesPrecalculadas(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirUtilidades() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        periodo: this.periodoSeleccionado ? this.periodoSeleccionado.utiDescripcion : '',
        fechaDesde: this.periodoSeleccionado ? this.periodoSeleccionado.utiDesde : '',
        fechaHasta: this.periodoSeleccionado ? this.periodoSeleccionado.utiHasta : '',
        fechaMaxima: this.periodoSeleccionado ? this.periodoSeleccionado.utiFechaMaximaPago : '',
        rhFunUtilidadesCalcularTOs: this.listaResultado
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteCalcularUtilidades", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoUtilidades.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarUtilidades() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.periodoSeleccionado ? this.periodoSeleccionado.utiDesde : '',
        fechaHasta: this.periodoSeleccionado ? this.periodoSeleccionado.utiHasta : '',
        rhFunUtilidadesCalcularTO: this.listaResultado
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteCalcularUtilidades", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoUtilidades_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.utilidadesPrecalculadasService.generarColumnas(this);
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
