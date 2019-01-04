import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { InvProformaMotivoTO } from '../../../../entidadesTO/inventario/InvProformaMotivoTO';
import { NgForm } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { MotivoProformasService } from '../../archivo/motivo-proformas/motivo-proformas.service';

@Component({
  selector: 'app-motivo-proformas-formulario',
  templateUrl: './motivo-proformas-formulario.component.html',
  styleUrls: ['./motivo-proformas-formulario.component.css']
})
export class MotivoProformasFormularioComponent implements OnInit {
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
  public invProformaMotivoTO: InvProformaMotivoTO = new InvProformaMotivoTO();
  public invProformaMotivoCopia: any;
  //
  @ViewChild("frmMotivoProformaDatos") frmMotivoProformaDatos: NgForm;
  public valoresIniciales: any;
  public motivoConsumoInicial: any;

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private proformaMotivoService: MotivoProformasService
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.invProformaMotivoTO = { ...this.parametros.invProformaMotivoTO };
    this.generarAtajosTeclado();
    this.operaciones();
    this.extraerValoresIniciales();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmMotivoProformaDatos ? this.frmMotivoProformaDatos.value : null));
      this.motivoConsumoInicial = JSON.parse(JSON.stringify(this.invProformaMotivoTO ? this.invProformaMotivoTO : null));
    }, 60);
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.invProformaMotivoTO = new InvProformaMotivoTO();
        this.tituloForm = LS.TITULO_FORM_NUEVO_MOTIVO_PROFORMA;
        break;
      case LS.ACCION_CONSULTAR:
        this.invProformaMotivoTO = this.parametros.invProformaMotivoTO;
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_MOTIVO_PROFORMA + ": Código: " + this.invProformaMotivoTO.pmCodigo;
        break;
      case LS.ACCION_EDITAR:
        this.invProformaMotivoTO = this.parametros.invProformaMotivoTO;
        this.tituloForm = LS.TITULO_FORM_EDITAR_MOTIVO_PROFORMA+ ": Código: " + this.invProformaMotivoTO.pmCodigo;
        break;
    }
  }

  insertarProformaMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(form);
      if (formTocado && form && form.valid) {
        this.invProformaMotivoCopia = JSON.parse(JSON.stringify(this.invProformaMotivoTO));
        this.setearValores(this.invProformaMotivoCopia);
        let parametro = { invProformaMotivoTO: this.invProformaMotivoCopia };
        this.proformaMotivoService.insertarInvProformasMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarProformasMotivoTO(respuesta) {
    this.cargando = false;
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    let parametro = {
      accion: LS.ACCION_CREAR,
      invProformaMotivoCopia: this.invProformaMotivoCopia
    };
    this.enviarAccion.emit(parametro);
  }

  actualizarProformaMotivo(form: NgForm) {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmMotivoProformaDatos)) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      this.enviarCancelar.emit();
    } else {
      if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
        this.cargando = true;
        let formTocado = this.utilService.establecerFormularioTocado(form);
        if (formTocado && form && form.valid) {
          this.invProformaMotivoCopia = JSON.parse(JSON.stringify(this.invProformaMotivoTO));
          this.setearValores(this.invProformaMotivoTO);
          let parametro = { invProformaMotivoTO: this.invProformaMotivoCopia };
          this.proformaMotivoService.actualizarInvProformasMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    }
  }

  despuesDeActualizarProformasMotivoTO(respuesta) {
    this.cargando = false;
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    let parametro = {
      accion: LS.ACCION_EDITAR,
      invProformaMotivoCopia: this.invProformaMotivoCopia
    };
    this.enviarAccion.emit(parametro);
  }

  setearValores(invProformaMotivoTO: InvProformaMotivoTO) {
    invProformaMotivoTO.pmEmpresa = LS.KEY_EMPRESA_SELECT;
    invProformaMotivoTO.usrCodigo = this.auth.getCodigoUser();
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmMotivoProformaDatos)) {
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

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }
}
