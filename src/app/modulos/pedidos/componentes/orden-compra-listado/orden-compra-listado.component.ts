import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { MenuItem } from 'primeng/api';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { InvPedidos } from '../../../../entidades/inventario/InvPedidos';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { InvPedidosOrdenCompraTO } from '../../../../entidadesTO/inventario/InvPedidosOrdenCompraTO';
import { InvPedidosOrdenCompraPK } from '../../../../entidades/inventario/InvPedidosOrdenCompraPK';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { OrdenCompraService } from '../../transacciones/generar-orden-compra/orden-compra.service';
import * as moment from 'moment';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';

@Component({
  selector: 'app-orden-compra-listado',
  templateUrl: './orden-compra-listado.component.html'
})
export class OrdenCompraListadoComponent implements OnInit, OnChanges {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() operacion: any;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  //[ELEMENTOS GENERALES]
  @ViewChild("excelDownload") excelDownload;
  public constantes: any; //Referencia a las constantes
  public opciones: MenuItem[] = []; //Listado de opciones que apareceran en la lista
  public isScreamMd: boolean; //Bandera para indicar el tamaño de la pantalla
  public es: any = {}; //Locale Date (Obligatoria)
  public activar: boolean = false;
  public funcionesUsuario: any = [];//Funciones del usuario actual
  public cargando: boolean = false;
  public accion: string = null;
  //Cambian al mostrar u ocultar el listado
  public vistaListado: boolean = false;
  //[ELEMENTOS USADOS EN LA TABLA]
  public listadoResultado: Array<InvPedidosOrdenCompraTO> = [];
  public objetoSeleccionado: InvPedidosOrdenCompraTO = new InvPedidosOrdenCompraTO(); //Objeto actualmente seleccionado
  //[ELEMENTOS DEL FORMULARIO ORDEN DE PEDIDO]
  public frmTitulo: string;
  public classTitulo: string;
  public invPedido: InvPedidos = new InvPedidos(); //Objeto de Orden de pedido
  //[ELEMENTOS DE LA ORDEN DE COMPRA]
  public dataFormularioCompra: any = null;//Objeto a enviar para generar la orden de compra
  public emailProveedor: string = null;
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
  public rowClassRules: any = {};

