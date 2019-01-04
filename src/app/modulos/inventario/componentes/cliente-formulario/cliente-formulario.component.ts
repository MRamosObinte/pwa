import { Component, OnInit, Input, Output, EventEmitter, HostListener, ChangeDetectorRef, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvClienteTO } from '../../../../entidadesTO/inventario/InvClienteTO';
import { IdentificacionService } from '../../../anexos/archivo/identificacion/identificacion.service';
import { AnxTipoIdentificacionTO } from '../../../../entidadesTO/anexos/AnxTipoIdentificacionTO';
import { AnxProvinciaCantonTO } from '../../../../entidadesTO/anexos/AnxProvinciaCantonTO';
import { CantonService } from '../../../anexos/archivo/canton/canton.service';
import { InvVendedorComboListadoTO } from '../../../../entidadesTO/inventario/InvVendedorComboListadoTO';
import { VendedorService } from '../../archivo/vendedor/vendedor.service';
import { InvClienteCategoriaTO } from '../../../../entidadesTO/inventario/InvClienteCategoriaTO';
import { ClienteService } from '../../archivo/cliente/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { InvFunListadoClientesTO } from '../../../../entidadesTO/inventario/InvFunListadoClientesTO';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgForm } from '@angular/forms';
import { CajCajaTO } from '../../../../entidadesTO/caja/CajCajaTO';
import { ClienteCategoriaService } from '../../archivo/cliente-categoria/cliente-categoria.service';
import { VendedorComponent } from '../../archivo/vendedor/vendedor.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GrupoEmpresarialComponent } from '../../archivo/grupo-empresarial/grupo-empresarial.component';
import { ContactosComponent } from './contactos/contactos.component';
import { InvClienteGrupoEmpresarialTO } from '../../../../entidadesTO/inventario/InvClienteGrupoEmpresarialTO';
import { TipoContribuyenteComponent } from '../../archivo/tipo-contribuyente/tipo-contribuyente.component';

@Component({
  selector: 'app-cliente-formulario',
  templateUrl: './cliente-formulario.component.html',
  styleUrls: ['./cliente-formulario.component.css']
})
export class ClienteFormularioComponent implements OnInit {

  constantes: any = LS;
  accion: string = null;
  rptaCedula: string = null;
  rptaRepetido: string = null;

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() listadoCategorias: Array<InvClienteCategoriaTO>;// listado tipocontri
  /**
   * parametros debe incluir: --> accion: (nuevo, editar, consulta)
   *                          --> objetoSeleccionado: (El seleccionado de la lista)
   */
  @Input() parametros;
  @Output() enviarCancelar = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  cliente: InvClienteTO;
  clienteRespaldo: InvClienteTO;
  innerWidth: number;
  isScreamMd: boolean = true;
  cargando: boolean = true;
  empresaExtranjera: boolean = false;
  activar: boolean = false;
  listadoTipoIdentificacion: Array<AnxTipoIdentificacionTO> = new Array();
  listadoProvincias: Array<AnxProvinciaCantonTO> = new Array();
  listadoCiudades: Array<AnxProvinciaCantonTO> = new Array();
  listadoVendedores: Array<InvVendedorComboListadoTO> = new Array();
  listadoGrupoEmpresarial: Array<InvClienteGrupoEmpresarialTO> = new Array();
  vendedorSeleccionado: InvVendedorComboListadoTO;
  provinciaSeleccionada: AnxProvinciaCantonTO;
  ciudadSeleccionada: AnxProvinciaCantonTO;
  seleccionado: InvFunListadoClientesTO;
  caja: CajCajaTO;
  digitosCedulaMax: number = 30;
  digitosCedulaMin: number = 1;
  codigoAnterior: string = "";
  correos: string[] = [];
  activarContactos: boolean = true;
  @ViewChild("frmClienteDatos") frmClienteDatos: NgForm;
  public valoresIniciales: any;
  public clienteInicial: any;

