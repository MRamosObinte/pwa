import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';
import { NgForm } from '@angular/forms';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { ConEstructuraTO } from '../../../../entidadesTO/contabilidad/ConEstructuraTO';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';

@Component({
  selector: 'app-plan-contable-formulario',
  templateUrl: './plan-contable-formulario.component.html',
  styleUrls: ['./plan-contable-formulario.component.css']
})
export class PlanContableFormularioComponent implements OnInit {

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
  public planContableTO: ConCuentasTO = new ConCuentasTO();
  public deshabilitarCampoCodigo: boolean = true;
  public tamanioEstructura: number = 0;
  public cuentaCodigo: any;
  public objetoTamaniosEstructura: ConEstructuraTO = new ConEstructuraTO();
  public listaResultado: Array<ConCuentasTO> = [];
  //EDITAR
  public index: number = 0;
  public modificarCodigoContable: number = 0;
  public codigoCuentaLlave: String = null;
  public objetoSeleccionado: ConCuentasTO = null;
  //
  @ViewChild("frmPlanContableDatos") frmPlanContableDatos: NgForm;
  public valoresIniciales: any;
  public planContableInicial: any;

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private planContableService: PlanContableService,
    private api: ApiRequestService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.planContableTO = this.parametros.planContableTO;
    this.deshabilitarCampoCodigo = this.parametros.deshabilitarCampoCodigo;
    this.tamanioEstructura = this.parametros.tamanioEstructura;
    this.cuentaCodigo = this.parametros.cuentaCodigo;
    this.objetoTamaniosEstructura = this.parametros.objetoTamaniosEstructura;
    this.listaResultado = this.parametros.listaResultado;
    this.operaciones();
    this.generarAtajosTeclado();
    this.extraerValoresIniciales();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmPlanContableDatos ? this.frmPlanContableDatos.value : null));
      this.planContableInicial = JSON.parse(JSON.stringify(this.planContableTO ? this.planContableTO : null));
    }, 60);
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
      case LS.ACCION_NUEVO:
        this.obtenerDatosPlanContableNuevo();
        this.tituloForm = LS.ACCION_NUEVO + LS.CONTABILIDAD_PLAN_CONTABLE;
        break;
      case LS.ACCION_EDITAR:
        this.obtenerDatosPlanContableEditar();
        this.tituloForm = LS.ACCION_EDITAR + LS.CONTABILIDAD_PLAN_CONTABLE + ": Código: " + this.planContableTO.cuentaCodigo;
        break;
      case LS.ACCION_CONSULTAR:
        this.obtenerDatosPlanContableConsultar();
        this.tituloForm = LS.ACCION_CONSULTAR + LS.CONTABILIDAD_PLAN_CONTABLE + ": Código: " + this.planContableTO.cuentaCodigo;
        break;
    }
  }


  /** Método que inicializa los valores para consultar un plan contable */
  obtenerDatosPlanContableConsultar() {
    this.planContableTO = this.parametros.planContableTO;
    this.objetoSeleccionado = this.parametros.objetoSeleccionado;
    this.planContableTO = new ConCuentasTO(this.objetoSeleccionado);
    this.planContableTO.cuentaDetalle = this.planContableTO.cuentaDetalle.trim();
    this.index = this.parametros.index;
    this.tamanioEstructura = this.parametros.tamanioEstructura;
    this.buscarConteoDetalle(this.objetoSeleccionado.cuentaCodigo);
  }

  /** Método que inicializa los valores para un nuevo plan contable */
  obtenerDatosPlanContableNuevo() {
    this.cargando = true;
    this.planContableTO = new ConCuentasTO();
    this.planContableTO.cuentaCodigo = this.cuentaCodigo;
    if (this.planContableTO.cuentaCodigo === 'NaN') {
      this.planContableTO.cuentaCodigo = '1';
    }
    this.cargando = false;
  }

  /** Método que inicializa los valores para editar un plan contable */
  obtenerDatosPlanContableEditar() {
    this.planContableTO = this.parametros.planContableTO;
    this.objetoSeleccionado = this.parametros.objetoSeleccionado;
    this.planContableTO = new ConCuentasTO(this.objetoSeleccionado);
    this.planContableTO.cuentaDetalle = this.planContableTO.cuentaDetalle.trim();
    this.index = this.parametros.index;
    this.tamanioEstructura = this.parametros.tamanioEstructura;
    this.buscarConteoDetalle(this.objetoSeleccionado.cuentaCodigo);
  }

  /** Metodo que inserta plan de cuenta */
  insertarPlanContable() {
    if (this.planContableTO.cuentaDetalle != null && this.planContableTO.cuentaDetalle != "") {
      if (this.empresaSeleccionada.listaSisPermisoTO.gruCrear) {
        if (this.planContableService.verificarPlanCuentaIngresadoCorrectamente(this.planContableTO.cuentaCodigo, this.objetoTamaniosEstructura)) {
          if (this.planContableService.buscarCuentaGrupo(this.listaResultado, this.planContableTO.cuentaCodigo, this.objetoTamaniosEstructura)) {
            let planCuentaCopia = JSON.parse(JSON.stringify(this.planContableTO));
            planCuentaCopia.cuentaDetalle = this.planContableService.formatoCapitalizado(this.planContableTO.cuentaDetalle, this.planContableTO.cuentaCodigo, this.tamanioEstructura);
            planCuentaCopia.empCodigo = this.empresaSeleccionada.empCodigo;
            planCuentaCopia.usrInsertaCuenta = this.auth.getCodigoUser();
            let objetoEnviar = { conCuentasTO: planCuentaCopia };
            this.cargando = true;
            this.planContableService.insertarPlanContable(objetoEnviar, this, LS.KEY_EMPRESA_SELECT);
          } else {
            this.toastr.warning(LS.MSJ_NO_CREAR_SIN_GRUPO, LS.TAG_AVISO);
          }
        } else {
          this.toastr.warning(LS.MSJ_PLAN_CUENTA_MAL_INGRESADO, LS.TAG_AVISO);
        }
      }
    } else {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.TAG_AVISO);
    }
  }

  despuesDeInsertarPlanContable(respuesta) {
    this.cargando = false;
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    let parametro = {
      operacion: LS.ACCION_NUEVO,
      planCuentaCopia: respuesta.extraInfo
    };
    this.enviarAccion.emit(parametro);
  }

  actualizarPlanContable() {
    if (this.planContableTO.cuentaDetalle != "") {
      if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmPlanContableDatos)) {
        this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
        this.enviarCancelar.emit();
      } else if (this.empresaSeleccionada.listaSisPermisoTO.gruModificar) {
        if (this.planContableService.verificarPlanCuentaIngresadoCorrectamente(this.planContableTO.cuentaCodigo, this.objetoTamaniosEstructura)) {
          let planCuentaCopia = JSON.parse(JSON.stringify(this.planContableTO));
          planCuentaCopia.cuentaDetalle = this.planContableService.formatoCapitalizado(this.planContableTO.cuentaDetalle, this.planContableTO.cuentaCodigo, this.tamanioEstructura);
          let objetoEnviar = { conCuentasTO: planCuentaCopia, codigoCambiarLlave: this.codigoCuentaLlave };
          this.cargando = true;
          this.planContableService.actualizarPlanContable(objetoEnviar, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.warning(LS.MSJ_PLAN_CUENTA_MAL_INGRESADO, 'Aviso');
        }
      }
    } else {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.TAG_AVISO);
    }
  }

  despuesDeActualizarPlanContable(respuesta) {
    this.cargando = false;
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    let parametro = {
      operacion: LS.ACCION_EDITAR,
      planCuentaCopia: respuesta.extraInfo
    };
    this.enviarAccion.emit(parametro);
  }

  /** Metodo que obtiene el conteo del detalle*/
  buscarConteoDetalle(cuentaCodigo): void {
    let objetoEnviar = { empCodigo: this.empresaSeleccionada.empCodigo, cuentaCodigo: cuentaCodigo }
    this.api.post("todocompuWS/contabilidadWebController/buscarConteoDetalleEliminarCuenta", objetoEnviar, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        this.setearDatosEditar(respuesta, cuentaCodigo);
      }).catch(err => this.utilService.handleError(err, this));
  }

  /** Metodo que se ejecuta despues de traer el conmteo detalle para saber si al editar se habilita o no el campo de codigo*/
  setearDatosEditar(respuesta, cuentaCodigo) {
    this.modificarCodigoContable = respuesta;
    this.modificarCodigoContable = this.estadoCuentaCodigo(cuentaCodigo) ? 1 : this.modificarCodigoContable;
    this.deshabilitarCampoCodigo = this.modificarCodigoContable === 0 ? false : true;
    this.codigoCuentaLlave = this.deshabilitarCampoCodigo ? '' : cuentaCodigo;
    this.activar = false;
  }

  estadoCuentaCodigo(cuentaCodigo): boolean {
    let contador = 0, indice = 0, estado = false;
    for (let i = 0; i < this.listaResultado.length; i++) {
      if (this.listaResultado[i].cuentaCodigo === cuentaCodigo.trim()) {
        if ((contador + 1) == this.listaResultado.length) {
          estado = false;
        } else {
          for (let j = contador + 1; j < this.listaResultado.length; j++) {
            indice = this.listaResultado[j].cuentaCodigo.lastIndexOf(cuentaCodigo.trim());
            if (indice >= 0) {
              estado = true;
              break;
            } else {
              estado = false;
            }
          }
        }
      }
      contador++;
    }
    return estado;
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmPlanContableDatos)) {
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
}
