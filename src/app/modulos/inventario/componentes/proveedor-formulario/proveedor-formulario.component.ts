import { Component, OnInit, Input, Output, EventEmitter, HostListener, ChangeDetectorRef, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvProveedorCategoriaTO } from '../../../../entidadesTO/inventario/InvProveedorCategoriaTO';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { AnxProvinciaCantonTO } from '../../../../entidadesTO/anexos/AnxProvinciaCantonTO';
import { AnxTipoIdentificacionTO } from '../../../../entidadesTO/anexos/AnxTipoIdentificacionTO';
import { IdentificacionService } from '../../../anexos/archivo/identificacion/identificacion.service';
import { CantonService } from '../../../anexos/archivo/canton/canton.service';
import { ProveedorCategoriaService } from '../../archivo/proveedor-categoria/proveedor-categoria.service';
import { ProveedorService } from '../../archivo/proveedor/proveedor.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProveedorCategoriaComponent } from '../../archivo/proveedor-categoria/proveedor-categoria.component';

@Component({
  selector: 'app-proveedor-formulario',
  templateUrl: './proveedor-formulario.component.html',
  styleUrls: ['./proveedor-formulario.component.css']
})
export class ProveedorFormularioComponent implements OnInit {
  /**LISTADOS */
  public listadoTipoIdentificacion: Array<AnxTipoIdentificacionTO> = new Array();
  public listadoProvincias: Array<AnxProvinciaCantonTO> = new Array();
  public listadoCiudades: Array<AnxProvinciaCantonTO> = new Array();
  public listadoCategorias: Array<InvProveedorCategoriaTO>;
  /**OBJETOS SELECCIONADOS */
  public provinciaSeleccionada: AnxProvinciaCantonTO = new AnxProvinciaCantonTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public invProveedorTO: InvProveedorTO = new InvProveedorTO();
  public digitosCedulaMax: number = 30;
  public digitosCedulaMin: number = 1;
  public codigoAnterior: string = "";
  public constantes: any = LS;
  public accion: string = null;
  public rptaCedula: string = null;
  public rptaRepetido: string = null;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public empresaExtranjera: boolean = false;
  public activar: boolean = true;
  public tituloFormulario: string = "";
  public correos: string[] = [];
  public correosCompra: string[] = [];
  @Input() parametros;
  @Output() cerrarFormularioProveedor = new EventEmitter();
  @Output() activarEstado = new EventEmitter();
  @ViewChild("frmProveedorDatos") frmProveedorDatos: NgForm;
  public valoresIniciales: any;

  constructor(
    private identificacionService: IdentificacionService,
    private cantonService: CantonService,
    private proveedorCategoriaService: ProveedorCategoriaService,
    private proveedorService: ProveedorService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.activar = this.parametros.activar;
    this.accion = this.parametros.accion;
    this.empresaSeleccionada = this.parametros.empresa;
    this.listadoCategorias = this.parametros.listadoCategorias;
    this.invProveedorTO = this.parametros.invProveedorTO;
    this.tituloFormulario = this.parametros.tituloFormulario;
    this.codigoAnterior = this.invProveedorTO.provCodigo;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    if (this.accion === LS.ACCION_ELIMINAR) {
      this.eliminarProveedor();
    } else {
      if (this.accion === LS.ACCION_EDITAR_ESTADO) {
        this.modificarEstadoProveedor();
      } else {
        this.empresaExtranjera = (this.empresaSeleccionada && this.empresaSeleccionada.empPais != 'ECUADOR');
        this.cargando = true;
        if (!this.listadoCategorias || this.listadoCategorias.length <= 0) {
          this.listarInvProveedorCategoriaTO();
        } else {
          this.invProveedorTO.provCategoria = this.accion === LS.ACCION_NUEVO || this.accion === LS.ACCION_CREAR ? this.listadoCategorias[0].pcCodigo : this.invProveedorTO.provCategoria;
        }
        this.listarCantones();
        this.listarIdentificaciones();
        this.definirAtajosDeTeclado();
        this.digitosCedulaMax = 13;
        this.digitosCedulaMin = 13;
      }
    }
    if (this.invProveedorTO.provEmail != null && this.invProveedorTO.provEmail != "") {
      this.correos = this.invProveedorTO.provEmail.split(";");
    }
    if (this.invProveedorTO.provEmailOrdenCompra != null && this.invProveedorTO.provEmailOrdenCompra != "") {
      this.correosCompra = this.invProveedorTO.provEmailOrdenCompra.split(";");
    }
    this.extraerValoresIniciales();
  }

