import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { InvTransferenciaMotivoTO } from '../../../../entidadesTO/inventario/InvTransferenciaMotivoTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgForm } from '@angular/forms';
import { MotivoTransferenciasService } from '../../archivo/motivo-transferencias/motivo-transferencias.service';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-motivo-transferencias-formulario',
  templateUrl: './motivo-transferencias-formulario.component.html',
  styleUrls: ['./motivo-transferencias-formulario.component.css']
})
export class MotivoTransferenciasFormularioComponent implements OnInit {

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
  public invTransferenciaMotivoTO: InvTransferenciaMotivoTO = new InvTransferenciaMotivoTO();
  //
  @ViewChild("frmMotivoTransferenciaDatos") frmMotivoTransferenciaDatos: NgForm;
  public valoresIniciales: any;
  public motivoTransferenciaInicial: any;

  constructor(
    private utilService: UtilService,
    private motivoTransferenciaService: MotivoTransferenciasService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.invTransferenciaMotivoTO = { ...this.parametros.invTransferenciaMotivoTO };
    this.operaciones();
    this.generarAtajosTeclado();
    this.extraerValoresIniciales();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmMotivoTransferenciaDatos ? this.frmMotivoTransferenciaDatos.value : null));
      this.motivoTransferenciaInicial = JSON.parse(JSON.stringify(this.invTransferenciaMotivoTO ? this.invTransferenciaMotivoTO : null));
    }, 60);
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.tituloForm = LS.TITULO_FORM_NUEVO_MOTIVO_TRANSFERENCIA;
        this.invTransferenciaMotivoTO = new InvTransferenciaMotivoTO
        break;
      case LS.ACCION_CONSULTAR:
        this.insertarMotivoTransferencia = this.parametros.invTransferenciaMotivoTO;
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_MOTIVO_TRANSFERENCIA + ": Código: " + this.invTransferenciaMotivoTO.tmCodigo;
        break;
      case LS.ACCION_EDITAR:
        this.invTransferenciaMotivoTO = this.parametros.invTransferenciaMotivoTO;
        this.tituloForm = LS.TITULO_FORM_EDITAR_MOTIVO_TRANSFERENCIA + ": Código: " + this.invTransferenciaMotivoTO.tmCodigo;
        break;
    }
  }

  insertarMotivoTransferencia(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(form);
      if (formTocado && form && form.valid) {
        let invTransferenciaMotivoCopia = JSON.parse(JSON.stringify(this.invTransferenciaMotivoTO));
        this.motivoTransferenciaService.setearValoresInvTransferenciaMotivo(invTransferenciaMotivoCopia);
        let parametro = {
          accionChar: 'I',
          invTransferenciaMotivoCopia: invTransferenciaMotivoCopia
        };
        this.cargando = false;
        this.enviarAccion.emit(parametro);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  actualizarMotivoTransferencia(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmMotivoTransferenciaDatos)) {
        this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
        this.enviarCancelar.emit();
      } else {
        this.cargando = true;
        let formTocado = this.utilService.establecerFormularioTocado(form);
        if (formTocado && form && form.valid) {
          let invTransferenciaMotivoCopia = JSON.parse(JSON.stringify(this.invTransferenciaMotivoTO));
          this.motivoTransferenciaService.setearValoresInvTransferenciaMotivo(invTransferenciaMotivoCopia);
          let parametro = {
            accionChar: 'M',
            invTransferenciaMotivoCopia: invTransferenciaMotivoCopia
          }
          this.cargando = false;
          this.enviarAccion.emit(parametro);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    }
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmMotivoTransferenciaDatos)) {
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
}