  constructor(
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private ordenCompraService: OrdenCompraService,
    private archivoService: ArchivoService
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.es = utilService.setLocaleDate();
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.iniciarAtajos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.parametrosBusqueda) {
      this.reiniciarValores();
      if (this.empresaSeleccionada && this.parametrosBusqueda) {
        LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
        let ocmAprobacionAutomatica = this.parametrosBusqueda.aprobacionAutomatica;
        //Buscar ordenes de compra
        this.filtroGlobal = "";
        this.buscarOrdenesCompra();
        this.iniciarAgGrid(ocmAprobacionAutomatica);
      }
    }
    if (changes.operacion) {
      this.operacionEnLista(this.operacion);
    }
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarOrdenCompra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (event: KeyboardEvent): boolean => {
      if (!this.dataFormularioCompra && this.objetoSeleccionado) {
        this.consultarOrdenCompra(this.objetoSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (!this.dataFormularioCompra && this.objetoSeleccionado) {
        this.editarOrdenCompra(this.objetoSeleccionado)
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ANULAR, (event: KeyboardEvent): boolean => {
      if (!this.dataFormularioCompra && this.objetoSeleccionado) {
        this.anularOrdenCompra(this.objetoSeleccionado)
      }
      return false;
    }));
  }

  /**
   * Reinicia los valores que influyen en la vista de la listaa su valor por defecto.
   * @memberof OrdenCompraListadoComponent
   */
  reiniciarValores() {
    this.activar = false;
    this.accion = null;
    this.dataFormularioCompra = null;
    this.vistaListado = false;
  }

  buscarOrdenesCompra() {
    this.cargando = true;
    this.limpiarResultado();
    if (this.parametrosBusqueda.fechaInicio && this.parametrosBusqueda.fechaFin) {
      this.parametrosBusqueda['fechaInicio'] = this.utilService.formatearDateToStringDDMMYYYY(this.parametrosBusqueda.fechaInicio);
      this.parametrosBusqueda['fechaFin'] = this.utilService.formatearDateToStringDDMMYYYY(this.parametrosBusqueda.fechaFin);
    }
    this.filasTiempo.iniciarContador();
    this.ordenCompraService.listarOrdenesCompra(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarOrdenesCompra(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultado = data ? data : [];
    this.filasTiempo.setFilas(this.listadoResultado.length);
    this.actualizarFilas();
    this.vistaListado = true;
    this.cargando = false;
  }

  /** Limpia la busqueda actualmente cargada */
  limpiarResultado() {
    this.vistaListado = false;
    this.listadoResultado = [];
    this.objetoSeleccionado = new InvPedidosOrdenCompraTO();
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
        let respuestaVerificacionLista = this.utilService.enviarListadoOrdenCompraSeleccionados(listadoInvPedidosTOSeleccionado.slice());
        if (respuestaVerificacionLista.conStatus) {
          this.cargando = false;
          this.toastr.warning(respuestaVerificacionLista.mensaje, LS.TAG_AVISO);
        } else {
          let parametros = { listaInvPedidosOrdenCompraTO: listadoInvPedidosTOSeleccionado, nombreReporte: LS.NOMBRE_REPORTE_ORDEN_COMPRA_LISTADO };
          this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosOrdenCompraTO", parametros, this.empresaSeleccionada)
            .then(data => {
              (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoOrdenesCompra_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
                : this.toastr.warning(LS.MSJ_NO_DATA);
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        }
      }
    }
  }

  imprimirIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listadoInvPedidosOCTOSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      let listaInvPedidosOrdenCompraPK = this.ordenCompraService.obtenerListaOrdenCompraSeleccionadoIndividual(listadoInvPedidosOCTOSeleccionado);
      if (listaInvPedidosOrdenCompraPK.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let respuestaVerificacionLista = this.utilService.enviarListadoOrdenCompraSeleccionados(listadoInvPedidosOCTOSeleccionado.slice());
        if (respuestaVerificacionLista.conStatus) {
          this.cargando = false;
          this.toastr.warning(respuestaVerificacionLista.mensaje, LS.TAG_AVISO);
        } else {
          if (respuestaVerificacionLista.listadoResultado.length > 0) {
            this.irAImprimir('OrdenesCompra_', "todocompuWS/pedidosWebController/generarReporteInvPedidosOrdenCompraLote", LS.NOMBRE_REPORTE_ORDEN_COMPRA_APROBADA_LOTE, listaInvPedidosOrdenCompraPK);
          }
        }
      }
    }
  }

  imprimirConClickDerecho() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaInvPedidosOrdenCompraPK = [];
      let pk: InvPedidosOrdenCompraPK = new InvPedidosOrdenCompraPK(this.objetoSeleccionado);
      listaInvPedidosOrdenCompraPK.push(pk)
      if (this.objetoSeleccionado.ocAprobada) {
        this.irAImprimir('OrdenesCompra_', "todocompuWS/pedidosWebController/generarReporteInvPedidosOrdenCompraLote", LS.NOMBRE_REPORTE_ORDEN_COMPRA_APROBADA, listaInvPedidosOrdenCompraPK);
      } else {
        this.irAImprimir('OrdenesCompra_', "todocompuWS/pedidosWebController/generarReporteInvPedidosOrdenCompraLote", LS.NOMBRE_REPORTE_ORDEN_COMPRA, listaInvPedidosOrdenCompraPK);
      }
    }
  }