  clickear(tipo: string) {
    let patt = new RegExp(LS.EXP_REGULAR_EMAIL);
    if (tipo === 'E') {
      let cor = this.correos[this.correos.length - 1];
      cor = cor.toLowerCase();
      if (!patt.test(cor)) {
        this.toastr.warning(LS.MSJ_CORREO_NO_VALIDO);
        this.correos.splice(this.correos.length - 1);
      } else {
        this.correos[this.correos.length - 1] = cor;
      }
    } else {
      let cor = this.correosCompra[this.correosCompra.length - 1];
      cor = cor.toLowerCase();
      if (!patt.test(cor)) {
        this.toastr.warning(LS.MSJ_CORREO_NO_VALIDO);
        this.correosCompra.splice(this.correosCompra.length - 1);
      } else {
        this.correosCompra[this.correosCompra.length - 1] = cor;
      }
    }

  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmProveedorDatos ? this.frmProveedorDatos.value : null));
    }, 50);
  }

  /**LISTAR CATEGORIAS DE PROVEEDOR */
  listarInvProveedorCategoriaTO() {
    this.proveedorCategoriaService.listarInvProveedorCategoria({ empresa: this.empresaSeleccionada.empCodigo }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProveedorCategoriaTO(data) {
    this.listadoCategorias = data ? data : [];

  }

  /**LISTAR IDENTIFICACIONES */
  listarIdentificaciones() {
    this.identificacionService.listarTipoIdentificacionTO(this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAnxTipoIdentificacionTO(data) {// tipo de identificacion
    this.listadoTipoIdentificacion = data;
    this.invProveedorTO.provTipoId = this.invProveedorTO.provTipoId ? this.invProveedorTO.provTipoId : (this.listadoTipoIdentificacion.length > 0 ? this.listadoTipoIdentificacion[0].tiCodigo : null);
    this.establecerLongitudIdentificacion();
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  /**LISTAR CIUDADES Y CANTONES */
  listarCantones() {
    this.cantonService.listarAnxDpaProvinciaTO(this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAnxDpaProvinciaTO(data) {
    this.listadoProvincias = data;
    if (this.empresaExtranjera) {
      this.invProveedorTO.provProvincia = this.invProveedorTO.provProvincia ? this.invProveedorTO.provProvincia : null;
    } else {
      this.provinciaSeleccionada = this.listadoProvincias.find(item => item.nombre == this.invProveedorTO.provProvincia);
      this.provinciaSeleccionada = this.provinciaSeleccionada ? this.provinciaSeleccionada : (this.listadoProvincias.length > 0 ? this.listadoProvincias[0] : null);
    }
    this.provinciaSeleccionada && this.provinciaSeleccionada.codigo ? this.listarCiudades() : null;
    this.extraerValoresIniciales();
  }

  listarCiudades() {
    this.cantonService.listarCiudadesAnxDpaProvinciaTO(this, { codigoProvincia: this.provinciaSeleccionada.codigo }, this.empresaSeleccionada.empCodigo);
  }

  despuesDeListarCiudadesAnxDpaProvinciaTO(data) {
    this.listadoCiudades = data;
    if (this.empresaExtranjera) {
      this.invProveedorTO.provCiudad = this.invProveedorTO.provCiudad ? this.invProveedorTO.provCiudad : null;
    } else {
      this.invProveedorTO.provCiudad = this.invProveedorTO.provCiudad ? this.invProveedorTO.provCiudad : (this.listadoCiudades.length > 0 ? this.listadoCiudades[0].nombre : null);
    }
    this.extraerValoresIniciales();
  }

  /**OTROS */
  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarProveedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarProveedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      this.cambiarEstadoActivar();
      return false;
    }))
  }

  espacios() {
    let b = this.invProveedorTO.provRazonSocial;
    for (let i = 0; i < b.length; i++) {
      b = b.split("   ").join(" ");
      b = b.split("  ").join(" ");
      b = b.split("'").join("");
    }
    this.invProveedorTO.provRazonSocial = b;
  }

  /*VALIDACIONES */
  verificarPermiso(accion, mostraMensaje) {
    return this.proveedorService.verificarPermiso(accion, this, mostraMensaje);
  }

  establecerLongitudIdentificacion() {
    let codigo = this.invProveedorTO.provTipoId;
    if (!this.empresaExtranjera) {
      switch (codigo) {
        case "R"://RUC
          this.digitosCedulaMax = 13;
          this.digitosCedulaMin = 13;
          this.invProveedorTO.provId = this.invProveedorTO.provId && this.invProveedorTO.provId.length <= 13 ? this.invProveedorTO.provId : "";
          break;
        case "C"://CEDULA
          this.digitosCedulaMax = 10;
          this.digitosCedulaMin = 10;
          this.invProveedorTO.provId = this.invProveedorTO.provId && this.invProveedorTO.provId.length <= 10 ? this.invProveedorTO.provId : "";
          break;
        default:
          this.rptaCedula = null;
          this.digitosCedulaMax = 130;
          this.digitosCedulaMin = 1;
          break;
      }
    }
  }

  soloNumeros(event) {
    return event.charCode >= 48 && event.charCode <= 57
  }

  validarIdentificacion() {
    if (this.invProveedorTO.provId) {
      let parametros = {
        empresa: LS.KEY_EMPRESA_SELECT,
        id: this.invProveedorTO.provId,
        codigo: this.invProveedorTO.provCodigo ? this.invProveedorTO.provCodigo : null,
        razonSocial: this.invProveedorTO.provRazonSocial ? this.invProveedorTO.provRazonSocial : null,
        nombre: this.invProveedorTO.provNombreComercial ? this.invProveedorTO.provNombreComercial : null
      }
      this.rptaRepetido = null;
      this.proveedorService.obtenerSiEsProveedorRepetido(parametros, this, LS.KEY_EMPRESA_SELECT);
      if (!this.empresaExtranjera) {
        let codigo = this.invProveedorTO.provTipoId;
        switch (codigo) {
          case "R"://RUC
            this.validarCedula();
            break;
          case "C"://CEDULA
            this.validarCedula();
            break;
        }
      }
    }
  }

  despuesDeObtenerSiEsProveedorRepetido(data) {
    if (data) {
      this.rptaRepetido = this.constantes.MSJ_PROVEEDOR_EXISTENTE;
      this.toastr.warning(this.rptaRepetido, this.constantes.TAG_REPETIDO);
    } else {
      this.rptaRepetido = null;
    }
    this.cargando = false;
  }

  validarCedula() {
    if (this.invProveedorTO.provId.length > 9) {
      this.proveedorService.validarCedula({ cedula: this.invProveedorTO.provId }, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.rptaCedula = LS.MSJ_CEDULA_NO_VALIDA;
    }
  }

  despuesDeValidarCedula(data) {
    if (data != "T") {
      this.rptaCedula = data;
      this.toastr.warning(data, LS.TAG_CEDULA);
    } else {
      this.rptaCedula = null;
    }
    this.cargando = false;
  }

  agregarEmail() {
    this.invProveedorTO.provEmail = "";
    for (let i = 0; i < this.correos.length; i++) {
      if (i < this.correos.length - 1) {
        this.invProveedorTO.provEmail += this.correos[i] + ";";
      } else if (i == this.correos.length - 1) {
        this.invProveedorTO.provEmail += this.correos[i];
      }
    }
  }

  agregarEmailCompra() {
    this.invProveedorTO.provEmailOrdenCompra = "";
    for (let i = 0; i < this.correosCompra.length; i++) {
      if (i < this.correosCompra.length - 1) {
        this.invProveedorTO.provEmailOrdenCompra += this.correosCompra[i] + ";";
      } else if (i == this.correosCompra.length - 1) {
        this.invProveedorTO.provEmailOrdenCompra += this.correosCompra[i];
      }
    }
  }


  validarAntesDeEnviar(form: NgForm): boolean {
    if (this.rptaCedula) {
      this.toastr.error(this.rptaCedula, LS.TAG_CEDULA);
      this.cargando = false;
      return false;
    }
    if (this.rptaRepetido) {
      this.toastr.error(this.rptaRepetido, LS.MSJ_CEDULO_REPETIDA);
      this.cargando = false;
      return false;
    }
    if (!form.valid) {
      this.utilService.establecerFormularioTocado(form);
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.TAG_CAMPOS_INVALIDOS);
      this.cargando = false;
      return false;
    }
    this.agregarEmail();
    this.agregarEmailCompra();
    if (!this.invProveedorTO.provEmail) {
      this.cargando = false;
      let parametros = {
        title: LS.MSJ_TITULO_GUARDAR,
        texto: LS.MSJ_PREGUNTA_GUARDAR_SIN_EMAIL,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.accion == LS.ACCION_CREAR ? this.continuarInsersion() : this.continuarEdicion();
        }
      });
    } else {
      return true;
    }
  }

  continuarInsersion() {
    this.llenarDatos();
    this.cargando = true;
    this.proveedorService.insertarProveedor({ invProveedorTO: this.invProveedorTO }, this, LS.KEY_EMPRESA_SELECT);
  }

  continuarEdicion() {
    this.llenarDatos();
    this.cargando = true;
    this.proveedorService.modificarProveedor({ invProveedorTO: this.invProveedorTO, codigoAnterior: this.codigoAnterior }, this, LS.KEY_EMPRESA_SELECT);
  }

  llenarDatos() {
    this.invProveedorTO.empCodigo = this.empresaSeleccionada.empCodigo;
    this.invProveedorTO.provNombreComercial = this.invProveedorTO.provNombreComercial ? this.invProveedorTO.provNombreComercial : null;
    this.invProveedorTO.usrInsertaProveedor = this.auth.getCodigoUser();
    if (!this.empresaExtranjera) {
      this.invProveedorTO.provProvincia = this.provinciaSeleccionada ? this.provinciaSeleccionada.nombre : "";
    }
  }

  /*OPERACIONES */
  insertarProveedor(form: NgForm) {
    this.cargando = true;
    if (this.validarAntesDeEnviar(form)) {
      this.continuarInsersion();
    }
  }

  actualizarProveedor(form: NgForm) {
    if (!this.utilService.puedoCancelar(this.valoresIniciales, this.frmProveedorDatos)) {
      this.cargando = true;
      if (this.validarAntesDeEnviar(form)) {
        this.continuarEdicion();
      }
    } else {
      this.cerrarFormularioProveedor.emit({ invProveedorTO: null, mostrarFormulario: false, accion: null });
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
    }
  }

  eliminarProveedor() {
    if (this.proveedorService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br/>" + LS.TAG_PROVEEDOR + ": " + this.invProveedorTO.provRazonSocial,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.proveedorService.eliminarProveedor({ invProveedorTO: this.invProveedorTO }, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.cerrarFormulario();
        }
      });
    } else {
      this.cerrarFormulario();
    }
  }

  modificarEstadoProveedor() {
    if (this.proveedorService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let parametros = {
        title: this.invProveedorTO.provInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (this.invProveedorTO.provInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Proveedor: " + this.invProveedorTO.provRazonSocial,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.invProveedorTO.provInactivo = !this.invProveedorTO.provInactivo;
          let invProveedorPk = { provEmpresa: this.invProveedorTO.provEmpresa, provCodigo: this.invProveedorTO.provCodigo };
          this.proveedorService.cambiarEstadoProveedor({ invProveedorPK: invProveedorPk, estado: this.invProveedorTO.provInactivo }, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.cerrarFormulario();
        }
      });
    } else {
      this.cerrarFormulario();
    }
  }

  despuesDeInsertarProveedor(extraInfo) {
    this.cargando = false;
    this.cerrarFormularioProveedor.emit({ invProveedorTO: extraInfo, mostrarFormulario: false, accion: this.accion });
  }

  despuesDeModificarProveedor(extraInfo) {
    this.cargando = false;
    this.cerrarFormularioProveedor.emit({ invProveedorTO: extraInfo, mostrarFormulario: false, accion: this.accion });
  }

  despuesDeEliminarProveedor() {
    this.cargando = false;
    this.cerrarFormularioProveedor.emit({ invProveedorTO: this.invProveedorTO, mostrarFormulario: false, accion: this.accion });
  }

  despuesDecambiarEstadoProveedor() {
    this.cargando = false;
    this.cerrarFormularioProveedor.emit({ invProveedorTO: this.invProveedorTO, mostrarFormulario: false, accion: this.accion });
  }

  mostrarTipoContribuyente() {
    const modalRef = this.modalService.open(ProveedorCategoriaComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.empresaModal = this.empresaSeleccionada;
    modalRef.componentInstance.razonSocial = this.invProveedorTO.provRazonSocial ? "- " + this.invProveedorTO.provRazonSocial :
      this.invProveedorTO.provRazonSocial;
    modalRef.result.then((result) => {
      this.listarInvProveedorCategoriaTO();
      if (result.tipoContribuyenteSeleccionado) {
        this.invProveedorTO.provCategoria = result.tipoContribuyenteSeleccionado ? result.tipoContribuyenteSeleccionado.pcCodigo : '';
      }
      this.definirAtajosDeTeclado();
    }, () => {
      this.listarInvProveedorCategoriaTO();
      this.definirAtajosDeTeclado();
    });
    this.cdRef.detectChanges();
  }

  /*METODO*/
  cerrarFormulario() {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_CREAR:
        if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmProveedorDatos)) {
          this.cerrarFormularioProveedor.emit({ invProveedorTO: null, mostrarFormulario: false, accion: null });
        } else {
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI_ACEPTAR,
            cancelButtonText: LS.MSJ_NO_CANCELAR
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.cerrarFormularioProveedor.emit({ invProveedorTO: null, mostrarFormulario: false, accion: null });
            }
          });
        }
        break;
      default:
        this.cerrarFormularioProveedor.emit({ invProveedorTO: null, mostrarFormulario: false, accion: null });
    }
  }

  cambiarEstadoActivar() {
    this.activar = !this.activar;
    this.activarEstado.emit(this.activar);
  }

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_CREAR:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  tamanioChico(id: number) {
    if (id == 1) { // para E-mail
      (<HTMLInputElement>document.querySelector('#correosolo .ui-chips-input-token input')).className = 'chico form-control form-control-sm';
    } else if (id == 2) {
      (<HTMLInputElement>document.querySelector('#correocompra .ui-chips-input-token input')).className = 'chico form-control form-control-sm';
    }
  }

  tamanioGrande(id: number) {
    if (id == 1 && this.correos.length == 0) { // this.correos.length % 3 == 0
      (<HTMLInputElement>document.querySelector('#correosolo .ui-chips-input-token input')).className = 'grande form-control form-control-sm';
    } else if (id == 2 && this.correosCompra.length == 0) {
      (<HTMLInputElement>document.querySelector('#correocompra .ui-chips-input-token input')).className = 'grande form-control form-control-sm';
    }
  }
}
