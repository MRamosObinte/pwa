import { Component, OnInit, Input, HostListener, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LS } from '../../../../constantes/app-constants';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { MenuItem } from 'primeng/api';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { InvProductoPK } from '../../../../entidades/inventario/InvProductoPK';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { ProductoService } from '../producto/producto.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { HotkeysService, Hotkey } from '../../../../../../node_modules/angular2-hotkeys';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { InvFunListadoProductosTO } from '../../../../entidadesTO/inventario/InvFunListadoProductosTO';

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css']
})
export class ListadoProductosComponent implements OnInit, OnChanges {
  @Input() parametrosBusqueda: any = null;//parametros de busqueda 
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Input() isConsumos: boolean;
  @Input() listar: boolean;
  @Input() activarAtajos: boolean;
  @Input() objetoNuevoEditado = { producto: null, accion: null };
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();
  public listadoProductos: Array<any> = [];
  public objectSelect: InvListaProductosGeneralTO;//Objeto seleccionado
  public objetoSeleccionadoListadoProductos: InvFunListadoProductosTO;
  public constantes: any = LS;
  public enterKey: number = 0;//Suma el numero de enter
  public isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
  public activar: boolean = false;
  public cargando: boolean = false;
  public vistaListadoProducto: boolean = false;
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public filasTiempo = new FilasTiempo();
  public gridApi: GridApi;
  public opciones: MenuItem[];
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";

