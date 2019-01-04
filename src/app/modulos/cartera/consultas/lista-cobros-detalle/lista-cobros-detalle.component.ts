import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { InvCliente } from '../../../../entidades/inventario/InvCliente';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ClienteListadoComponent } from '../../../inventario/componentes/cliente-listado/cliente-listado.component';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { ListaCobrosDetalleService } from './lista-cobros-detalle.service';
import { CarFunCobrosDetalleTO } from '../../../../entidadesTO/cartera/CarFunCobrosDetalleTO';
import { NgForm } from '@angular/forms';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { ConMayorAuxiliarTO } from '../../../../entidadesTO/contabilidad/ConMayorAuxiliarTO';
import { AnxRetencionesRentaComprasTO } from '../../../../entidadesTO/anexos/AnxRetencionesRentaComprasTO';
import { MayorAuxiliarService } from '../../../contabilidad/consultas/mayor-auxiliar/mayor-auxiliar.service';
import { ListaCobrosListadoService } from '../lista-cobros-listado/lista-cobros-listado.service';

@Component({
  selector: 'app-lista-cobros-detalle',
  templateUrl: './lista-cobros-detalle.component.html',
  styleUrls: ['./lista-cobros-detalle.component.css']
})
export class ListaCobrosDetalleComponent implements OnInit {

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  //
  public cliente: InvCliente = new InvCliente();
  public clienteCodigo: string = null;
  //
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  //
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public es: object = {};
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  //
  public listaResultado: Array<CarFunCobrosDetalleTO> = [];
  public objetoSeleccionado: CarFunCobrosDetalleTO;
  //
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};

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
  public rowClassRules: any = {};
  // INICIALIZACION PARA LLAMAR AL MAYOR AUXILIAR
  public mayorAuxiliarSeleccionado: AnxRetencionesRentaComprasTO = new AnxRetencionesRentaComprasTO;
  public objetoContableEnviar = null;
  public activarInicial: boolean = false;
  public mostrarContabilidaAcciones: boolean = false;
  public listadoResultadoMayorAuxiliar: Array<ConMayorAuxiliarTO> = [];
  public mostrarFormularioMayorAuxiliar: boolean = false;;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private modalService: NgbModal,
    private sistemaService: AppSistemaService,
    private sectorService: SectorService,
    private cobrosDetalleService: ListaCobrosDetalleService,
    private mayorAuxiliarService: MayorAuxiliarService,
    private cdRef: ChangeDetectorRef,
    private listadoCobrosService: ListaCobrosListadoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["cobrosDetalle"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.iniciarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
    this.focusClienteCodigo();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.cliente.invClientePK.cliCodigo = "";
    this.cliente.cliRazonSocial = "";
    this.sectorSeleccionado = null;
    this.listarSectores();
    this.limpiarResultado();
  }

  listarSectores() {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: true };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = (this.sectorSeleccionado && this.sectorSeleccionado.secCodigo) ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.filasService.actualizarFilas("0", "0");
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  buscarCarFunCobrosDetalleTO(form: NgForm) {
    this.cargando = true;
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      this.filasTiempo.iniciarContador();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        cliente: this.clienteCodigo
      }
      this.cobrosDetalleService.listarCarFunCobrosDetalleTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarCarFunCobrosDetalleTO(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirCarFunCobrosDetalle() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        cliente: this.cliente ? this.cliente.cliRazonSocial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listaResultado,
      };
      this.cobrosDetalleService.imprimirCarFunCobrosDetalle(parametros, this, this.empresaSeleccionada);
    }
  }

  exportarCarFunCobrosDetalle() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        cliente: this.cliente ? this.cliente.cliRazonSocial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listaResultado,
      };
      this.cobrosDetalleService.exportarCarFunCobrosDetalle(parametros, this, this.empresaSeleccionada);
    }
  }

  imprimirListaCobrosIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        numeroSistema: [this.objetoSeleccionado.cobNumeroSistema]
      }
      this.listadoCobrosService.imprimirCarFunCobrosPorLote(parametro, this, this.empresaSeleccionada);
    }
  }

  imprimirListaCobrosPorLote() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listadoCobrosSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      let cobrosPK: Array<String> = this.listadoCobrosService.obtenerCobrosPK(listadoCobrosSeleccionado);
      if (listadoCobrosSeleccionado.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let respuestaVerificacionLista = this.utilService.enviarListadoCobrosSeleccionados(listadoCobrosSeleccionado.slice());
        if (respuestaVerificacionLista.conStatus) {
          this.cargando = false;
          this.toastr.warning(respuestaVerificacionLista.mensaje, LS.TAG_AVISO);
        } else {
          if (respuestaVerificacionLista.listadoResultado.length > 0) {
            let parametro = {
              empresa: this.empresaSeleccionada.empCodigo,
              usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
              numeroSistema: cobrosPK
            }
            this.listadoCobrosService.imprimirCarFunCobrosPorLote(parametro, this, this.empresaSeleccionada);
          }
        }
      }
    }
  }

  //cliente
  buscarCliente(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.cliente.invClientePK.cliCodigo) {
      let fueBuscado = (this.cliente.invClientePK.cliCodigo && this.clienteCodigo && this.cliente.invClientePK.cliCodigo === this.clienteCodigo);
      if (!fueBuscado) {
        let parametro = { empresa: LS.KEY_EMPRESA_SELECT, busqueda: this.cliente.invClientePK.cliCodigo, mostrarInactivo: false }
        event.srcElement.blur();
        event.preventDefault();
        this.abrirModalCliente(parametro);
      }
    }
  }

  abrirModalCliente(parametro) {
    const modalRef = this.modalService.open(ClienteListadoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.parametros = parametro;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      if (result) {
        this.clienteCodigo = result ? result.cliCodigo : null;
        this.cliente.invClientePK.cliCodigo = result ? result.cliCodigo : null;
        this.cliente.cliRazonSocial = result ? result.cliRazonSocial : null;
        this.cliente.invClienteGrupoEmpresarial.geNombre = result ? result.cliGrupoEmpresarialNombre : null;
        this.focusClienteCodigo();
      } else {
        this.focusClienteCodigo();
      }
    }, () => {
      this.focusClienteCodigo();
    });
  }

  validarCliente() {
    if (this.cliente.invClientePK.cliCodigo !== this.clienteCodigo) {
      this.clienteCodigo = null;
      this.cliente = new InvCliente();
    }
  }

  focusClienteCodigo() {
    let element = document.getElementById('codCliente');
    element ? element.focus() : null;
  }

  iniciarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionMayorAuxiliar(LS.ACCION_CONSULTAR);
      }
      return false;
    }))
  }

  generarOpciones() {
    let isValido = this.objetoSeleccionado.cobNumeroSistema;
    let perImprimir = this.empresaSeleccionada.listaSisPermisoTO.gruImprimir;
    this.opciones = [
      { label: LS.LABEL_CONSULTAR_COBRO, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.irAlHijo({ accion: LS.ACCION_CONSULTAR, objetoSeleccionado: this.objetoSeleccionado }) : null },
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.operacionMayorAuxiliar(LS.ACCION_CONSULTAR) : null },
      { label: LS.LABEL_IMPRIMIR_COBROS, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: () => perImprimir ? this.imprimirListaCobrosIndividual() : null }
    ];
  }

    /**
   * event contiene la empresa seleccionada, la accion que se envia y otro parametro que se ajuste a la accion
   * @param {*} event
   */
  ejecutarAccion(event) {
    this.iniciarAtajosTeclado();
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_CONSULTAR:
        this.irAlHijo(event);
        break;
    }
  }

