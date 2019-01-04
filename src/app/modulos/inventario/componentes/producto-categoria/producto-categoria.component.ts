import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { MenuItem } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoCategoriaService } from './producto-categoria.service';
import { InvProductoCategoriaTO } from '../../../../entidadesTO/inventario/InvProductoCategoriaTO';
import { InvProductoCategoriaPK } from '../../../../entidades/inventario/InvProductoCategoriaPK';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { PlanContableService } from '../../../contabilidad/archivo/plan-contable/plan-contable.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { InvProductoSubCategoria } from '../../../../entidades/inventario/InvProductoSubCategoria';
import { InvProductoSubCategoriaPK } from '../../../../entidades/inventario/InvProductoSubCategoriaPK';

@Component({
  selector: 'app-producto-categoria',
  templateUrl: './producto-categoria.component.html',
  styleUrls: ['./producto-categoria.component.css']
})
export class ProductoCategoriaComponent implements OnInit {

  @ViewChild("excelDownload") excelDownload;
  @Input() empresaModal: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() razonSocial: string;
  public esModal: boolean = false;//Si es modal será true
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = Array();
  public constantes: any;
  public invProductoCategoriaTO: InvProductoCategoriaTO = new InvProductoCategoriaTO();
  public frmTitulo: string;
  public classTitulo: string;
  public vistaFormulario: boolean = false;
  public accion: string = null;//Bandera
  public accionSC: string = null; // Bandera Sub-categoria
  public cargando: boolean;
  public activar: boolean;
  public isPedidos: string;
  public listadoResultado: Array<InvProductoCategoriaTO> = Array();
  public objetoSeleccionado = new InvProductoCategoriaTO();
  public objetoNuevoSeleccionado = new InvProductoCategoriaTO();
  public listadoSubCategoria: Array<InvProductoSubCategoria> = new Array();
  public subCategoriaSeleccionado: InvProductoSubCategoria = new InvProductoSubCategoria();
  public subCategoria: InvProductoSubCategoria = new InvProductoSubCategoria();
  public isScreamMd: boolean = true;
  public cuentaCodigo: string;
  public cuentaDetalle: string;
  public tamanioEstructura: number = 0;
  public mostrarCuenta: boolean = true;
  public mostrarSubCategoria: boolean = false;
  public vistaFormularioSC: boolean = false;
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
  public subCategorias = [];

  constructor(
    private route: ActivatedRoute,
    public api: ApiRequestService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public utilService: UtilService,
    private planContableService: PlanContableService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private modalService: NgbModal,
    private categoriaService: ProductoCategoriaService,
    private router: Router,
    private archivoService: ArchivoService
  ) {
    if (this.router.url.toString().indexOf('pedidoProductoCategoria') > -1) {
      this.mostrarCuenta = false;
    }
    this.constantes = LS; //Hace referncia a los constantes
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.inicializarAtajos();
    this.subCategoria.invProductoSubcategoriaPK = new InvProductoSubCategoriaPK();
  }