  constructor(
    private identificacionService: IdentificacionService,
    private cantonService: CantonService,
    private vendedorService: VendedorService,
    private clienteCategoriaService: ClienteCategoriaService,
    private clienteService: ClienteService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef
  ) {
    this.cliente = new InvClienteTO();
    this.provinciaSeleccionada = new AnxProvinciaCantonTO();
    this.ciudadSeleccionada = new AnxProvinciaCantonTO();
    this.vendedorSeleccionado = new InvVendedorComboListadoTO();
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    //parametros necesarios
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.seleccionado = this.parametros.objetoSeleccionado;
    if (this.parametros.cliente) {
      this.cliente = this.parametros.cliente;
    }
    this.cliente.empCodigo = LS.KEY_EMPRESA_SELECT;

    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    }
    if (this.empresaSeleccionada && this.empresaSeleccionada.empPais != LS.LABEL_ECUADOR) {
      this.empresaExtranjera = true;
    }
    this.actuarSegunAccion();
    this.identificacionService.listarTipoIdentificacionTO(this, LS.KEY_EMPRESA_SELECT);
    this.cantonService.listarAnxDpaProvinciaTO(this, LS.KEY_EMPRESA_SELECT);
    this.listarVendedores();
    if (!this.listadoCategorias || this.listadoCategorias.length <= 0) {
      this.clienteCategoriaService.listarInvClienteCategoriaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else if (this.parametros && this.parametros.categoriaSeleccionada) {
      this.cliente.cliCategoria = this.parametros.categoriaSeleccionada.ccCodigo;
    }
    this.clienteService.listarGrupoEmpresarial({ empresa: LS.KEY_EMPRESA_SELECT, busqueda: null }, this, LS.KEY_EMPRESA_SELECT);
    this.clienteService.obtenerPermisosDeCaja(parametro, this, LS.KEY_EMPRESA_SELECT);

    if (this.seleccionado && this.seleccionado.cliEmail != "") {
      this.correos = this.seleccionado.cliEmail.split(";");
      this.tamanioChico();
    }
    this.definirAtajosDeTeclado();
    this.extraerValoresIniciales();
  }

