import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { EmpresaService } from '../../archivo/empresa/empresa.service';
import { SisEmpresa } from '../../../../entidades/sistema/SisEmpresa';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-empresa-formulario',
  templateUrl: './empresa-formulario.component.html',
  styleUrls: ['./empresa-formulario.component.css']
})
export class EmpresaFormularioComponent implements OnInit {

  public constantes: any = LS;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() administracion: boolean;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  public empresa: SisEmpresa = new SisEmpresa;
  @Input() accion: string = null;
  public cargando: boolean = false;
  public hayClave: boolean = false;
  public hayEmail: boolean = false;

  //formulario
  @ViewChild("frmEmpresaDatos") frmEmpresaDatos: NgForm;
  public valoresIniciales: any;

  constructor(
    public toastr: ToastrService,
    private empresaService: EmpresaService,
    private atajoService: HotkeysService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.definirAtajosDeTeclado();
    this.obtenerEmpresa();
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarEmpresa') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarEmpresa') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  obtenerEmpresa(): any {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    };
    this.empresaService.obtenerEmpresa(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  verificarCampos() {
    this.hayEmail = this.empresa.empEmailNotificaciones ? true : false;
    this.hayClave = this.empresa.empClaveNotificaciones ? true : false;
  }

  despuesDeObtenerEmpresa(data) {
    this.empresa = data;
    this.verificarCampos();
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  cerrarFormulario() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmEmpresaDatos)) {
      this.enviarCancelar.emit();
    } else {
      let parametros = {
        title: LS.MSJ_TITULO_CANCELAR,
        texto: LS.MSJ_PREGUNTA_CANCELAR,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_ACEPTAR,
        cancelButtonText: LS.MSJ_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.enviarCancelar.emit();
        }
      });
    }
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.empresaService.verificarPermiso(accion, this, mostraMensaje);
  }

  actualizarEmpresa(ngForm: NgForm) {
    if (!this.utilService.puedoCancelar(this.valoresIniciales, this.frmEmpresaDatos)) {
      let formTocado = this.utilService.establecerFormularioTocado(ngForm);
      if (formTocado && !ngForm.invalid) {
        this.cargando = true;
        let parametro = {
          sisEmpresa: this.empresa
        }
        this.empresaService.modificarSisEmpresa(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.TOAST_ADVERTENCIA);
      }
    } else {
      this.enviarCancelar.emit();
      this.utilService.generarSwal(LS.PEDIDOS_CONFIGURACION_CORREO, LS.SWAL_SUCCESS, LS.NO_REALIZO_NINGUN_CAMBIO);
    }
  }

  despuesDeModificarSisEmpresa(data) {
    this.toastr.success(LS.MSJ_CORREO_ACTUALIZADO, LS.TOAST_CORRECTO);
    this.cargando = false;
    this.enviarCancelar.emit();
  }

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    if (this.accion != LS.ACCION_CONSULTAR && !this.utilService.puedoCancelar(this.valoresIniciales, this.frmEmpresaDatos)) {
      event.returnValue = false;
    } else {
      return true;
    }
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmEmpresaDatos ? this.frmEmpresaDatos.value : null));
    }, 50);
  }

}
