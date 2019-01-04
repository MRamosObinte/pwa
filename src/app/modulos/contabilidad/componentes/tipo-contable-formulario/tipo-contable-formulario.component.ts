import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { TipoContableService } from '../../archivo/tipo-contable/tipo-contable.service';
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';

@Component({
  selector: 'app-tipo-contable-formulario',
  templateUrl: './tipo-contable-formulario.component.html',
  styleUrls: ['./tipo-contable-formulario.component.css']
})
export class TipoContableFormularioComponent implements OnInit {

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
  public conTipoTO: ConTipoTO = new ConTipoTO();
  //
  @ViewChild("frmTipoContableDatos") frmTipoContableDatos: NgForm;
  public valoresIniciales: any;
  public conTipoInicial: any;
  //
  public listaModulos: Array<string> = LS.LISTA_MODULOS;
  public listaTipos: Array<string> = LS.LISTA_TIPOS;

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private tipoContableService: TipoContableService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.conTipoTO = { ...this.parametros.conTipoTO };
    this.operaciones();
    this.extraerValoresIniciales();
    this.generarAtajosTeclado();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmTipoContableDatos ? this.frmTipoContableDatos.value : null));
      this.conTipoInicial = JSON.parse(JSON.stringify(this.conTipoTO ? this.conTipoTO : null));
    }, 50);
  }

  generarAtajosTeclado() {
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
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.tituloForm = LS.TITULO_FORM_NUEVO_TIPO_CONTABLE;
        this.obtenerDatosTipoContable();
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.TITULO_FORM_EDITAR_TIPO_CONTABLE + ": Código: " + this.conTipoTO.tipCodigo;
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_TIPO_CONTABLE + ": Código: " + this.conTipoTO.tipCodigo;
        break;
    }
  }

  obtenerDatosTipoContable() {
    this.conTipoTO = new ConTipoTO();
    this.conTipoTO.tipModulo = this.listaModulos[0];
    this.conTipoTO.tipTipoPrincipal = this.listaTipos[0];
  }

  /** Metodo para guardar un nuevo tipo contable*/
  insertarTipoContable(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let tipoCopia = JSON.parse(JSON.stringify(this.conTipoTO));
        tipoCopia.tipDetalle = this.conTipoTO.tipDetalle;
        tipoCopia.empCodigo = this.empresaSeleccionada.empCodigo;
        tipoCopia.usrInsertaTipo = this.auth.getCodigoUser();
        let parametro = { conTipoTO: tipoCopia };
        this.tipoContableService.insertarTipoContable(parametro, this, tipoCopia, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  /** Metodo que se ejecuta despues de insertar un tipo de contable*/
  despuesDeInsertarTipoContable(respuesta, tipoCopia) {
    this.cargando = false;
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      operacion: LS.ACCION_CREAR,
      tipoCopia: tipoCopia
    };
    this.enviarAccion.emit(parametro);
  }

  /** Metodo para guardar una modificacion de un tipo contable*/
  actualizarTipoContable(form: NgForm) {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmTipoContableDatos)) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      this.enviarCancelar.emit();
    } else {
      if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          let tipoCopia = JSON.parse(JSON.stringify(this.conTipoTO));
          tipoCopia.tipDetalle = this.conTipoTO.tipDetalle;
          let parametro = { conTipoTO: tipoCopia };
          this.tipoContableService.actualizarTipoContable(parametro, this, tipoCopia, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    }
  }

  /** Metodo que se ejecuta despues de modificar un tipo contable*/
  despuesDeModificarTipoContable(respuesta, tipoCopia) {
    this.cargando = false;
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      operacion: LS.ACCION_EDITAR,
      tipoCopia: tipoCopia
    };
    this.enviarAccion.emit(parametro);
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmTipoContableDatos)) {
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
}