/**
 * Métodos para consultar cobros, envia parametrosFormulario (accion y objeto seleccionado)
 *
 * @memberof ListaCobrosDetalleComponent
 */
consultarCobros(){
    this.irAlHijo({ accion: LS.ACCION_CONSULTAR, objetoSeleccionado: this.objetoSeleccionado })
  }

  irAlHijo(event) {
    this.parametrosFormulario.accion = event.accion;
    this.parametrosFormulario.seleccionado = event.objetoSeleccionado;
    this.parametrosFormulario.cliente = this.cliente
    this.vistaFormulario = true;
  }

  cancelar() {
    this.vistaFormulario = false;
    this.activar = false;
  }

  /**
   * Método para llamar al contable, envia objetoContableEnviar
   *
   * @param {*} accion
   * @memberof ListaCobrosDetalleComponent
   */
  operacionMayorAuxiliar(accion) {
    if (this.mayorAuxiliarService.verificarPermiso(accion, this, true) && this.objetoSeleccionado.cobNumeroSistema) {
      this.cargando = true;
      this.activarInicial = JSON.parse(JSON.stringify(this.activar));
      this.objetoContableEnviar = {
        accion: accion,
        contable: this.objetoSeleccionado.cobNumeroSistema,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: null,
        listaPeriodos: [],
        volverACargar: true
      };
    }
  }

  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : this.activarInicial;
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
    this.filasService.actualizarFilas(this.listadoResultadoMayorAuxiliar.length, this.filasTiempo.getTiempo());
    this.cdRef.detectChanges();
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

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.cobrosDetalleService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.components = {};
    this.rowClassRules = {
      'fila-pendiente': function (params) {
        if (params.data.cobPendiente === true) {
          return true;
        }
        return false;
      }
    };
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
    this.objetoSeleccionado = fila ? fila.data : null;
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
    this.objetoSeleccionado = data;
    if (this.objetoSeleccionado.cobNumeroSistema) {
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
