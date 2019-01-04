import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { MenuItem } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ProductoMedidaService } from './producto-medida.service';
import { InvProductoMedidaTO } from '../../../../entidadesTO/inventario/InvProductoMedidaTO';
import { ActivatedRoute } from '@angular/router';
import { InvProductoMedidaPK } from '../../../../entidades/inventario/InvProductoMedidaPK';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-producto-medida',
  templateUrl: './producto-medida.component.html',
  styleUrls: ['./producto-medida.component.css']
})
export class ProductoMedidaComponent implements OnInit {

  @Input() empresaModal: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() razonSocial: string;
  esModal: boolean = false;//Si es modal será true
  empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  listaEmpresas: Array<PermisosEmpresaMenuTO> = Array();
  constantes: any;
  invProductoMedidaTO: InvProductoMedidaTO = new InvProductoMedidaTO();
  frmTitulo: string;
  classTitulo: string = LS.ICON_FILTRAR;
  vistaFormulario: boolean = false;
  accion: string = null; //Bandera
  cargando: boolean;
  activar: boolean;
  listadoResultado: Array<InvProductoMedidaTO> = Array();
  objetoSeleccionado = new InvProductoMedidaTO();
  objetoNuevoSeleccionado = new InvProductoMedidaTO();
  isScreamMd: boolean = true;
  configAutonumeric: AppAutonumeric;
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();

  constructor(
    private route: ActivatedRoute,
    public api: ApiRequestService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public utilService: UtilService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private productoMedidaService: ProductoMedidaService,
    private archivoService: ArchivoService
  ) {
    this.constantes = LS; //Hace referncia a los constantes
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.configAutonumeric = {
      decimalPlaces: 4,
      decimalPlacesRawValue: 4,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 4,
      maximumValue: '99999999999999999999999.99',
      minimumValue: '0',
    }
  }

  ngOnInit() {
    if (this.empresaModal) {
      this.esModal = true;
      this.activar = true;
      this.listaEmpresas.push(this.empresaModal);
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.buscarMedidasProducto();
      this.cambiarEmpresaSeleccionada();
    } else {
      this.listaEmpresas = this.route.snapshot.data['medidaProducto'];
      if (this.listaEmpresas) {
        this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
        LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
        this.cambiarEmpresaSeleccionada();
      }
    }
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.inicializarAtajos();
    this.iniciarAgGrid();
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  inicializarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      this.cerrarProductoMedida();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarMedida') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirMedida') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarMedida') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (!this.vistaFormulario && this.objetoSeleccionado) {
        this.editarProductoMedida(this.objetoSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (!this.vistaFormulario && this.objetoSeleccionado) {
        this.eliminarProductoMedida(this.objetoSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      if (this.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnGuardarMedida') as HTMLElement;
        element ? element.click() : null;
        return false;
      }
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      if (this.vistaFormulario) {
        this.resetearFormulario();
      }
      return false;
    }));
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.invProductoMedidaTO = new InvProductoMedidaTO();
    this.limpiarListado();
    this.vistaFormulario = false;
    this.activar = true;
  }

  buscarMedidasProducto() {
    this.cargando = true;
    this.accion = null;
    this.limpiarListado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.filasTiempo.iniciarContador();
    this.productoMedidaService.listarInvProductoMedidaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProductoMedidaTO(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultado = data ? data : [];
    this.cargando = false;
  }

  limpiarListado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.filtroGlobal = "";
    this.listadoResultado = [];
    this.accion = null;
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  private generarOpciones() {
    let perEditar = this.objetoSeleccionado && this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.vistaFormulario;
    let perEliminar = this.objetoSeleccionado && this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.vistaFormulario;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.editarProductoMedida(this.objetoSeleccionado) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.eliminarProductoMedida(this.objetoSeleccionado) : null }
    ];
  }

  nuevoProductoMedida() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CREAR;
      this.frmTitulo = LS.TITULO_FORM_NUEVO_PRODUCTO_MEDIDA;
      this.classTitulo = LS.ICON_CREAR;
      this.invProductoMedidaTO = new InvProductoMedidaTO();
      this.vistaFormulario = true;
      this.cargando = false;
      this.activar = false;
    }
  }

  editarProductoMedida(productoMedida: InvProductoMedidaTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_EDITAR;
      this.frmTitulo = LS.TITULO_FORM_EDITAR_PRODUCTO_MEDIDA;
      this.classTitulo = LS.ICON_EDITAR;
      this.invProductoMedidaTO = new InvProductoMedidaTO(productoMedida);
      this.vistaFormulario = true;
      this.activar = false;
      this.cargando = false;
    }
  }

  guardarProductoMedida(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let productoMedidaCopia = this.productoMedidaService.formatearInvProductoMedidaTO(this.invProductoMedidaTO, this);
        let parametro = { invProductoMedidaTO: productoMedidaCopia, accion: 'I' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoMedida", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.objetoNuevoSeleccionado = productoMedidaCopia;
              this.resetearFormulario();
              this.refrescarTabla(productoMedidaCopia, 'I');
              this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
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
    this.invProductoMedidaTO = new InvProductoMedidaTO();
    this.vistaFormulario = false;
    this.accion = null;
  }

  actualizarProductoMedida(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let productoMedidaCopia = this.productoMedidaService.formatearInvProductoMedidaTO(this.invProductoMedidaTO, this);
        let parametro = { invProductoMedidaTO: productoMedidaCopia, accion: 'M' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoMedida", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.objetoNuevoSeleccionado = productoMedidaCopia;
              this.resetearFormulario();
              this.refrescarTabla(productoMedidaCopia, 'U');
              this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  eliminarProductoMedida(productoMedida: InvProductoMedidaTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { invProductoMedidaPK: new InvProductoMedidaPK({ medEmpresa: productoMedida.medEmpresa, medCodigo: productoMedida.medCodigo }) };
          this.api.post("todocompuWS/inventarioWebController/eliminarInvProductoMedida", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(productoMedida, 'D');
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
              } else {
                this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
              }
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        }
      });
    }
  }

  cerrarProductoMedida() {
    this.objetoNuevoSeleccionado = this.objetoNuevoSeleccionado && this.objetoNuevoSeleccionado.medCodigo == "" ?
      null : this.objetoNuevoSeleccionado;
    let parametro = {
      medidaSeleccionada: this.objetoNuevoSeleccionado
    }
    this.activeModal.close(parametro);
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listadoInvProductoMedidaTO: this.listadoResultado };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteInvProductoMedidaTO", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ?
            this.utilService.descargarArchivoPDF('listaUnidadesMedida' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listadoInvProductoMedidaTO: this.listadoResultado };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteInvProductoMedidaTO", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, 'ListaUnidadesMedida_')
            : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.productoMedidaService.generarColumnasProductoMedida();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarFila(0);
    this.redimencionarColumnas();
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
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

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  refrescarTabla(objetoAccion: InvProductoMedidaTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          listaTemporal.unshift(objetoAccion);
          this.listadoResultado = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.medCodigo === objetoAccion.medCodigo);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = objetoAccion;
        this.listadoResultado = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        var indexTemp = this.listadoResultado.findIndex(item => item.medCodigo === objetoAccion.medCodigo);
        let listaTemporal = [...this.listadoResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listadoResultado = listaTemporal;
        (this.listadoResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
    this.activar = true;
    this.refreshGrid();
  }
  //#endregion 
}
