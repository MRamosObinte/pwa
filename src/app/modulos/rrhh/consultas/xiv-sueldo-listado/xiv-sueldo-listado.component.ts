import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
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
import { XivSueldoListadoService } from './xiv-sueldo-listado.service';
import { PeriodoXivSueldoService } from '../../archivo/periodo-xiv-sueldo/periodo-xiv-sueldo.service';
import { RhXivSueldoPeriodoTO } from '../../../../entidadesTO/rrhh/RhXivSueldoPeriodoTO';
import { RhFunXivSueldoConsultarTO } from '../../../../entidadesTO/rrhh/RhFunXivSueldoConsultarTO';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-xiv-sueldo-listado',
  templateUrl: './xiv-sueldo-listado.component.html'
})
export class XivSueldoListadoComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaResultado: Array<RhFunXivSueldoConsultarTO> = [];
  public listaPeriodos: Array<RhXivSueldoPeriodoTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public periodoSeleccionado: RhXivSueldoPeriodoTO = new RhXivSueldoPeriodoTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public xivSueldoSeleccionado: RhFunXivSueldoConsultarTO = new RhFunXivSueldoConsultarTO();
  public constantes: any = LS;
  public cargando: boolean = false;
  public mostrarAccionesContabilidad: boolean = false;
  public activar: boolean = false;
  public opciones: MenuItem[];
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public objetoContableEnviar: any = {};

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
    private periodoXivService: PeriodoXivSueldoService,
    private sectorService: SectorService,
    private xivSueldoListadoService: XivSueldoListadoService
  ) {
    this.listaEmpresas = this.route.snapshot.data['xivSueldoListado'];
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
      let element: HTMLElement = document.getElementById('btnActivarXivSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarXivSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarXivSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirXivSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarOpciones() {
    let permiso = this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this);
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_CONSULTAR, command: () => this.verContable() },
      { label: LS.LABEL_IMPRIMIR_CONTABLE, icon: LS.ICON_IMPRIMIR, disabled: !permiso, command: () => permiso ? this.imprimirContable() : null },
      { label: LS.LABEL_IMPRIMIR_COMPROBANTE, icon: LS.ICON_IMPRIMIR, disabled: !permiso, command: () => permiso ? this.imprimirComprobanteXiVSueldo() : null },
    ];
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
    this.periodoXivService.listaRhXivSueldoPeriodoTO({}, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarRhXivSueldoPeriodoTO(data) {
    this.listaPeriodos = data;
    if (this.listaPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.periodoSecuencial ? this.listaPeriodos.find(item => item.periodoSecuencial === this.periodoSeleccionado.periodoSecuencial) : this.listaPeriodos[0];
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
  buscarXivSueldo(form: NgForm) {
    this.limpiarResultado();
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.filasTiempo.iniciarContador();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        desde: this.periodoSeleccionado ? this.periodoSeleccionado.xivDesde : null,
        hasta: this.periodoSeleccionado ? this.periodoSeleccionado.xivHasta : null
      };
      this.xivSueldoListadoService.listaRhFunConsultarXivSueld(parametro, this, LS.KEY_EMPRESA_SELECT)
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarRhFunConsultarXivSueld(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirXivSueldo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        periodo: this.periodoSeleccionado ? this.periodoSeleccionado.xivDescripcion : '',
        fechaDesde: this.periodoSeleccionado ? this.periodoSeleccionado.xivDesde : '',
        fechaHasta: this.periodoSeleccionado ? this.periodoSeleccionado.xivHasta : '',
        fechaMaxima: this.periodoSeleccionado ? this.periodoSeleccionado.xivFechaMaximaPago : '',
        rhFunXivSueldoConsultarTO: this.listaResultado
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteXivSueldoConsulta", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoXivSueldo.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarXivSueldo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.periodoSeleccionado ? this.periodoSeleccionado.xivDesde : '',
        fechaHasta: this.periodoSeleccionado ? this.periodoSeleccionado.xivHasta : '',
        rhFunXivSueldoConsultarTO: this.listaResultado
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteXivSueldoConsulta", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoXivSueldo_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //CONTABLE
  imprimirContable() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaPk = [];
      let pk = new ConContablePK();
      pk.conEmpresa = this.empresaSeleccionada.empCodigo;
      pk.conNumero = this.xivSueldoSeleccionado.xivNumero;
      pk.conPeriodo = this.xivSueldoSeleccionado.xivPeriodo;
      pk.conTipo = this.xivSueldoSeleccionado.xivTipo;
      listaPk.push(pk);
      let parametros = { listadoPK: listaPk };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableIndividual", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('Contable.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //COMPROBANTE
  imprimirComprobanteXiVSueldo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { RhFunXivSueldoConsultarTO: this.xivSueldoSeleccionado, fechaMaxima: this.periodoSeleccionado.xivFechaMaximaPago };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteComprobanteXIVSueldo", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('ComprobanteXivSueldo.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.xivSueldoListadoService.generarColumnas(this);
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

  ejecutarAccion(data) {
    this.xivSueldoSeleccionado = data;
    this.imprimirContable();
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.xivSueldoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
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

  //Contable
  verContable() {
    if (this.xivSueldoSeleccionado.xivPeriodo && this.xivSueldoSeleccionado.xivTipo && this.xivSueldoSeleccionado.xivNumero) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.xivSueldoSeleccionado.xivPeriodo + " | " + this.xivSueldoSeleccionado.xivTipo + " | " + this.xivSueldoSeleccionado.xivNumero,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        volverACargar: true
      };
      this.activar = true;
    } else {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
    }
  }

  cerrarContabilidadAcciones(event) {
    if (!event.noIniciarAtajoPadre) {
      this.generarAtgajosTeclado();
      this.activar = false;
      this.objetoContableEnviar = event.objetoEnviar;
      this.mostrarAccionesContabilidad = event.mostrarContilidadAcciones;
    }
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
  }

}
