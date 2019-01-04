import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from '../../archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import * as moment from 'moment'
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { CostosMensualesService } from './costos-mensuales.service';
import { GridApi } from 'ag-grid';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { ProductoService } from '../../../inventario/componentes/producto/producto.service';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-costos-mensuales',
  templateUrl: './costos-mensuales.component.html',
  styleUrls: ['./costos-mensuales.component.css']
})
export class CostosMensualesComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];
  //
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  //
  public listaSectores: Array<PrdListaSectorTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  //
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  //
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filaSeleccionada: any;
  //
  public columnasDinamicas: Array<any>[];
  public listaResultado: Array<any> = null;
  public rowClassRules: any = {};
  //
  public producto: any;
  public objetoDesdeFuera;
  public dataListado: any = {};
  public mostrarKardex: boolean = false;// PARA MOSTRAR KARDEX
  public mostrarBtnRegresarFomulario: boolean = true;

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

  constructor(
    private utilService: UtilService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private sectorService: SectorService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
    private costosMeService: CostosMensualesService,
    private productoService: ProductoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['costosMensuales'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarSectores();
    this.limpiarResultado();
    this.seleccionarFechas();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  listarSectores() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      mostrarInactivo: false
    }
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.cargando = false;
    this.listaSectores = data;
    this.sectorSeleccionado = this.listaSectores ? this.listaSectores[0] : undefined;
  }

  seleccionarFechas() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0]
        this.fechaHasta = data[1]
        this.fechaActual = data[1]
      }).catch(err => this.utilService.handleError(err, this));
  }

  listadoCostosMensuales(form: NgForm, agrupar) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          codigoSector: this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado.secCodigo : 'null',
          fechaInicio: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
          fechaFin: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
          usuario: this.empresaSeleccionada.empCodigo,
          agrupadoPor: agrupar
        };
        this.filasTiempo.iniciarContador();
        this.costosMeService.listarCostosMensuales(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeListarCostosMensuales(lista) {
    this.filasTiempo.finalizarContador();
    this.columnasDinamicas = lista.columnas;
    this.iniciarAgGrid();
    this.listaResultado = lista.datos;
    this.cargando = false;
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        columnas: this.columnasDinamicas,
        datos: this.listaResultado,
        sector: this.sectorSeleccionado.secCodigo,
      };
      this.costosMeService.exportarCostosMensuales(parametros, this, this.empresaSeleccionada);
    }
  }

  //MÉTODOS PARA CONSULTAR KARDEX
  ejecutarAccion(data) {
    if (data) {
      this.producto = data;
      this.listarKardex();
    }
  }

  consultarKardex() {
    this.producto = this.filaSeleccionada;
    if (this.producto[1] !== "") {
      this.listarKardex();
    }
  }

  listarKardex() {
    if (this.producto) {
      this.dataListado = { vista: 'kardex', nombreProducto: this.producto[0] };
      this.objetoDesdeFuera = {
        empresa: this.empresaSeleccionada,
        bodega: null,
        fechaDesde: this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaHasta ? this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaActual) : this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaActual)),
        productoSeleccionado: null
      }
      this.obtenerInvProductoTO();
    }
  }

  obtenerInvProductoTO() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      codigo: this.producto[1] ? this.producto[1] : ""
    }
    this.productoService.obtenerProducto(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerProducto(data) {
    this.objetoDesdeFuera.productoSeleccionado = data ? new InvListaProductosGeneralTO() : null;
    this.objetoDesdeFuera.productoSeleccionado.proCodigoPrincipal = data ? data.proCodigoPrincipal : null;
    this.objetoDesdeFuera.productoSeleccionado.proCategoria = data ? data.catCodigo : null;
    this.objetoDesdeFuera.productoSeleccionado.proNombre = data ? data.proNombre : null;
    this.objetoDesdeFuera.productoSeleccionado.detalleMedida = data ? data.medCodigo : null;
    this.cargando = false;
    this.objetoDesdeFuera = data ? this.objetoDesdeFuera : null;
    this.mostrarKardex = data ? true : false;
  }

  verEstadoBtnRegresar(event) {
    this.mostrarBtnRegresarFomulario = event;
    if (this.mostrarBtnRegresarFomulario) {
      this.objetoDesdeFuera = null;
      this.mostrarKardex = false;
    }
  }

  cerrarKardex(event) {
    this.mostrarKardex = event;
    this.objetoDesdeFuera = null;
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.consultarKardex();
      }
      return false;
    }))
  }

  generarOpciones() {
    this.opciones = [
      { label: LS.MSJ_CONSULTAR_KARDEX, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.consultarKardex() },
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.costosMeService.generarColumnas(this.columnasDinamicas);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.components = {};
    this.rowClassRules = {
      'tr-negrita': function (params) {
        if (!params.data[2]) {
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

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.filaSeleccionada = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.filaSeleccionada = data;
    if (this.filaSeleccionada[1] !== "") {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = this.innerWidth <= 576 ? false : true; this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }
}
