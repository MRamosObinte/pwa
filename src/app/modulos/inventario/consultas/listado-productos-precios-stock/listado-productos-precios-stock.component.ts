import { Component, OnInit, HostListener } from '@angular/core';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { InvListaProductosTO } from '../../../../entidadesTO/inventario/InvListaProductosTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvProductoCategoriaTO } from '../../../../entidadesTO/inventario/InvProductoCategoriaTO';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';
import { ProductoCategoriaService } from '../../componentes/producto-categoria/producto-categoria.service';
import { ListadoProductosPreciosStockService } from './listado-productos-precios-stock.service';
import { BodegaService } from '../../archivo/bodega/bodega.service';

@Component({
  selector: 'app-listado-productos-precios-stock',
  templateUrl: './listado-productos-precios-stock.component.html',
  styleUrls: ['./listado-productos-precios-stock.component.css']
})
export class ListadoProductosPreciosStockComponent implements OnInit {
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaCategorias: Array<InvProductoCategoriaTO> = [];
  public listaBodegas: Array<InvListaBodegasTO> = [];
  public listaResultado: Array<InvListaProductosTO> = [];
  public bodegaSeleccionada: InvListaBodegasTO = new InvListaBodegasTO();
  public categoriaSeleccionada: InvProductoCategoriaTO = new InvProductoCategoriaTO();
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public busqueda: string = null;
  public filasTiempo: FilasTiempo = new FilasTiempo();

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
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
    private bodegaService: BodegaService,
    private listadoProductoPrecioStockService: ListadoProductosPreciosStockService,
    private productoCategoriaService: ProductoCategoriaService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['listadoProductosPreciosStock'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.categoriaSeleccionada = null;
    this.bodegaSeleccionada = null;
    this.limpiarResultado();
    this.listarCategorias();
    this.listarBodegas();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarListadoProductosPreciosStock') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarListadoProductosPreciosStock') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirListadoProductosPreciosStock') as HTMLElement;
      element.click();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarListadoProductosPreciosStock') as HTMLElement;
      element.click();
      return false;
    }))
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  listarCategorias() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, tipoComprobante: "", accion: LS.ACCION_COMBO };
    this.productoCategoriaService.listarInvProductoCategoriaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProductoCategoriaTO(data) {
    this.listaCategorias = data;
    if (this.listaCategorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.catCodigo ? this.listaCategorias.find(item => item.catCodigo === this.categoriaSeleccionada.catCodigo) : null;
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  listarBodegas() {
    this.cargando = true;
    this.listaBodegas = [];
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: false };
    this.bodegaService.listarInvListaBodegasTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvListaBodegasTO(data) {
    this.listaBodegas = data;
    if (this.listaBodegas.length > 0) {
      this.bodegaSeleccionada = this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.listaBodegas.find(item => item.bodCodigo === this.bodegaSeleccionada.bodCodigo) : null;
    } else {
      this.bodegaSeleccionada = null;
    }
    this.cargando = false;
  }

  //Operaciones
  buscarListadoProductosPreciosStock() {
    this.cargando = true;
    this.filtroGlobal = "";
    this.listaResultado = new Array();
    this.filasTiempo.iniciarContador();
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      bodega: this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.bodegaSeleccionada.bodCodigo : null,
      categoria: this.categoriaSeleccionada && this.categoriaSeleccionada.catCodigo ? this.categoriaSeleccionada.catCodigo : null,
      busqueda: this.busqueda,
      incluirInactivos: true,
      limite: false,
      activar: false
    }
    this.listadoProductoPrecioStockService.listarListadoProductosPreciosStock(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarListadoProductosPreciosStock(data) {
    this.filasTiempo.finalizarContador();
    this.listaResultado = data;
    this.cargando = false;
    this.iniciarAgGrid();
  }

  imprimirListadoProductosPreciosStock() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { bodega: this.bodegaSeleccionada ? this.bodegaSeleccionada.bodCodigo : '', listInvListaProductosTO: this.listaResultado };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteListaProductos", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoPDF('listadoProductosPreciosStock' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarListadoProductosPreciosStock() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listInvListaProductosTO: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarListadoProductosPreciosStock", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "listadoProductosPreciosStock_") : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.listadoProductoPrecioStockService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
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
