import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdPreLiquidacionMotivoTO } from '../../../../entidadesTO/Produccion/PrdPreLiquidacionMotivoTO';
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { PreLiquidacionMotivoService } from '../../archivos/pre-liquidacion-motivo/pre-liquidacion-motivo.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-pre-liquidacion-motivo-formulario',
  templateUrl: './pre-liquidacion-motivo-formulario.component.html',
  styleUrls: ['./pre-liquidacion-motivo-formulario.component.css']
})
export class PreLiquidacionMotivoFormularioComponent implements OnInit {

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
  public preliquidacionMotivoTO: PrdPreLiquidacionMotivoTO = new PrdPreLiquidacionMotivoTO();
  //
  @ViewChild("frmPreLiquidacionMotivosDatos") frmPreLiquidacionMotivosDatos: NgForm;
  public valoresIniciales: any;
  public preLiquidacionInicial: any;
  public constantes: any = LS;

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private preLiquidacionService: PreLiquidacionMotivoService,
    private atajoService: HotkeysService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.preliquidacionMotivoTO = { ...this.parametros.preliquidacionMotivoTO };
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
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmPreLiquidacionMotivosDatos ? this.frmPreLiquidacionMotivosDatos.value : null));
      this.preLiquidacionInicial = JSON.parse(JSON.stringify(this.preliquidacionMotivoTO ? this.preliquidacionMotivoTO : null));
    }, 50);
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmPreLiquidacionMotivosDatos) && this.utilService.compararObjetos(this.preLiquidacionInicial, this.preliquidacionMotivoTO);
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.tituloForm = LS.ACCION_NUEVO + " " + LS.PRODUCCION_MOTIVO_PRE_LIQUIDACION;
        this.obtenerPreLiquidacion();
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.ACCION_CONSULTAR + " " + LS.PRODUCCION_MOTIVO_PRE_LIQUIDACION + ": Código: " + this.preliquidacionMotivoTO.prdPreLiquidacionMotivoPK.plmCodigo;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.ACCION_EDITAR + " " + LS.PRODUCCION_MOTIVO_PRE_LIQUIDACION + ": Código: " + this.preliquidacionMotivoTO.prdPreLiquidacionMotivoPK.plmCodigo;;
        break;
    }
  }

  obtenerPreLiquidacion() {
    this.cargando = true;
    this.preliquidacionMotivoTO = new PrdPreLiquidacionMotivoTO();
    this.extraerValoresIniciales();
  }


  insertarPrdPreLiquidacionMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let liquidacionCopia = JSON.parse(JSON.stringify(this.preliquidacionMotivoTO));
        liquidacionCopia.plmDetalle = this.preliquidacionMotivoTO.plmDetalle;
        liquidacionCopia.prdPreLiquidacionMotivoPK.plmCodigo = this.preliquidacionMotivoTO.prdPreLiquidacionMotivoPK.plmCodigo;
        liquidacionCopia.prdPreLiquidacionMotivoPK.plmEmpresa = this.empresaSeleccionada.empCodigo;
        liquidacionCopia.usrCodigo = this.auth.getCodigoUser();
        liquidacionCopia.usrEmpresa = null;
        liquidacionCopia.usrFechaInserta = null;
        delete liquidacionCopia.id
        let parametro = {
          prdPreLiquidacionMotivo: liquidacionCopia
        };
        this.preLiquidacionService.insertarPrdPreLiquidacionMotivo(parametro, this, liquidacionCopia, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarPreLiquidacionMotivo(respuesta, liquidacionCopia) {
    this.cargando = false;
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      operacion: LS.ACCION_CREAR,
      liquidacionCopia: liquidacionCopia
    };
    this.enviarAccion.emit(parametro);
  }

  actualizarPreLiquidacionMotivo(form: NgForm) {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmPreLiquidacionMotivosDatos)) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      this.enviarCancelar.emit();
    } else {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let liquidacionCopia = JSON.parse(JSON.stringify(this.preliquidacionMotivoTO));
        liquidacionCopia.plmDetalle = this.preliquidacionMotivoTO.plmDetalle;
        let parametro = {
          prdPreLiquidacionMotivo: liquidacionCopia
        };
        this.preLiquidacionService.actualizarPreLiquidacionMotivo(parametro, this, liquidacionCopia, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeActualizarPreLiquidacionMotivo(respuesta, liquidacionCopia) {
    this.cargando = false;
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      operacion: LS.ACCION_EDITAR,
      liquidacionCopia: liquidacionCopia
    };
    this.enviarAccion.emit(parametro);
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmPreLiquidacionMotivosDatos)) {
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
