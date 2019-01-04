import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { PiscinaService } from '../../archivos/piscina/piscina.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { PlanContableService } from '../../../contabilidad/archivo/plan-contable/plan-contable.service';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { PrdPiscinaTO } from '../../../../entidadesTO/Produccion/PrdPiscinaTO';

@Component({
  selector: 'app-piscina-formulario',
  templateUrl: './piscina-formulario.component.html',
  styleUrls: ['./piscina-formulario.component.css']
})
export class PiscinaFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() listaSectores: Array<PrdListaSectorTO>;
  /**
   * parametros debe incluir: --> accion: (nuevo, editar, consulta)
   *                          --> objetoSeleccionado: (El seleccionado de la lista)
   */
  @Input() parametros;
  @Output() enviarCancelar = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  //
  public constantes: any = LS;
  public accion: string = null;
  public rptaCedula: string = null;
  public rptaRepetido: string = null;
  public piscina: PrdPiscinaTO;
  public piscinaRespaldo: PrdPiscinaTO;
  public sectorSeleccionado: PrdListaSectorTO;
  public piscinaSeleccionada: PrdListaPiscinaTO;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public tituloForm: string = LS.TITULO_FILTROS;
  @ViewChild("frmPiscinaDatos") frmPiscinaDatos: NgForm;
  public valoresIniciales: any;
  public piscinaInicial: any;//
  public tamanioEstructura: number = -1;
  public maxLengthDirecto: boolean = true;
  public maxLengthIndirecto: boolean = true;
  public maxLengthTransferencia: boolean = true;
  public maxLengthProductoTerminado: boolean = true;
  public cuentaDetalle: any = {};

  constructor(
    private piscinaService: PiscinaService,
    private planContableService: PlanContableService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.sectorSeleccionado = this.parametros.sectorSeleccionado;
    this.piscinaSeleccionada = this.parametros.piscinaSeleccionada;
    this.piscina = new PrdPiscinaTO();
    this.actuarSegunAccion();
    if (this.tamanioEstructura === -1) {
      this.buscarEstructuraEmpresa();
    }
    this.definirAtajosDeTeclado();
  }

  actuarSegunAccion() {
    switch (this.accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        this.obtenerPiscina();
        break;
    }
  }

  soloNumeros(event) {
    return event.charCode >= 48 && event.charCode <= 57
  }

  buscarEstructuraEmpresa() {
    switch (this.accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_EDITAR:
        this.obtenerTamanioEstructura();
        break;
    }
  }

  obtenerTamanioEstructura() {
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.planContableService.getTamanioListaConEstructura(parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => { this.utilService.handleError(err, this); });
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmPiscinaDatos ? this.frmPiscinaDatos.value : null));
      this.piscinaInicial = JSON.parse(JSON.stringify(this.piscina ? this.piscina : null));
    }, 50);
  }


  obtenerPiscina() {
    this.cargando = true;
    this.obtenerTituloFormulario();
    this.piscina = this.convertirPrdListaPiscinaTOAPrdPiscina();
    this.cargando = false;
    this.buscarPlanCuentas();
    this.extraerValoresIniciales();
  }

  obtenerTituloFormulario() {
    switch (this.accion) {
      case LS.ACCION_NUEVO:
        this.tituloForm = LS.TITULO_FORM_NUEVA_PISCINA;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.TITULO_FORM_EDITAR_PISCINA;
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_PISCINA;
        break;
    }
  }

  buscarPlanCuentas() {
    if (this.accion === LS.ACCION_EDITAR || this.accion === LS.ACCION_CONSULTAR) {
      if (this.piscina.ctaCostoDirecto) {
        let parametroBusquedaConCuentas = {
          empresa: LS.KEY_EMPRESA_SELECT,
          buscar: this.piscina.ctaCostoDirecto
        };
        this.planContableService
          .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
          .then(data => {
            if (data.length != 0) {
              this.cuentaDetalle.directo = data[0];
            }
          });
      }
      if (this.piscina.ctaCostoIndirecto) {
        let parametroBusquedaConCuentas = {
          empresa: LS.KEY_EMPRESA_SELECT,
          buscar: this.piscina.ctaCostoIndirecto
        };
        this.planContableService
          .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
          .then(data => {
            if (data.length != 0) {
              this.cuentaDetalle.indirecto = data[0];
            }
          });
      }
      if (this.piscina.ctaCostoProductoTerminado) {
        let parametroBusquedaConCuentas = {
          empresa: LS.KEY_EMPRESA_SELECT,
          buscar: this.piscina.ctaCostoProductoTerminado
        };
        this.planContableService
          .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
          .then(data => {
            if (data.length != 0) {
              this.cuentaDetalle.productoterminado = data[0];
            }
          });
      }

      if (this.piscina.ctaCostoTransferencia) {
        let parametroBusquedaConCuentas = {
          empresa: LS.KEY_EMPRESA_SELECT,
          buscar: this.piscina.ctaCostoTransferencia
        };
        this.planContableService
          .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
          .then(data => {
            if (data.length != 0) {
              this.cuentaDetalle.transferencia = data[0];
            }
          });
      }
    }
  }

  buscarPlanCuentasTipo(tipo) {
    if (this.accion === LS.ACCION_EDITAR || this.accion === LS.ACCION_NUEVO) {
      switch (tipo) {
        case 'D':
          if (this.piscina.ctaCostoDirecto) {
            let parametroBusquedaConCuentas = {
              empresa: LS.KEY_EMPRESA_SELECT,
              buscar: this.piscina.ctaCostoDirecto
            };
            this.planContableService
              .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
              .then(data => {
                if (data.length != 0) {
                  this.cuentaDetalle.directo = data[0];
                } else {
                  if (this.cuentaDetalle.directo) {
                    this.cuentaDetalle.directo.cuentaCodigo = "";
                    this.cuentaDetalle.directo.cuentaDetalle = "";
                  }
                  this.piscina.ctaCostoDirecto = "";
                }
              });
          }
          break;
        case 'I':
          if (this.piscina.ctaCostoIndirecto) {
            let parametroBusquedaConCuentas = {
              empresa: LS.KEY_EMPRESA_SELECT,
              buscar: this.piscina.ctaCostoIndirecto
            };
            this.planContableService
              .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
              .then(data => {
                if (data.length != 0) {
                  this.cuentaDetalle.indirecto = data[0];
                } else {
                  if (this.cuentaDetalle.indirecto) {
                    this.cuentaDetalle.indirecto.cuentaCodigo = "";
                    this.cuentaDetalle.indirecto.cuentaDetalle = "";
                  }
                  this.piscina.ctaCostoIndirecto = "";
                }
              });
          }
          break;
        case 'T':
          if (this.piscina.ctaCostoTransferencia) {
            let parametroBusquedaConCuentas = {
              empresa: LS.KEY_EMPRESA_SELECT,
              buscar: this.piscina.ctaCostoTransferencia
            };
            this.planContableService
              .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
              .then(data => {
                if (data.length != 0) {
                  this.cuentaDetalle.transferencia = data[0];
                } else {
                  if (this.cuentaDetalle.transferencia) {
                    this.cuentaDetalle.transferencia.cuentaCodigo = "";
                    this.cuentaDetalle.transferencia.cuentaDetalle = "";
                  }
                  this.piscina.ctaCostoTransferencia = "";
                }
              });
          }
          break;
        case 'P':
          if (this.piscina.ctaCostoProductoTerminado) {
            let parametroBusquedaConCuentas = {
              empresa: LS.KEY_EMPRESA_SELECT,
              buscar: this.piscina.ctaCostoProductoTerminado
            };
            this.planContableService
              .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
              .then(data => {
                if (data.length != 0) {
                  this.cuentaDetalle.productoterminado = data[0];
                } else {
                  if (this.cuentaDetalle.productoterminado) {
                    this.cuentaDetalle.productoterminado.cuentaCodigo = "";
                    this.cuentaDetalle.productoterminado.cuentaDetalle = "";
                  }
                  this.piscina.ctaCostoProductoTerminado = "";
                }
              });
          }
          break;
      }
    }
  }

  validarCuenta(tipo) {
    switch (tipo) {
      case 'D':
        if (this.piscina.ctaCostoDirecto.length === this.tamanioEstructura) {
          this.buscarPlanCuentasTipo('D');
        } else {
          if (this.cuentaDetalle.directo) {
            this.cuentaDetalle.directo.cuentaCodigo = "";
            this.cuentaDetalle.directo.cuentaDetalle = "";
          }
          this.piscina.ctaCostoDirecto = "";
        }
        this.validarRequiredCuentas();
        break;
      case 'I':
        if (this.piscina.ctaCostoIndirecto.length === this.tamanioEstructura) {
          this.buscarPlanCuentasTipo('I');
        } else {
          if (this.cuentaDetalle.indirecto) {
            this.cuentaDetalle.indirecto.cuentaCodigo = "";
            this.cuentaDetalle.indirecto.cuentaDetalle = "";
          }
          this.piscina.ctaCostoIndirecto = "";
        }
        this.validarRequiredCuentas();
        break;
      case 'T':
        if (this.piscina.ctaCostoTransferencia.length === this.tamanioEstructura) {
          this.buscarPlanCuentasTipo('T');
        } else {
          if (this.cuentaDetalle.transferencia) {
            this.cuentaDetalle.transferencia.cuentaCodigo = "";
            this.cuentaDetalle.transferencia.cuentaDetalle = "";
          }
          this.piscina.ctaCostoTransferencia = "";
        }
        this.validarRequiredCuentas();
        break;
      case 'P':
        if (this.piscina.ctaCostoProductoTerminado.length === this.tamanioEstructura) {
          this.buscarPlanCuentasTipo('P');
        } else {
          if (this.cuentaDetalle.productoterminado) {
            this.cuentaDetalle.productoterminado.cuentaCodigo = "";
            this.cuentaDetalle.productoterminado.cuentaDetalle = "";
          }
          this.piscina.ctaCostoProductoTerminado = "";
        }
        this.validarRequiredCuentas();
        break;
    }
  }

  convertirPrdListaPiscinaTOAPrdPiscina(): PrdPiscinaTO {
    let predPiscina = new PrdPiscinaTO(this.piscinaSeleccionada);
    predPiscina.pisEmpresa = LS.KEY_EMPRESA_SELECT;
    predPiscina.secEmpresa = LS.KEY_EMPRESA_SELECT;
    predPiscina.secCodigo = this.sectorSeleccionado.secCodigo;
    predPiscina.usrEmpresa = this.empresaSeleccionada.empCodigo;
    predPiscina.usrCodigo = this.empresaSeleccionada.empSmtpUserName;
    predPiscina.usrFechaInsertaPiscina = (new Date()).toDateString();
    return predPiscina;
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.piscinaService.verificarPermiso(accion, this, mostraMensaje);
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      if (this.accion !== null) {
        this.cancelar();
      }
      return false;
    }))
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmPiscinaDatos) && this.utilService.compararObjetos(this.piscinaInicial, this.piscina);
  }

  insertarPiscina(form: NgForm) {
    if (this.piscinaService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.piscina.secCodigo = this.sectorSeleccionado.secCodigo;
        this.piscina.pisSector = this.sectorSeleccionado.secCodigo;
        this.piscina.pisActiva = true;
        let parametro = {
          prdPiscina: this.piscina
        }
        this.piscinaService.insertarPiscina(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarPiscina(data) {
    this.cargando = false;
    if (data) {
      this.enviarCancelar.emit({ piscina: this.piscina, accion: LS.ACCION_NUEVO });
    }
  }

  actualizarPiscina(form: NgForm) {
    if (!this.sePuedeCancelar()) {
      this.cargando = true;
      if (this.piscinaService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          this.piscina.secCodigo = this.sectorSeleccionado.secCodigo;
          this.piscina.pisSector = this.sectorSeleccionado.secCodigo;
          let parametro = {
            prdPiscinaTO: this.piscina
          }
          this.piscinaService.modificarPiscina(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    } else {
      let parametro = {
        empresa: this.empresaSeleccionada,
        accion: LS.ACCION_REGISTRO_NO_EXITOSO,
        piscina: this.piscinaSeleccionada
      }
      this.enviarCancelar.emit(parametro);
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
    }
  }

  despuesDeModificarPiscina(data) {
    this.cargando = false;
    this.enviarCancelar.emit({ piscina: this.piscina, accion: this.accion });
  }

  cancelar() {
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_REGISTRO_NO_EXITOSO,
      accionPiscina: this.accion,
      piscina: this.piscinaSeleccionada
    }
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_NUEVO:
        if (this.sePuedeCancelar()) {
          this.accion = null;
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
              this.accion = null;
              this.enviarCancelar.emit(parametro);
            }
          });
        }
        break;
      default:
        this.accion = null;
        this.enviarCancelar.emit(parametro);
        break;
    }
  }
  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }

  buscarConfiguracionDeCuentas(event, cuenta, tipo) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && cuenta) {
      let parametroBusquedaConCuentas = {
        empresa: LS.KEY_EMPRESA_SELECT,
        buscar: cuenta
      };
      switch (tipo) {
        case 'D':
          if (this.piscina.ctaCostoDirecto && this.piscina.ctaCostoDirecto.length <= this.tamanioEstructura) {
            this.abrirModalDeCuentas(event, parametroBusquedaConCuentas, tipo);
          }
          break;
        case 'I':
          if (this.piscina.ctaCostoIndirecto && this.piscina.ctaCostoIndirecto.length <= this.tamanioEstructura) {
            this.abrirModalDeCuentas(event, parametroBusquedaConCuentas, tipo);
          }
          break;
        case 'T':
          if (this.piscina.ctaCostoTransferencia && this.piscina.ctaCostoTransferencia.length <= this.tamanioEstructura) {
            this.abrirModalDeCuentas(event, parametroBusquedaConCuentas, tipo);
          }
          break;
        case 'P':
          if (this.piscina.ctaCostoProductoTerminado && this.piscina.ctaCostoProductoTerminado.length <= this.tamanioEstructura) {
            this.abrirModalDeCuentas(event, parametroBusquedaConCuentas, tipo);
          }
          break;
      }
    }
  }

  abrirModalDeCuentas(event, parametroBusquedaConCuentas, tipo) {
    event.srcElement.blur();
    event.preventDefault();
    const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
    modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
    modalRef.result.then((result) => {
      if (result) {
        switch (tipo) {
          case 'D':
            this.cuentaDetalle.directo = result;
            this.piscina.ctaCostoDirecto = result.cuentaCodigo;
            this.validarRequiredCuentas();
            document.getElementById('indirecto').focus();
            break;
          case 'I':
            this.cuentaDetalle.indirecto = result;
            this.piscina.ctaCostoIndirecto = result.cuentaCodigo;
            this.validarRequiredCuentas();
            document.getElementById('transferencia').focus();
            break;
          case 'T':
            this.cuentaDetalle.transferencia = result;
            this.piscina.ctaCostoTransferencia = result.cuentaCodigo;
            this.validarRequiredCuentas();
            document.getElementById('terminado').focus();
            break;
          case 'P':
            this.cuentaDetalle.productoterminado = result;
            this.piscina.ctaCostoProductoTerminado = result.cuentaCodigo;
            this.validarRequiredCuentas();
            break;
        }
      }
    }, () => {
    });
  }

  validarRequiredCuentas() {
    this.maxLengthDirecto = this.piscina.ctaCostoDirecto ? false : true;
    this.maxLengthIndirecto = this.piscina.ctaCostoIndirecto ? false : true;
    this.maxLengthTransferencia = this.piscina.ctaCostoTransferencia ? false : true;
    this.maxLengthProductoTerminado = this.piscina.ctaCostoProductoTerminado ? false : true;
  }
}
