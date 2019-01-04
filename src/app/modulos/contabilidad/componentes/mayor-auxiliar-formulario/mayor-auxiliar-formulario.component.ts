import { Component, OnInit, ChangeDetectorRef, HostListener, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ListadoPlanCuentasComponent } from '../listado-plan-cuentas/listado-plan-cuentas.component';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { ConMayorAuxiliarTO } from '../../../../entidadesTO/contabilidad/ConMayorAuxiliarTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { MayorAuxiliarService } from '../../consultas/mayor-auxiliar/mayor-auxiliar.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { NgForm } from '@angular/forms';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';

@Component({
  selector: 'app-mayor-auxiliar-formulario',
  templateUrl: './mayor-auxiliar-formulario.component.html',
  styleUrls: ['./mayor-auxiliar-formulario.component.css']
})
export class MayorAuxiliarFormularioComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listadoResultadoMayorAuxiliar: Array<ConMayorAuxiliarTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public mayorAuxiliarSeleccionado: ConMayorAuxiliarTO = new ConMayorAuxiliarTO();
  public conCuentas: ConCuentasTO = new ConCuentasTO();
  public fechaInicio: Date;
  public fechaFin: Date;
  public fechaActual: Date;
  public constantes: any = LS;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public es: object = {};
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public tamanioEstructura: number = 0;
  public opciones: MenuItem[];
  public codigoCuenta: String = null;
  public objetoContableEnviar = null;
  public cargando: boolean = false;
  public activar: boolean = false;
  public activarInicial: boolean = false;
  public mostrarContabilidaAcciones: boolean = false;
  public mostrarBtnCancelar: boolean = false;//true, para que se muestre el boton balanceComprobacionSeleccionado
  @Input() objetoMayorAuxiliarDesdeFuera;
  @Output() cerrarMayorAuxiliar = new EventEmitter();
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
    private archivoService: ArchivoService,
    private periodoService: PeriodoService,
  ) {
  }
  ngOnInit() {
    this.constantes = LS;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    if (this.objetoMayorAuxiliarDesdeFuera) {
      this.setearValoresMayorAuxiliarDesdeFuera();
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.obtenerEstructura();
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    } else {
      this.listaEmpresas = this.route.snapshot.data["mayorAuxiliar"];
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    }
    this.generarAtajosTeclado();
    //Inicializar tabla
    this.iniciarAgGrid();
    document.getElementById('cuenta').focus();
  }

  setearValoresMayorAuxiliarDesdeFuera() {
    this.listaEmpresas.push(this.objetoMayorAuxiliarDesdeFuera.empresa);
    this.empresaSeleccionada = this.listaEmpresas[0];
    this.conCuentas.cuentaCodigo = this.objetoMayorAuxiliarDesdeFuera.codigoCuentaDesde;
    this.conCuentas.cuentaDetalle = this.objetoMayorAuxiliarDesdeFuera.cuentaDetalle;
    this.codigoCuenta = this.conCuentas.cuentaCodigo;
    this.fechaInicio = this.objetoMayorAuxiliarDesdeFuera.fechaInicio;
    this.fechaFin = this.objetoMayorAuxiliarDesdeFuera.fechaFin;
    this.mostrarBtnCancelar = this.objetoMayorAuxiliarDesdeFuera.mostrarBtnCancelar;
    if (this.objetoMayorAuxiliarDesdeFuera.listaSectores.length > 0) {
      this.listaSectores = this.objetoMayorAuxiliarDesdeFuera.listaSectores;
      this.sectorSeleccionado = this.objetoMayorAuxiliarDesdeFuera.sector;
    } else {
      this.listarSectores();
    }
    this.listar();
  }

  //OPERACIONES
  /** Metodo que es llamado al dar clic derecho de la tabla de Mayor Auxiliar, y seteara las variables que se necesita para mostrarse en el componente app-contable-formulario*/
  operacionMayorAuxiliar(accion) {
    if (this.mayorAuxiliarService.verificarPermiso(accion, this, true) && this.mayorAuxiliarSeleccionado.maContable) {
      this.cargando = true;
      this.activarInicial = JSON.parse(JSON.stringify(this.activar));
      this.objetoContableEnviar = {
        accion: accion,
        contable: this.mayorAuxiliarSeleccionado.maContable,
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

  /** Metodo para imprimir listado de mayor auxiliar  */
  imprimirListadoMayorAuxiliar() {
    if (this.mayorAuxiliarService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        empresa: this.empresaSeleccionada.empCodigo,
        ListaConMayorAuxiliarTO: this.listadoResultadoMayorAuxiliar,
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        ctaDesde: this.codigoCuenta,
        ctaHasta: this.codigoCuenta
      };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/imprimirReporteMayorAuxiliar", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoMayorAuxiliar.pdf', data);
          } else {
            this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Metodo para exportar listado  de mayor auxiliar */
  exportarMayorAuxiliar() {
    if (this.mayorAuxiliarService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ConMayorAuxiliarTO: this.listadoResultadoMayorAuxiliar, codigoCuenta: this.codigoCuenta, fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio), fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin) };
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteConMayorAuxiliarTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "MayorAuxiliar_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //LISTADOS
  /** Metodo para listar mayor auxiliar dependiendo de la empresa,sector y fechas  */
  listarMayorAuxiliarTO(form?: NgForm) {
    this.filasTiempo.resetearContador();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid && this.fechasValidos.fechaInicioValido && this.fechasValidos.fechaFinValido) {
      this.listar();
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  listar() {
    this.filasTiempo.iniciarContador();
    let parametro = {
      codigoCuentaDesde: this.conCuentas.cuentaCodigo,
      codigoCuentaHasta: this.conCuentas.cuentaCodigo,
      fechaInicio: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
      fechaFin: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
      empresa: this.empresaSeleccionada.empCodigo,
      sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null
    }
    this.cargando = true;
    this.mayorAuxiliarService.listarMayorAuxiliar(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarMayorAuxiliarTO() */
  despuesDeListarMayorAuxiliar(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultadoMayorAuxiliar = data;
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

  //OTROS METODOS
  /** Metodo para limpiar la tabla */
  limpiarResultado() {
    this.listadoResultadoMayorAuxiliar = [];
    this.filasService.actualizarFilas("0", "0");
    this.listadoPeriodos = [];
    this.periodoSeleccionado = null;
  }

  /** Metodo que se ejecuta cuando se selecciona la empresa */
  cambiarEmpresaSeleccionada() {
    this.conCuentas.cuentaCodigo = null;
    this.conCuentas.cuentaDetalle = null;
    this.sectorSeleccionado = null;
    this.codigoCuenta = null;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.obtenerEstructura();
    this.listarSectores();
    this.limpiarResultado();
    this.fechaInicio = this.utilService.obtenerFechaInicioMes();
    this.obtenerFechaInicioActualMes();
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

  obtenerEstructura() {
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho */
  generarOpciones() {
    let isValido = this.mayorAuxiliarSeleccionado.maContable;
    let permisoMayorizar = isValido && this.mayorAuxiliarSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruMayorizarContables;
    let permisoDesMayorizar = isValido && this.mayorAuxiliarSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarContables;
    let permisoReversar = isValido && this.mayorAuxiliarSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
    let permisoAnular = isValido && this.mayorAuxiliarSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
    let permisoRestaurar = isValido && this.mayorAuxiliarSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.operacionMayorAuxiliar(LS.ACCION_CONSULTAR) : null },
      { label: LS.ACCION_MAYORIZAR, icon: LS.ICON_MAYORIZAR, disabled: !permisoMayorizar, command: () => permisoMayorizar ? this.operacionMayorAuxiliar(LS.ACCION_MAYORIZAR) : null },
      { label: LS.ACCION_DESMAYORIZAR, icon: LS.ICON_DESMAYORIZAR, disabled: !permisoDesMayorizar, command: () => permisoDesMayorizar ? this.operacionMayorAuxiliar(LS.ACCION_DESMAYORIZAR) : null },
      { label: LS.ACCION_REVERSAR, icon: LS.ICON_REVERSAR, disabled: !permisoReversar, command: () => permisoReversar ? this.operacionMayorAuxiliar(LS.ACCION_REVERSAR) : null },
      { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !permisoAnular, command: () => permisoAnular ? this.operacionMayorAuxiliar(LS.ACCION_ANULAR) : null },
      { label: LS.ACCION_RESTAURAR, icon: LS.ICON_RESTAURAR, disabled: !permisoRestaurar, command: () => permisoRestaurar ? this.operacionMayorAuxiliar(LS.ACCION_RESTAURAR) : null },
    ];
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarMayorAuxiliar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listadoResultadoMayorAuxiliar.length > 0) {
        this.operacionMayorAuxiliar(LS.ACCION_CONSULTAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MAYORIZAR, (): boolean => {
      if (this.listadoResultadoMayorAuxiliar.length > 0) {
        this.operacionMayorAuxiliar(LS.ACCION_MAYORIZAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_DESMAYORIZAR, (): boolean => {
      if (this.listadoResultadoMayorAuxiliar.length > 0) {
        this.operacionMayorAuxiliar(LS.ACCION_DESMAYORIZAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_REVERSAR, (): boolean => {
      if (this.listadoResultadoMayorAuxiliar.length > 0) {
        this.operacionMayorAuxiliar(LS.ACCION_REVERSAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ANULAR, (): boolean => {
      if (this.listadoResultadoMayorAuxiliar.length > 0) {
        this.operacionMayorAuxiliar(LS.ACCION_ANULAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_RESTAURAR, (): boolean => {
      if (this.listadoResultadoMayorAuxiliar.length > 0) {
        this.operacionMayorAuxiliar(LS.ACCION_RESTAURAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirMayorAuxiliar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarMayorAuxiliar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnRegresar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //VALIDACIONES
  //metodo para validar si el input la cuenta es correcto y no se envie otro codigo 
  validarCuenta() {
    if (this.codigoCuenta !== this.conCuentas.cuentaCodigo) {
      this.codigoCuenta = null;
      this.conCuentas.cuentaCodigo = null;
      this.conCuentas.cuentaDetalle = null;
      this.limpiarResultado();
    }
  }

  //metodo para validar si las fechas son correctas
  validarFechas(tipo) {
    this.fechasValidos = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaInicio, this.fechaFin)));
  }

  //BUSQUEDAS
  /** Metodo que muestra un modal de todas las cuentas que coincidan con lo que se ingreso en el input de cuenta */
  buscarConCuentas(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      let fueBuscado = (this.conCuentas.cuentaCodigo === this.codigoCuenta && this.conCuentas.cuentaCodigo && this.codigoCuenta);
      if (!fueBuscado) {
        this.conCuentas.cuentaCodigo = this.conCuentas.cuentaCodigo === '' ? null : this.conCuentas.cuentaCodigo;
        this.conCuentas.cuentaCodigo = this.conCuentas.cuentaCodigo ? this.conCuentas.cuentaCodigo.toUpperCase() : null;
        if (this.conCuentas.cuentaCodigo) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.conCuentas.cuentaCodigo, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
          modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
          modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
          modalRef.result.then((result) => {
            this.codigoCuenta = result ? result.cuentaCodigo : null;
            this.conCuentas.cuentaCodigo = result ? result.cuentaCodigo : null;
            this.conCuentas.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
            document.getElementById('cuenta').focus();
          }, (reason) => {//Cuando se cierra sin un dato
            let element: HTMLElement = document.getElementById('cuenta') as HTMLElement;
            element ? element.focus() : null;
          });
        }
      }
    }
  }

  //METODOS QUE EL COMPONENTE APP-CONTABLE-FORMULARIO NECESITA
  /** Metodo que se necesita para el componente app-contable-formulario, ya que setea de NULL la variable objetoContableEnviar y cambia de estado a FALSE la variable mostrarContabilidaAcciones para mostrar la pantalla de Mayor Auxiliar*/
  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : this.activarInicial;
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
    this.filasService.actualizarFilas(this.listadoResultadoMayorAuxiliar.length, this.filasTiempo.getTiempo());
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

  cerrarMayorAux() {
    this.cerrarMayorAuxiliar.emit(false);
  }

  verContable() {
    this.operacionMayorAuxiliar(LS.ACCION_CONSULTAR);
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.mayorAuxiliarService.generarColumnas('MayorAuxiliar');
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
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
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
    this.mayorAuxiliarSeleccionado = data;
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
    this.mayorAuxiliarSeleccionado = fila ? fila.data : null;
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
