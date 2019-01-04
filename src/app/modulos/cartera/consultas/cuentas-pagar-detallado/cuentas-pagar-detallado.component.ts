import { Component, OnInit, ViewChild, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { CuentasPorPagarDetalladoTO } from '../../../../entidadesTO/cartera/CuentasPorPagarDetalladoTO';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { LS } from '../../../../constantes/app-constants';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ListadoProveedoresComponent } from '../../../inventario/componentes/listado-proveedores/listado-proveedores.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { CuentasPagarDetalladoService } from './cuentas-pagar-detallado.service';

@Component({
  selector: 'app-cuentas-pagar-detallado',
  templateUrl: './cuentas-pagar-detallado.component.html',
  styleUrls: ['./cuentas-pagar-detallado.component.css']
})
export class CuentasPagarDetalladoComponent implements OnInit {

  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;

  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();

  public proveedor: InvProveedorTO = new InvProveedorTO(); //El proveedor se elegira en el modal
  public codigoProveedor: string = null;
  public fechaFin: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};

  public listaResultado: Array<CuentasPorPagarDetalladoTO> = [];
  public objetoSeleccionado: CuentasPorPagarDetalladoTO;

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  @Input() data;
  public mostrarBtnCancelar: boolean = false;
  @Output() cerrarCuentaDetallada = new EventEmitter();

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


  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private utilService: UtilService,
    private sectorService: SectorService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
    private cuentasPagarDetalladoService: CuentasPagarDetalladoService
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['cuentasPorPagarDetallado'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    if (this.data) {
      this.setearValoresDesdeAfuera();
    } else {
      this.obtenerFechaActual();
    }
  }

  generarAtajosTeclado() {
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
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnRegresar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.proveedor = new InvProveedorTO();
    this.codigoProveedor = null;
    this.limpiarResultado();
    this.listarSectores();
  }

  obtenerFechaActual() {
    this.sistemaService.obtenerFechaServidor(this, this.empresaSeleccionada);
  }

  despuesDeObtenerFechaServidor(data) {
    this.fechaFin = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
    this.fechaActual = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
  }

  listarSectores() {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
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
    this.actualizarFilas();
  }

  buscarCarListaCuentasPorPagarDetallado() {
    this.cargando = true;
    this.limpiarResultado();
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.filasTiempo.iniciarContador();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        proveedor: this.codigoProveedor,
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
      }
      this.cuentasPagarDetalladoService.listarCarListaCuentasPorPagarDetallado(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
    }
  }

  despuesDeListarCarListaCuentasPorPagarDetallado(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  setearValoresDesdeAfuera() {
    this.listaEmpresas = this.data.listaEmpresas;
    this.listaSectores = this.data.listaSectores;
    this.empresaSeleccionada = this.data.empresa;
    this.sectorSeleccionado = this.data.sector;
    this.codigoProveedor = this.data.proveedor;
    this.proveedor.provCodigo = this.data.proveedor;
    this.proveedor.provRazonSocial = this.data.razonSocial
    this.fechaFin = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.data.hasta);
    this.mostrarBtnCancelar = this.data.mostrarBtnCancelar;
    this.buscarCarListaCuentasPorPagarDetallado();
  }

  cerrarCuentaDetallado() {
    this.cerrarCuentaDetallada.emit(false);
  }

  imprimirCarListaCuentasPorPagarDetallado() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        proveedor: this.proveedor ? this.proveedor.provNombreComercial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        listado: this.listaResultado,
      };
      this.cuentasPagarDetalladoService.imprimirCarListaCuentasPorPagarDetallado(parametros, this, this.empresaSeleccionada);
    }
  }

  exportarCarListaCuentasPorPagarDetallado() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        proveedor: this.proveedor ? this.proveedor.provNombreComercial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        listado: this.listaResultado,
      };
      this.cuentasPagarDetalladoService.exportarCarListaCuentasPorPagarDetallado(parametros, this, this.empresaSeleccionada);
    }
  }

  //Proveedor
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

  generarOpciones() {
    let isValido = this.listaResultado.length > 0 ? this.objetoSeleccionado.cxpdPeriodo : false;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_COMPRA, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.consultarCompras() : null }
    ];
  }

  // CONSULTAR COMPRAS
  consultarCompras() {
    if (this.objetoSeleccionado.cxpdPeriodo && this.objetoSeleccionado.cxpdMotivo && this.objetoSeleccionado.cxpdNumero) {
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.cuentasPagarDetalladoService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
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
    if (this.objetoSeleccionado.cxpdPeriodo) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  ejecutarAccion(event) {
    this.consultarCompras();
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
