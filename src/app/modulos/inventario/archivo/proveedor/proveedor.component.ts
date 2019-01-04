import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ProveedorService } from './proveedor.service';
import { ProveedorCategoriaService } from '../proveedor-categoria/proveedor-categoria.service';
import { InvProveedorCategoriaTO } from '../../../../entidadesTO/inventario/InvProveedorCategoriaTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  public listaResultadoProveedores: Array<InvProveedorTO> = [];
  public listaCategorias: Array<InvProveedorCategoriaTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public proveeedorSeleccionado: InvProveedorTO = new InvProveedorTO();
  public categoriaSeleccionada: InvProveedorCategoriaTO = new InvProveedorCategoriaTO();
  public constantes: any = LS;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activarProveedor: boolean = false;
  public isScreamMd: boolean = true;
  public parametrosFormulario: any = { accion: null, empresaSeleccionada: null, invProveedorTO: null, listadoCategorias: [], tituloFormulario: null, activar: false };
  public vistaListado: boolean = true;
  public vistaFormulario: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public busqueda: string = null;
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;

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
    this.listaEmpresas = this.route.snapshot.data['proveedorInv'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  operacionesProveedor(accion) {
    switch (accion) {
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.activarProveedor = false;
          this.parametrosFormulario.empresa = this.empresaSeleccionada;
          this.parametrosFormulario.accion = LS.ACCION_ELIMINAR;
          this.parametrosFormulario.invProveedorTO = this.proveeedorSeleccionado;
          this.vistaFormulario = true;
          this.vistaListado = true;
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true) && this.empresaSeleccionada.listaSisPermisoTO.gruCrearProveedores) {
          this.parametrosFormulario.empresa = this.empresaSeleccionada;
          this.parametrosFormulario.accion = LS.ACCION_CREAR;
          this.parametrosFormulario.invProveedorTO = new InvProveedorTO();
          this.parametrosFormulario.listadoCategorias = this.listaCategorias;
          this.parametrosFormulario.tituloFormulario = LS.TITULO_FORM_NUEVO_PROVEEDOR;
          this.parametrosFormulario.activar = true;
          this.activarProveedor = true;
          this.vistaFormulario = true;
          this.vistaListado = false;
        }
        break;
      }
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
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR_ESTADO, this, true) && this.empresaSeleccionada.listaSisPermisoTO.gruModificarProveedores) {
          this.parametrosFormulario.empresa = this.empresaSeleccionada;
          this.parametrosFormulario.accion = LS.ACCION_EDITAR_ESTADO;
          this.parametrosFormulario.invProveedorTO = this.proveeedorSeleccionado;
          this.vistaFormulario = true;
          this.vistaListado = true;
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

  listarProveedores(inactivos) {
    this.limpiarResultado();
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      categoria: null,
      busqueda: this.busqueda,
      inactivos: inactivos
    };
    this.proveedorService.listarInvProveedorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProveedorTO(data) {
    this.cargando = false;
    if (data.length != 0) {
      this.listaResultadoProveedores = data;
    }
  }

  listarInvProveedorCategoriaTO() {
    this.cargando = true;
    this.proveedorCategoriaService.listarInvProveedorCategoria({ empresa: this.empresaSeleccionada.empCodigo }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProveedorCategoriaTO(data) {
    this.listaCategorias = data;
    if (this.listaCategorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.pcCodigo ? this.listaCategorias.find(item => item.pcCodigo === this.categoriaSeleccionada.pcCodigo) : this.listaCategorias[0];
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  imprimirProveedor() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoProveedores: this.listaResultadoProveedores };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/imprimirReporteProveedor", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoProveedores.pdf', data)
            : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarProveedor() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoProveedores: this.listaResultadoProveedores };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteProveedor", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, 'ListadoProveedores_')
            : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.listarInvProveedorCategoriaTO();
  }

  limpiarResultado() {
    this.listaResultadoProveedores = [];
    this.filtroGlobal = "";
    this.filasService.actualizarFilas("0", "0");
    if (this.busqueda) {
      (<HTMLInputElement>document.getElementById('btnBuscarProveedor')).disabled = false;
      (<HTMLInputElement>document.getElementById('btnInactivo')).disabled = false;
    } else {
      (<HTMLInputElement>document.getElementById('btnBuscarProveedor')).disabled = true;
      (<HTMLInputElement>document.getElementById('btnInactivo')).disabled = true;
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarProveedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarProveedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoProveedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirProveedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarProveedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.listaResultadoProveedores.length > 0) {
        this.operacionesProveedor(LS.ACCION_EDITAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.listaResultadoProveedores.length > 0) {
        this.operacionesProveedor(LS.ACCION_ELIMINAR);
      }
      return false;
    }))
  }

  generarOpciones() {
    let perConsultar = true;
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && this.empresaSeleccionada.listaSisPermisoTO.gruModificarProveedores;
    let perInactivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && this.empresaSeleccionada.listaSisPermisoTO.gruModificarProveedores && !this.proveeedorSeleccionado.provInactivo;
    let perActivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && this.empresaSeleccionada.listaSisPermisoTO.gruModificarProveedores && this.proveeedorSeleccionado.provInactivo;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.operacionesProveedor(LS.ACCION_CONSULTAR) : null },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesProveedor(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesProveedor(LS.ACCION_ELIMINAR) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionesProveedor(LS.ACCION_EDITAR_ESTADO) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionesProveedor(LS.ACCION_EDITAR_ESTADO) : null },
    ];
  }

  consultarProveedor() {
    this.operacionesProveedor(LS.ACCION_CONSULTAR);
  }

  /** Metodo que se necesita para app-proveddor-formulario(componente), cambia de estado la variable activarProveedor */
  cambiarEstadoActivar(event) {
    this.activarProveedor = event;
  }

  cerrarFormularioProveedor(event) {
    this.vistaFormulario = event.mostrarFormulario;
    if (event.accion) {
      this.listarInvProveedorCategoriaTO();
      if (event.accion === LS.ACCION_CREAR) {
        this.refrescarTabla(event.invProveedorTO, 'I');
      } else {
        if (event.accion === LS.ACCION_EDITAR || event.accion === LS.ACCION_EDITAR_ESTADO) {
          this.refrescarTabla(event.invProveedorTO, 'U');
        } else {
          if (event.accion === LS.ACCION_ELIMINAR) {
            this.refrescarTabla(event.invProveedorTO, 'D');
          }
        }
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
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultadoProveedores.findIndex(item => item.provCodigo === invProveedorTO.provCodigo);
        let listaTemporal = [... this.listaResultadoProveedores];
        listaTemporal[indexTemp] = invProveedorTO;
        this.listaResultadoProveedores = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultadoProveedores.findIndex(item => item.provCodigo === invProveedorTO.provCodigo);
        let listaTemporal = [...this.listaResultadoProveedores];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultadoProveedores = listaTemporal;
        (this.listaResultadoProveedores.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.proveedorService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarFila(0);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.proveeedorSeleccionado = fila ? fila.data : null;
  }
  /***/

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

  seleccionarFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
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
  //#endregion
}
