import { Component, OnInit, Input, ChangeDetectorRef, HostListener, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { MenuItem } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ActivatedRoute } from '@angular/router';
import { ProductoMarcaService } from './producto-marca.service';
import { InvProductoMarcaComboListadoTO } from '../../../../entidadesTO/inventario/InvProductoMarcaComboListadoTO';
import { InvProductoMarcaTO } from '../../../../entidadesTO/inventario/InvProductoMarcaTO';
import { InvProductoMarcaPK } from '../../../../entidades/inventario/InvProductoMarcaPK';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-producto-marca',
  templateUrl: './producto-marca.component.html',
  styleUrls: ['./producto-marca.component.css']
})
export class ProductoMarcaComponent implements OnInit {
  @Input() empresaModal: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() marcaSeleccionada: InvProductoMarcaComboListadoTO;
  @Input() razonSocial: string;
  marcaNuevoSeleccionada = new InvProductoMarcaComboListadoTO();
  esModal: boolean = false;//Si es modal será true
  empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  listaEmpresas: Array<PermisosEmpresaMenuTO> = Array();
  constantes: any;
  invProductoMarcaTO: InvProductoMarcaTO = new InvProductoMarcaTO();
  frmTitulo: string;
  classTitulo: string;
  vistaFormulario: boolean = false;
  accion: string = null;//Bandera
  cargando: boolean;
  activar: boolean;
  listadoInvProductoMarcaComboListadoTO: Array<InvProductoMarcaComboListadoTO> = Array();
  isScreamMd: boolean = true;
  opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public filasTiempo: FilasTiempo = new FilasTiempo();
  filtroGlobal: string = "";
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
    public api: ApiRequestService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public utilService: UtilService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private cdRef: ChangeDetectorRef,
    private archivoService: ArchivoService,
    private marcaService: ProductoMarcaService
  ) {
    this.constantes = LS; //Hace referncia a los constantes
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.inicializarAtajos();
  }

  ngOnInit() {
    if (this.empresaModal) {
      this.esModal = true;
      this.activar = true;
      this.listaEmpresas.push(this.empresaModal);
      this.empresaSeleccionada = this.listaEmpresas[0];
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.buscarProductoMarcas();
      this.cambiarEmpresaSeleccionada();
    } else {
      this.listaEmpresas = this.route.snapshot.data['productoMarca'];
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.listaEmpresas ? LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo : null;
      this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    }
    this.iniciarAgGrid();
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.cdRef.detectChanges();
  }

  inicializarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      this.cerrarProductoMarca();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarMarcaProducto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirMarcaProducto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarMarcaProducto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoMarcaProducto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listadoInvProductoMarcaComboListadoTO.length > 0) {
        this.editarProductoMarca(this.marcaSeleccionada);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listadoInvProductoMarcaComboListadoTO.length > 0) {
        this.eliminarProductoMarca(this.marcaSeleccionada);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      if (this.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnGuardarMarcaProducto') as HTMLElement;
        element ? element.click() : null;
        return false;
      }
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      if (this.vistaFormulario) {
        this.resetearFormulario();
      }
      return false;
    }));
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.invProductoMarcaTO = new InvProductoMarcaTO();
    this.limpiarListado();
    this.vistaFormulario = false;
    this.activar = true;
    this.accion = null;
  }

  buscarProductoMarcas() {
    this.cargando = true;
    this.accion = null;
    this.limpiarListado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.marcaService.listarInvMarcaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvMarcaTO(data) {
    this.listadoInvProductoMarcaComboListadoTO = data ? data : [];
    this.actualizarFilas();
    this.cargando = false;
  }

  limpiarListado() {
    this.listadoInvProductoMarcaComboListadoTO = [];
    this.marcaSeleccionada = new InvProductoMarcaComboListadoTO();
    this.actualizarFilas();
  }

  generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.vistaFormulario;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.vistaFormulario;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editarProductoMarca(this.marcaSeleccionada) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarProductoMarca(this.marcaSeleccionada) : null }
    ];
  }

  nuevoProductoMarca() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CREAR;
      this.frmTitulo = LS.TITULO_FORM_NUEVO_PRODUCTO_MARCA;
      this.classTitulo = LS.ICON_CREAR;
      this.invProductoMarcaTO = new InvProductoMarcaTO();
      this.vistaFormulario = true;
      this.cargando = false;
      this.activar = false;
    }
  }

  guardarProductoMarca(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invProductoMarcaTOCopia = this.marcaService.formatearInvProductoMarcaTO(this.invProductoMarcaTO, this);
        let parametro = { invProductoMarcaTO: invProductoMarcaTOCopia, accion: 'I' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoMarcaTO", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.marcaNuevoSeleccionada = invProductoMarcaTOCopia;
              this.resetearFormulario();
              this.refrescarTabla(invProductoMarcaTOCopia, 'I');
              this.toastr.info(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ERROR);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  resetearFormulario() {
    this.frmTitulo = LS.TITULO_FILTROS
    this.classTitulo = LS.ICON_FILTRAR;
    this.invProductoMarcaTO = new InvProductoMarcaTO();
    this.vistaFormulario = false;
    this.accion = null;
    this.activar = true;
  }

  editarProductoMarca(productoMarcaTO: InvProductoMarcaComboListadoTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_EDITAR;
      this.frmTitulo = LS.TITULO_FORM_EDITAR_PRODUCTO_MARCA;
      this.classTitulo = LS.ICON_EDITAR;
      this.invProductoMarcaTO = new InvProductoMarcaTO(productoMarcaTO);
      this.vistaFormulario = true;
      this.cargando = false;
      this.activar = false;
    }
  }

  actualizarProductoMarca(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invProductoMarcaTOCopia = this.marcaService.formatearInvProductoMarcaTO(this.invProductoMarcaTO, this);
        let parametro = { invProductoMarcaTO: invProductoMarcaTOCopia, accion: 'M' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoMarcaTO", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.marcaNuevoSeleccionada = invProductoMarcaTOCopia;
              this.resetearFormulario();
              this.refrescarTabla(invProductoMarcaTOCopia, 'U');
              this.toastr.info(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ERROR);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  eliminarProductoMarca(productoMarcaTO: InvProductoMarcaComboListadoTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let invProductoMarcaPK = new InvProductoMarcaPK({ marEmpresa: this.empresaSeleccionada.empCodigo, marCodigo: productoMarcaTO.marCodigo });
          let parametro = { invProductoMarcaPK: invProductoMarcaPK };
          this.api.post("todocompuWS/inventarioWebController/eliminarInvProductoMarca", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(productoMarcaTO, 'D');
                this.toastr.info(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
              } else {
                this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
              }
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        }
      });
    }
  }

  cerrarProductoMarca() {
    this.marcaNuevoSeleccionada = this.marcaNuevoSeleccionada && this.marcaNuevoSeleccionada.marCodigo == "" ?
      null : this.marcaNuevoSeleccionada;
    let parametro = {
      marcaSeleccionado: this.marcaNuevoSeleccionada
    }
    this.activeModal.close(parametro);
  }

  imprimirMarcaProducto() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listInvProductoMarcaComboListadoTO: this.listadoInvProductoMarcaComboListadoTO };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteProductoMarca", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoMarcaProductos_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
            : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarMarcaProducto() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listInvProductoMarcaComboListadoTO: this.listadoInvProductoMarcaComboListadoTO };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteProductoMarca", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoMarcaProductos_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  refrescarTabla(productoMarcaCombo: InvProductoMarcaComboListadoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoInvProductoMarcaComboListadoTO.length > 0) {
          let listaTemporal = [... this.listadoInvProductoMarcaComboListadoTO];
          listaTemporal.unshift(productoMarcaCombo);
          this.listadoInvProductoMarcaComboListadoTO = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoInvProductoMarcaComboListadoTO.findIndex(item => item.marCodigo === productoMarcaCombo.marCodigo);
        let listaTemporal = [... this.listadoInvProductoMarcaComboListadoTO];
        listaTemporal[indexTemp] = productoMarcaCombo;
        this.listadoInvProductoMarcaComboListadoTO = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoInvProductoMarcaComboListadoTO.findIndex(item => item.marCodigo === productoMarcaCombo.marCodigo);
        this.listadoInvProductoMarcaComboListadoTO = this.listadoInvProductoMarcaComboListadoTO.filter((val, i) => i != indexTemp);
        (this.listadoInvProductoMarcaComboListadoTO.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
    this.activar = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.marcaService.generarColumnas(this.esModal);
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
    this.marcaSeleccionada = fila ? fila.data : null;
  }

  filaSeleccionar() {
    this.enviarItem(this.marcaSeleccionada);
  }

  /**
   *Enviar Item seleccionado
   */
  enviarItem(item) {
    this.activeModal.close(item);
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
    this.marcaSeleccionada = data;
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
