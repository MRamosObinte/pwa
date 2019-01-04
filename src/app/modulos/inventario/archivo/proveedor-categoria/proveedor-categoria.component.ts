import { Component, OnInit, HostListener, ViewChild, Input } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { InvProveedorCategoriaTO } from '../../../../entidadesTO/inventario/InvProveedorCategoriaTO';
import { ProveedorCategoriaService } from './proveedor-categoria.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-proveedor-categoria',
  templateUrl: './proveedor-categoria.component.html',
  styleUrls: ['./proveedor-categoria.component.css']
})
export class ProveedorCategoriaComponent implements OnInit {
  public listaResultado: Array<InvProveedorCategoriaTO> = [];
  public objetoSeleccionado: InvProveedorCategoriaTO = new InvProveedorCategoriaTO();
  public objetoNuevoSeleccionado: InvProveedorCategoriaTO = new InvProveedorCategoriaTO();
  public invProveedorCategoriaTO: InvProveedorCategoriaTO = new InvProveedorCategoriaTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = LS;
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public classIcon: string = LS.ICON_FILTRAR;
  esModal: boolean = false;//Si es modal será true
  @Input() empresaModal: PermisosEmpresaMenuTO;
  @Input() razonSocial: string;
  empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public vistaFormulario: boolean = false;
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
    private proveedorCategoriaService: ProveedorCategoriaService,
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private auth: AuthService,
    private archivoService: ArchivoService,
    private utilService: UtilService,
    public activeModal: NgbActiveModal,
  ) {
  }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['categoriaProveedorInv'];
    if (this.empresaModal) {
      this.esModal = true;
      this.empresaSeleccionada = this.empresaModal;
    } else {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    }
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.listarInvProveedorCategoriaTO();
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  //LISTADOS
  /** Metodo para listar las categorias de clientes dependiendo de la empresa*/
  listarInvProveedorCategoriaTO() {
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    this.proveedorCategoriaService.listarInvProveedorCategoria({ empresa: this.empresaSeleccionada.empCodigo }, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarInvProveedorCategoriaTO()*/
  despuesDeListarInvProveedorCategoriaTO(data) {
    this.filasTiempo.finalizarContador();
    this.listaResultado = data;
    this.cargando = false;
  }

  //OPERACIONES
  /** Metodo general, este metodo se ejecuta cada vez que se de clic en las opciones (Nuevo,editar o eliminar) para poder setear sus valores correspondientes*/
  operacionesCategoria(opcion) {
    switch (opcion) {
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.invProveedorCategoriaTO = new InvProveedorCategoriaTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.activar = false;
          this.tituloForm = LS.TITULO_FILTROS;
          this.classIcon = LS.ICON_FILTRAR;
          this.eliminarCategoria();
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.invProveedorCategoriaTO = new InvProveedorCategoriaTO();
          this.accion = LS.ACCION_CREAR;
          this.activar = false;
          this.tituloForm = LS.TITULO_FORM_NUEVO_CATEGORIA_PROVEEDOR;
          this.classIcon = LS.ICON_FILTRO_NUEVO;
          this.vistaFormulario = true;
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.invProveedorCategoriaTO = new InvProveedorCategoriaTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_EDITAR;
          this.activar = false;
          this.tituloForm = LS.TITULO_FORM_EDITAR_CATEGORIA_PROVEEDOR;
          this.classIcon = LS.ICON_FILTRO_EDITAR;
          this.vistaFormulario = true;
        }
        break;
      }
    }
  }

  accionesCategoria(invProveedorCategoriaTO, accionChar) {
    this.api.post("todocompuWS/inventarioWebController/accionInvProveedorCategoria", { invProveedorCategoriaTO: invProveedorCategoriaTO, accion: accionChar }, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        this.cargando = false;
        if (respuesta && respuesta.extraInfo) {
          switch (this.accion) {
            case LS.ACCION_CREAR: {
              this.refrescarTabla(invProveedorCategoriaTO, 'I')
              break;
            }
            case LS.ACCION_EDITAR: {
              this.refrescarTabla(invProveedorCategoriaTO, 'U')
              break;
            }
            case LS.ACCION_ELIMINAR: {
              this.refrescarTabla(invProveedorCategoriaTO, 'D')
              break;
            }
          }
          this.toastr.success(respuesta.operacionMensaje, 'Aviso');
          this.resetear();
        } else {
          this.accion === LS.ACCION_ELIMINAR ? this.resetear() : null;
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  insertarCategoria(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invCategoriaCopia = JSON.parse(JSON.stringify(this.invProveedorCategoriaTO));
        this.objetoNuevoSeleccionado = invCategoriaCopia;
        this.setearValoresCategoria(invCategoriaCopia);
        this.accionesCategoria(invCategoriaCopia, 'I');
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  actualizarCategoria(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invCategoriaCopia = JSON.parse(JSON.stringify(this.invProveedorCategoriaTO));
        this.objetoNuevoSeleccionado = invCategoriaCopia;
        this.setearValoresCategoria(invCategoriaCopia);
        this.accionesCategoria(invCategoriaCopia, 'M');
        this.vistaFormulario = false;
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  eliminarCategoria() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let item = JSON.parse(JSON.stringify(this.invProveedorCategoriaTO));
      item.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.accionesCategoria(item, 'E');
        } else {
          this.resetear();
        }
      });
    }
  }

  imprimirCategoriaProveedor() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoCategorias: this.listaResultado };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/imprimirReporteCategoriaProveedor", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoCategoriasProveedor.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarCategoriaProveedor() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoCategorias: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteCategoriaProveedor", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoCategoriasProveedor_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  cerrarTipoContribuyente() {
    this.objetoNuevoSeleccionado = this.objetoNuevoSeleccionado && this.objetoNuevoSeleccionado.pcCodigo == "" ?
      null : this.objetoNuevoSeleccionado;
    let parametro = {
      tipoContribuyenteSeleccionado: this.objetoNuevoSeleccionado
    }
    this.activeModal.close(parametro);
  }

  //OTROS METODOS
  setearValoresCategoria(invCategoriaCopia) {
    invCategoriaCopia.pcEmpresa = LS.KEY_EMPRESA_SELECT.trim();
    invCategoriaCopia.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
    invCategoriaCopia.usrCodigo = this.auth.getCodigoUser();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listaResultado = [];
    this.vistaFormulario = false;
    this.filasService.actualizarFilas("0", "0");
  }

  /** Metodo que reinicia los valores de las variables accion,filas y los listaEmpresas de opciones de menú*/
  resetear() {
    this.accion = null;
    this.activar = false;
    this.tituloForm = LS.TITULO_FILTROS;
    this.classIcon = LS.ICON_FILTRAR;
    this.vistaFormulario = false;
    this.filasService.actualizarFilas(this.listaResultado.length, this.filasTiempo.getTiempo());
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho*/
  generarOpciones() {
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && !this.vistaFormulario;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar && !this.vistaFormulario;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesCategoria(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesCategoria(LS.ACCION_ELIMINAR) : null },
    ];
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      this.cerrarTipoContribuyente();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (!this.vistaFormulario && this.listaResultado.length > 0) {
        this.operacionesCategoria(LS.ACCION_EDITAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (!this.vistaFormulario && this.listaResultado.length > 0) {
        this.operacionesCategoria(LS.ACCION_ELIMINAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      if (this.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
        element.click();
        return false;
      }
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      if (this.listaResultado.length > 0) {
        let element: HTMLElement = document.getElementById('btnImprimirCategoriaProveedor') as HTMLElement;
        element.click();
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      if (this.listaResultado.length > 0) {
        let element: HTMLElement = document.getElementById('btnExportarCategoriaProveedor') as HTMLElement;
        element.click();
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      if (this.vistaFormulario) {
        this.resetear();
      }
      return false;
    }))
  }

  refrescarTabla(invProveedorCategoriaTO: InvProveedorCategoriaTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(invProveedorCategoriaTO);
          this.listaResultado = listaTemporal;
          this.seleccionarFila(0);
        }
        this.vistaFormulario = false;
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultado.findIndex(item => item.pcCodigo === invProveedorCategoriaTO.pcCodigo);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = invProveedorCategoriaTO;
        this.listaResultado = listaTemporal;
        this.seleccionarFila(indexTemp);
        this.vistaFormulario = false;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.pcCodigo === invProveedorCategoriaTO.pcCodigo);
        let listaTemporal = [...this.listaResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultado = listaTemporal;
        (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  //METODOS PARA DESPLAZARSE EN LA TABLA CON TECLAS
  /** Es llamado cuando se ejecuta el filtro en la tabla*/
  filtrarGlobalmente(dt) {
    dt.filterGlobal(this.filtroGlobal.toUpperCase(), 'contains');
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.proveedorCategoriaService.generarColumnas();
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
    this.objetoSeleccionado = fila ? fila.data : null;
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
    this.objetoSeleccionado = data;
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