  irAImprimir(nombre, url, nombreReporte, listado) {
    if (listado.length === 0) {
      this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
      this.cargando = false;
    } else {
      let parametros = { listaInvPedidosOrdenCompraPK: listado, nombreReporte: nombreReporte };
      this.archivoService.postPDF(url, parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoPDF(nombre + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
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
        let parametros = { listaInvPedidosOrdenCompraTO: listadoInvPedidosTOSeleccionado };
        this.archivoService.postExcel("todocompuWS/pedidosWebController/exportarReporteInvPedidosOrdenCompraTO", parametros, this.empresaSeleccionada)
          .then(data => {
            if (data) {
              this.utilService.descargarArchivoExcel(data._body, "ListadoOrdenesCompra_");
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
    let perNotificar = this.utilService.verificarPermiso(LS.ACCION_NOTIFICAR_PROVEEDOR, this) && !this.objetoSeleccionado.ocAnulado && this.objetoSeleccionado.ocAprobada && this.objetoSeleccionado.ocmNotificarProveedor;
    let perAnular = this.utilService.verificarPermiso(LS.ACCION_ANULAR_ORDEN_COMPRA, this) && !this.objetoSeleccionado.ocAnulado;
    let perAprobar = this.utilService.verificarPermiso(LS.ACCION_APROBAR_ORDEN_COMPRA, this) && !this.objetoSeleccionado.ocAnulado && !this.objetoSeleccionado.ocAprobada && this.objetoSeleccionado.ocPuedeAprobar;
    let perImprimir = this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this) && !this.objetoSeleccionado.ocAnulado;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: (event) => perConsultar ? this.consultarOrdenCompra(this.objetoSeleccionado) : null },
      { label: LS.ACCION_NOTIFICAR_PROVEEDOR, icon: LS.ICON_NOTIFICAR, disabled: !perNotificar, command: (event) => perNotificar ? this.notificarOrdenCompra(this.objetoSeleccionado) : null },
      { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !perAnular, command: (event) => perAnular ? this.anularOrdenCompra(this.objetoSeleccionado) : null },
      { label: LS.ACCION_APROBAR, icon: LS.ICON_APROBAR, disabled: !perAprobar, command: (event) => perAnular ? this.aprobarOrdenCompra(this.objetoSeleccionado) : null },
      { label: LS.ACCION_IMPRIMIR, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: (event) => perImprimir ? this.imprimirConClickDerecho() : null }
    ];
  }

  consultarOrdenCompra(ordenCompra: InvPedidosOrdenCompraTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.accion = LS.ACCION_CONSULTAR;
      this.dataFormularioCompra = { accion: this.accion, invPedidosOrdenCompraPK: new InvPedidosOrdenCompraPK(ordenCompra), vista: 'ordencompra' };
    }
  }

  editarOrdenCompra(ordenCompra: InvPedidosOrdenCompraTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.accion = LS.ACCION_EDITAR;
      this.dataFormularioCompra = { accion: this.accion, invPedidosOrdenCompraPK: new InvPedidosOrdenCompraPK(ordenCompra), vista: 'ordencompra' };
    }
  }

  notificarOrdenCompra(ordenCompra: InvPedidosOrdenCompraTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_APROBAR, this, true)) {
      let parametros = {
        title: LS.TOAST_INFORMACION,
        texto: LS.MSJ_NOTIFICACION_PROVEEDOR,
        type: LS.SWAL_INFO,
        confirmButtonText: LS.TAG_ENVIAR,
        cancelButtonText: LS.MSJ_CANCELAR,
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          if (ordenCompra.provEmailOrdenCompra === null || ordenCompra.provEmailOrdenCompra === "") {
            let parametros = {
              message: LS.MSJ_NOTIFICAR_PROVEEDOR,
              confirmButtonText: LS.MSJ_ACEPTAR,
              input: 'email',
              inputValidator: LS.MSJ_VALID_EMAIL,
              showCancelButton: true
            };
            this.utilService.generarSwallInputText(parametros).then((result) => {
              if (result.value) {
                this.emailProveedor = result.value;
                this.notificarProveedor(ordenCompra);
              }
            });
          } else { this.notificarProveedor(ordenCompra); }
        }
      });
    }
  }

  anularOrdenCompra(ordenCompra: InvPedidosOrdenCompraTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_ANULAR_ORDEN_COMPRA, this, true)) {
      this.accion = LS.ACCION_ANULAR;
      this.dataFormularioCompra = { accion: this.accion, invPedidosOrdenCompraPK: new InvPedidosOrdenCompraPK(ordenCompra), vista: 'ordencompra' };
    }
  }

  aprobarOrdenCompra(ordenCompra: InvPedidosOrdenCompraTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_APROBAR_ORDEN_COMPRA, this, true)) {
      this.accion = LS.ACCION_APROBAR;
      this.dataFormularioCompra = { accion: this.accion, invPedidosOrdenCompraPK: new InvPedidosOrdenCompraPK(ordenCompra), vista: 'ordencompra' };
    }
  }

  notificarProveedor(ordenCompra: InvPedidosOrdenCompraTO) {
    //Si las notificaciones de proveedor estan activas
    if (ordenCompra.ocmNotificarProveedor) {
      this.cargando = true;
      let parametro = { invPedidosOrdenCompraPK: new InvPedidosOrdenCompraPK(ordenCompra), emailProveedor: this.emailProveedor };
      this.ordenCompraService.enviarNotificacionProveedor(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeEnviarNotificacion(data) {
    if (data && data.estadoOperacion === LS.KEY_EXITO) {
      this.toastr.success(data.operacionMensaje, LS.TOAST_CORRECTO);
    } else {
      this.toastr.warning(data.operacionMensaje, LS.TOAST_ERROR);
    }
  }
  //#endregion

  //#region [R3] FUNCIONES GENERALES
  cancelar() {
    this.actualizarFilas();
    this.dataFormularioCompra = null;
    this.vistaListado = true;
    this.accion = null;
    this.invPedido = new InvPedidos();
    this.enviarCancelar.emit();
  }

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit({ activar: this.activar, deshabilitarOpciones: false });
  }

  cambiarActivarFormulario(event) {
    this.vistaListado = event.vistaListado;
    let objetoActivar = { 'activar': event.activar, 'deshabilitarOpciones': true }
    this.enviarActivar.emit(objetoActivar);
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
      case LS.LST_LIMPIAR: {
        this.limpiarResultado();
        break;
      }
    }
    this.cancelar();
  }
  //#endregion

  //#region [R3] [AG-GRID] 
  iniciarAgGrid(ocmAprobacionAutomatica) {
    this.columnDefs = this.ordenCompraService.generarColumnasOrdenCompra(ocmAprobacionAutomatica);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent,
      iconoEstado: IconoEstadoComponent
    };
    this.components = {};
    this.rowClassRules = {
      'fila-pendiente': function (params) {
        var estado = params.data.estado;
        return estado == 'PENDIENTE';
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      // scrolls to the first column
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      // sets focus into the first grid cell
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  /**
   * Método que se llama desde el componente del boton ,
   * es obligatio q este s
   * @param {*} event
   * @param {*} dataSelected
   * @memberof PlanContableComponent
   */
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

  onCellDoubleClicked(event) {
    this.consultarOrdenCompra(event.data);
  }

  refrescarTabla(invPedidosOrdenCompraTO: InvPedidosOrdenCompraTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          listaTemporal.unshift(invPedidosOrdenCompraTO);
          this.listadoResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.ocNumero === invPedidosOrdenCompraTO.ocNumero);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = invPedidosOrdenCompraTO;
        this.listadoResultado = listaTemporal;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoResultado.findIndex(item => item.ocNumero === invPedidosOrdenCompraTO.ocNumero);
        let listaTemporal = [...this.listadoResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listadoResultado = listaTemporal;
        break;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }
  //#endregion

}
