import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { MenuItem } from '../../../../../../node_modules/primeng/api';
import { LS } from '../../../../constantes/app-constants';
import { NgbActiveModal } from '../../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { InvListaConsultaVentaTO } from '../../../../entidadesTO/inventario/InvListaConsultaVentaTO';
import { VentaListadoService } from './venta-listado.service';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ContextMenu } from 'primeng/contextmenu';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { VentaService } from '../../transacciones/venta/venta.service';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-venta-listado',
  templateUrl: './venta-listado.component.html'
})
export class VentaListadoComponent implements OnInit, OnChanges {

  @Input() parametrosBusqueda: any = null;//parametros de busqueda 
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  listadoVentas: Array<InvListaConsultaVentaTO> = [];
  columnasSeleccionadas: Array<any> = [];//listado total de columnas 
  objetoSeleccionado: InvListaConsultaVentaTO;//Objeto seleccionado
  constantes: any = LS;
  innerWidth: number;
  veces: number = 0;

  isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
  activar: boolean = false;
  cargando: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  objetoContableEnviar: any = {};
  mostrarAccionesContabilidad: boolean = false; //flag para ocultar o mostrar formulario contabilidad

  public titulo: string = "";

  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public frameworkComponents;
  public pinnedBottomRowData;
  public rowClassRules;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    public activeModal: NgbActiveModal,
    private ventaService: VentaService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private ventaListadoService: VentaListadoService
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.ventaListadoService.definirAtajosDeTeclado();
    this.iniciarAgGrid();
  }

  buscarVentas() {
    this.cargando = true;
    this.listadoVentas = new Array();
    this.ventaService.listarVentas(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarVenta(data) {
    this.listadoVentas = data;
    this.cargando = false;
  }

  generarOpciones() {
    let perConsultar = true;
    let perDesmayorizar = this.ventaService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada) && (!this.objetoSeleccionado.vtaStatus || this.objetoSeleccionado.vtaStatus === " ");
    let perMayorizar = this.ventaService.verificarPermiso(LS.ACCION_MAYORIZAR, this.empresaSeleccionada) && this.objetoSeleccionado.vtaStatus === LS.ETIQUETA_PENDIENTE;
    let perAnular = this.ventaService.verificarPermiso(LS.ACCION_ANULAR, this.empresaSeleccionada) && this.objetoSeleccionado.vtaStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.vtaStatus !== LS.ETIQUETA_ANULADO;
    let perRestaurar = this.ventaService.verificarPermiso(LS.ACCION_RESTAURAR, this.empresaSeleccionada) && this.objetoSeleccionado.vtaStatus === LS.ETIQUETA_ANULADO;
    let perContabilizar = !this.objetoSeleccionado.conNumero && (!this.objetoSeleccionado.vtaStatus || this.objetoSeleccionado.vtaStatus === " ");
    let perVerContable = this.objetoSeleccionado.conNumero;

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado) : null },
      { label: LS.ACCION_DESMAYORIZAR, icon: LS.ICON_DESMAYORIZAR, disabled: !perDesmayorizar, command: () => perDesmayorizar ? this.desmayorizar() : null },
      { label: LS.ACCION_MAYORIZAR, icon: LS.ICON_MAYORIZAR, disabled: !perMayorizar, command: () => perMayorizar ? this.emitirAccion(LS.ACCION_MAYORIZAR, this.objetoSeleccionado) : null },
      { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !perAnular, command: () => perAnular ? this.emitirAccion(LS.ACCION_ANULAR, this.objetoSeleccionado) : null },
      { label: LS.ACCION_RESTAURAR, icon: LS.ICON_RESTAURAR, disabled: !perRestaurar, command: () => perRestaurar ? this.emitirAccion(LS.ACCION_RESTAURAR, this.objetoSeleccionado) : null },
      { label: LS.ACCION_CONTABILIZAR, icon: LS.ICON_CALCULADORA, disabled: !perContabilizar, command: () => perContabilizar ? this.contabilizarVenta() : null },
      { label: LS.ACCION_VER_CONTABLE, icon: LS.ICON_CALCULADORA, disabled: !perVerContable, command: () => perVerContable ? this.verContableVenta() : null }
    ];
  }

  consultarVenta() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado)
  }

  emitirAccion(accion, seleccionado: InvListaConsultaVentaTO) {
    let parametros = {
      accion: accion,
      objetoSeleccionado: seleccionado,
      listadoPeriodos: this.parametrosBusqueda && this.parametrosBusqueda.listaPeriodos ? this.parametrosBusqueda.listaPeriodos : []
    }
    this.enviarAccion.emit(parametros);
  }

  desmayorizar() {
    if (this.ventaService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada)) {
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        numeroDocumento: this.objetoSeleccionado.vtaDocumentoNumero,
        tipoDocumento: this.objetoSeleccionado.vtaDocumentoTipo
      };
      this.cargando = true;
      this.ventaService.desmayorizarVenta(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.TAG_AVISO);
      this.cargando = false;
    }
  };

  despuesDeDesmayorizarVenta(data) {
    this.objetoSeleccionado.vtaStatus = "PENDIENTE"
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: data.operacionMensaje + '<br>' + LS.MSJ_PREGUNTA_MAYORIZAR,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_MAYORIZAR + "'></i>  " + LS.ACCION_MAYORIZAR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = false;
        this.actualizarTabla(this.objetoSeleccionado);
        this.emitirAccion(LS.ACCION_MAYORIZAR, this.objetoSeleccionado);
      } else {//Cierra el formulario
        this.actualizarTabla(this.objetoSeleccionado);
        this.cargando = false;
      }
    });
  };

  contabilizarVenta() {
    this.cargando = true;
    let listadoPk: Array<string> = this.objetoSeleccionado.vtaNumero ? this.objetoSeleccionado.vtaNumero.split("|") : new Array();
    if (listadoPk && listadoPk.length === 3) {
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        periodo: listadoPk[0],
        motivo: listadoPk[1],
        ventaNumero: listadoPk[2],
        codigoUsuario: this.auth.getCodigoUser()
      };
      this.ventaService.contabilizar(parametro, this);
    } else {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
      this.cargando = false;
    }
  }

  despuesDeContabilizarVenta(mensaje) {
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: mensaje + '<br>' + LS.MSJ_PREGUNTA_VER_CONTABLE,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_VER + "'></i>  " + LS.ACCION_VER_CONTABLE,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.construirObjetoPK();
        this.verContableVenta();
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  construirObjetoPK() {
    let listadoPk: Array<string> = this.objetoSeleccionado.vtaNumero ? this.objetoSeleccionado.vtaNumero.split("|") : new Array();
    let periodo = listadoPk[0];
    let tipo = 'C-VEN';
    let ventaNumero = listadoPk[2];
    this.objetoSeleccionado.conNumero = periodo + "|" + tipo + "|" + ventaNumero;
  }

  verContableVenta() {
    if (this.objetoSeleccionado.conNumero) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.objetoSeleccionado.conNumero,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: null,
        listaPeriodos: [],
        volverACargar: true
      };
    } else {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
      this.cargando = false;
    }
  }

  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : this.activar;
    this.cambiarActivar(this.activar);
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarAccionesContabilidad = event.mostrarContilidadAcciones;
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cambiarActivar(this.activar);
  }

  ngOnChanges(changes) {
    if (changes.parametrosBusqueda) {
      if (changes.parametrosBusqueda.currentValue && changes.parametrosBusqueda.currentValue.listar) {//puede listar
        this.titulo = this.parametrosBusqueda.titulo;
        this.buscarVentas();
      } else if (changes.parametrosBusqueda.currentValue && changes.parametrosBusqueda.currentValue.vtaResultante) {//es entrante por guardado o edicion de objeto
        this.actualizarTabla(changes.parametrosBusqueda.currentValue.vtaResultante);
      } else { //toca limpiar la lista
        this.listadoVentas = new Array();
      }
    }
  }

  actualizarTabla(vtaResultante) {
    let ventaEnLista: InvListaConsultaVentaTO = vtaResultante;
    let index = this.listadoVentas.findIndex(item => item.vtaDocumentoNumero == ventaEnLista.vtaDocumentoNumero);
    if (index >= 0) {
      ventaEnLista.id = index;
      this.listadoVentas[index] = ventaEnLista;
      // this.gridApi ? setTimeout(() => { this.gridApi.updateRowData({ update: [ventaEnLista] }) }, 50) : null;
      if (this.gridApi) {
        var rowNode = this.gridApi.getRowNode("" + index);
        rowNode.setData(ventaEnLista);
      }
    } else {
      let listaTemporal = [... this.listadoVentas];
      listaTemporal.unshift(ventaEnLista);
      this.listadoVentas = listaTemporal;
    }
    this.refreshGrid();
  }

  seleccionarBodega(listadoBodegas, caja) {
    return listadoBodegas.find(item => item.bodCodigo == caja.permisoBodegaPermitida);
  }

  cambiarActivar(estado) {
    this.activar = !estado;
    this.enviarActivar.emit(estado);
  }

  imprimirVentas() {
    if (this.ventaService.verificarPermiso(LS.ACCION_IMPRIMIR, this.empresaSeleccionada, true)) {
      this.ventaListadoService.imprimirVentas(this);
    }
  }

  exportarVentas() {
    if (this.ventaService.verificarPermiso(LS.ACCION_EXPORTAR, this.empresaSeleccionada, true)) {
      this.ventaListadoService.exportarVentas(this);
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.ventaListadoService.generarColumnasConsulta();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
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

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

}
