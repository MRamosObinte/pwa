import { Component, OnInit, ChangeDetectorRef, HostListener, ViewChild } from '@angular/core';
import { ConMayorAuxiliarTO } from '../../../../entidadesTO/contabilidad/ConMayorAuxiliarTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';
import { MenuItem } from 'primeng/api';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { MayorAuxiliarService } from '../mayor-auxiliar/mayor-auxiliar.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';
import { ListadoPlanCuentasComponent } from '../../componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';

@Component({
  selector: 'app-mayor-auxiliar-multiple',
  templateUrl: './mayor-auxiliar-multiple.component.html',
  styleUrls: ['./mayor-auxiliar-multiple.component.css']
})
export class MayorAuxiliarMultipleComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaResultadoMayorAuxiliarMul: Array<ConMayorAuxiliarTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public mayorAuxiliarMultipleSeleccionado: ConMayorAuxiliarTO = new ConMayorAuxiliarTO();
  public conCuentasDesde: ConCuentasTO = new ConCuentasTO();
  public conCuentasHasta: ConCuentasTO = new ConCuentasTO();
  public fechaInicio: Date;
  public fechaFin: Date;
  public fechaActual: any;
  public constantes: any;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public es: object = {};
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public innerWidth: number;
  public tamanioEstructura: number = 0;
  public opciones: MenuItem[];
  public codigoCuentaDesde: string = null;
  public codigoCuentaHasta: string = null;
  public objetoContableEnviar = null;
  public cargando: boolean = false;
  public activar: boolean = false;
  public mostrarContabilidaAcciones: boolean = false;
  public isSeleccionarPrimeraFila: boolean = true;
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public screamXS: boolean = true;
  
  public listadoPeriodos: Array<SisPeriodo> = new Array();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private sectorService: SectorService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private modalService: NgbModal,
    private planContableService: PlanContableService,
    private mayorAuxiliarService: MayorAuxiliarService,
    private utilService: UtilService,
    private cdRef: ChangeDetectorRef,
    private sistemaService: AppSistemaService,
    private periodoService: PeriodoService,
    private archivoService: ArchivoService) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data["mayorAuxiliarMultiple"];
    this.innerWidth = window.innerWidth;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    //Inicializar tabla
    this.iniciarAgGrid();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarMayorAuxiliarMultiple') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarMayorAuxiliar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultadoMayorAuxiliarMul.length > 0) {
        this.operacionMayorAuxiliarMultiple(LS.ACCION_CONSULTAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MAYORIZAR, (): boolean => {
      if (this.listaResultadoMayorAuxiliarMul.length > 0) {
        this.operacionMayorAuxiliarMultiple(LS.ACCION_MAYORIZAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_DESMAYORIZAR, (): boolean => {
      if (this.listaResultadoMayorAuxiliarMul.length > 0) {
        this.operacionMayorAuxiliarMultiple(LS.ACCION_DESMAYORIZAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_REVERSAR, (): boolean => {
      if (this.listaResultadoMayorAuxiliarMul.length > 0) {
        this.operacionMayorAuxiliarMultiple(LS.ACCION_REVERSAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ANULAR, (): boolean => {
      if (this.listaResultadoMayorAuxiliarMul.length > 0) {
        this.operacionMayorAuxiliarMultiple(LS.ACCION_ANULAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_RESTAURAR, (): boolean => {
      if (this.listaResultadoMayorAuxiliarMul.length > 0) {
        this.operacionMayorAuxiliarMultiple(LS.ACCION_RESTAURAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirMayorAuxiliarMultiple') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarMayorAuxiliarMultiple') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  operacionMayorAuxiliarMultiple(accion) {
    if (this.mayorAuxiliarService.verificarPermiso(accion, this, true) && this.mayorAuxiliarMultipleSeleccionado.maContable) {
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: accion,
        contable: this.mayorAuxiliarMultipleSeleccionado.maContable,
        listadoSectores: this.listaSectores,
        tamanioEstructura: this.tamanioEstructura,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: null,
        listaPeriodos: [],
        volverACargar: true
      };
    }
  }

  imprimirListadoMayorAuxiliarMultiple() {
    if (this.mayorAuxiliarService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        empresa: this.empresaSeleccionada.empCodigo,
        ListaConMayorAuxiliarTO: this.listaResultadoMayorAuxiliarMul,
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        ctaDesde: this.codigoCuentaDesde,
        ctaHasta: this.codigoCuentaHasta
      };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/imprimirReporteMayorAuxiliar", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoMayorAuxiliarMultiple.pdf', data);
          } else {
            this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarMayorAuxiliarMultiple() {
    if (this.mayorAuxiliarService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ConMayorAuxiliarTO: this.listaResultadoMayorAuxiliarMul, codigoCuenta: this.codigoCuentaDesde, fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio), fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin) };
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteConMayorAuxiliarTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "MayorAuxiliarMultiple_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //LISTADOS
  /** Metodo para listar mayor auxiliar dependiendo de la empresa,sector y fechas  */
  listarMayorAuxiliarMultipleTO(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid && this.fechasValidos.fechaInicioValido && this.fechasValidos.fechaFinValido) {
      this.filasTiempo.iniciarContador();
      this.listar();
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  listar() {
    let parametro = {
      codigoCuentaDesde: this.codigoCuentaDesde,
      codigoCuentaHasta: this.codigoCuentaHasta,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      empresa: this.empresaSeleccionada.empCodigo,
      sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null
    }
    this.cargando = true;
    this.mayorAuxiliarService.listarMayorAuxiliar(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarMayorAuxiliarMultipleTO() */
  despuesDeListarMayorAuxiliar(data) {
    this.filasTiempo.finalizarContador();
    this.listaResultadoMayorAuxiliarMul = data;
    this.cargando = false;
  }

  /** Metodo que lista todos los sectores segun empresa */
  listarSectores() {
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo se ejecuta despues de haber ejecutado el metodo listarSectores() y asi obetener seleccionar el sector  */
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  /** Metodo que se ejecuta cuando se selecciona la empresa */
  cambiarEmpresaSeleccionada() {
    this.conCuentasDesde.cuentaCodigo = null;
    this.conCuentasHasta.cuentaCodigo = null;
    this.conCuentasDesde.cuentaDetalle = null;
    this.conCuentasHasta.cuentaDetalle = null;
    this.codigoCuentaDesde = null;
    this.codigoCuentaHasta = null;
    this.sectorSeleccionado = null;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.obtenerFechaInicioActualMes()
    this.planContableService.getTamanioListaConEstructura(parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
    this.listarSectores();
    this.limpiarResultado();
    this.listarPeriodos();
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

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.listaResultadoMayorAuxiliarMul = [];
    this.filasService.actualizarFilas("0", "0");
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho */
  generarOpciones() {
    let isValido = this.mayorAuxiliarMultipleSeleccionado.maContable;
    let permisoMayorizar = isValido && this.mayorAuxiliarMultipleSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruMayorizarContables;
    let permisoDesMayorizar = isValido && this.mayorAuxiliarMultipleSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarContables;
    let permisoReversar = isValido && this.mayorAuxiliarMultipleSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
    let permisoAnular = isValido && this.mayorAuxiliarMultipleSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
    let permisoRestaurar = isValido && this.mayorAuxiliarMultipleSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.operacionMayorAuxiliarMultiple(LS.ACCION_CONSULTAR) : null },
      { label: LS.ACCION_MAYORIZAR, icon: LS.ICON_MAYORIZAR, disabled: !permisoMayorizar, command: () => permisoMayorizar ? this.operacionMayorAuxiliarMultiple(LS.ACCION_MAYORIZAR) : null },
      { label: LS.ACCION_DESMAYORIZAR, icon: LS.ICON_DESMAYORIZAR, disabled: !permisoDesMayorizar, command: () => permisoDesMayorizar ? this.operacionMayorAuxiliarMultiple(LS.ACCION_DESMAYORIZAR) : null },
      { label: LS.ACCION_REVERSAR, icon: LS.ICON_REVERSAR, disabled: !permisoReversar, command: () => permisoReversar ? this.operacionMayorAuxiliarMultiple(LS.ACCION_REVERSAR) : null },
      { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !permisoAnular, command: () => permisoAnular ? this.operacionMayorAuxiliarMultiple(LS.ACCION_ANULAR) : null },
      { label: LS.ACCION_RESTAURAR, icon: LS.ICON_RESTAURAR, disabled: !permisoRestaurar, command: () => permisoRestaurar ? this.operacionMayorAuxiliarMultiple(LS.ACCION_RESTAURAR) : null },
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.mayorAuxiliarService.generarColumnas('MayorAuxiliarMultiple');
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.mayorAuxiliarMultipleSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.mayorAuxiliarMultipleSeleccionado = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

  //VALIDACIONES
  //metodo para validar si el input la cuenta es correcto y no se envie otro codigo 
  validarCuentaDesde() {
    if (this.codigoCuentaDesde !== this.conCuentasDesde.cuentaCodigo) {
      this.codigoCuentaDesde = null;
      this.conCuentasDesde.cuentaCodigo = null;
      this.conCuentasDesde.cuentaDetalle = null;
      this.limpiarResultado();
    }
  }

  validarCuentaHasta() {
    if (this.codigoCuentaHasta !== this.conCuentasHasta.cuentaCodigo) {
      this.codigoCuentaHasta = null;
      this.conCuentasHasta.cuentaCodigo = null;
      this.conCuentasHasta.cuentaDetalle = null;
      this.limpiarResultado();
    }
  }

  //metodo para validar si las fechas son correctas
  validarFechas(tipo) {
    this.fechasValidos = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaInicio, this.fechaFin)));
  }

  //BUSQUEDAS
  /** Metodo que muestra un modal de todas las cuentas que coincidan con lo que se ingreso en el input de cuenta */
  buscarConCuentaDesde(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      if (!this.fueBuscadoAnteriormente(this.conCuentasDesde, this.codigoCuentaDesde)) {
        this.conCuentasDesde.cuentaCodigo = this.conCuentasDesde.cuentaCodigo === '' ? null : this.conCuentasDesde.cuentaCodigo;
        this.conCuentasDesde.cuentaCodigo = this.conCuentasDesde.cuentaCodigo ? this.conCuentasDesde.cuentaCodigo.toUpperCase() : null;
        if (this.conCuentasDesde.cuentaCodigo) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.conCuentasDesde.cuentaCodigo, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
          modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
          modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
          modalRef.result.then((result) => {
            this.codigoCuentaDesde = result ? result.cuentaCodigo : null;
            this.conCuentasDesde.cuentaCodigo = result ? result.cuentaCodigo : null;
            this.conCuentasDesde.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
            document.getElementById('cuentaDesde').focus();
          }, (reason) => {//Cuando se cierra sin un dato
            let element: HTMLElement = document.getElementById('cuentaDesde') as HTMLElement;
            element ? element.focus() : null;
          });
        }
      }
    }
  }

  buscarConCuentaHasta(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      if (!this.fueBuscadoAnteriormente(this.conCuentasHasta, this.codigoCuentaHasta)) {
        this.conCuentasHasta.cuentaCodigo = this.conCuentasHasta.cuentaCodigo === '' ? null : this.conCuentasHasta.cuentaCodigo;
        this.conCuentasHasta.cuentaCodigo = this.conCuentasHasta.cuentaCodigo ? this.conCuentasHasta.cuentaCodigo.toUpperCase() : null;
        if (this.conCuentasHasta.cuentaCodigo) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.conCuentasHasta.cuentaCodigo, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
          modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
          modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
          modalRef.result.then((result) => {
            this.codigoCuentaHasta = result ? result.cuentaCodigo : null;
            this.conCuentasHasta.cuentaCodigo = result ? result.cuentaCodigo : null;
            this.conCuentasHasta.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
            document.getElementById('cuentaHasta').focus();
          }, (reason) => {//Cuando se cierra sin un dato
            let element: HTMLElement = document.getElementById('cuentaHasta') as HTMLElement;
            element ? element.focus() : null;
          });
        }
      }
    }
  }

  fueBuscadoAnteriormente(cuenta, codigoCuentaCopia): boolean {
    return (cuenta.cuentaCodigo && cuenta.cuentaCodigo === codigoCuentaCopia);
  }

  //METODOS QUE EL COMPONENTE APP-CONTABLE-FORMULARIO NECESITA
  /** Metodo que se necesita para el componente app-contable-formulario, ya que setea de NULL la variable objetoContableEnviar y cambia de estado a FALSE la variable mostrarContabilidaAcciones para mostrar la pantalla de Mayor Auxiliar*/
  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : false;
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
    this.filasService.actualizarFilas(this.listaResultadoMayorAuxiliarMul.length, this.filasTiempo.getTiempo());
    this.cdRef.detectChanges();
    if (event.contable) {
      this.listar();
    }
    this.generarAtajosTeclado();
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
    this.cdRef.detectChanges();
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  verContable() {
    this.operacionMayorAuxiliarMultiple(LS.ACCION_CONSULTAR);
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
