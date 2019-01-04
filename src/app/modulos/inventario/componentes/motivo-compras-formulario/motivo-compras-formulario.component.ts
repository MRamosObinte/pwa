import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { InvComprasMotivoTO } from '../../../../entidadesTO/inventario/InvComprasMotivoTO';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { NgForm } from '@angular/forms';
import { MotivoComprasService } from '../../archivo/motivo-compras/motivo-compras.service';
import { TipoContableService } from '../../../contabilidad/archivo/tipo-contable/tipo-contable.service';

@Component({
  selector: 'app-motivo-compras-formulario',
  templateUrl: './motivo-compras-formulario.component.html',
  styleUrls: ['./motivo-compras-formulario.component.css']
})
export class MotivoComprasFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarCancelar = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();
  @Input() parametros;
  //
  public accion: string = null;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public tituloForm: string = "";
  public constantes: any = LS;
  //
  public invComprasMotivoTO: InvComprasMotivoTO = new InvComprasMotivoTO();
  //
  public listaTipos: Array<ConTipoTO> = [];
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
  public listaFormaImprimir: Array<string> = LS.LISTA_MOTIVOS_COMPRA_FORMA_IMPRIMIR;
  public formaImprimirSeleccionado: string = "";
  public listaFormaContabilizar: Array<string> = LS.LISTA_MOTIVOS_COMPRA_FORMA_CONTABILIZAR;
  public formaContabilizarSeleccionado: string = "";
  //
  @ViewChild("frmMotivoCompraDatos") frmMotivoCompraDatos: NgForm;
  public valoresIniciales: any;
  public motivoCompraInicial: any;

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private motivoComprasService: MotivoComprasService,
    private tipoContableService: TipoContableService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.listaTipos = this.parametros.listaTipos;
    this.invComprasMotivoTO = { ...this.parametros.invComprasMotivoTO };
    this.operaciones();
    this.extraerValoresIniciales();
    this.generarAtajos();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmMotivoCompraDatos ? this.frmMotivoCompraDatos.value : null));
      this.motivoCompraInicial = JSON.parse(JSON.stringify(this.invComprasMotivoTO ? this.invComprasMotivoTO : null));
    }, 100);
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.tituloForm = LS.TITULO_FORM_NUEVO_MOTIVO_COMPRA;
        this.obtenerDatosMotivoComprasNuevo();
        break;
      case LS.ACCION_CONSULTAR:
        this.obtenerDatosMotivoCompras();
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_MOTIVO_COMPRA + ": Código: " + this.invComprasMotivoTO.cmCodigo;
        break;
      case LS.ACCION_EDITAR:
        this.obtenerDatosMotivoCompras();
        this.tituloForm = LS.TITULO_FORM_EDITAR_MOTIVO_COMPRA + ": Código: " + this.invComprasMotivoTO.cmCodigo;
        break;
    }
  }

  obtenerDatosMotivoComprasNuevo() {
    this.cargando = true;
    this.invComprasMotivoTO = new InvComprasMotivoTO();
    this.formaContabilizarSeleccionado = this.listaFormaContabilizar[0];
    this.formaImprimirSeleccionado = this.listaFormaImprimir[0];
    this.tipoSeleccionado = this.listaTipos.length > 0 ? this.listaTipos[0] : null;
    this.cargando = false;
  }

  obtenerDatosMotivoCompras() {
    this.cargando = true;
    this.invComprasMotivoTO = this.parametros.invCompraMotivoTO;
    this.llenarCombos();
    this.cargando = false;
  }

  insertarInvComprasMotivoTO(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invCompraMotivoTOCopia = JSON.parse(JSON.stringify(this.invComprasMotivoTO));
        this.setearValoresInvComprasMotivoTO(invCompraMotivoTOCopia);
        let parametro = { invCompraMotivoTO: invCompraMotivoTOCopia };
        this.motivoComprasService.insertarInvComprasMotivoTO(parametro, this, invCompraMotivoTOCopia, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarInvComprasMotivoTO(respuesta, invCompraMotivoTOCopia) {
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      invCompraMotivoTOCopia: invCompraMotivoTOCopia,
      accionChar: 'I'
    };
    this.cargando = false;
    this.enviarAccion.emit(parametro);
  }

  actualizarInvComprasMotivoTO(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmMotivoCompraDatos) && form && form.valid && formularioTocado) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      this.enviarCancelar.emit();
    } else {
      if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
        this.cargando = true;
        if (form && form.valid && formularioTocado) {
          let invCompraMotivoTOCopia = JSON.parse(JSON.stringify(this.invComprasMotivoTO));
          this.setearValoresInvComprasMotivoTO(invCompraMotivoTOCopia);
          let parametro = { invCompraMotivoTO: invCompraMotivoTOCopia };
          this.motivoComprasService.actualizarInvComprasMotivoTO(parametro, this, invCompraMotivoTOCopia, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    }
  }

  despuesDeActualizarInvComprasMotivoTO(respuesta, invCompraMotivoTOCopia) {
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      invCompraMotivoTOCopia: invCompraMotivoTOCopia,
      accionChar: 'U'
    };
    this.cargando = false;
    this.enviarAccion.emit(parametro);

  }

  llenarCombos() {
    this.tipoSeleccionado = this.listaTipos.filter(tipo => tipo.tipCodigo === this.invComprasMotivoTO.tipCodigo)[0];
    this.formaContabilizarSeleccionado = this.listaFormaContabilizar.filter(forma => forma === this.invComprasMotivoTO.cmFormaContabilizar)[0];
    this.formaImprimirSeleccionado = this.listaFormaImprimir.filter(forma => forma === this.invComprasMotivoTO.cmFormaImprimir)[0];
  }

  //OTROS METODOS
  /** Metodo para setear los valores en comun del objeto  InvComprasMotivoTO*/
  setearValoresInvComprasMotivoTO(invCompraMotivoTOCopia) {
    invCompraMotivoTOCopia.cmEmpresa = LS.KEY_EMPRESA_SELECT;
    invCompraMotivoTOCopia.cmFormaContabilizar = this.formaContabilizarSeleccionado;
    invCompraMotivoTOCopia.cmFormaImprimir = this.formaImprimirSeleccionado;
    invCompraMotivoTOCopia.tipCodigo = this.tipoSeleccionado.tipCodigo;
    invCompraMotivoTOCopia.usrCodigo = this.auth.getCodigoUser();
  }

  //LISTADOS
  /** Metodo que lista todos los tipos contables segun empresa*/
  listarTipos() {
    this.listaTipos = [];
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.tipoContableService.listarTipoContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo se ejecuta despues de haber ejecutado el metodo listarTipos() y asi seleccionar el primer elemento*/
  despuesDeListarTipoContable(listaTipos) {
    this.listaTipos = listaTipos ? listaTipos : [];
    if (this.listaTipos.length > 0) {
      this.tipoSeleccionado = this.tipoSeleccionado ? this.listaTipos.find(item => item.tipCodigo === this.tipoSeleccionado.tipCodigo) : this.listaTipos[0];
    } else {
      this.tipoSeleccionado = null;
    }
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmMotivoCompraDatos)) {
      this.enviarCancelar.emit();
    } else {
      switch (this.accion) {
        case LS.ACCION_EDITAR:
        case LS.ACCION_CREAR:
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI,
            cancelButtonText: LS.MSJ_NO
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.enviarCancelar.emit();
            }
          });
          break;
        default:
          this.enviarCancelar.emit();
      }
    }
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }
}
