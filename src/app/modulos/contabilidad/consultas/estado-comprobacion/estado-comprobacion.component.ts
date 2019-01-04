import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { ConBalanceComprobacionTO } from '../../../../entidadesTO/contabilidad/ConBalanceComprobacionTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { EstadoComprobacionService } from './estado-comprobacion.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ContextMenu } from 'primeng/contextmenu';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';

@Component({
  selector: 'app-estado-comprobacion',
  templateUrl: './estado-comprobacion.component.html',
  styleUrls: ['./estado-comprobacion.component.css']
})
export class EstadoComprobacionComponent implements OnInit {
  public listaResultadoEstadoComprobacion: Array<ConBalanceComprobacionTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public balanceComprobacionSeleccionado: ConBalanceComprobacionTO = new ConBalanceComprobacionTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public fechaInicio: Date;
  public fechaFin: Date;
  public fechaActual: Date;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public constantes: any = LS;
  public es: object = {};
  public tamanioEstructura: number = 0;
  public cargando: boolean = false;
  public activar: boolean = false;
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public ocultarOpciones: boolean = false;
  public objetoMayorAuxiliarDesdeFuera;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  public mostrarFormularioMayorAuxiliar: boolean = false;;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  public longitudGrupo1: number = 0;
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
  public filtroGlobal = "";
  //
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  public listadoPeriodos: Array<SisPeriodo> = new Array();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private sectorService: SectorService,
    private planContableService: PlanContableService,
    private sistemaService: AppSistemaService,
    private estadoComprobacionService: EstadoComprobacionService,
    private periodoService: PeriodoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["estadosComprobacion"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  //PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  consultarMayorAuxiliar() {
    if (this.balanceComprobacionSeleccionado.bcCuenta && this.balanceComprobacionSeleccionado.bcCuenta.length === this.tamanioEstructura) {
      this.objetoMayorAuxiliarDesdeFuera = {
        empresa: this.empresaSeleccionada,
        codigoCuentaDesde: this.balanceComprobacionSeleccionado.bcCuenta,
        cuentaDetalle: this.balanceComprobacionSeleccionado.bcDetalle.trim(),
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin,
        mostrarBtnCancelar: true,
        listaSectores: this.listaSectores,
        sector: this.sectorSeleccionado
      };
      this.mostrarFormularioMayorAuxiliar = true;
    }
  }

  cerrarMayorAuxiliar(event) {
    this.mostrarFormularioMayorAuxiliar = event;
    this.objetoMayorAuxiliarDesdeFuera = null;
    this.actualizarFilas();
    this.generarAtajosTeclado();
  }

  //LISTADOS
  listarEstadoComprobacion(form: NgForm, ocultarDetalle) {
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid && this.fechasValidos.fechaInicioValido && this.fechasValidos.fechaFinValido) {
      let parametro = {
        ocultarDetalle: ocultarDetalle,
        fechaInicio: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaFin: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        empresa: this.empresaSeleccionada.empCodigo,
        codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null
      }
      this.filasTiempo.iniciarContador();
      this.cargando = true;
      this.ocultarOpciones = ocultarDetalle;
      this.estadoComprobacionService.listarEstadoComprobacion(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarEstadoComprobacion(data) {
    this.iniciarAgGrid();
    this.filasTiempo.finalizarContador();
    this.listaResultadoEstadoComprobacion = data;
    this.cargando = false;
  }

  /**Metodo que lista todos los sectores segun empresa*/
  listarSectores() {
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Este metodo se ejecuta despues de haber ejecutado el metodo listarSectores() y asi obetener seleccionar el sector  */
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  //VALIDACIONES
  validarFechas(tipo) {
    this.fechasValidos = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaInicio, this.fechaFin)));
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.obtenerFechaInicioActualMes();
    this.limpiarResultado();
    this.listarSectores();
    this.listarPeriodos();
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.longitudGrupo1 = data[0].estGrupo1;
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.listaResultadoEstadoComprobacion = [];
    this.filasService.actualizarFilas("0", "0");
  }

  listarPeriodos() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.cargando = true;
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPeriodos(listadoPeriodos) {
    this.listadoPeriodos = listadoPeriodos ? listadoPeriodos : [];
    this.cargando = false;
    if (this.listadoPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado ? this.listadoPeriodos.find(item => item.perCerrado === false) : this.listadoPeriodos[0];
      this.fechaFin = new Date(this.periodoSeleccionado.perHasta);
      this.fechaActual = new Date(this.periodoSeleccionado.perHasta);
    } else {
      this.periodoSeleccionado = null;
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarEstadoComprobacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarBalanceComprobacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirBalanceComprobacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarBalanceComprobacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultadoEstadoComprobacion.length > 0) {
        this.consultarMayorAuxiliar();
      }
      return false;
    }))
  }

  generarOpciones() {
    let isValido = this.listaResultadoEstadoComprobacion.length > 0 ? this.balanceComprobacionSeleccionado.bcCuenta.length === this.tamanioEstructura : false;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_MAYOR_AUXILIAR, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.consultarMayorAuxiliar() : null }
    ];
  }

  imprimirBalanceComprobacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        listConBalanceComprobacionTO: this.listaResultadoEstadoComprobacion
      };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteBalanceComprobacion", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoEstadoComprobacion.pdf', data);
          } else {
            this.toastr.warning("El reporte no existe o tiene errores");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarBalanceComprobacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        listConBalanceComprobacionTO: this.listaResultadoEstadoComprobacion
      };
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteEstadosComprobacion", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "estadoComprobacion_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.estadoComprobacionService.generarColumnas(this, this.ocultarOpciones, this.longitudGrupo1);
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
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
    this.balanceComprobacionSeleccionado = fila ? fila.data : null;
  }

  ejecutarAccion(data) {
    this.balanceComprobacionSeleccionado = data;
    this.consultarMayorAuxiliar();
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.balanceComprobacionSeleccionado = data;
    if (this.balanceComprobacionSeleccionado.bcCuenta.length === this.tamanioEstructura) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
