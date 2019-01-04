import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LS } from '../../../../constantes/app-constants';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { CarPagosCobrosFormaTO } from '../../../../entidadesTO/cartera/CarPagosCobrosFormaTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FormaPagoService } from '../../archivo/forma-pago/forma-pago.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';

@Component({
  selector: 'app-forma-pago-formulario-cartera',
  templateUrl: './forma-pago-formulario-cartera.component.html',
  styleUrls: ['./forma-pago-formulario-cartera.component.css']
})
export class FormaPagoFormularioCarteraComponent implements OnInit {
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarAccion = new EventEmitter();
  @Input() parametros;
  //
  public accion: string = null;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activarFormulario: boolean = false;
  public tituloForm: string = "";
  public constantes: any = LS;
  // Cuenta
  public codigoCuenta: String = null;
  public tamanioEstructura: number = 0;
  //Sector
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  //
  public formaPago: CarPagosCobrosFormaTO = new CarPagosCobrosFormaTO();
  //
  public listaResultado: Array<CarPagosCobrosFormaTO> = [];

  @ViewChild("frmFormaPagoDatos") frmFormaPagoDatos: NgForm;
  public valoresIniciales: any;

  constructor(
    private formaPagoService: FormaPagoService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private modalService: NgbModal,
    private sectorService: SectorService,
  ) { }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.tamanioEstructura = this.parametros.tamanioEstructura;
    this.listaSectores = this.parametros.listaSectores;
    this.listaResultado = this.parametros.listaResultado;
    this.activarFormulario = this.parametros.activar;
    this.operaciones();
    this.extraerValoresIniciales();
    this.generarAtajos();
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarFormulario') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarFormaPago') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmFormaPagoDatos ? this.frmFormaPagoDatos.value : null));
    }, 60);
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.tituloForm = LS.TITULO_FORM_NUEVO_FORMA_PAGO;
        this.obtenerDatosFormaPagoNuevo();
        break;
      case LS.ACCION_CONSULTAR:
        this.obtenerDatoFormaPagoConsulta();
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_FORMA_PAGO;
        break;
      case LS.ACCION_EDITAR:
        this.obtenerDatoFormaPago();
        this.tituloForm = LS.TITULO_FORM_EDITAR_FORMA_PAGO
        break;
    }
  }

  obtenerDatosFormaPagoNuevo() {
    this.cargando = true;
    this.formaPago = new CarPagosCobrosFormaTO();
    this.sectorSeleccionado = this.listaSectores[0];
    this.tamanioEstructura = this.parametros.tamanioEstructura;
    this.cargando = false;
  }

  obtenerDatoFormaPagoConsulta() {
    this.cargando = true;
    this.formaPago = { ...this.parametros.formaPago };
    this.codigoCuenta = this.formaPago.ctaCodigo;
    this.llenarCombo();
    this.cargando = false;
  }

  obtenerDatoFormaPago() {
    this.cargando = true;
    this.formaPago = { ...this.parametros.formaPago };
    this.codigoCuenta = this.formaPago.ctaCodigo;
    this.llenarCombo();
    this.cargando = false;
  }

  llenarCombo() {
    this.sectorSeleccionado = this.formaPagoService.seleccionarSector(this.listaSectores, this.formaPago.secCodigo);
  }

  insertarFormaPago(form: NgForm) {
    if (this.formaPagoService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let formaPagoCopia = JSON.parse(JSON.stringify(this.formaPago));
        this.setearValoresInvComprasFormaPago(formaPagoCopia);
        let parametro = { accion: 'I', carPagosCobrosFormaTO: formaPagoCopia };
        this.formaPagoService.accionCarPagosForma(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  modificarFormaPago(form: NgForm) {
    if (this.formaPagoService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let formaPagoCopia = JSON.parse(JSON.stringify(this.formaPago));
        this.setearValoresInvComprasFormaPago(formaPagoCopia);
        let parametro = { accion: 'U', carPagosCobrosFormaTO: formaPagoCopia };
        this.formaPagoService.accionCarPagosForma(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeAccionCarPagosForma(respuesta) {
    this.cargando = false;
    if (respuesta) {
      if (this.accion === LS.ACCION_CREAR) {
        respuesta.formaPago.fpSecuencial = respuesta.extraInfo.fpSecuencial;
        this.enviarAccion.emit({ accion: LS.ACCION_CREADO, formaPago: respuesta.formaPago, tipo: 'I' });
      } else {
        this.enviarAccion.emit({ accion: LS.ACCION_CREADO, formaPago: respuesta.formaPago, tipo: 'M' });
      }
    }
  }

  setearValoresInvComprasFormaPago(formaPago) {
    formaPago.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
    formaPago.usrCodigo = this.auth.getCodigoUser();
    formaPago.secCodigo = this.sectorSeleccionado.secCodigo;
  }


  /** Metodo para listar los sectores dependiendo de la empresa*/
  listarSectores() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarSectores()*/
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listarSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  //BUSQUEDAS
  /** Metodo que muestra un modal de todas las cuentas que coincidan con lo que se ingreso en el input de cuenta */
  buscarConCuentas(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      let fueBuscado = (this.formaPago.ctaCodigo === this.codigoCuenta && this.formaPago.ctaCodigo && this.codigoCuenta);
      if (!fueBuscado) {
        this.formaPago.ctaCodigo = this.formaPago.ctaCodigo === '' ? null : this.formaPago.ctaCodigo;
        this.formaPago.ctaCodigo = this.formaPago.ctaCodigo ? this.formaPago.ctaCodigo.toUpperCase() : null;
        if (this.formaPago.ctaCodigo) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.formaPago.ctaCodigo, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', backdrop: 'static' });
          modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
          modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
          modalRef.result.then((result) => {
            this.codigoCuenta = result ? result.cuentaCodigo : null;
            this.formaPago.ctaCodigo = result ? result.cuentaCodigo : null;
            this.formaPago.fpDetalle = result ? (result.cuentaDetalle.trim()).toUpperCase() : null;
            this.focusSector();
          }, (reason) => {//Cuando se cierra sin un dato
            this.focusCuenta();
          });
        }
      }
    }
  }

  focusCuenta() {
    let element: HTMLElement = document.getElementById('cuenta') as HTMLElement;
    element ? element.focus() : null;
  }

  focusSector() {
    let element: HTMLElement = document.getElementById('sector') as HTMLElement;
    element ? element.focus() : null;
  }

  //VALIDACIONES
  /** Metodo para validar si el input la cuenta es correcto y no se envie otro codigo*/
  validarCuenta() {
    if (this.codigoCuenta !== this.formaPago.ctaCodigo) {
      this.codigoCuenta = null;
      this.formaPago.ctaCodigo = null;
    }
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmFormaPagoDatos)) {
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
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
              this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
            }
          });
          break;
        default:
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
      }
    }
  }

  cambiarActivar() {
    this.activarFormulario = !this.activarFormulario;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: this.activarFormulario });
  }
}
