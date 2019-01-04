import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { InvFunComprasTO } from '../../../../entidadesTO/inventario/InvFunComprasTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { InvComprasMotivoTO } from '../../../../entidadesTO/inventario/InvComprasMotivoTO';
import { MotivoComprasService } from '../../archivo/motivo-compras/motivo-compras.service';
import { TipoDocumentoService } from '../../../anexos/archivo/tipo-documento/tipo-documento.service';
import { AnxTipoComprobanteComboTO } from '../../../../entidadesTO/anexos/AnxTipoComprobanteComboTO';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { ListadoProveedoresComponent } from '../../componentes/listado-proveedores/listado-proveedores.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { ListadoComprasService } from './listado-compras.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { VisualizadorImagenesComponent } from '../../../../componentesgenerales/visualizador-imagenes/visualizador-imagenes.component';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-listado-compras',
  templateUrl: './listado-compras.component.html',
  styleUrls: ['./listado-compras.component.css']
})
export class ListadoComprasComponent implements OnInit {
  public listaResultadoCompras: Array<InvFunComprasTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaMotivos: Array<InvComprasMotivoTO> = [];
  public listaTipoComprobante: Array<AnxTipoComprobanteComboTO> = [];
  public motivoSeleccionado: InvComprasMotivoTO = new InvComprasMotivoTO();
  public tipoComprobanteSeleccionado: AnxTipoComprobanteComboTO = new AnxTipoComprobanteComboTO();
  public proveedor: InvProveedorTO = new InvProveedorTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activarCompras: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public codigoProveedor: string = null;
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};
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
  public comprasSeleccionado: InvFunComprasTO = new InvFunComprasTO();
  //Para buscar las imagenes
  public listadoComprasPK: any;
  public periodo: any;
  //parametros para consultar compras
  public parametrosCompra: any;

  public opciones: MenuItem[];
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private motivoService: MotivoComprasService,
    private modalService: NgbModal,
    private sistemaService: AppSistemaService,
    private tipoDocumentoService: TipoDocumentoService,
    private listadoCompraService: ListadoComprasService,
    private api: ApiRequestService
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['comprasListado'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.tipoComprobanteSeleccionado = null;
    this.motivoSeleccionado = null;
    this.proveedor = new InvProveedorTO();
    this.codigoProveedor = null;
    this.limpiarResultado();
    this.listarMotivos();
    this.listarTiposComprobante();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarCompras') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarCompras') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirCompras') as HTMLElement;
      element.click();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarCompras') as HTMLElement;
      element.click();
      return false;
    }))
  }

  limpiarResultado() {
    this.listaResultadoCompras = [];
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

  listarMotivos() {
    this.cargando = true;
    this.listaMotivos = [];
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, activos: true };
    this.motivoService.listarInvComprasMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarInvComprasMotivoTO(data) {
    this.listaMotivos = data;
    if (this.listaMotivos.length > 0) {
      this.motivoSeleccionado = (this.motivoSeleccionado && this.motivoSeleccionado.cmCodigo) ? this.listaMotivos.find(item => item.cmCodigo === this.motivoSeleccionado.cmCodigo) : null;
    } else {
      this.motivoSeleccionado = null;
    }
    this.cargando = false;
  }

  listarTiposComprobante() {
    this.cargando = true;
    this.listaTipoComprobante = [];
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, codigoTipoTransaccion: null };
    this.tipoDocumentoService.listarAnxTipoComprobanteComboTO(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarAnxTipoComprobanteComboTO(data) {
    this.listaTipoComprobante = data;
    if (this.listaTipoComprobante.length > 0) {
      this.tipoComprobanteSeleccionado = (this.tipoComprobanteSeleccionado && this.tipoComprobanteSeleccionado.tcCodigo) ? this.listaTipoComprobante.find(item => item.tcCodigo === this.tipoComprobanteSeleccionado.tcCodigo) : null;
    } else {
      this.tipoComprobanteSeleccionado = null;
    }
    this.cargando = false;
  }

  buscarProveedor(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && !this.esValidoProveedor()) {
      if (this.proveedor && this.proveedor.provCodigo.length > 0) {
        let busqueda = this.proveedor.provCodigo.toUpperCase();
        let parametroBusqueda = { empresa: LS.KEY_EMPRESA_SELECT, categoria: null, inactivos: false, busqueda: busqueda };
        event.srcElement.blur();
        event.preventDefault();
        const modalRef = this.modalService.open(ListadoProveedoresComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
        modalRef.result.then((result: InvProveedorTO) => {
          if (result) {
            this.proveedor = new InvProveedorTO(result);
            this.codigoProveedor = this.proveedor.provCodigo;
          }
        }, () => {
          this.focusProveedorCodigo();
        });
      } else {
        this.toastr.info(LS.MSJ_ENTERTOMODAL, LS.TAG_AVISO);
      }
    }
  }

  focusProveedorCodigo() {
    let element = document.getElementById('provCodigo');
    element ? element.focus() : null;
  }

  esValidoProveedor(): boolean {
    return this.proveedor.provCodigo != "" && this.proveedor.provCodigo === this.codigoProveedor;
  }

  validarProveedor() {
    if (this.proveedor.provCodigo !== this.codigoProveedor) {
      this.proveedor = new InvProveedorTO();
      this.codigoProveedor = null;
    }
  }

  //Ver imagenes
  ejecutarAccion(data) {
    this.comprasSeleccionado = data;
    this.formarListadoComprasPK();
    this.verImagenes();
  }

  verImagenes() {
    this.formarListadoComprasPK();
    let numeroCompra: Array<string> = this.comprasSeleccionado.compNumeroSistema.split("|");
    let nMotivoCompra = numeroCompra[0].split(' ');
    let nNumeroCompra = numeroCompra[1].split(' ');
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      periodo: this.periodo,
      motivo: nMotivoCompra[0],
      numero: nNumeroCompra[1],
    }
    this.api.post("todocompuWS/inventarioWebController/obtenerAdjuntosCompraListado", parametro, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          let listado = respuesta.extraInfo ? respuesta.extraInfo : [];
          if (listado && listado.length > 0) {
            let listadoEnviar = [];
            listado.forEach(value => { listadoEnviar.push({ source: value.imagenString, alt: value.adjTipo, title: value.adjTipo }) });
            const modalRef = this.modalService.open(VisualizadorImagenesComponent, { size: 'lg', windowClass: "miSize", backdrop: 'static' });
            modalRef.componentInstance.listaImagenes = listadoEnviar;
          } else {
            this.toastr.warning(LS.MSJ_NO_HAY_IMAGENES, LS.TAG_AVISO);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  formarListadoComprasPK() {
    let fechaCompra: Array<string> = this.comprasSeleccionado.compFecha.split("-");
    let año = fechaCompra[0];
    let mes = fechaCompra[1];
    this.periodo = año + "-" + mes;
  }

  obtenerContablePk(): object {
    return { conContablePK: this.utilService.obtenerConContablePK(this.listadoComprasPK, LS.KEY_EMPRESA_SELECT, '|') };
  }

  //Operaciones
  buscarCompras(form: NgForm) {
    this.limpiarResultado();
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        documento: this.tipoComprobanteSeleccionado && this.tipoComprobanteSeleccionado.tcCodigo ? this.tipoComprobanteSeleccionado.tcCodigo : null,
        motivo: this.motivoSeleccionado && this.motivoSeleccionado.cmCodigo ? this.motivoSeleccionado.cmCodigo : null,
        proveedor: this.codigoProveedor
      };
      this.filasTiempo.iniciarContador();
      this.listadoCompraService.listarInvFunComprasTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarInvFunComprasTO(data) {
    this.listaResultadoCompras = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirCompras() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        documento: this.tipoComprobanteSeleccionado ? this.tipoComprobanteSeleccionado.tcCodigo : '',
        motivo: this.motivoSeleccionado ? this.motivoSeleccionado.cmCodigo : '',
        proveedorId: this.codigoProveedor ? this.codigoProveedor : '',
        listInvFunComprasTO: this.listaResultadoCompras
      };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteListadoCompras", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoCompras.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarCompras() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        listInvFunComprasTO: this.listaResultadoCompras
      };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteListadoCompras", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoCompras_") : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);;
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //Consultar compras formulario
  generarOpciones() {
    let permiso = true;
    this.opciones = [
      { label: LS.LABEL_CONSULTAR_COMPRA, icon: LS.ICON_CONSULTAR, disabled: !permiso, command: () => permiso ? this.consultarCompra() : null },
    ];
  }

  consultarCompra() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      let itemCompra: Array<string> = this.comprasSeleccionado.compNumeroSistema.split("|");
      let motivo: Array<string> = itemCompra[0].split(' ');
      let numero: Array<string> = itemCompra[1].split(' ');
      let itemFecha: Array<string> = this.comprasSeleccionado.compFecha.split("-");
      this.parametrosCompra = {
        accion: LS.ACCION_CONSULTAR,
        parametroBusqueda: {
          empresa: LS.KEY_EMPRESA_SELECT,
          periodo: itemFecha[0] + "-" + itemFecha[1],
          motivo: motivo[0],
          numero: numero[1]
        }
      }
    }
  }

  ejecutarAccionCompras(event) {
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activarCompras = event.activar;
        break;
      case LS.ACCION_CANCELAR:
        this.generarAtajosTeclado();
        this.parametrosCompra = null;
        break;
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.listadoCompraService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
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

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.comprasSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

}