  ngOnInit() {
    if (this.empresaModal) {
      this.esModal = true;
      this.activar = true;
      this.listaEmpresas.push(this.empresaModal);
      this.empresaSeleccionada = this.listaEmpresas[0];
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.buscarProductoCategorias();
      this.buscarProductoSubCategoria();
      this.cambiarEmpresaSeleccionada();
    } else {
      this.listaEmpresas = this.route.snapshot.data['categoriaProductoInv'];
      this.isPedidos = this.route.snapshot.data['pedidos'];
      if (this.listaEmpresas) {
        this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
        LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
        this.cambiarEmpresaSeleccionada();
      }
    }
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.iniciarAgGrid();
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

  inicializarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      this.cerrarCategoria();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.objetoSeleccionado) {
        this.editarProductoCategoria(this.objetoSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.objetoSeleccionado) {
        this.eliminarProductoCategoria(this.objetoSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      if (this.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
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

  verRestantesSubcategorias() {
    let bandera;
    for (var i = 0; i < LS.LISTA_SUBCATEGORIAS.length; i++) {
      bandera = true;
      for (var j = 0; j < this.listadoSubCategoria.length; j++) {
        if (LS.LISTA_SUBCATEGORIAS[i] == this.listadoSubCategoria[j].invProductoSubcategoriaPK.scatCodigo) {
          bandera = false;
        }
      }
      if (bandera) {
        this.subCategorias.push(LS.LISTA_SUBCATEGORIAS[i]);
      }
    }
    if (this.subCategorias && this.accionSC == LS.ACCION_CREAR) {
      this.subCategoria.invProductoSubcategoriaPK.scatCodigo = this.subCategorias[0];
    }
  }

  espacios() {
    let b = this.invProductoCategoriaTO.catDetalle;
    for (let i = 0; i < b.length; i++) {
      b = b.split("   ").join(" ");
      b = b.split("  ").join(" ");
      b = b.split("'").join("");
      b = b.split("*").join("");
      b = b.split("'").join("");
    }
    this.invProductoCategoriaTO.catDetalle = b;
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.invProductoCategoriaTO = new InvProductoCategoriaTO();
    this.limpiarListado();
    this.vistaFormulario = false;
    this.activar = false;
    this.accion = null;
    this.activar = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.planContableService.getTamanioListaConEstructura(parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = this.utilService.establecerLongitudPenultimoGrupo(data);
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  buscarProductoCategorias() {
    this.cargando = true;
    this.accion = null;
    this.limpiarListado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.filasTiempo.iniciarContador();
    this.categoriaService.listarInvProductoCategoriaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProductoCategoriaTO(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultado = data ? data : [];
    this.cargando = false;
  }

  buscarProductoSubCategoria() {
    this.cargando = true;
    this.accionSC = null;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.categoriaService.listarInvProductoSubCategoria(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSubCategoriaTO(data) {
    this.listadoSubCategoria = data ? data : [];
    this.cargando = false;
  }

  // sub-categoria
  nuevoProductoSubCategoria() {
    this.accionSC = LS.ACCION_CREAR;
    this.mostrarSubCategoria = true;
    this.vistaFormularioSC = true;
    this.vistaFormulario = false;
    this.subCategoria = new InvProductoSubCategoria();
    this.subCategoria.invProductoSubcategoriaPK = new InvProductoSubCategoriaPK();
    this.activar = false;
    this.subCategorias = [];
    this.verRestantesSubcategorias();
  }

  editarProductoSubCategoria(productoSubCategoria: InvProductoSubCategoria) {
    this.cargando = true;
    this.activar = false;
    this.accionSC = LS.ACCION_EDITAR;
    this.mostrarSubCategoria = true;
    this.vistaFormularioSC = true;
    this.frmTitulo = LS.TITULO_FORM_EDITAR_PRODUCTO_SUBCATEGORIA;
    this.classTitulo = LS.ICON_EDITAR;
    this.subCategoria = productoSubCategoria;
    this.activar = false;
    this.cargando = false;
    this.subCategorias = [];
    this.subCategorias.push(this.subCategoria.invProductoSubcategoriaPK.scatCodigo);
  }

  agregarSubCategoria() { // nuevo sub-categoria
    this.cargando = true;
    this.accionSC = null;
    this.vistaFormulario = false;
    this.mostrarSubCategoria = true;
    this.activar = true;
    this.iniciarAgGrid();
    this.cargando = false;
  }

  guardarProductoSubCategoria(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.cargando = true;
      this.subCategoria.invProductoSubcategoriaPK.scatEmpresa = LS.KEY_EMPRESA_SELECT;
      this.subCategoria.usrEmpresa = LS.KEY_EMPRESA_SELECT;
      this.subCategoria.usrCodigo = this.empresaSeleccionada.empSmtpUserName;
      this.categoriaService.guardarInvProductoSubCategoria({ invProductoSubcategoria: this.subCategoria }, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
    }
  }

  despuesDeGuardarSubCategoria(data) {
    this.buscarProductoSubCategoria();
    this.subCategoriaSeleccionado.invProductoSubcategoriaPK.scatCodigo = data.invProductoSubcategoriaPK.scatCodigo;
    this.cancelarSubCategoria();
    this.subCategorias = [];
    this.cargando = false;
  }

  actualizarProductoSubCategoria(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.cargando = true;
      this.subCategoria.invProductoSubcategoriaPK.scatEmpresa = LS.KEY_EMPRESA_SELECT;
      this.subCategoria.usrEmpresa = LS.KEY_EMPRESA_SELECT;
      this.subCategoria.usrCodigo = this.empresaSeleccionada.empSmtpUserName;
      this.categoriaService.modificarInvProductoSubCategoria({ invProductoSubcategoria: this.subCategoria }, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
    }
  }

  despuesDeModificarSubCategoria(data) {
    this.buscarProductoSubCategoria();
    this.subCategoriaSeleccionado.invProductoSubcategoriaPK.scatCodigo = data.invProductoSubcategoriaPK.scatCodigo;
    this.cancelarSubCategoria();
    this.subCategorias = [];
    this.cargando = false;
  }

  eliminarProductoSubCategoria() {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_PRODUCTO_CATEGORIA + ": " + this.subCategoria.scatDetalle,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.cargando = true;
        this.categoriaService.eliminarInvProductoSubCategoria({ invProductoSubcategoriaPK: this.subCategoria.invProductoSubcategoriaPK }, this, LS.KEY_EMPRESA_SELECT);
      }
    });
  }

  despuesDeEliminarSubCategoria(data) {
    this.cargando = false;
    this.buscarProductoSubCategoria();
    this.cancelarSubCategoria();
    this.subCategorias = [];
  }

  cancelarSubCategoria() {
    this.vistaFormularioSC = false;
    this.vistaFormulario = false;
    this.activar = true;
    this.subCategoria = new InvProductoSubCategoria();
    this.subCategoria.invProductoSubcategoriaPK = new InvProductoSubCategoriaPK();
  }

  atrasFormulario() {
    this.vistaFormulario = true;
    this.mostrarSubCategoria = false;
    this.cargando = true;
    this.activar = false;
    this.cargando = false;
  }
  // end sub-categoria

  limpiarListado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.filtroGlobal = "";
    this.listadoResultado = [];
    this.accion = null;
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  nuevoProductoCategoria() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.activar = false;
      this.accion = LS.ACCION_CREAR;
      this.frmTitulo = LS.TITULO_FORM_NUEVO_PRODUCTO_CATEGORIA;
      this.classTitulo = LS.ICON_CREAR;
      this.invProductoCategoriaTO = new InvProductoCategoriaTO();
      this.vistaFormulario = true;
      this.cargando = false;
      this.subCategoriaSeleccionado.invProductoSubcategoriaPK.scatCodigo = "";
    }
  }

  guardarProductoCategoria(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.cargando = true;
        this.subCategoriaSeleccionado.invProductoSubcategoriaPK.scatEmpresa = LS.KEY_EMPRESA_SELECT;
        this.invProductoCategoriaTO.scatCodigo = this.subCategoriaSeleccionado.invProductoSubcategoriaPK.scatCodigo;
        this.invProductoCategoriaTO.scatEmpresa = this.subCategoriaSeleccionado.invProductoSubcategoriaPK.scatEmpresa;
        let invProductoCategoriaTOCopia = this.categoriaService.formatearInvProductoTipoTO(this.invProductoCategoriaTO, this);

        let parametro = { invProductoCategoriaTO: invProductoCategoriaTOCopia, accion: 'I' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoCategoria", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.objetoNuevoSeleccionado = invProductoCategoriaTOCopia;
              this.resetearFormulario();
              this.refrescarTabla(invProductoCategoriaTOCopia, 'I');
              this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        // this.cargando = false;
      }
    }
  }

  resetearFormulario() {
    this.frmTitulo = LS.TITULO_FILTROS
    this.classTitulo = LS.ICON_FILTRAR;
    this.invProductoCategoriaTO = new InvProductoCategoriaTO();
    this.vistaFormulario = false;
    this.activar = true;
    this.cuentaCodigo = null;
    this.cuentaDetalle = null;
    this.accion = null;
    this.iniciarAgGrid();
  }

  editarProductoCategoria(productoCategoriaTO: InvProductoCategoriaTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.activar = false;
      this.accion = LS.ACCION_EDITAR;
      this.frmTitulo = LS.TITULO_FORM_EDITAR_PRODUCTO_CATEGORIA;
      this.classTitulo = LS.ICON_EDITAR;
      this.invProductoCategoriaTO = new InvProductoCategoriaTO(productoCategoriaTO);
      this.subCategoriaSeleccionado.invProductoSubcategoriaPK.scatCodigo = this.invProductoCategoriaTO.scatCodigo;
      this.subCategoriaSeleccionado.invProductoSubcategoriaPK.scatEmpresa = this.invProductoCategoriaTO.scatEmpresa;
      this.cuentaCodigo = productoCategoriaTO.ctaCodigo;
      let parametro = { empresa: LS.KEY_EMPRESA_SELECT, codigo: this.cuentaCodigo }
      this.planContableService.obtenerConCuenta(parametro, this, LS.KEY_EMPRESA_SELECT);//Envia a buscar la cuenta contable
      this.vistaFormulario = true;
      this.activar = false;
      this.cargando = false;
    }
  }

  /**
   * Respuesta de buscar la cuenta
   * @param {*} data
   * @memberof ProductoCategoriaComponent
   */
  despuesDeObtenerConCuenta(data) {
    this.cuentaDetalle = data ? data.ctaDetalle : "";
  }

  actualizarProductoCategoria(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.subCategoriaSeleccionado.invProductoSubcategoriaPK.scatEmpresa = LS.KEY_EMPRESA_SELECT;
        this.invProductoCategoriaTO.scatCodigo = this.subCategoriaSeleccionado.invProductoSubcategoriaPK.scatCodigo;
        this.invProductoCategoriaTO.scatEmpresa = this.subCategoriaSeleccionado.invProductoSubcategoriaPK.scatEmpresa;
        let invProductoCategoriaTOCopia = this.categoriaService.formatearInvProductoTipoTO(this.invProductoCategoriaTO, this);
        let parametro = { invProductoCategoriaTO: invProductoCategoriaTOCopia, accion: 'M' };
        this.api.post("todocompuWS/inventarioWebController/accionInvProductoCategoria", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.objetoNuevoSeleccionado = invProductoCategoriaTOCopia;
              this.resetearFormulario();
              this.refrescarTabla(invProductoCategoriaTOCopia, 'U');
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

  eliminarProductoCategoria(productoCategoriaTO: InvProductoCategoriaTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_PRODUCTO_CATEGORIA + ": " + productoCategoriaTO.catDetalle,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let invProductoCategoriaPK = new InvProductoCategoriaPK({ catEmpresa: this.empresaSeleccionada.empCodigo, catCodigo: productoCategoriaTO.catCodigo });
          let parametro = { invProductoCategoriaPK: invProductoCategoriaPK };
          this.api.post("todocompuWS/inventarioWebController/eliminarInvProductoCategoria", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(productoCategoriaTO, 'D');
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

  cerrarCategoria() {
    this.objetoNuevoSeleccionado = this.objetoNuevoSeleccionado && this.objetoNuevoSeleccionado.catCodigo == "" ?
      null : this.objetoNuevoSeleccionado;

    let parametro = {
      categoriaSeleccionado: this.objetoNuevoSeleccionado
    }
    this.activeModal.close(parametro);
  }

  buscarCuentaContable(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && !this.esCuentaCodigoValido()) {
      if (this.invProductoCategoriaTO.ctaCodigo && this.invProductoCategoriaTO.ctaCodigo.length > 0) {
        let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.invProductoCategoriaTO.ctaCodigo, ctaGrupo: null };
        event.srcElement.blur();
        event.preventDefault();
        const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
        modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
        modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
        modalRef.result.then((result) => {
          this.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.invProductoCategoriaTO.ctaCodigo = result ? result.cuentaCodigo : "";
          this.invProductoCategoriaTO.ctaEmpresa = result ? result.empCodigo : "";
          this.cuentaDetalle = result ? result.cuentaDetalle.trim() : "";
        }, () => {
          //Al minimizar, es necesario
        });
      } else {
        this.toastr.info(LS.MSJ_ENTER_NO_DATA, LS.TOAST_INFORMACION)
      }
    }
  }

  esCuentaCodigoValido(): boolean {
    return this.cuentaCodigo && this.cuentaCodigo === this.invProductoCategoriaTO.ctaCodigo;
  }

  validarCuentaCodigo() {
    if (this.cuentaCodigo !== this.invProductoCategoriaTO.ctaCodigo) {
      this.cuentaCodigo = null;
      this.cuentaDetalle = "";
      this.invProductoCategoriaTO.ctaCodigo = "";
      this.invProductoCategoriaTO.ctaEmpresa = "";
    }
  }


  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listadoInvProductoCategoriaTO: this.listadoResultado };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteInvProductoCategoriaTO", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('listaProductoCategoria_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);

          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listadoInvProductoCategoriaTO: this.listadoResultado };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteInvProductoCategoriaTO", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, 'ListadoCategoriasProducto_') : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [R3] [AG-GRID]
  iniciarAgGrid() {
    if (this.mostrarSubCategoria) {
      this.columnDefs = this.categoriaService.generarColumnasProductoSubCategoria();
    } else {
      this.columnDefs = this.categoriaService.generarColumnasProductoCategoria(this.isPedidos);
    }
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
    if (this.mostrarSubCategoria) {
      this.subCategoria = data;
      this.generarOpcionesSubCategoria();
    } else {
      this.objetoSeleccionado = data;
      this.generarOpciones();
    }

    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  private generarOpciones() {
    let perEditar = this.objetoSeleccionado && this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.vistaFormulario;
    let perEliminar = this.objetoSeleccionado && this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.vistaFormulario;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editarProductoCategoria(this.objetoSeleccionado) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarProductoCategoria(this.objetoSeleccionado) : null }
    ];
  }

  private generarOpcionesSubCategoria() {
    let perEditar = this.subCategoria && this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && this.mostrarSubCategoria;
    let perEliminar = this.subCategoria && this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && this.mostrarSubCategoria;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editarProductoSubCategoria(this.subCategoria) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarProductoSubCategoria() : null }
    ];
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  refrescarTabla(objetoAccion: InvProductoCategoriaTO, operacion: string) {
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
        var indexTemp = this.listadoResultado.findIndex(item => item.catCodigo === objetoAccion.catCodigo);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = objetoAccion;
        this.listadoResultado = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        var indexTemp = this.listadoResultado.findIndex(item => item.catCodigo === objetoAccion.catCodigo);
        let listaTemporal = [...this.listadoResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listadoResultado = listaTemporal;
        (this.listadoResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
    this.refreshGrid();
    this.activar = true;
  }
  //#endregion
}
