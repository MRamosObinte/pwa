import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { InvProveedorCategoriaTO } from '../../../../entidadesTO/inventario/InvProveedorCategoriaTO';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ProveedorService } from '../../archivo/proveedor/proveedor.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ProveedorCategoriaService } from '../../archivo/proveedor-categoria/proveedor-categoria.service';
import { GridApi } from 'ag-grid';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-listado-proveedor',
  templateUrl: './listado-proveedor.component.html',
  styleUrls: ['./listado-proveedor.component.css']
})
export class ListadoProveedorComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaResultadoProveedores: Array<InvProveedorTO> = [];
  public listaCategorias: Array<InvProveedorCategoriaTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public proveeedorSeleccionado: InvProveedorTO = new InvProveedorTO();
  public categoriaSeleccionada: InvProveedorCategoriaTO = new InvProveedorCategoriaTO();
  public constantes: any = LS;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public cargando: boolean = false;
  public activarProveedor: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public parametrosFormulario: any = { accion: null, empresaSeleccionada: null, invProveedorTO: null, listadoCategorias: [], tituloFormulario: null, activar: false };
  public vistaListado: boolean = true;
  public vistaFormulario: boolean = false;
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
  //Exportar
  public exportarTodosEstado: boolean = true;
  public columnDefsExportar: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private proveedorService: ProveedorService,
    private archivoService: ArchivoService,
    private proveedorCategoriaService: ProveedorCategoriaService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['listadoProveedor'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  listarInvProveedorCategoriaTO() {
    this.cargando = true;
    this.proveedorCategoriaService.listarInvProveedorCategoria({ empresa: this.empresaSeleccionada.empCodigo }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProveedorCategoriaTO(data) {
    this.listaCategorias = data;
    if (this.listaCategorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.pcCodigo ? this.listaCategorias.find(item => item.pcCodigo === this.categoriaSeleccionada.pcCodigo) : null;
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.listarInvProveedorCategoriaTO();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      if (this.listaResultadoProveedores.length > 0) {
        let element: HTMLElement = document.getElementById('btnActivarProveedor') as HTMLElement;
        element ? element.click() : null;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarProveedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirProveedor') as HTMLElement;
      element.click();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarProveedor') as HTMLElement;
      element.click();
      return false;
    }))
  }

  limpiarResultado() {
    this.listaResultadoProveedores = [];
    this.filasService.actualizarFilas("0", "0");
  }

  generarOpciones() {
    let perConsultar = true;
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && this.empresaSeleccionada.listaSisPermisoTO.gruModificarProveedores;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.operacionesProveedor(LS.ACCION_CONSULTAR) : null },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesProveedor(LS.ACCION_EDITAR) : null }
    ];
  }

  cerrarFormularioProveedor(event) {
    this.vistaFormulario = event.mostrarFormulario;
    if (event.accion === LS.ACCION_CREAR) {
      this.refrescarTabla(event.invProveedorTO, 'I');
    } else {
      if (event.accion === LS.ACCION_EDITAR || event.accion === LS.ACCION_EDITAR_ESTADO) {
        this.refrescarTabla(event.invProveedorTO, 'U');
      }
    }
    this.generarAtajosTeclado();
    this.vistaListado = true;
    this.activarProveedor = false;
  }

  refrescarTabla(invProveedorTO: InvProveedorTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultadoProveedores.length > 0) {
          let listaTemporal = [... this.listaResultadoProveedores];
          listaTemporal.unshift(invProveedorTO);
          this.listaResultadoProveedores = listaTemporal;
          this.actualizarFilas();
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultadoProveedores.findIndex(item => item.provCodigo === invProveedorTO.provCodigo);
        let listaTemporal = [... this.listaResultadoProveedores];
        listaTemporal[indexTemp] = invProveedorTO;
        this.listaResultadoProveedores = listaTemporal;
        break;
      }
    }
  }

  cambiarEstadoActivar(event) {
    this.activarProveedor = event;
  }

  //Operaciones
  buscarProveedores(inactivos) {
    this.limpiarResultado();
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      categoria: this.categoriaSeleccionada ? this.categoriaSeleccionada.pcCodigo : null,
    };
    this.proveedorService.listarInvFunListadoProveedorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvFunListadoProveedorTO(data) {
    this.cargando = false;
    this.listaResultadoProveedores = data;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirProveedor() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoProveedores: this.listaResultadoProveedores };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/imprimirReporteProveedor", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoProveedores.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarProveedor() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoProveedores: this.listaResultadoProveedores, listaFiltradoProveedores: this.columnDefsExportar };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteProveedor", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, 'ListadoProveedores_') : this.toastr.warning(LS.MSJ_NO_RESULTADOS, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  abrirExportar() {
    this.exportarTodosEstado = true;
    this.columnDefsExportar = this.proveedorService.generarColumnasTodo();
  }

  exportarTodos() {
    this.abrirExportar();
    this.exportarProveedor();
  }

  cambiarEstadoExportar() {
    this.utilService.cambiarEstadoExportar(this.columnDefsExportar, this.exportarTodosEstado);
  }

  cambiarEstadoItemExportar() {
    this.utilService.cambiarEstadoItemExportar(this.columnDefsExportar, this);
  }

  operacionesProveedor(accion) {
    switch (accion) {
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true) && this.empresaSeleccionada.listaSisPermisoTO.gruModificarProveedores) {
          this.parametrosFormulario.empresa = this.empresaSeleccionada;
          this.parametrosFormulario.accion = LS.ACCION_EDITAR;
          this.parametrosFormulario.invProveedorTO = this.proveeedorSeleccionado;
          this.parametrosFormulario.listadoCategorias = this.listaCategorias;
          this.parametrosFormulario.tituloFormulario = LS.TITULO_FORM_EDITAR_PROVEEDOR;
          this.parametrosFormulario.activar = true;
          this.activarProveedor = true;
          this.vistaFormulario = true;
          this.vistaListado = false;
        }
        break;
      }
      case LS.ACCION_CONSULTAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
          this.parametrosFormulario.empresa = this.empresaSeleccionada;
          this.parametrosFormulario.accion = LS.ACCION_CONSULTAR;
          this.parametrosFormulario.invProveedorTO = this.proveeedorSeleccionado;
          this.parametrosFormulario.listadoCategorias = this.listaCategorias;
          this.parametrosFormulario.tituloFormulario = LS.TITULO_FORM_CONSULTAR_PROVEEDOR;
          this.parametrosFormulario.activar = true;
          this.activarProveedor = true;
          this.vistaFormulario = true;
          this.vistaListado = false;
        }
        break;
      }
    }
  }

  consultarProveedor() {
    this.operacionesProveedor(LS.ACCION_CONSULTAR);
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.proveedorService.generarColumnasGenerales();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      inputEstado: InputEstadoComponent
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

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.proveeedorSeleccionado = fila ? fila.data : null;
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.proveeedorSeleccionado = data;
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
