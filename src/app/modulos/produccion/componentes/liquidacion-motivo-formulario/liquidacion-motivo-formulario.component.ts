import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { NgForm } from '@angular/forms';
import { LS } from '../../../../constantes/app-constants';
import { PrdLiquidacionMotivoTO } from '../../../../entidadesTO/Produccion/PrdLiquidacionMotivoTO';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LiquidacionMotivoService } from '../../archivos/liquidacion-motivo/liquidacion-motivo.service';

@Component({
  selector: 'app-liquidacion-motivo-formulario',
  templateUrl: './liquidacion-motivo-formulario.component.html',
  styleUrls: ['./liquidacion-motivo-formulario.component.css']
})
export class LiquidacionMotivoFormularioComponent implements OnInit {

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
  public liquidacionMotivoTO: PrdLiquidacionMotivoTO = new PrdLiquidacionMotivoTO();

  @ViewChild("frmLiquidacionMotivosDatos") frmLiquidacionMotivosDatos: NgForm;
  public valoresIniciales: any;
  public liquidacionInicial: any;
  public constantes: any = LS;


  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private liquidacionMotivoService: LiquidacionMotivoService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.liquidacionMotivoTO = { ...this.parametros.liquidacionMotivoTO };
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
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmLiquidacionMotivosDatos ? this.frmLiquidacionMotivosDatos.value : null));
      this.liquidacionInicial = JSON.parse(JSON.stringify(this.liquidacionMotivoTO ? this.liquidacionMotivoTO : null));
    }, 50);
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.tituloForm = LS.ACCION_NUEVO + " " + LS.PRODUCCION_MOTIVO_LIQUIDACION;
        this.obtenerLiquidacion();
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.ACCION_CONSULTAR + " " + LS.PRODUCCION_MOTIVO_LIQUIDACION + ": Código: " + this.liquidacionMotivoTO.prdLiquidacionMotivoPK.lmCodigo;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.ACCION_EDITAR + " " + LS.PRODUCCION_MOTIVO_LIQUIDACION + ": Código: " + this.liquidacionMotivoTO.prdLiquidacionMotivoPK.lmCodigo;;
        break;
    }
  }

  obtenerLiquidacion() {
    this.cargando = true;
    this.liquidacionMotivoTO = new PrdLiquidacionMotivoTO();
    this.extraerValoresIniciales();
  }

  /**
 * Método para insertar un nuevo motivo de liquidación 
 *
 * @param {NgForm} form
 * @memberof LiquidacionMotivoComponent
 */
  insertarLiquidacionMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let liquidacionCopia = JSON.parse(JSON.stringify(this.liquidacionMotivoTO));
        liquidacionCopia.lmDetalle = this.liquidacionMotivoTO.lmDetalle;
        liquidacionCopia.prdLiquidacionMotivoPK.lmCodigo = this.liquidacionMotivoTO.prdLiquidacionMotivoPK.lmCodigo;
        liquidacionCopia.prdLiquidacionMotivoPK.lmEmpresa = this.empresaSeleccionada.empCodigo;
        liquidacionCopia.usrCodigo = this.auth.getCodigoUser();
        liquidacionCopia.usrEmpresa = null;
        liquidacionCopia.usrFechaInserta = null;
        let parametro = {
          prdLiquidacionMotivo: liquidacionCopia
        };
        this.liquidacionMotivoService.insertarLiquidacionMotivo(parametro, this, liquidacionCopia, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarLiquidacionMotivo(respuesta, liquidacionCopia) {
    this.cargando = false;
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      operacion: LS.ACCION_CREAR,
      liquidacionCopia: liquidacionCopia
    };
    this.enviarAccion.emit(parametro);
  }

  /**
   * Método para insertar una modificación de un motivo de liquidación seleccionado
   *
   * @param {NgForm} form
   * @memberof LiquidacionMotivoComponent
   */
  actualizarLiquidacionMotivo(form: NgForm) {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmLiquidacionMotivosDatos)) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      this.enviarCancelar.emit();
    } else {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let liquidacionCopia = JSON.parse(JSON.stringify(this.liquidacionMotivoTO));
        liquidacionCopia.lmDetalle = this.liquidacionMotivoTO.lmDetalle;
        let parametro = {
          prdLiquidacionMotivo: liquidacionCopia
        };
        this.liquidacionMotivoService.actualizarLiquidacionMotivo(parametro, this, liquidacionCopia, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeModificarLiquidacionMotivo(respuesta, liquidacionCopia) {
    this.cargando = false;
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      operacion: LS.ACCION_EDITAR,
      liquidacionCopia: liquidacionCopia
    };
    this.enviarAccion.emit(parametro);
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmLiquidacionMotivosDatos)) {
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
