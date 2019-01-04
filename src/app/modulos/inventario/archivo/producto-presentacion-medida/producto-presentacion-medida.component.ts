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
import { ProductoPresentacionMedidaService } from './producto-presentacion-medida.service';
import { InvProductoPresentacionUnidadesComboListadoTO } from '../../../../entidadesTO/inventario/InvProductoPresentacionUnidadesComboListadoTO';
import { InvProductoPresentacionUnidadesTO } from '../../../../entidadesTO/inventario/InvProductoPresentacionUnidadesTO';
import { InvProductoPresentacionUnidadesPK } from '../../../../entidades/inventario/InvProductoPresentacionUnidadesPK';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { FilasTiempo } from '../../../../enums/FilasTiempo';

@Component({
  selector: 'app-producto-presentacion-medida',
  templateUrl: './producto-presentacion-medida.component.html',
  styleUrls: ['./producto-presentacion-medida.component.css']
})
export class ProductoPresentacionMedidaComponent implements OnInit {

  @Input() empresaModal: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() razonSocial: string;
  esModal: boolean = false;//Si es modal será true
  empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  listaEmpresas: Array<PermisosEmpresaMenuTO> = Array();
  constantes: any;
  invProductoPresentacionUnidadesTO: InvProductoPresentacionUnidadesTO = new InvProductoPresentacionUnidadesTO();
  frmTitulo: string;
  classTitulo: string = LS.ICON_FILTRAR;
  vistaFormulario: boolean = false;
  accion: string = null;//Bandera
  cargando: boolean;
  activar: boolean;
  listadoInvProductoPresentacionUnidadesComboListadoTO: Array<InvProductoPresentacionUnidadesComboListadoTO> = Array();
  unidadSeleccionada = new InvProductoPresentacionUnidadesComboListadoTO();
  unidadNuevoSeleccionada = new InvProductoPresentacionUnidadesComboListadoTO();
  isScreamMd: boolean = true;
  opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  filtroGlobal: string = "";
  filasTiempo: FilasTiempo = new FilasTiempo();
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
    private ppUnidadService: ProductoPresentacionMedidaService
  ) {
    this.constantes = LS; //Hace referncia a los constantes
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.inicializarAtajos();
  }

  ngOnInit() {
    this.activar = true;
    if (this.empresaModal) {
      this.esModal = true;
      this.listaEmpresas.push(this.empresaModal);
      this.empresaSeleccionada = this.listaEmpresas[0];
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.buscarProductoPresentacionUnidad();
      this.cambiarEmpresaSeleccionada();
    } else {
      this.listaEmpresas = this.route.snapshot.data['productoPresentacionUnidad'];
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.listaEmpresas ? LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo : null;
      this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    }
    this.iniciarAgGrid(); this.iniciarAgGrid();
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.cdRef.detectChanges();
  }

  inicializarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      this.cerrarProductoPresentacion();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarPresentacionMedida') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirPresentacionMedida') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarPresentacionMedida') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoPresentacionMedida') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listadoInvProductoPresentacionUnidadesComboListadoTO.length > 0) {
        this.editarProductoPresentacionUnidad(this.unidadSeleccionada);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listadoInvProductoPresentacionUnidadesComboListadoTO.length > 0) {
        this.eliminarProductoPresentacionUnidad(this.unidadSeleccionada);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      if (this.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnGuardarPresentacionMedida') as HTMLElement;
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
    this.invProductoPresentacionUnidadesTO = new InvProductoPresentacionUnidadesTO();
    this.limpiarListado();
    this.vistaFormulario = false;
    this.accion = null;
  }

  buscarProductoPresentacionUnidad() {
    this.cargando = true;
    this.accion = null;
    this.limpiarListado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.ppUnidadService.listaPresentacionUnidadTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPresentacionUnidadTO(data) {
    this.listadoInvProductoPresentacionUnidadesComboListadoTO = data ? data : [];
    this.cargando = false;
  }

  limpiarListado() {
    this.listadoInvProductoPresentacionUnidadesComboListadoTO = [];
    this.actualizarFilas();
  }

  private generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.vistaFormulario;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.vistaFormulario;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editarProductoPresentacionUnidad(this.unidadSeleccionada) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarProductoPresentacionUnidad(this.unidadSeleccionada) : null }
    ];
  }

  nuevoProductoPresentacionUnidad() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.activar = false;
      this.accion = LS.ACCION_CREAR;
      this.frmTitulo = LS.TITULO_FORM_NUEVO_PRODUCTO_PRESENTACION_UNIDAD;
      this.classTitulo = LS.ICON_CREAR;
      this.invProductoPresentacionUnidadesTO = new InvProductoPresentacionUnidadesTO();
      this.vistaFormulario = true;
      this.cargando = false;
    }
  }

  guardarProductoPresentacionUnidad(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invProductoPresentacionCopia = this.ppUnidadService.formatearInvProductoPresentacionUnidadesTO(this.invProductoPresentacionUnidadesTO, this);
        let parametro = { invProductoPresentacionUnidadesTO: invProductoPresentacionCopia, accion: 'I' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoPresentacionUnidadesTO", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.unidadNuevoSeleccionada = invProductoPresentacionCopia;
              this.resetearFormulario();
              this.refrescarTabla(invProductoPresentacionCopia, 'I');
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
    this.invProductoPresentacionUnidadesTO = new InvProductoPresentacionUnidadesTO();
    this.vistaFormulario = false;
    this.activar = true;
    this.accion = null;
  }

  editarProductoPresentacionUnidad(ppUnidadComboTO: InvProductoPresentacionUnidadesComboListadoTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.activar = false;
      this.accion = LS.ACCION_EDITAR;
      this.frmTitulo = LS.TITULO_FORM_EDITAR_PRODUCTO_PRESENTACION_UNIDAD;
      this.classTitulo = LS.ICON_EDITAR;
      this.invProductoPresentacionUnidadesTO = new InvProductoPresentacionUnidadesTO(ppUnidadComboTO);
      this.vistaFormulario = true;
      this.cargando = false;
    }
  }

  actualizarProductoPresentacionUnidad(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invProductoPresentacionCopia = this.ppUnidadService.formatearInvProductoPresentacionUnidadesTO(this.invProductoPresentacionUnidadesTO, this);
        let parametro = { invProductoPresentacionUnidadesTO: invProductoPresentacionCopia, accion: 'M' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoPresentacionUnidadesTO", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.unidadNuevoSeleccionada = invProductoPresentacionCopia;
              this.resetearFormulario();
              this.refrescarTabla(invProductoPresentacionCopia, 'U');
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

  eliminarProductoPresentacionUnidad(ppUnidadComboTO: InvProductoPresentacionUnidadesComboListadoTO) {
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
          let invProductoPresentacionUnidadesPK = new InvProductoPresentacionUnidadesPK({ presuEmpresa: this.empresaSeleccionada.empCodigo, presuCodigo: ppUnidadComboTO.presuCodigo });
          let parametro = { invProductoPresentacionUnidadesPK: invProductoPresentacionUnidadesPK };
          this.api.post("todocompuWS/inventarioWebController/eliminarInvProductoPresentacionUnidades", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(ppUnidadComboTO, 'D');
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

  cerrarProductoPresentacion() {
    this.unidadNuevoSeleccionada = this.unidadNuevoSeleccionada && this.unidadNuevoSeleccionada.presuCodigo == "" ?
      null : this.unidadNuevoSeleccionada;
    let parametro = {
      presUnidadSeleccionada: this.unidadNuevoSeleccionada
    }
    this.activeModal.close(parametro);
  }

  imprimirPresentacionMedida() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listInvProductoPresentacionUnidadesTO: this.listadoInvProductoPresentacionUnidadesComboListadoTO };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteProductoPresentacionUnidad", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoPresentacionUnidad_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
            : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarPresentacionMedida() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listInvProductoPresentacionUnidadesTO: this.listadoInvProductoPresentacionUnidadesComboListadoTO };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReportePresentacionUnidad", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoPresentacionUnidad_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  refrescarTabla(ppPresentacionUnidad: InvProductoPresentacionUnidadesComboListadoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoInvProductoPresentacionUnidadesComboListadoTO.length > 0) {
          let listaTemporal = [... this.listadoInvProductoPresentacionUnidadesComboListadoTO];
          listaTemporal.unshift(ppPresentacionUnidad);
          this.listadoInvProductoPresentacionUnidadesComboListadoTO = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoInvProductoPresentacionUnidadesComboListadoTO.findIndex(item => item.presuCodigo === ppPresentacionUnidad.presuCodigo);
        let listaTemporal = [... this.listadoInvProductoPresentacionUnidadesComboListadoTO];
        listaTemporal[indexTemp] = ppPresentacionUnidad;
        this.listadoInvProductoPresentacionUnidadesComboListadoTO = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoInvProductoPresentacionUnidadesComboListadoTO.findIndex(item => item.presuCodigo === ppPresentacionUnidad.presuCodigo);
        this.listadoInvProductoPresentacionUnidadesComboListadoTO = this.listadoInvProductoPresentacionUnidadesComboListadoTO.filter((val, i) => i != indexTemp);
        (this.listadoInvProductoPresentacionUnidadesComboListadoTO.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;

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
    this.columnDefs = this.ppUnidadService.generarColumnas(this.esModal);
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
    this.unidadSeleccionada = fila ? fila.data : null;
  }

  filaSeleccionar() {
    this.enviarItem(this.unidadSeleccionada);
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
    this.unidadSeleccionada = data;
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
