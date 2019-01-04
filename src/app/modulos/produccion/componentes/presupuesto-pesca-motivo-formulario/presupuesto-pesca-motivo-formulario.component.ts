import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdPresupuestoPescaMotivoTO } from '../../../../entidadesTO/Produccion/PrdPresupuestoPescaMotivoTO';
import { NgForm } from '@angular/forms';
import { LS } from '../../../../constantes/app-constants';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PresupuestoPescaMotivoService } from '../../archivos/presupuesto-pesca-motivo/presupuesto-pesca-motivo.service';

@Component({
  selector: 'app-presupuesto-pesca-motivo-formulario',
  templateUrl: './presupuesto-pesca-motivo-formulario.component.html',
  styleUrls: ['./presupuesto-pesca-motivo-formulario.component.css']
})
export class PresupuestoPescaMotivoFormularioComponent implements OnInit {

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
  //
  public presupuestoPM: PrdPresupuestoPescaMotivoTO = new PrdPresupuestoPescaMotivoTO();
  //
  @ViewChild("frmPresupuestoPMDatos") frmPresupuestoPMDatos: NgForm;
  public valoresIniciales: any;
  public liquidacionInicial: any;
  public constantes: any = LS;

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private presupuestoPMService: PresupuestoPescaMotivoService,
  ) { }

  ngOnInit() {

    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.presupuestoPM = { ...this.parametros.presupuestoPM };
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
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
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

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmPresupuestoPMDatos ? this.frmPresupuestoPMDatos.value : null));
      this.liquidacionInicial = JSON.parse(JSON.stringify(this.presupuestoPM ? this.presupuestoPM : null));
    }, 50);
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.tituloForm = LS.ACCION_NUEVO + " " + LS.PRODUCCION_MOTIVO_PRESUPUESTO_PESCA;
        this.obtenerPresupuestoPesca();
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.ACCION_CONSULTAR + " " + LS.PRODUCCION_MOTIVO_PRESUPUESTO_PESCA + ": Código: " + this.presupuestoPM.prdPresupuestoPescaMotivoPK.presuCodigo;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.ACCION_EDITAR + " " + LS.PRODUCCION_MOTIVO_PRESUPUESTO_PESCA + ": Código: " + this.presupuestoPM.prdPresupuestoPescaMotivoPK.presuCodigo;;
        break;
    }
  }

  obtenerPresupuestoPesca() {
    this.cargando = true;
    this.presupuestoPM = new PrdPresupuestoPescaMotivoTO();
    this.extraerValoresIniciales();
  }

  /**
* Método para insertar un nuevo motivo de liquidación 
*
* @param {NgForm} form
* @memberof PresupuestoPescaMotivoComponent
*/
  insertarPresupuestoPescaMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let presupuestoCopia = JSON.parse(JSON.stringify(this.presupuestoPM));
        presupuestoCopia.presuDetalle = this.presupuestoPM.presuDetalle;
        presupuestoCopia.prdPresupuestoPescaMotivoPK.presuCodigo = this.presupuestoPM.prdPresupuestoPescaMotivoPK.presuCodigo;
        presupuestoCopia.prdPresupuestoPescaMotivoPK.presuEmpresa = this.empresaSeleccionada.empCodigo;
        presupuestoCopia.usrCodigo = this.auth.getCodigoUser();
        presupuestoCopia.usrEmpresa = null;
        presupuestoCopia.usrFechaInserta = null;
        let parametro = {
          prdPresupuestoPescaMotivo: presupuestoCopia
        };
        this.presupuestoPMService.insertarPresupuestoPescaMotivo(parametro, this, presupuestoCopia, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarPresupuestoPescaMotivo(respuesta, presupuestoCopia) {
    this.cargando = false;
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      operacion: LS.ACCION_CREAR,
      presupuestoCopia: presupuestoCopia
    };
    this.enviarAccion.emit(parametro);
  }

  actualizarPresupuestoPMotivo(form: NgForm) {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmPresupuestoPMDatos)) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      this.enviarCancelar.emit();
    } else {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let presupuestoCopia = JSON.parse(JSON.stringify(this.presupuestoPM));
        presupuestoCopia.presuDetalle = this.presupuestoPM.presuDetalle;
        let parametro = {
          prdPresupuestoPescaMotivo: presupuestoCopia
        };
        this.presupuestoPMService.actualizarPresupuestoPMotivo(parametro, this, presupuestoCopia, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeActualizarPrespuestoMotivo(respuesta, presupuestoCopia) {
    this.cargando = false;
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      operacion: LS.ACCION_EDITAR,
      presupuestoCopia: presupuestoCopia
    };
    this.enviarAccion.emit(parametro);
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmPresupuestoPMDatos)) {
      this.enviarCancelar.emit();
    } else {
      switch (this.accion) {
        case LS.ACCION_EDITAR:
        case LS.ACCION_NUEVO:
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