  constructor(
    public activeModal: NgbActiveModal,
    private productoService: ProductoService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
    private atajoService: HotkeysService
  ) { }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    if (this.isModal) {
      this.buscarProductos();
    }
    this.definirAtajosDeTeclado();
    this.iniciarAgGrid();
  }

  ngOnChanges() {
    if (this.listar) {
      this.buscarProductos();
    } else {
      if (this.objetoNuevoEditado && this.objetoNuevoEditado.accion === LS.ACCION_CREADO) {
        this.refrescarTabla(this.objetoNuevoEditado.producto, 'I');
      }
      if (this.objetoNuevoEditado && this.objetoNuevoEditado.accion === LS.ACCION_MODIFICADO) {
        this.refrescarTabla(this.objetoNuevoEditado.producto, 'U');
      }
    }
    this.definirAtajosDeTeclado();
  }

  buscarProductos() {
    this.cargando = true;
    this.filtroGlobal = "";
    this.listadoProductos = new Array();
    this.filasTiempo.iniciarContador();
    this.vistaListadoProducto = this.parametrosBusqueda && this.parametrosBusqueda.vista && this.parametrosBusqueda.vista === 'listadoProductos' ? true : false;
    this.vistaListadoProducto ? this.productoService.getListaInvFunListadoProductosTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT)
      : this.productoService.getListaProductosTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvFunListadoProductosTO(data) {
    this.filasTiempo.finalizarContador();
    this.listadoProductos = data;
    this.cargando = false;
    this.iniciarAgGrid();
  }

  despuesDeListarProducto(data) {
    this.filasTiempo.finalizarContador();
    if (data.length === 0) {
      this.activeModal.dismiss();
    } else {
      if (data.length === 1 && this.isModal) {
        this.activeModal.close(data[0]);
      } else {
        this.listadoProductos = data;
      }
    }
    this.cargando = false;
  }

  /**Consultar producto */
  consultarProducto() {
    if (this.vistaListadoProducto) {
      this.vistaListadoProducto ?
        this.objectSelect = this.objetoSeleccionadoListadoProductos ?
          this.productoService.convertirInvFunListadoProductosTOAInvListaProductosGeneralTO(this.objetoSeleccionadoListadoProductos) : null
        : null;
    }
    this.objectSelect ? this.emitirAccion(LS.ACCION_CONSULTAR, this.objectSelect) : null;
  }

  /**Eliminar producto */
  eliminar(seleccionado: InvListaProductosGeneralTO) {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br/>" + LS.TAG_PRODUCTO + ": " + seleccionado.proNombre,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.cargando = true;
        let parametro = { invProductoPK: new InvProductoPK({ proEmpresa: LS.KEY_EMPRESA_SELECT, proCodigoPrincipal: seleccionado.proCodigoPrincipal }) };
        this.productoService.eliminarProducto(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    });
  }

  despuesDeEliminarProducto() {
    this.refrescarTabla(this.objectSelect, 'D');
    this.cargando = false;
  }

  /**Cambiar estado de producto */
  cambiarEstado(accion, seleccionado: InvListaProductosGeneralTO) {
    let texto, titulo, estado = true;
    if (accion == LS.ACCION_INACTIVAR) {
      texto = LS.MSJ_PREGUNTA_INACTIVAR;
      titulo = LS.MSJ_TITULO_INACTIVAR;
    } else {
      texto = LS.MSJ_PREGUNTA_ACTIVAR;
      titulo = LS.MSJ_TITULO_ACTIVAR;
      estado = false;
    }
    let parametros = {
      title: titulo,
      texto: texto + "<br>" + LS.TAG_PRODUCTO + ": " + seleccionado.proNombre,
      type: LS.SWAL_QUESTION,
      confirmButtonText: LS.MSJ_SI_ACEPTAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.cargando = true;
        let parametro = {
          estado: estado,
          invProductoPK: new InvProductoPK({ proEmpresa: LS.KEY_EMPRESA_SELECT, proCodigoPrincipal: seleccionado.proCodigoPrincipal })
        };
        this.productoService.cambiarEstadoProducto(parametro, this, LS.KEY_EMPRESA_SELECT)
      }
    });
  }

  despuesDeCambiarEstadoProducto(data) {
    if (data) {
      this.objectSelect.proInactivo = !this.objectSelect.proInactivo;
      this.refrescarTabla(this.objectSelect, 'U')
    }
    this.cargando = false;
  }

  enviarItem(item) {
    this.activeModal.close(item);
  }

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit(this.activar);
  }

  imprimirProductos() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        listInvListaProductosGeneralTO: this.vistaListadoProducto ? null : this.listadoProductos,
        listInvFunListadoProductosTO: this.vistaListadoProducto ? this.listadoProductos : null
      };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteProductos", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoPDF('listaUnidadesMedida' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
            : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarProductos() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        listInvListaProductosGeneralTO: this.vistaListadoProducto ? null : this.listadoProductos,
        listInvFunListadoProductosTO: this.vistaListadoProducto ? this.listadoProductos : null
      };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteInvListaProductosGeneralTO", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListaProductos_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarListado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.productoService.verificarPermiso(LS.ACCION_EDITAR, this) && this.activarAtajos) {
        this.emitirAccion(LS.ACCION_EDITAR, this.objectSelect);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.productoService.verificarPermiso(LS.ACCION_CONSULTAR, this) && this.activarAtajos) {
        this.emitirAccion(LS.ACCION_CONSULTAR, this.objectSelect);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.productoService.verificarPermiso(LS.ACCION_ELIMINAR, this) && this.activarAtajos) {
        this.eliminar(this.objectSelect);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirProductos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarProductos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  refrescarTabla(producto: InvListaProductosGeneralTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoProductos.length > 0) {
          let listaTemporal = [... this.listadoProductos];
          listaTemporal.unshift(producto);
          this.listadoProductos = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        if (this.vistaListadoProducto) {
          var indexTemp = this.listadoProductos.findIndex(item => item.prdCodigoPrincipal === producto.proCodigoPrincipal);
          let listaTemporal = [... this.listadoProductos];
          let product = listaTemporal[indexTemp];
          product.prdNombre = producto.proNombre;
          product.prdMedida = producto.detalleMedida;
          product.prdCategoria = producto.proCategoria;
          this.listadoProductos = listaTemporal;
        } else {
          var indexTemp = this.listadoProductos.findIndex(item => item.proCodigoPrincipal === producto.proCodigoPrincipal);
          let listaTemporal = [... this.listadoProductos];
          listaTemporal[indexTemp] = producto;
          this.listadoProductos = listaTemporal;
        }
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoProductos.findIndex(item => item.proCodigoPrincipal === producto.proCodigoPrincipal);
        let listaTemporal = [...this.listadoProductos];
        listaTemporal.splice(indexTemp, 1);
        this.listadoProductos = listaTemporal;
        (this.listadoProductos.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
    this.refreshGrid();
  }

  emitirAccion(accion, seleccionado: InvListaProductosGeneralTO) {
    let parametros = {
      accion: accion,
      objetoSeleccionado: seleccionado
    }
    this.enviarAccion.emit(parametros);
  }
  //Menu
  generarOpciones() {
    this.vistaListadoProducto ? this.objectSelect =
      this.objetoSeleccionadoListadoProductos ? this.productoService.convertirInvFunListadoProductosTOAInvListaProductosGeneralTO(this.objetoSeleccionadoListadoProductos) : null : null;
    let perConsultar = this.objectSelect;
    let perEditar = this.productoService.verificarPermiso(LS.ACCION_EDITAR, this) && this.objectSelect;
    let perEliminar = this.productoService.verificarPermiso(LS.ACCION_ELIMINAR, this) && this.objectSelect;
    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.emitirAccion(LS.ACCION_CONSULTAR, this.objectSelect) : null
      },
      {
        label: LS.ACCION_EDITAR,
        icon: LS.ICON_EDITAR,
        disabled: !perEditar,
        command: () => perEditar ? this.emitirAccion(LS.ACCION_EDITAR, this.objectSelect) : null
      }
    ];

    if (!this.vistaListadoProducto) {
      this.opciones.push(
        {
          label: LS.ACCION_ELIMINAR,
          icon: LS.ICON_ELIMINAR,
          disabled: !perEliminar,
          command: () => perEliminar ? this.eliminar(this.objectSelect) : null
        },
        {
          label: LS.ACCION_INACTIVAR,
          icon: LS.ICON_INACTIVAR,
          disabled: !perEditar || this.objectSelect.proInactivo,
          command: () => !perEditar || !this.objectSelect.proInactivo ? this.cambiarEstado(LS.ACCION_INACTIVAR, this.objectSelect) : null
        },
        {
          label: LS.ACCION_ACTIVAR,
          icon: LS.ICON_ACTIVAR,
          disabled: !perEditar || !this.objectSelect.proInactivo,
          command: () => !perEditar || this.objectSelect.proInactivo ? this.cambiarEstado(LS.ACCION_ACTIVAR, this.objectSelect) : null
        }
      )
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.vistaListadoProducto ? this.productoService.generarColumnasProductoListado() : this.productoService.generarColumnasGenerales(this);
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
    this.vistaListadoProducto ?
      this.objetoSeleccionadoListadoProductos = fila ? fila.data : null :
      this.objectSelect = fila ? fila.data : null;
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
    this.objectSelect = data;
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
  /**Modal */
  filaSeleccionar() {
    this.enviarItem(this.objectSelect);
  }

  ejecutarSpanAccion(event, data) {
    this.enviarItem(data);
  }

  /*Metodos para seleccionar producto con ENTER O DOBLECLICK */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isModal) {
      if (event.keyCode === 13) {
        if (this.enterKey > 0) {
          this.enviarItem(this.objectSelect);
        }
        this.enterKey = this.enterKey + 1;
      }
    }
  }
}
