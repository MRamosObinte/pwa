import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { LS } from '../../../../constantes/app-constants';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { FormaPagoService } from '../../archivo/forma-pago/forma-pago.service';
import { InvComprasFormaPagoTO } from '../../../../entidadesTO/inventario/InvComprasFormaPagoTO';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forma-pago-formulario',
  templateUrl: './forma-pago-formulario.component.html',
  styleUrls: ['./forma-pago-formulario.component.css']
})
export class FormaPagoFormularioComponent implements OnInit {

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
  // Cuenta
  public codigoCuenta: String = null;
  public tamanioEstructura: number = 0;
  //
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  //
  public invComprasFormaPagoTO: InvComprasFormaPagoTO = new InvComprasFormaPagoTO();
  public listaResultado: Array<InvComprasFormaPagoTO> = [];
  public indexTablaEditar: number = 0;
  //
  @ViewChild("frmFormaPagoDatos") frmFormaPagoDatos: NgForm;
  public valoresIniciales: any;
  public formaPagoInicial: any;

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private modalService: NgbModal,
    private sectorService: SectorService,
    private formaPagoService: FormaPagoService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.tamanioEstructura = this.parametros.tamanioEstructura;
    this.listaSectores = this.parametros.listaSectores;
    this.invComprasFormaPagoTO = { ...this.parametros.invComprasFormaPagoTO };
    this.operaciones();
    this.extraerValoresIniciales();
    this.generarAtajos();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmFormaPagoDatos ? this.frmFormaPagoDatos.value : null));
      this.formaPagoInicial = JSON.parse(JSON.stringify(this.invComprasFormaPagoTO ? this.invComprasFormaPagoTO : null));
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
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_FORMA_PAGO + ": Cuenta: " + this.invComprasFormaPagoTO.ctaCodigo;
        break;
      case LS.ACCION_EDITAR:
        this.obtenerDatoFormaPago();
        this.tituloForm = LS.TITULO_FORM_EDITAR_FORMA_PAGO + ": Cuenta: " + this.invComprasFormaPagoTO.ctaCodigo
        break;
    }
  }

  obtenerDatosFormaPagoNuevo() {
    this.cargando = true;
    this.invComprasFormaPagoTO = new InvComprasFormaPagoTO();
    this.sectorSeleccionado = this.listaSectores[0];
    this.tamanioEstructura = this.parametros.tamanioEstructura;
    this.cargando = false;
  }

  obtenerDatoFormaPagoConsulta() {
    this.cargando = true;
    this.invComprasFormaPagoTO = this.parametros.invComprasFormaPagoTO;
    this.codigoCuenta = this.invComprasFormaPagoTO.ctaCodigo;
    this.llenarCombo();
    this.cargando = false;
  }

  obtenerDatoFormaPago() {
    this.cargando = true;
    this.invComprasFormaPagoTO = this.parametros.invComprasFormaPagoTO;
    this.codigoCuenta = this.invComprasFormaPagoTO.ctaCodigo;
    this.listaResultado = this.parametros.listaResultado;
    this.llenarCombo();
    this.indexTablaEditar = this.invComprasFormaPagoTO.fpSecuencial ? this.listaResultado.findIndex(item => item.fpSecuencial === this.invComprasFormaPagoTO.fpSecuencial) :
      this.listaResultado.findIndex(item => item.ctaCodigo === this.invComprasFormaPagoTO.ctaCodigo);
    this.cargando = false;
  }

  insertarInvComprasFormaPagoTO(form: NgForm) {
    if (this.formaPagoService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invComprasFormaPagoCopia = JSON.parse(JSON.stringify(this.invComprasFormaPagoTO));
        this.setearValoresInvComprasFormaPago(invComprasFormaPagoCopia);
        let parametro = {
          accionChar: 'I',
          invComprasFormaPagoCopia: invComprasFormaPagoCopia
        };
        this.cargando = false;
        this.enviarAccion.emit(parametro);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  actualizarInvComprasFormaPagoTO(form: NgForm) {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmFormaPagoDatos)) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      this.enviarCancelar.emit();
    } else {
      if (this.formaPagoService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          let invComprasFormaPagoCopia = JSON.parse(JSON.stringify(this.invComprasFormaPagoTO));
          this.setearValoresInvComprasFormaPago(invComprasFormaPagoCopia);
          let parametro = {
            accionChar: 'M',
            invComprasFormaPagoCopia: invComprasFormaPagoCopia,
            indexTablaEditar: this.indexTablaEditar
          };
          this.cargando = false;
          this.enviarAccion.emit(parametro);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    }
  }

  setearValoresInvComprasFormaPago(invComprasFormaPagoTO) {
    invComprasFormaPagoTO.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
    invComprasFormaPagoTO.usrCodigo = this.auth.getCodigoUser();
    invComprasFormaPagoTO.secCodigo = this.sectorSeleccionado.secCodigo;
  }

  llenarCombo() {
    this.sectorSeleccionado = this.formaPagoService.seleccionarSector(this.listaSectores, this.invComprasFormaPagoTO.secCodigo);
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

  //BUSQUEDAS
  /** Metodo que muestra un modal de todas las cuentas que coincidan con lo que se ingreso en el input de cuenta */
  buscarConCuentas(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      let fueBuscado = (this.invComprasFormaPagoTO.ctaCodigo === this.codigoCuenta && this.invComprasFormaPagoTO.ctaCodigo && this.codigoCuenta);
      if (!fueBuscado) {
        this.invComprasFormaPagoTO.ctaCodigo = this.invComprasFormaPagoTO.ctaCodigo === '' ? null : this.invComprasFormaPagoTO.ctaCodigo;
        this.invComprasFormaPagoTO.ctaCodigo = this.invComprasFormaPagoTO.ctaCodigo ? this.invComprasFormaPagoTO.ctaCodigo.toUpperCase() : null;
        if (this.invComprasFormaPagoTO.ctaCodigo) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.invComprasFormaPagoTO.ctaCodigo, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', backdrop: 'static' });
          modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
          modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
          modalRef.result.then((result) => {
            this.codigoCuenta = result ? result.cuentaCodigo : null;
            this.invComprasFormaPagoTO.ctaCodigo = result ? result.cuentaCodigo : null;
            this.invComprasFormaPagoTO.fpDetalle = result ? (result.cuentaDetalle.trim()).toUpperCase() : null;
            document.getElementById('cuenta').focus();
          }, (reason) => {//Cuando se cierra sin un dato
            let element: HTMLElement = document.getElementById('cuenta') as HTMLElement;
            element ? element.focus() : null;
          });
        }
      }
    }
  }

  //VALIDACIONES
  /** Metodo para validar si el input la cuenta es correcto y no se envie otro codigo*/
  validarCuenta() {
    if (this.codigoCuenta !== this.invComprasFormaPagoTO.ctaCodigo) {
      this.codigoCuenta = null;
      this.invComprasFormaPagoTO.ctaCodigo = null;
    }
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmFormaPagoDatos)) {
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

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }
}
