import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { CarListaMayorAuxiliarClienteProveedorTO } from '../../../../entidadesTO/cartera/CarListaMayorAuxiliarClienteProveedorTO';
import { LS } from '../../../../constantes/app-constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { CobrosMayorAuxiliarClienteService } from '../cobros-mayor-auxiliar-cliente/cobros-mayor-auxiliar-cliente.service';
import * as moment from 'moment';
import { GridApi } from 'ag-grid';
import { ListadoProveedoresComponent } from '../../../inventario/componentes/listado-proveedores/listado-proveedores.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-pagos-mayor-auxiliar-proveedor',
  templateUrl: './pagos-mayor-auxiliar-proveedor.component.html',
  styleUrls: ['./pagos-mayor-auxiliar-proveedor.component.css']
})
export class PagosMayorAuxiliarProveedorComponent implements OnInit {

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
  public fechaInicio: Date = new Date();
  public fechaFin: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};

  public listaResultado: Array<CarListaMayorAuxiliarClienteProveedorTO> = [];
  public objetoSeleccionado: CarListaMayorAuxiliarClienteProveedorTO;

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

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
    private pagosMayAux: CobrosMayorAuxiliarClienteService
  ) { }
  //compras y pagos
  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['pagosMayorAuxiliarProveedor'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
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
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.proveedor = new InvProveedorTO();
    this.codigoProveedor = null;
    this.limpiarResultado();
    this.listarSectores();
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
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

  buscarCarListaMayorAuxiliarClienteProveedor() {
    this.cargando = true;
    this.limpiarResultado();
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.filasTiempo.iniciarContador();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        proveedor: this.codigoProveedor,
        accion: 'P'
      }
      this.pagosMayAux.listarCarListaMayorAuxiliarClienteProveedor(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
    }
  }

  despuesDeListarCarListaMayorAuxiliarClienteProveedor(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirCarListaMayorAuxiliarClienteProveedor() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        cliente: this.proveedor ? this.proveedor.provNombreComercial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        listado: this.listaResultado,
        tipo: 'P'
      };
      this.pagosMayAux.imprimirCarListaMayorAuxiliarClienteProveedor(parametros, this, this.empresaSeleccionada);
    }
  }

  exportarCarListaMayorAuxiliarClienteProveedor() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        cliente: this.proveedor ? this.proveedor.provNombreComercial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        listado: this.listaResultado,
        tipo: 'P'
      };
      this.pagosMayAux.exportarCarListaMayorAuxiliarClienteProveedor(parametros, this, this.empresaSeleccionada);
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
    if (this.objetoSeleccionado && this.objetoSeleccionado.maClavePrincipal) {
      let itemTransferencia: Array<string> = this.objetoSeleccionado.maClavePrincipal.split("|");
      let clave = itemTransferencia[0];
      let consultaCompras = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this) && clave === 'COMP ';
      let consultaPago = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this) && clave === 'PAGO ';

      this.opciones = [
        { label: LS.ACCION_CONSULTAR_COMPRA, icon: LS.ICON_CONSULTAR, disabled: !consultaCompras, command: () => consultaCompras ? this.consultaCompras() : null },
        { label: LS.ACCION_CONSULTAR_PAGOS, icon: LS.ICON_CONSULTAR, disabled: !consultaPago, command: () => consultaPago ? this.consultaPagos() : null }
      ];
    }
  }

  consultaCompras() {

  }

  consultaPagos() {

  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.pagosMayAux.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
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
    if (this.objetoSeleccionado.maContable) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  ejecutarAccion(data) {
    let item: Array<string> = this.objetoSeleccionado.maClavePrincipal.split("|");
    let clave = item[0];
    if (clave === 'COMP ') {
      this.consultaCompras();
    }
    if (clave === 'PAGO ') {
      this.consultaPagos();
    }
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

}
