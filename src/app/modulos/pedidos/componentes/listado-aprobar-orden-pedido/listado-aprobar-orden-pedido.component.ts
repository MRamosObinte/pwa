import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { InvPedidoTO } from '../../../../entidadesTO/inventario/InvPedidoTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { InvPedidosPK } from '../../../../entidades/inventario/InvPedidosPK';
import { OrdenPedidoService } from '../../transacciones/generar-orden-pedido/orden-pedido.service';

@Component({
  selector: 'app-listado-aprobar-orden-pedido',
  templateUrl: './listado-aprobar-orden-pedido.component.html'
})
export class ListadoAprobarOrdenPedidoComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() operacion: any;
  @Input() filasTiempoRecargar: boolean = false;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  public constantes: any = LS; //Referencia a las constantes
  public opciones: MenuItem[] = []; //Listado de opciones que apareceran en la lista
  public isScreamMd: boolean; //Bandera para indicar el tamaño de la pantalla
  public es: any = {}; //Locale Date (Obligatoria)
  public activar: boolean = false;
  public cargando: boolean = false;
  public accion: string = null;
  //Cambian al mostrar u ocultar el listado
  public vistaListado: boolean = false;
  //[ELEMENTOS USADOS EN LA TABLA]
  public listadoResultado: Array<InvPedidoTO> = [];
  public objetoSeleccionado: InvPedidoTO = new InvPedidoTO(); //Objeto actualmente seleccionado
  //[ELEMENTOS DEL FORMULARIO ORDEN DE PEDIDO]
  public frmTitulo: string;
  public classTitulo: string;
  public dataFormularioPedido: any = null;
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
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public funcionesUsuario: Array<string> = [];//Funciones del usuario actual

  constructor(
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private ordenPedidoService: OrdenPedidoService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private api: ApiRequestService,
    private archivoService: ArchivoService
  ) { }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.iniciarAtajos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.parametrosBusqueda) {
      this.reiniciarValores();
      if (this.empresaSeleccionada && this.parametrosBusqueda) {
        LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
        let pmAprobacionAutomatica = this.parametrosBusqueda.pmAprobacionAutomatica;
        this.filtroGlobal = "";
        this.listarOrdenesPedido();
        this.iniciarAgGrid(pmAprobacionAutomatica);
      }
    }
    if (changes.filasTiempoRecargar) {
      this.actualizarFilas();
    }
    if (changes.operacion) {
      this.operacionEnLista(this.operacion);
    }
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarOrdenPedido') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirListado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarListado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true) && this.objetoSeleccionado) {
        this.consultarOrdenPedido();
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ANULAR, (): boolean => {
      if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true) && this.objetoSeleccionado) {
        if (this.objetoSeleccionado && this.ordenPedidoService.verificarPermiso(LS.ACCION_ANULAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_PEDIDO_APROBADO && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_PENDIENTE && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_ANULADO) {
          this.anularOrdenPedido();
        }
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_RESTAURAR, (): boolean => {
      if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true) && this.objetoSeleccionado) {
        if (this.objetoSeleccionado && this.ordenPedidoService.verificarPermiso(LS.ACCION_RESTAURAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_ANULADO) {
          this.resturarOrdenPedido();
        }
      }
      return false;
    }));
  }

  //Operaciones
  consultarOrdenPedido() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CONSULTAR;
      this.mostrarObjetoParaAccion(this.objetoSeleccionado);
    }
  }

  aprobarOrdenPedido(ordenPedido) {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_APROBAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_APROBAR;
      this.mostrarObjetoParaAccion(ordenPedido);
    }
  }

  desAprobarOrdenPedido(ordenPedido) {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_DESAPROBAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_DESAPROBAR;
      this.mostrarObjetoParaAccion(ordenPedido);
    }
  }

  anularOrdenPedido() {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_ANULAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_ANULAR;
      this.mostrarObjetoParaAccion(this.objetoSeleccionado);
    }
  }

  resturarOrdenPedido() {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_RESTAURAR, this, true)) {
      this.cargando = true;
      let pk = new InvPedidosPK({ pedEmpresa: this.objetoSeleccionado.codigoempresa, pedSector: this.objetoSeleccionado.codigosector, pedMotivo: this.objetoSeleccionado.codigomotivo, pedNumero: this.objetoSeleccionado.pedidonumero });
      this.api.post("todocompuWS/pedidosWebController/restaturarInvPedidos", { invPedidosPK: pk }, LS.KEY_EMPRESA_SELECT)
        .then(respuesta => {
          if (respuesta && respuesta.extraInfo) {
            this.objetoSeleccionado.estado = LS.ETIQUETA_POR_APROBAR_PEDIDO;
            this.objetoSeleccionado.pedanulado = false;
            this.refreshGrid();
            this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          } else {
            this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  listarOrdenesPedido() {
    this.filasTiempo.filas = 0;
    this.cargando = true;
    this.limpiarResultado();
    if (this.parametrosBusqueda.fechaInicio && this.parametrosBusqueda.fechaFin) {
      this.parametrosBusqueda['fechaInicio'] = this.utilService.formatearDateToStringDDMMYYYY(this.parametrosBusqueda.fechaInicio);
      this.parametrosBusqueda['fechaFin'] = this.utilService.formatearDateToStringDDMMYYYY(this.parametrosBusqueda.fechaFin);
    }
    this.funcionesUsuario = this.parametrosBusqueda ? this.parametrosBusqueda.funcionesUsuario : null;
    this.ordenPedidoService.listarOrdenesPedido(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarOrdenPedido(data) {
    this.listadoResultado = data ? data : [];
    this.actualizarFilas();
    this.vistaListado = true;
    this.cargando = false;
  }

  imprimirOrdenPedido(ordenPedido) {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let pk = new InvPedidosPK({ pedEmpresa: ordenPedido.codigoempresa, pedNumero: ordenPedido.pedidonumero, pedMotivo: ordenPedido.codigomotivo, pedSector: ordenPedido.codigosector })
      let parametro = { invPedidosPK: pk, nombreReporte: LS.NOMBRE_REPORTE_APROBAR_ORDEN_PEDIDO };
      this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosGeneral", parametro, this.empresaSeleccionada)
        .then(respuesta => {
          if (respuesta) {
            this.utilService.descargarArchivoPDF('ordenDePedido ' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listadoInvPedidosTOSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      if (listadoInvPedidosTOSeleccionado.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let respuestaVerificacionLista = this.utilService.enviarListadoPedidosSeleccionados(listadoInvPedidosTOSeleccionado.slice());
        if (respuestaVerificacionLista.conStatus) {
          this.cargando = false;
          this.toastr.warning(respuestaVerificacionLista.mensaje, LS.TAG_AVISO);
        } else {
          if (respuestaVerificacionLista.listadoResultado.length > 0) {
            let parametros = {
              codigoSector: this.parametrosBusqueda && this.parametrosBusqueda.busqueda ? this.parametrosBusqueda.busqueda : "",
              codigoMotivo: this.parametrosBusqueda && this.parametrosBusqueda.motivo ? this.parametrosBusqueda.motivo : "",
              listadoInvPedidosTO: listadoInvPedidosTOSeleccionado,
              nombreReporte: LS.NOMBRE_REPORTE_APROBAR_ORDEN_PEDIDO_LISTADO
            };
            this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosTO", parametros, this.empresaSeleccionada)
              .then(data => {
                if (data._body.byteLength > 0) {
                  this.utilService.descargarArchivoPDF('ListadoOrdenesPedido_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
                } else {
                  this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
                }
                this.cargando = false;
              }).catch(err => this.utilService.handleError(err, this));
          }
        }
      }
    }
  }

  imprimirIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listadoInvPedidosTOSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      let listaInvPedidosPK = this.ordenPedidoService.formatearImprimirPedidosIndividual(listadoInvPedidosTOSeleccionado);
      if (listaInvPedidosPK.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let respuestaVerificacionLista = this.utilService.enviarListadoPedidosSeleccionados(listadoInvPedidosTOSeleccionado.slice());
        if (respuestaVerificacionLista.conStatus) {
          this.cargando = false;
          this.toastr.warning(respuestaVerificacionLista.mensaje, LS.TAG_AVISO);
        } else {
          if (respuestaVerificacionLista.listadoResultado.length > 0) {
            let parametros = { listaInvPedidosPK: listaInvPedidosPK, nombreReporte: LS.NOMBRE_REPORTE_APROBAR_ORDEN_PEDIDO_LOTE };
            this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosLote", parametros, this.empresaSeleccionada)
              .then(data => {
                if (data._body.byteLength > 0) {
                  this.utilService.descargarArchivoPDF('OrdenesPedidos_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
                } else {
                  this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
                }
                this.cargando = false;
              }).catch(err => this.utilService.handleError(err, this));

          }
        }
      }
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let listadoInvPedidosTOSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      if (listadoInvPedidosTOSeleccionado.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let parametros = {
          codigoMotivo: this.parametrosBusqueda && this.parametrosBusqueda.motivoSeleccionado ? this.parametrosBusqueda.motivoSeleccionado.pmCodigo : "",
          listadoInvPedidosTO: listadoInvPedidosTOSeleccionado
        };
        this.archivoService.postExcel("todocompuWS/pedidosWebController/exportarReporteInvPedidosTO", parametros, this.empresaSeleccionada)
          .then(data => {
            if (data) {
              this.utilService.descargarArchivoExcel(data._body, "ListadoOrdenesPedido_");
            } else {
              this.toastr.warning(LS.MSJ_NO_DATA);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      }
    }
  }

  //Otros metodos
  reiniciarValores() {
    this.filasTiempo.filas = 0;
    this.activar = false;
    this.accion = null;
    this.dataFormularioPedido = null;
    this.vistaListado = false;
  }

  limpiarResultado() {
    this.vistaListado = false;
    this.listadoResultado = [];
    this.objetoSeleccionado = new InvPedidoTO();
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  mostrarObjetoParaAccion(ordenPedido: InvPedidoTO) {
    this.dataFormularioPedido = {
      accion: this.accion,
      invPedidosPK: new InvPedidosPK({
        pedEmpresa: ordenPedido.codigoempresa,
        pedMotivo: ordenPedido.codigomotivo,
        pedNumero: ordenPedido.pedidonumero,
        pedSector: ordenPedido.codigosector
      }),
      tipo: 'APROBAROP',
      invPedidoTO: ordenPedido
    }
    this.cargando = false;
  }

  operacionEnLista(event) {
    switch (event.accion) {
      case LS.LST_ACTUALIZAR: {
        this.refrescarTabla(event.objeto, 'U');
        break;
      }
      case LS.LST_LIMPIAR: {
        this.limpiarResultado();
        break;
      }
    }
    this.cancelar();
  }

  refrescarTabla(invPedidoTO: InvPedidoTO, operacion: string) {
    switch (operacion) {
      case 'U': {
        invPedidoTO.pedfecha = JSON.parse(JSON.stringify(this.utilService.convertirFechaStringYYYYMMDD(invPedidoTO.pedfecha)));
        var indexTemp = this.listadoResultado.findIndex(item => item.pedidonumero === invPedidoTO.pedidonumero);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = invPedidoTO;
        this.listadoResultado = listaTemporal;
        break;
      }
    }
    this.refreshGrid();
  }

  cancelar() {
    this.dataFormularioPedido = null;
    this.vistaListado = true;
    this.accion = null;
    this.enviarCancelar.emit();
    this.iniciarAtajos();
  }

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit({ activar: this.activar, deshabilitarOpciones: false, gridApi: this.gridApi });
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  cambiarActivarFormulario(event) {
    this.vistaListado = event.vistaListado;
    let objetoActivar = { 'activar': event.activar, 'deshabilitarOpciones': true }
    this.enviarActivar.emit(objetoActivar);
  }

  //Menu
  generarOpciones() {
    let perConsultar = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this);
    let perAprobar = this.ordenPedidoService.verificarPermiso(LS.ACCION_APROBAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_POR_APROBAR_PEDIDO;
    let perDesAprobar = this.ordenPedidoService.verificarPermiso(LS.ACCION_DESAPROBAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_PEDIDO_APROBADO && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_PENDIENTE && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_ANULADO;
    let perAnular = this.utilService.verificarPermiso(LS.ACCION_ANULAR, this) && this.funcionesUsuario.indexOf('Aprobador') > -1 && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_PEDIDO_APROBADO && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_PENDIENTE && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_ANULADO;
    let perRestaurar = this.utilService.verificarPermiso(LS.ACCION_RESTAURAR, this) && this.funcionesUsuario.indexOf('Aprobador') > -1 && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_ANULADO;
    let perImprimir = this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_ANULADO;

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.consultarOrdenPedido() : null },
      { label: LS.ACCION_APROBAR, icon: LS.ICON_APROBAR, disabled: !perAprobar, command: () => perAprobar ? this.aprobarOrdenPedido(this.objetoSeleccionado) : null },
      { label: LS.ACCION_DESAPROBAR, icon: LS.ICON_DESAPROBAR, disabled: !perDesAprobar, command: () => perDesAprobar ? this.desAprobarOrdenPedido(this.objetoSeleccionado) : null },
      { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !perAnular, command: () => perAnular ? this.anularOrdenPedido() : null },
      { label: LS.ACCION_RESTAURAR, icon: LS.ICON_RESTAURAR, disabled: !perRestaurar, command: () => perRestaurar ? this.resturarOrdenPedido() : null },
      { label: LS.ACCION_IMPRIMIR, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: () => perImprimir ? this.imprimirOrdenPedido(this.objetoSeleccionado) : null }
    ];
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  //Tabla
  iniciarAgGrid(pmAprobacionAutomatica) {
    this.columnDefs = this.ordenPedidoService.generarColumnasOrdenPedidoAprobar(pmAprobacionAutomatica);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      iconoEstado: IconoEstadoComponent
    };
    this.components = {};
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
    this.objetoSeleccionado = fila ? fila.data : null;
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }
}
