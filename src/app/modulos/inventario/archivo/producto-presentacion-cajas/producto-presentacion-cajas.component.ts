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
import { ProductoPresentacionCajasService } from './producto-presentacion-cajas.service';
import { InvProductoPresentacionCajasPK } from '../../../../entidades/inventario/InvProductoPresentacionCajasPK';
import { ActivatedRoute } from '@angular/router';
import { InvProductoPresentacionCajasTO } from '../../../../entidadesTO/inventario/InvProductoPresentacionCajasTO';
import { InvProductoPresentacionCajasComboListadoTO } from '../../../../entidadesTO/inventario/InvProductoPresentacionCajasComboListadoTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-producto-presentacion-cajas',
  templateUrl: './producto-presentacion-cajas.component.html',
  styleUrls: ['./producto-presentacion-cajas.component.css']
})
export class ProductoPresentacionCajasComponent implements OnInit {

  @Input() empresaModal: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() razonSocial: string;
  esModal: boolean = false;//Si es modal será true
  empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  listaEmpresas: Array<PermisosEmpresaMenuTO> = Array();
  constantes: any;
  invProductoPresentacionCajasTO: InvProductoPresentacionCajasTO = new InvProductoPresentacionCajasTO();
  frmTitulo: string;
  classTitulo: string = LS.ICON_FILTRAR;
  vistaFormulario: boolean = false;
  accion: string = null;//Bandera
  cargando: boolean;
  activar: boolean;
  listadoInvProductoPresentacionCajasComboListadoTO: Array<InvProductoPresentacionCajasComboListadoTO> = Array();
  pPresentacionCajaSeleccionado = new InvProductoPresentacionCajasComboListadoTO();
  pPresentacionCajaNuevoSeleccionado = new InvProductoPresentacionCajasComboListadoTO();
  isScreamMd: boolean = true;
  opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  filasTiempo: FilasTiempo = new FilasTiempo();
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
    private ppCajaService: ProductoPresentacionCajasService
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
      this.buscarProductoPresentacionCajas();
      this.cambiarEmpresaSeleccionada();
    } else {
      this.listaEmpresas = this.route.snapshot.data['productoPresentacionCaja'];
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
      this.cerrarPresCaja();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarPresentacionCaja') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirPresentacionCaja') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarPresentacionCaja') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoPresentacionCaja') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listadoInvProductoPresentacionCajasComboListadoTO.length > 0) {
        this.editarProductoPresentacionCajas(this.pPresentacionCajaSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listadoInvProductoPresentacionCajasComboListadoTO.length > 0) {
        this.eliminarProductoPresentacionCajas(this.pPresentacionCajaSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      if (this.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnGuardarPresentacionCaja') as HTMLElement;
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
    this.invProductoPresentacionCajasTO = new InvProductoPresentacionCajasTO();
    this.limpiarListado();
    this.vistaFormulario = false;
    this.activar = true;
    this.accion = null;
  }

  buscarProductoPresentacionCajas() {
    this.cargando = true;
    this.accion = null;
    this.limpiarListado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.ppCajaService.listarPresentacionCajaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPresentacionCajaTO(data) {
    this.listadoInvProductoPresentacionCajasComboListadoTO = data ? data : [];
    this.cargando = false;
  }

  limpiarListado() {
    this.listadoInvProductoPresentacionCajasComboListadoTO = [];
    this.actualizarFilas();
  }

  private generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.vistaFormulario;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.vistaFormulario;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editarProductoPresentacionCajas(this.pPresentacionCajaSeleccionado) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarProductoPresentacionCajas(this.pPresentacionCajaSeleccionado) : null }
    ];
  }

  nuevoProductoPresentacionCajas() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CREAR;
      this.frmTitulo = LS.TITULO_FORM_NUEVO_PRODUCTO_PRESENTACION_CAJA;
      this.classTitulo = LS.ICON_CREAR;
      this.invProductoPresentacionCajasTO = new InvProductoPresentacionCajasTO();
      this.vistaFormulario = true;
      this.cargando = false;
      this.activar = false;
    }
  }

  guardarProductoPresentacionCajas(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invProductoPresentacionCopia = this.ppCajaService.formatearInvProductoPresentacionCajasTO(this.invProductoPresentacionCajasTO, this);
        let parametro = { invProductoPresentacionCajasTO: invProductoPresentacionCopia, accion: 'I' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoPresentacionCajasTO", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.pPresentacionCajaNuevoSeleccionado = invProductoPresentacionCopia;
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
    this.activar = true;
    this.frmTitulo = LS.TITULO_FILTROS
    this.classTitulo = LS.ICON_FILTRAR;
    this.invProductoPresentacionCajasTO = new InvProductoPresentacionCajasTO();
    this.vistaFormulario = false;
    this.accion = null;
  }

  editarProductoPresentacionCajas(ppCajaTO: InvProductoPresentacionCajasComboListadoTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_EDITAR;
      this.frmTitulo = LS.TITULO_FORM_EDITAR_PRODUCTO_PRESENTACION_CAJA;
      this.classTitulo = LS.ICON_EDITAR;
      this.invProductoPresentacionCajasTO = new InvProductoPresentacionCajasTO(ppCajaTO);
      this.vistaFormulario = true;
      this.cargando = false;
      this.activar = false;
    }
  }

  actualizarProductoPresentacionCajas(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invProductoPresentacionCopia = this.ppCajaService.formatearInvProductoPresentacionCajasTO(this.invProductoPresentacionCajasTO, this);
        let parametro = { invProductoPresentacionCajasTO: invProductoPresentacionCopia, accion: 'M' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoPresentacionCajasTO", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.pPresentacionCajaNuevoSeleccionado = invProductoPresentacionCopia;
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

  eliminarProductoPresentacionCajas(ppCajaTO: InvProductoPresentacionCajasComboListadoTO) {
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
          let invProductoPresentacionCajasPK = new InvProductoPresentacionCajasPK({ prescEmpresa: this.empresaSeleccionada.empCodigo, prescCodigo: ppCajaTO.prescCodigo });
          let parametro = { invProductoPresentacionCajasPK: invProductoPresentacionCajasPK };
          this.api.post("todocompuWS/inventarioWebController/eliminarInvPresentacionCajas", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(ppCajaTO, 'D');
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

  cerrarPresCaja() {
    this.pPresentacionCajaNuevoSeleccionado = this.pPresentacionCajaNuevoSeleccionado && this.pPresentacionCajaNuevoSeleccionado.prescCodigo == "" ?
      null : this.pPresentacionCajaNuevoSeleccionado;
    let parametro = {
      presCajaSeleccionado: this.pPresentacionCajaNuevoSeleccionado
    }
    this.activeModal.close(parametro);
  }

  imprimirPresentacionCaja() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listInvProductoPresentacionCajasComboListadoTO: this.listadoInvProductoPresentacionCajasComboListadoTO };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReportePresentacionCaja", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoPresentacionCaja_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarPresentacionCaja() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listInvProductoPresentacionCajasComboListadoTO: this.listadoInvProductoPresentacionCajasComboListadoTO };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReportePresentacionCaja", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoPresentacionCaja_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  refrescarTabla(pPresentacionCajaTO: InvProductoPresentacionCajasComboListadoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoInvProductoPresentacionCajasComboListadoTO.length > 0) {
          let listaTemporal = [... this.listadoInvProductoPresentacionCajasComboListadoTO];
          listaTemporal.unshift(pPresentacionCajaTO);
          this.listadoInvProductoPresentacionCajasComboListadoTO = listaTemporal;
          this.seleccionarFila(0);
        }
        this.cdRef.detectChanges();
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoInvProductoPresentacionCajasComboListadoTO.findIndex(item => item.prescCodigo === pPresentacionCajaTO.prescCodigo);
        let listaTemporal = [... this.listadoInvProductoPresentacionCajasComboListadoTO];
        listaTemporal[indexTemp] = pPresentacionCajaTO;
        this.listadoInvProductoPresentacionCajasComboListadoTO = listaTemporal;
        this.seleccionarFila(indexTemp);

        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoInvProductoPresentacionCajasComboListadoTO.findIndex(item => item.prescCodigo === pPresentacionCajaTO.prescCodigo);
        this.listadoInvProductoPresentacionCajasComboListadoTO = this.listadoInvProductoPresentacionCajasComboListadoTO.filter((val, i) => i != indexTemp);
        (this.listadoInvProductoPresentacionCajasComboListadoTO.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
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
    this.columnDefs = this.ppCajaService.generarColumnas(this.esModal);
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
    this.pPresentacionCajaSeleccionado = fila ? fila.data : null;
  }

  filaSeleccionar() {
    this.enviarItem(this.pPresentacionCajaSeleccionado);
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
    this.pPresentacionCajaSeleccionado = data;
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
