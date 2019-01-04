import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
import { ProductoTipoService } from './producto-tipo.service';
import { InvProductoTipoComboTO } from '../../../../entidadesTO/inventario/InvProductoTipoComboTO';
import { InvProductoTipoTO } from '../../../../entidadesTO/inventario/InvProductoTipoTO';
import { InvProductoTipoPK } from '../../../../entidades/inventario/InvProductoTipoPK';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { FilasTiempo } from '../../../../enums/FilasTiempo';

@Component({
  selector: 'app-producto-tipo',
  templateUrl: './producto-tipo.component.html',
  styleUrls: ['./producto-tipo.component.css']
})
export class ProductoTipoComponent implements OnInit {

  @Input() empresaModal: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  esModal: boolean = false;//Si es modal será true
  empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  listaEmpresas: Array<PermisosEmpresaMenuTO> = Array();
  constantes: any;
  invProductoTipoTO: InvProductoTipoTO = new InvProductoTipoTO();
  frmTitulo: string;
  classTitulo: string;
  vistaFormulario: boolean = false;
  accion: string = null;//Bandera
  cargando: boolean;
  activar: boolean;
  listadoInvProductoTipoComboTO: Array<InvProductoTipoComboTO> = Array();
  tipoSeleccionado = new InvProductoTipoComboTO();
  tipoNuevoSeleccionado = new InvProductoTipoComboTO();
  isScreamMd: boolean = true;
  opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  listaTipoProducto: Array<string> = Array();
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
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
    private archivoService: ArchivoService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private tipoService: ProductoTipoService
  ) {
    this.constantes = LS; //Hace referncia a los constantes
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.listaTipoProducto = LS.LISTA_TIPOS_PRODUCTO;
    this.inicializarAtajos();
    this.iniciarAgGrid();
  }

  ngOnInit() {
    if (this.empresaModal) {
      this.esModal = true;
      this.activar = true;
      this.listaEmpresas.push(this.empresaModal);
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.buscarProductoTipo();
      this.cambiarEmpresaSeleccionada();
    } else {
      this.listaEmpresas = this.route.snapshot.data['tipoProducto'];
      if (this.listaEmpresas) {
        this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
        LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
        this.cambiarEmpresaSeleccionada();
      }
    }
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  inicializarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      this.cerrarTipo();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarTipoProducto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirTipoProducto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarTipoProducto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoTipoProducto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listadoInvProductoTipoComboTO.length > 0) {
        this.editarProductoTipo(this.tipoSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listadoInvProductoTipoComboTO.length > 0) {
        this.eliminarProductoTipo(this.tipoSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      if (this.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnGuardarTipoProducto') as HTMLElement;
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
    this.invProductoTipoTO = new InvProductoTipoTO();
    this.limpiarListado();
    this.vistaFormulario = false;
    this.activar = false;
    this.activar = true;
    this.accion = null;
  }

  buscarProductoTipo() {
    this.cargando = true;
    this.accion = null;
    this.limpiarListado();
    this.filasTiempo.iniciarContador();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, accion: 'LISTADO' };
    this.tipoService.listarInvProductoTipoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProductoTipoTO(data) {
    this.filasTiempo.finalizarContador();
    this.listadoInvProductoTipoComboTO = data ? data : [];
    this.cargando = false;
  }

  limpiarListado() {
    this.listadoInvProductoTipoComboTO = [];
    this.actualizarFilas();
  }

  private generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.vistaFormulario;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.vistaFormulario;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editarProductoTipo(this.tipoSeleccionado) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarProductoTipo(this.tipoSeleccionado) : null }
    ];
  }

  nuevoProductoTipo() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.activar = false;
      this.listaTipoProducto = LS.LISTA_TIPOS_PRODUCTO;
      this.accion = LS.ACCION_CREAR;
      this.frmTitulo = LS.TITULO_FORM_NUEVO_PRODUCTO_TIPO;
      this.classTitulo = LS.ICON_CREAR;
      this.invProductoTipoTO = new InvProductoTipoTO();
      this.invProductoTipoTO.tipTipo = this.listaTipoProducto[0];
      this.vistaFormulario = true;
      this.cargando = false;
    }
  }

  guardarProductoTipo(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invProductoTipoTOCopia = this.tipoService.formatearInvProductoTipoTO(this.invProductoTipoTO, this);
        let parametro = { invProductoTipoTO: invProductoTipoTOCopia, accion: 'I' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoTipo", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.tipoNuevoSeleccionado = invProductoTipoTOCopia;
              this.resetearFormulario();
              this.refrescarTabla(invProductoTipoTOCopia, 'I');
              this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  resetearFormulario() {
    this.frmTitulo = LS.TITULO_FILTROS
    this.classTitulo = LS.ICON_FILTRAR;
    this.invProductoTipoTO = new InvProductoTipoTO();
    this.vistaFormulario = false;
    this.activar = true;
    this.accion = null;
  }

  editarProductoTipo(productoTipoComboTO: InvProductoTipoComboTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.activar = false;
      this.listaTipoProducto = LS.LISTA_TIPOS_PRODUCTO;
      this.accion = LS.ACCION_EDITAR;
      this.frmTitulo = LS.TITULO_FORM_EDITAR_PRODUCTO_TIPO;
      this.classTitulo = LS.ICON_EDITAR;
      this.invProductoTipoTO = new InvProductoTipoTO(productoTipoComboTO);
      this.vistaFormulario = true;
      this.cargando = false;
    }
  }

  actualizarProductoTipo(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invProductoTipoTOCopia = this.tipoService.formatearInvProductoTipoTO(this.invProductoTipoTO, this);
        let parametro = { invProductoTipoTO: invProductoTipoTOCopia, accion: 'M' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoTipo", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.tipoNuevoSeleccionado = invProductoTipoTOCopia;
              this.resetearFormulario();
              this.refrescarTabla(invProductoTipoTOCopia, 'U');
              this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ERROR);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  eliminarProductoTipo(productoTipoComboTO: InvProductoTipoComboTO) {
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
          let invProductoTipoPK = new InvProductoTipoPK({ tipEmpresa: this.empresaSeleccionada.empCodigo, tipCodigo: productoTipoComboTO.tipCodigo });
          let parametro = { invProductoTipoPK: invProductoTipoPK };
          this.api.post("todocompuWS/inventarioWebController/eliminarInvProductoTipo", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(productoTipoComboTO, 'D');
              } else {
                this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
              }
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        }
      });
    }
  }

  cerrarTipo() {
    this.tipoNuevoSeleccionado = this.tipoNuevoSeleccionado && this.tipoNuevoSeleccionado.tipCodigo == "" ?
      null : this.tipoNuevoSeleccionado;
    let parametro = {
      tipoSeleccionado: this.tipoNuevoSeleccionado
    }
    this.activeModal.close(parametro);
  }

  imprimirTipoProducto() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listInvProductoTipoComboTO: this.listadoInvProductoTipoComboTO };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteProductoTipo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ?
            this.utilService.descargarArchivoPDF('ListadoProductoTipo_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarTipoProducto() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listInvProductoTipoComboTO: this.listadoInvProductoTipoComboTO };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteProductoTipo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoProductoTipo_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }


  refrescarTabla(invProductoTipoComboTOCopia: InvProductoTipoComboTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoInvProductoTipoComboTO.length > 0) {
          let listaTemporal = [... this.listadoInvProductoTipoComboTO];
          listaTemporal.unshift(invProductoTipoComboTOCopia);
          this.listadoInvProductoTipoComboTO = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoInvProductoTipoComboTO.findIndex(item => item.tipCodigo === invProductoTipoComboTOCopia.tipCodigo);
        let listaTemporal = [... this.listadoInvProductoTipoComboTO];
        listaTemporal[indexTemp] = invProductoTipoComboTOCopia;
        this.listadoInvProductoTipoComboTO = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoInvProductoTipoComboTO.findIndex(item => item.tipCodigo === invProductoTipoComboTOCopia.tipCodigo);
        let listaTemporal = [...this.listadoInvProductoTipoComboTO];
        listaTemporal.splice(indexTemp, 1);
        this.listadoInvProductoTipoComboTO = listaTemporal;
        (this.listadoInvProductoTipoComboTO.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
    this.activar = true;
  }
  //#endregion

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.tipoService.generarColumnas(this.esModal);
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
    this.tipoSeleccionado = fila ? fila.data : null;
  }

  filaSeleccionar() {
    this.enviarItem(this.tipoSeleccionado);
  }
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
    this.tipoSeleccionado = data;
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
