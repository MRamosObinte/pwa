import { Component, OnInit, HostListener } from '@angular/core';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { DatoFunListaProductosImpresionPlaca } from '../../../../entidadesTO/inventario/DatoFunListaProductosImpresionPlaca';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ImprimirPlacasProductosService } from './imprimir-placas-productos.service';
import { GridApi } from 'ag-grid';
import { CheckboxHeaderComponent } from '../../../componentes/checkbox-header/checkbox-header.component';

@Component({
  selector: 'app-imprimir-placas-productos',
  templateUrl: './imprimir-placas-productos.component.html',
  styleUrls: ['./imprimir-placas-productos.component.css']
})
export class ImprimirPlacasProductosComponent implements OnInit {
  public listaResultadoProductoPlaca: Array<DatoFunListaProductosImpresionPlaca> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activarProductoPlaca: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public codigoProducto: string = null;
  public estadoGeneral: boolean = true;
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
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private imprimirPlacaProductoService: ImprimirPlacasProductosService,
    private archivoService: ArchivoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['imprimirPlacasProductos'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarProductoPlaca') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarProductoPlaca') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirProductoPlaca') as HTMLElement;
      element.click();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarProductoPlaca') as HTMLElement;
      element.click();
      return false;
    }))
  }

  limpiarResultado() {
    this.listaResultadoProductoPlaca = [];
    this.filasService.actualizarFilas("0", "0");
  }

  //Operaciones
  buscarProductoPlaca() {
    this.limpiarResultado();
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, producto: this.codigoProducto ? this.codigoProducto : ' ', estado: true };
    this.imprimirPlacaProductoService.listarDatoFunListaProductosImpresionPlaca(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarDatoFunListaProductosImpresionPlaca(data) {
    this.cargando = false;
    this.listaResultadoProductoPlaca = data;
    this.iniciarAgGrid();
  }

  imprimirProductoPlaca() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listProductosImpresionPlaca: this.listaResultadoProductoPlaca };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteImpresionPlaca", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoImprimirPlacasProductos.pdf', data) : this.toastr.warning("El reporte no existe o tiene errores");
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarProductoPlaca() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listProductosImpresionPlaca: this.listaResultadoProductoPlaca };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteProductoImprimirPlacas", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, 'ListadoImprimirPlacasProductos_') : this.toastr.warning("No se encontraron resultados");
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.imprimirPlacaProductoService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
    this.frameworkComponents = {
      checkHeader: CheckboxHeaderComponent
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
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

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  //Check
  cambiarEstadoGeneral(value) {
    this.estadoGeneral = value;
    this.gridApi.forEachNode((rowNode) => {
      rowNode.data.estado = this.estadoGeneral;
    });
    this.refreshGrid();
  }

  verificarEstado(event) {
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
