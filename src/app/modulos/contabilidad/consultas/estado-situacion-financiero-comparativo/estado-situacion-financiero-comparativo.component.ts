import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ConBalanceGeneralComparativoTO } from '../../../../entidadesTO/contabilidad/ConBalanceGeneralComparativoTO';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { EstadoSituacionFinancieroComparativoService } from './estado-situacion-financiero-comparativo.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ContextMenu } from 'primeng/contextmenu';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';

@Component({
  selector: 'app-estado-situacion-financiero-comparativo',
  templateUrl: './estado-situacion-financiero-comparativo.component.html',
  styleUrls: ['./estado-situacion-financiero-comparativo.component.css']
})
export class EstadoSituacionFinancieroComparativoComponent implements OnInit {
  public listaResultado: Array<ConBalanceGeneralComparativoTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public estadoSituacionFinCompSeleccionado: ConBalanceGeneralComparativoTO = new ConBalanceGeneralComparativoTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public fechaAnterior: Date;
  public fechaActual: Date;
  public constantes: any = LS;
  public es: object = {};
  public tamanioEstructura: number = 0;
  public cargando: boolean = false;
  public activar: boolean = false;
  public opciones: MenuItem[];
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public ocultarOpciones: boolean = false;
  public objetoMayorAuxiliarDesdeFuera;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  public mostrarFormularioMayorAuxiliar: boolean = false;;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
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
    private estadoSituacionFinComp: EstadoSituacionFinancieroComparativoService,
    private periodoService: PeriodoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["estadoSituacionFinancieraComparativo"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  //LISTADOS
  listarFunBalanceGeneralComparativoTO(form: NgForm, ocultarDetalle) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid && this.fechasValidos.fechaInicioValido && this.fechasValidos.fechaFinValido) {
      this.limpiarResultado();
      let parametro = {
        ocultar: ocultarDetalle,
        fechaAnterior: this.fechaAnterior,
        fechaActual: this.fechaActual,
        empresa: this.empresaSeleccionada.empCodigo,
        secCodigo: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null
      }
      this.cargando = true;
      this.ocultarOpciones = ocultarDetalle;
      this.filasTiempo.iniciarContador();
      this.estadoSituacionFinComp.listarFunBalanceGeneralComparativoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarFunBalanceGeneralComparativoTO(data) {
    this.iniciarAgGrid();
    this.filasTiempo.finalizarContador();
    this.listaResultado = data;
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

  //OTROS
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.limpiarResultado();
    this.listarSectores();
    this.obtenerFechaInicioActualMes();
    this.listarPeriodos();
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
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
      this.fechaActual = new Date(this.periodoSeleccionado.perHasta);
    } else {
      this.periodoSeleccionado = null;
    }
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaAnterior = data[0];//Fecha inicio en la posicion 0
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  imprimirEstadoSituacionFinancieraComp() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaAnterior: this.utilService.convertirFechaStringDDMMYYYY(this.fechaAnterior),
        fechaActual: this.utilService.convertirFechaStringDDMMYYYY(this.fechaActual),
        codigoSector: this.sectorSeleccionado.secCodigo,
        listConBalanceGeneralComparativoTO: this.listaResultado
      };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteBalanceGeneralComparativo", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoEstadoSituacionFinancieraComparativa.pdf', data);
          } else {
            this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarEstadoSituacionFinancieraComp() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaAnterior: this.utilService.convertirFechaStringDDMMYYYY(this.fechaAnterior),
        fechaActual: this.utilService.convertirFechaStringDDMMYYYY(this.fechaActual),
        sector: this.sectorSeleccionado.secCodigo,
        listConBalanceGeneralComparativoTO: this.listaResultado
      };
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteEstadoSituacionFinancieraComparativo", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "estadoSituacionFinancieraComparativa_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarEstadoSituacionFinancieraComp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarEstadoSituacionFinancieraComp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirEstadoSituacionFinancieraComp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarEstadoSituacionFinancieraComp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.consultarMayorAuxiliar();
      }
      return false;
    }))
  }

  generarOpciones() {
    let isValido = this.listaResultado.length > 0 ? this.estadoSituacionFinCompSeleccionado.bgCuenta.length === this.tamanioEstructura : false;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_MAYOR_AUXILIAR, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.consultarMayorAuxiliar() : null }
    ];
  }

  //PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  consultarMayorAuxiliar() {
    if (this.estadoSituacionFinCompSeleccionado.bgCuenta && this.estadoSituacionFinCompSeleccionado.bgCuenta.length === this.tamanioEstructura) {
      this.objetoMayorAuxiliarDesdeFuera = {
        empresa: this.empresaSeleccionada,
        codigoCuentaDesde: this.estadoSituacionFinCompSeleccionado.bgCuenta,
        cuentaDetalle: this.estadoSituacionFinCompSeleccionado.bgDetalle.trim(),
        fechaInicio: this.fechaAnterior,
        fechaFin: this.fechaActual,
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

  //VALIDACIONES
  validarFechas(tipo) {
    this.fechasValidos = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaAnterior, this.fechaActual)));
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.estadoSituacionFinComp.generarColumnas(this);
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
    this.estadoSituacionFinCompSeleccionado = fila ? fila.data : null;
  }

  ejecutarAccion(data) {
    this.estadoSituacionFinCompSeleccionado = data;
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
      // scrolls to the first column
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      // sets focus into the first grid cell
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
    this.estadoSituacionFinCompSeleccionado = data;
    if (this.estadoSituacionFinCompSeleccionado.bgCuenta.length === this.tamanioEstructura) {
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
