import { Component, OnInit, OnChanges, ViewChild, Input, EventEmitter, Output, SimpleChanges, HostListener } from '@angular/core';
import { ContextMenu } from 'primeng/contextmenu';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { MenuItem } from 'primeng/api';
import { InvPedidoTO } from '../../../../entidadesTO/inventario/InvPedidoTO';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { InvPedidosPK } from '../../../../entidades/inventario/InvPedidosPK';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { OrdenPedidoService } from '../../transacciones/generar-orden-pedido/orden-pedido.service';

@Component({
  selector: 'app-listado-generar-orden-compra',
  templateUrl: './listado-generar-orden-compra.component.html'
})
export class ListadoGenerarOrdenCompraComponent implements OnInit, OnChanges {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() operacion: any;
  @Input() filasTiempoRecargar: boolean = false;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  //[ELEMENTOS GENERALES]
  @ViewChild("excelDownload") excelDownload;
  public constantes: any; //Referencia a las constantes
  public opciones: MenuItem[] = []; //Listado de opciones que apareceran en la lista
  public isScreamMd: boolean; //Bandera para indicar el tamaño de la pantalla
  public es: any = {}; //Locale Date (Obligatoria)
  public activar: boolean = false;
  public cargando: boolean = false;
  public carrito: boolean = false;
  public accion: string = null;
  //Cambian al mostrar u ocultar el listado
  public vistaListado: boolean = false;
  //[ELEMENTOS USADOS EN LA TABLA]
  public listadoResultado: Array<InvPedidoTO> = [];
  public objetoSeleccionado: InvPedidoTO = new InvPedidoTO(); //Objeto actualmente seleccionado
  //[ELEMENTOS DEL FORMULARIO ORDEN DE PEDIDO]
  public dataFormularioPedido: any = null;
  //[ELEMENTOS DE LA ORDEN DE COMPRA]
  public dataFormularioCompra: any = null;//Objeto a enviar para generar la orden de compra
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
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
    private archivoService: ArchivoService
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.es = utilService.setLocaleDate();
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.parametrosBusqueda) {
      this.reiniciarValores();
      if (this.empresaSeleccionada && this.parametrosBusqueda) {
        LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
        let pmAprobacionAutomatica = this.parametrosBusqueda.pmAprobacionAutomatica;
        //Buscar ordenes de pedido, 
        this.filtroGlobal = "";
        this.buscarOrdenesPedido();
        this.iniciarAgGrid(pmAprobacionAutomatica);
      }
    }
    if (changes.filasTiempoRecargar) {
      this.actualizarFilas();
    }
    if (changes.operacion) {
      this.operacionEnLista(this.operacion);
    }
    this.iniciarAtajos();
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarOrdenCompra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true) && this.objetoSeleccionado) {
        this.consultarOrdenPedido();
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (!this.dataFormularioPedido) {
        this.eliminarOrdenPedido(this.objetoSeleccionado);
      }
      return false;
    }));
  }

  reiniciarValores() {
    this.filasTiempo.filas = 0;
    this.activar = false;
    this.accion = null;
    this.dataFormularioPedido = null;
    this.dataFormularioCompra = null;
    this.vistaListado = false;
  }

  /** Filtra las ordenes de pedido */
  buscarOrdenesPedido() {
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

  /** Callback, despues de traer la lista de Ordenes de pedido */
  despuesDeListarOrdenPedido(data) {
    this.listadoResultado = data ? data : [];
    this.actualizarFilas();
    this.vistaListado = true;
    this.cargando = false;
  }

  /** Limpia la busqueda actualmente cargada */
  limpiarResultado() {
    this.vistaListado = false;
    this.listadoResultado = [];
    this.objetoSeleccionado = new InvPedidoTO();
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listadoInvPedidosTOSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      if (listadoInvPedidosTOSeleccionado.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let parametros = {
          codigoMotivo: this.parametrosBusqueda && this.parametrosBusqueda.motivo ? this.parametrosBusqueda.motivo : "",
          codigoSector: this.parametrosBusqueda && this.parametrosBusqueda.sector ? this.parametrosBusqueda.sector : "",
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

  imprimirIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listadoInvPedidosTOSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      let listaInvPedidosPK = this.ordenPedidoService.formatearImprimirPedidosIndividual(listadoInvPedidosTOSeleccionado);
      if (listaInvPedidosPK.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let parametros = {
          listaInvPedidosPK: listaInvPedidosPK,
          nombreReporte: LS.NOMBRE_REPORTE_APROBAR_ORDEN_PEDIDO_LOTE
        };
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

  //#region [R4] OPERACIONES DE ORDEN DE PEDIDO
  generarOpciones() {
    let perConsultar = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this);
    let perEliminar = this.ordenPedidoService.verificarPermiso(LS.ACCION_ELIMINAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_PENDIENTE;
    let perEjecutar = this.ordenPedidoService.verificarPermiso(LS.ACCION_EJECUTAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_PEDIDO_APROBADO;
    let perImprimir = this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_PENDIENTE;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.consultarOrdenPedido() : null },
      { label: LS.ACCION_GENERAR_ORDEN_COMPRA, icon: LS.ICON_EJECUTAR, disabled: !perEjecutar, command: () => perEjecutar ? this.ejecutarOrdenPedido(this.objetoSeleccionado) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.eliminarOrdenPedido(this.objetoSeleccionado) : null },
      { label: LS.ACCION_IMPRIMIR, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: () => perImprimir ? this.imprimirOrdenPedido(this.objetoSeleccionado) : null }
    ];
  }

  consultarOrdenPedido() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CONSULTAR;
      this.mostrarObjetoParaAccion(this.objetoSeleccionado);
    }
  }

  ejecutarOrdenPedido(ordenPedido) {
    if (this.utilService.verificarPermiso(LS.ACCION_EJECUTAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_EJECUTAR;
      this.mostrarObjetoParaAccion(ordenPedido);
    }
  }

  eliminarOrdenPedido(ordenPedido: InvPedidoTO) {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_ELIMINAR;
      this.mostrarObjetoParaAccion(ordenPedido);
    }
  }

  imprimirOrdenPedido(ordenPedido) {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametro = {
        invPedidosPK: new InvPedidosPK({ pedEmpresa: ordenPedido.codigoempresa, pedNumero: ordenPedido.pedidonumero, pedMotivo: ordenPedido.codigomotivo, pedSector: ordenPedido.codigosector })
        , nombreReporte: "reportOrdenPedidoAprobado.jrxml"
      };
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

  consultarOrdenCompra(event) {
    if (event.accion && event.detSecuencial && this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      if (event.accion === LS.ACCION_CARRITO) {
        this.dataFormularioCompra = {
          accion: LS.ACCION_CARRITO,
          detSecuencial: event.detSecuencial,
          vista: 'ordencompra',
          pmAprobacionAutomatica: this.parametrosBusqueda.pmAprobacionAutomatica ? this.parametrosBusqueda.pmAprobacionAutomatica : false,
        };
      }
    }
  }

  /** Mostrar el objeto para editar, aprobar o ejecutar */
  mostrarObjetoParaAccion(ordenPedido: InvPedidoTO) {
    if (this.accion === LS.ACCION_EJECUTAR) {
      this.dataFormularioCompra = {
        accion: this.accion,
        pmAprobacionAutomatica: this.parametrosBusqueda.pmAprobacionAutomatica ? this.parametrosBusqueda.pmAprobacionAutomatica : false,
        invPedidosPK: new InvPedidosPK({
          pedEmpresa: ordenPedido.codigoempresa,
          pedMotivo: ordenPedido.codigomotivo,
          pedNumero: ordenPedido.pedidonumero,
          pedSector: ordenPedido.codigosector
        })
      };
    } else {
      this.dataFormularioPedido = {
        accion: this.accion,
        invPedidosPK: new InvPedidosPK({
          pedEmpresa: ordenPedido.codigoempresa,
          pedMotivo: ordenPedido.codigomotivo,
          pedNumero: ordenPedido.pedidonumero,
          pedSector: ordenPedido.codigosector
        }),
        invPedidoTO: ordenPedido
      }
    }
    this.cargando = false;
  }
  //#endregion

  //#region [R3] FUNCIONES GENERALES
  cancelar(event?) {
    if (event && event.accion === LS.ACCION_CARRITO) {
      this.dataFormularioCompra = null;
      this.carrito = false;
    } else {
      this.dataFormularioCompra = null;
      this.dataFormularioPedido = null;
      this.vistaListado = true;
      this.accion = null;
      this.enviarCancelar.emit();
    }
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
    if (event && event.accion === LS.ACCION_CARRITO) {
      this.carrito = true;
    }
  }

  operacionEnLista(event) {
    switch (event.accion) {
      case LS.LST_INSERTAR: {
        this.refrescarTabla(event.objeto, 'I');
      }
      case LS.LST_ACTUALIZAR: {
        this.refrescarTabla(event.objeto, 'U');
        break;
      }
      case LS.LST_ELIMINAR: {
        this.refrescarTabla(event.objeto, 'D');
        break;
      }
      case LS.LST_LIMPIAR: {
        this.limpiarResultado();
        break;
      }
    }
    this.cancelar();
  }
  //#endregion

  //#region [R3] [AG-GRID] 
  iniciarAgGrid(apAutomatica) {
    this.columnDefs = this.ordenPedidoService.generarColumnasOrdenPedidoAprobar(apAutomatica);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      iconoEstado: IconoEstadoComponent
    };
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
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

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  getDataSelected(): Array<any> {
    return this.utilService.getAGSelectedData(this.gridApi);
  }

  refrescarTabla(invPedidoTO: InvPedidoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          invPedidoTO.pedfecha = JSON.parse(JSON.stringify(this.utilService.convertirFechaStringYYYYMMDD(invPedidoTO.pedfecha)));
          listaTemporal.unshift(invPedidoTO);
          this.listadoResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.pedidonumero === invPedidoTO.pedidonumero);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = invPedidoTO;
        this.listadoResultado = listaTemporal;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoResultado.findIndex(item => item.pedidonumero === invPedidoTO.pedidonumero);
        let listaTemporal = [...this.listadoResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listadoResultado = listaTemporal;
        break;
      }
    }
    this.refreshGrid();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }
  //#endregion

}