  clickear() {
    let patt = new RegExp(LS.EXP_REGULAR_EMAIL);
    let cor = this.correos[this.correos.length - 1];
    cor = cor.toLowerCase();
    if (!patt.test(cor)) {
      this.toastr.warning(LS.MSJ_CORREO_NO_VALIDO);
      this.correos.splice(this.correos.length - 1);
    } else {
      this.correos[this.correos.length - 1] = cor;
    }
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.clienteService.verificarPermiso(accion, this, mostraMensaje);
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarCliente') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      this.cancelar();
      return false;
    }))
  }

  actuarSegunAccion() {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        this.obtenerInvClienteTO();
        break;
    }
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmClienteDatos ? this.frmClienteDatos.value : null));
      this.clienteInicial = JSON.parse(JSON.stringify(this.cliente ? this.cliente : null));
    }, 50);
  }

  obtenerInvClienteTO() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      codigo: this.seleccionado ? this.seleccionado.cliCodigo : ""
    }
    this.clienteService.obtenerClienteTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerClienteTO(data) {
    this.cliente = new InvClienteTO(data);
    this.llenarCombos(this.cliente);
    this.codigoAnterior = this.cliente.cliCodigo;
    //
    if (LS.ACCION_CONSULTAR == this.accion) {
      this.activarContactos = this.cliente.cliLugaresEntrega ? JSON.parse(this.cliente.cliLugaresEntrega) : false;
    }
    this.extraerValoresIniciales();
  }

  despuesDeObtenerPermisosDeCaja(data) {
    this.caja = data;
    this.cargando = false;
  }

  llenarCombos(cliente: InvClienteTO) {
    this.establecerLongitudIdentificacion(this.cliente.cliTipoId);
    //Provincias
    this.provinciaSeleccionada = this.listadoProvincias.find(item => item.nombre == cliente.cliProvincia);
    this.provinciaSeleccionada && this.provinciaSeleccionada.codigo ? this.listarCiudades() : null;
    //Vendedores
    if (this.listadoVendedores.length > 0) {
      this.vendedorSeleccionado = this.listadoVendedores.find(item => item.vendCodigo == cliente.vendCodigo && item.vendEmpresa == LS.KEY_EMPRESA_SELECT);
    }
  }

  espacios() {
    let b = this.cliente.cliRazonSocial;
    for (let i = 0; i < b.length; i++) {
      b = b.split("   ").join(" ");
      b = b.split("  ").join(" ");
      b = b.split("'").join("");
    }
    this.cliente.cliRazonSocial = b;
  }

  despuesDeListarAnxTipoIdentificacionTO(data) {
    this.listadoTipoIdentificacion = data;
    if (this.accion === LS.ACCION_NUEVO) {
      this.cliente.cliTipoId = this.listadoTipoIdentificacion[0].tiCodigo;
      this.establecerLongitudIdentificacion(this.cliente.cliTipoId);
    }
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  despuesDeListarAnxDpaProvinciaTO(data) {
    this.listadoProvincias = data;
    this.provinciaSeleccionada = this.listadoProvincias.find(item => item.nombre == this.cliente.cliProvincia);
    this.provinciaSeleccionada && this.provinciaSeleccionada.codigo ? this.listarCiudades() : null;
    this.cargando = false;
  }

  listarCiudades() {
    let parametro = {
      codigoProvincia: this.provinciaSeleccionada.codigo
    }
    this.cantonService.listarCiudadesAnxDpaProvinciaTO(this, parametro, this.empresaSeleccionada.empCodigo);
  }

  despuesDeListarCiudadesAnxDpaProvinciaTO(data) {
    this.listadoCiudades = data;
    this.cargando = false;
  }

  listarVendedores() {
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo
    };
    this.vendedorService.listarComboinvListaVendedorTOs(this, parametro, this.empresaSeleccionada.empCodigo);
  }

  despuesDeListarVendedorTOs(data) {
    this.listadoVendedores = data;
    this.cargando = false;
  }

  listadoTipoContribuyente() {
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.clienteCategoriaService.listarInvClienteCategoriaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvClienteCategoriaTO(data) {
    this.listadoCategorias = data;
    this.cargando = false;
  }

  cancelar() {
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_REGISTRO_NO_EXITOSO,
      cliente: this.seleccionado
    }
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_NUEVO:
        if (this.sePuedeCancelar()) {
          this.enviarCancelar.emit(parametro);
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
              this.enviarCancelar.emit(parametro);
            }
          });
        }
        break;
      default:
        this.enviarCancelar.emit(parametro);
    }
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmClienteDatos) && this.utilService.compararObjetos(this.clienteInicial, this.cliente);
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }

  establecerLongitudIdentificacion(codigo) {
    if (!this.empresaExtranjera) {
      switch (codigo) {
        case "R"://RUC
          this.digitosCedulaMax = 13;
          this.digitosCedulaMin = 13;
          this.cliente.cliId = this.cliente.cliId && this.cliente.cliId.length <= 13 ? this.cliente.cliId : "";
          this.validarIdentificacion(codigo);
          break;
        case "C"://CEDULA
          this.digitosCedulaMax = 10;
          this.digitosCedulaMin = 10;
          this.cliente.cliId = this.cliente.cliId && this.cliente.cliId.length <= 10 ? this.cliente.cliId : "";
          this.validarIdentificacion(codigo);
          break;
        default:
          this.rptaCedula = null;
          this.digitosCedulaMax = 130;
          this.digitosCedulaMin = 1;
          this.validarIdentificacion(codigo);
          break;
      }
    }
  }

  validarIdentificacion(codigo) {
    if (this.cliente.cliId) {
      let parametros = {
        empresa: LS.KEY_EMPRESA_SELECT,
        id: this.cliente.cliId,
        codigo: this.cliente.cliCodigo
      }
      this.rptaRepetido = null;
      this.clienteService.obtenerSiEsClienteRepetido(parametros, this, LS.KEY_EMPRESA_SELECT);
      if (!this.empresaExtranjera) {
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

  soloNumeros(event) {
    return event.charCode >= 48 && event.charCode <= 57
  }

  validarCedula() {
    if (this.cliente.cliId.length > 9) {
      let parametro = {
        cedula: this.cliente.cliId
      }
      this.clienteService.validarCedula(parametro, this, LS.KEY_EMPRESA_SELECT);
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

  insertarCliente(form: NgForm) {
    this.cargando = true;
    this.espacios();
    if (this.validarAntesDeEnviar(form)) {
      this.continuarInsersion();
    }
  }

  validarAntesDeEnviar(form: NgForm): boolean {
    if (this.rptaCedula) {
      this.toastr.warning(this.rptaCedula, LS.TAG_CEDULA);
      this.cargando = false;
      return false;
    }
    if (!form.valid) {
      this.utilService.establecerFormularioTocado(form);
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_CAMPOS_INVALIDOS);
      this.cargando = false;
      return false;
    }
    this.agregarEmail();
    if (!this.cliente.cliEmail) {
      this.cargando = false;
      let parametros = {
        title: LS.MSJ_PREGUNTA_GUARDAR_SIN_EMAIL,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.accion == LS.ACCION_NUEVO ? this.continuarInsersion() : this.continuarEdicion();
        }
      });
    } else {
      return true;
    }
  }

  agregarEmail() {
    this.cliente.cliEmail = "";
    for (let i = 0; i < this.correos.length; i++) {
      if (i < this.correos.length - 1) {
        this.cliente.cliEmail += this.correos[i] + ";";
      } else if (i == this.correos.length - 1) {
        this.cliente.cliEmail += this.correos[i];
      }
    }
  }

  continuarInsersion() {
    this.completarDatosAPartirDeCombos();
    let parametro = {
      invClienteTO: this.cliente
    }
    this.clienteService.insertarCliente(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  continuarEdicion() {
    this.completarDatosAPartirDeCombos();
    let parametro = {
      invClienteTO: this.cliente,
      codigoAnterior: this.codigoAnterior
    }
    this.clienteService.modificarCliente(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  completarDatosAPartirDeCombos() {
    if (this.cliente.geCodigo) {
      this.cliente.geEmpresa = LS.KEY_EMPRESA_SELECT;
    } else {
      this.cliente.geEmpresa = null;
      this.cliente.geCodigo = null;
    }
    if (!this.empresaExtranjera) {
      this.cliente.cliProvincia = this.provinciaSeleccionada ? this.provinciaSeleccionada.nombre : "";
    }
  }

  actualizarCliente(form: NgForm) {
    if (!this.sePuedeCancelar()) {
      this.cargando = true;
      if (this.validarAntesDeEnviar(form)) {
        this.continuarEdicion();
      }
    } else {
      let parametro = {
        empresa: this.empresaSeleccionada,
        accion: LS.ACCION_REGISTRO_NO_EXITOSO,
        cliente: this.seleccionado
      }
      this.enviarCancelar.emit(parametro);
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
    }
  }

  despuesDeInsertarCliente(data) {
    this.cargando = false;
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_REGISTRO_EXITOSO,
      cliente: this.cliente
    }
    this.enviarCancelar.emit(parametro);
  }

  despuesDeModificarCliente(data) {
    this.cargando = false;
    this.enviarCancelar.emit(data);
  }

  despuesDeListarInvClienteGrupoEmpresarial(data) {
    this.listadoGrupoEmpresarial = data;
    this.cargando = false;
  }

  despuesDeObtenerSiEsClienteRepetido(data) {
    if (data) {
      this.rptaRepetido = LS.MSJ_CLIENTE_MISMA_IDENTIFICACION;
      this.toastr.warning(this.rptaRepetido, LS.TAG_REPETIDO);
    } else {
      this.rptaRepetido = null;
    }
    this.cargando = false;
  }

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_NUEVO:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  mostrarContactos() {
    if (this.accion === LS.ACCION_CONSULTAR && this.cliente && !this.cliente.cliLugaresEntrega) {
      this.toastr.warning(LS.MSJ_NO_EXITEN_RESULTADOS, LS.TOAST_INFORMACION);
    } else {
      const modalRef = this.modalService.open(ContactosComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
      modalRef.componentInstance.cliente = this.cliente;
      modalRef.componentInstance.accion = this.accion;
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.componentInstance.razonSocial = this.cliente.cliRazonSocial != "" ? "- " + this.cliente.cliRazonSocial :
        this.cliente.cliRazonSocial;
      modalRef.result.then(() => {
        this.definirAtajosDeTeclado();
      }, () => {
        this.definirAtajosDeTeclado();
      });
    }
  }

  mostrarTipoContribuyente() {
    const modalRef = this.modalService.open(TipoContribuyenteComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.empresaModal = this.empresaSeleccionada;
    modalRef.componentInstance.razonSocial = this.cliente.cliRazonSocial != "" ? "- " + this.cliente.cliRazonSocial :
      this.cliente.cliRazonSocial;
    modalRef.result.then((result) => {
      this.listadoTipoContribuyente();
      if (result.tipoContribuyenteSeleccionado != null) {
        this.cliente.cliCategoria = result.tipoContribuyenteSeleccionado ? result.tipoContribuyenteSeleccionado.ccCodigo : '';
      }
      this.definirAtajosDeTeclado();
    }, (reason) => {
      this.listadoTipoContribuyente();
      this.definirAtajosDeTeclado();
    });
    this.cdRef.detectChanges();
  }

  mostrarVendedor() {
    const modalRef = this.modalService.open(VendedorComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.empresaModal = this.empresaSeleccionada;
    modalRef.componentInstance.razonSocial = this.cliente.cliRazonSocial != "" ? "- " + this.cliente.cliRazonSocial :
      this.cliente.cliRazonSocial;
    modalRef.componentInstance.vendedorSeleccionado = this.vendedorSeleccionado;
    modalRef.result.then((result) => {
      this.listarVendedores();
      if (result.vendedorSeleccionado != null) {
        this.cliente.vendCodigo = result.vendedorSeleccionado ? result.vendedorSeleccionado.vendCodigo : '';
        this.cliente.vendEmpresa = result.vendedorSeleccionado ? result.vendedorSeleccionado.vendEmpresa : '';
      }
      this.definirAtajosDeTeclado();
    }, (reason) => {
      this.listarVendedores();
      this.definirAtajosDeTeclado();
    });
    this.cdRef.detectChanges();
  }

  mostrarGrupoEmpresarial() {
    const modalRef = this.modalService.open(GrupoEmpresarialComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.empresaModal = this.empresaSeleccionada;
    modalRef.componentInstance.listadoGrupos = this.listadoGrupoEmpresarial;
    modalRef.componentInstance.razonSocial = this.cliente.cliRazonSocial != "" ? "- " + this.cliente.cliRazonSocial :
      this.cliente.cliRazonSocial;
    modalRef.result.then((result) => {
      this.clienteService.listarGrupoEmpresarial({ empresa: LS.KEY_EMPRESA_SELECT, busqueda: null }, this, LS.KEY_EMPRESA_SELECT);
      if (result.grupoEmpresarialNuevoSeleccionado != null) {
        this.cliente.geCodigo = result.grupoEmpresarialNuevoSeleccionado ? result.grupoEmpresarialNuevoSeleccionado.geCodigo : '';
      }
      this.definirAtajosDeTeclado();
    }, (reason) => {
      //Al minimizar, es necesario
      this.clienteService.listarGrupoEmpresarial({ empresa: LS.KEY_EMPRESA_SELECT, busqueda: null }, this, LS.KEY_EMPRESA_SELECT);
      this.definirAtajosDeTeclado();
    });
    this.cdRef.detectChanges();
  }

  tamanioChico() {
    (<HTMLInputElement>document.querySelector('#correosolo input')).className = 'chico form-control form-control-sm';
  }

  tamanioGrande() {
    if (this.correos.length == 0) { // this.correos.length % 3 == 0
      (<HTMLInputElement>document.querySelector('#correosolo input')).className = 'grande form-control form-control-sm';
    }
  }
}
