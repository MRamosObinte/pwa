import { Component, OnInit, Input, Output, OnChanges, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhPrestamoMotivo } from '../../../../entidades/rrhh/RhPrestamoMotivo';
import { RhComboFormaPagoTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoTO';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { PrestamosService } from '../../transacciones/prestamos/prestamos.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpleadosListadoComponent } from '../empleados-listado/empleados-listado.component';
import { ImprimirComponent } from '../../../../componentesgenerales/imprimir/imprimir.component';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';
import { NgForm } from '@angular/forms';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import * as moment from 'moment';
import { ContableListadoService } from '../../../contabilidad/transacciones/contable-listado/contable-listado.service';
import { RhPrestamo } from '../../../../entidades/rrhh/RhPrestamo';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';

@Component({
  selector: 'app-prestamo-formulario',
  templateUrl: './prestamo-formulario.component.html'
})
export class PrestamoFormularioComponent implements OnInit, OnChanges {
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() parametrosFormulario: any = {};
  @Output() enviarAccion = new EventEmitter();
  @Input() formasDePago: Array<RhComboFormaPagoTO> = new Array();
  @Input() esContable: boolean = false;
  @Input() conContable: ConContable = new ConContable();
  @Input() tipoSeleccionado: ConTipoTO = new ConTipoTO();
  @Input() data: any = {};
  @Input() titulo: string = LS.RRHH_NUEVO_PRESTAMO;

  public constantes: any = LS;
  public innerWidth: number;
  public accion: string = null;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public vistaFormulario: boolean = false;
  public configAutonumericEnteros: AppAutonumeric;
  public configAutonumericReales: AppAutonumeric;
  public es: object = {};
  //contable
  public fechaContableValido: boolean = true;
  public conContableCopia: any;
  //
  @Input() listaPrestamoMotivo: Array<RhPrestamoMotivo> = []; // motivo
  public prestamoMotivoSeleccionado: RhPrestamoMotivo = new RhPrestamoMotivo();
  @Input() listaFormaPago: Array<RhComboFormaPagoTO> = new Array();
  public rhComboFormaPagoTO: RhComboFormaPagoTO = new RhComboFormaPagoTO();
  @Input() rhPrestamo: RhPrestamo = new RhPrestamo();
  public fechaActual: Date = new Date();
  public fechaHasta: Date = new Date();
  public codigoEmpleado: string = null;
  //Documento
  public documentoValido: boolean = true;
  public reversar: boolean = false;
  //contable
  public estadoContableAMayorizar: boolean = false;
  public puedeEditarTabla: boolean = false;

  @ViewChild("frmDatos") frmDatos: NgForm;
  public valoresIniciales: any;

  constructor(
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private modalService: NgbModal,
    private prestamoService: PrestamosService,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private contableService: ContableListadoService
  ) { }

  ngOnInit() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.obtenerFechaInicioActualMes();
    this.configAutonumericReales = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '999999999',
      minimumValue: "0.1"
    }
    this.configAutonumericEnteros = {
      decimalPlaces: 0,
      decimalPlacesRawValue: 0,
      decimalPlacesShownOnBlur: 0,
      decimalPlacesShownOnFocus: 0,
      maximumValue: '999999999',
      minimumValue: '0'
    };
    this.conContableCopia = this.esContable ? { ...this.conContable } : new ConContable();
    this.puedeEditarTabla = !this.esContable || this.data.accion === LS.ACCION_MAYORIZAR;
    this.esContable ? this.seleccionarCombos() : null;
    this.accion = this.esContable ? this.data.accion : this.accion;
  }

  ngOnChanges(changes) {
    this.generarAtajos();
    if (changes.parametrosFormulario && changes.parametrosFormulario.currentValue) {
      this.empresaSeleccionada = this.parametrosFormulario.empresaSeleccionada;
      this.cambiarEmpresaSeleccionada();
    }
  }

  accionesBotones(event) {//recepcion de metodos
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.activar = false;
        this.cancelar();
        break;
      case LS.ACCION_MAYORIZAR:
        if (!this.fechaContableValido) {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        } else {
          this.estadoContableAMayorizar = event.estado;
          this.mayorizar(this.frmDatos);
        }
        break;
      case LS.ACCION_IMPRIMIR:
        this.enviarAccion.emit({ accion: LS.ACCION_IMPRIMIR });
        break;
      case LS.ACCION_ANULAR:
        this.enviarAccion.emit({ accion: LS.ACCION_ANULAR });
        break;
      case LS.ACCION_ELIMINAR:
        this.enviarAccion.emit({ accion: LS.ACCION_ELIMINAR });
        break;
      case LS.ACCION_REVERSAR:
        this.enviarAccion.emit({ accion: LS.ACCION_REVERSAR });
        break;
    }
  }

  seleccionarCombos() {
    this.reversar = this.rhPrestamo.preValor < 0 ? true : false;
    this.rhPrestamo.preValor = Math.abs(this.rhPrestamo.preValor);
    this.prestamoMotivoSeleccionado = this.listaPrestamoMotivo[0];
    this.codigoEmpleado = this.rhPrestamo && this.rhPrestamo.rhEmpleado ? this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId : null;
    if (this.listaFormaPago && this.listaFormaPago.length > 0 && this.rhPrestamo.conCuentas) {
      for (let i = 0; i < this.listaFormaPago.length; i++) {
        if (this.listaFormaPago[i].ctaCodigo == this.rhPrestamo.conCuentas.conCuentasPK.ctaCodigo) {
          this.rhComboFormaPagoTO = this.listaFormaPago[i];
          return;
        }
      }
    }
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  validarDocumento() {
    this.cargando = true;
    this.documentoValido = false;
    if (this.rhPrestamo.preDocumento && this.rhComboFormaPagoTO.validar) {
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        documento: this.rhPrestamo.preDocumento.trim(),//documento ingresado en el input
        cuenta: this.rhComboFormaPagoTO.ctaCodigo,//cuanta contable de la forma de pago
      }
      this.contableService.verificarDocumentoBanco(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
      this.documentoValido = true;
    }
  }

  despuesDeVerificarDocumento(data) {
    this.documentoValido = data;//documento erroneo desde la base de datos
    this.cargando = false;
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = LS.ACCION_CREAR;
    this.extraerDatosPaPrestamos();
    // limpiarmos los demas valores del formulario
    this.rhPrestamo.preValor = 0;
    this.rhPrestamo.preNumeroPagos = 0;
    this.rhPrestamo.preDocumento = "";
    this.rhPrestamo.preObservaciones = "";
    this.rhPrestamo.preAuxiliar = false;
    this.fechaHasta = this.fechaActual;
  }

  extraerDatosPaPrestamos() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, inactivoMotivo: true };
    this.prestamoService.extraerDatosPaPrestamos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesExtraerDatosPaPrestamos(data) {
    if (data) {
      this.listaFormaPago = data.map.listaFormaPago;
      this.listaPrestamoMotivo = data.map.listaPrestamo;
      this.prestamoMotivoSeleccionado = this.listaPrestamoMotivo ? this.listaPrestamoMotivo[0] : null;
      this.rhComboFormaPagoTO = this.listaFormaPago ? this.listaFormaPago[0] : null;
    } else {
      this.listaFormaPago = [];
      this.listaPrestamoMotivo = [];
      this.prestamoMotivoSeleccionado = null;
      this.rhComboFormaPagoTO = null;
    }
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  validarEmpleado() {
    if (this.codigoEmpleado !== this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId) {
      this.codigoEmpleado = null;
      this.rhPrestamo.rhEmpleado.empNombres = "";
      this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId = "";
    }
  }

  abrirModalTrabajadores(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      let fueBuscado = (this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId === this.codigoEmpleado && this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId && this.codigoEmpleado);
      if (!fueBuscado) {
        this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId = this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId === '' ? null : this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId;
        this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId = this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId ? this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId.toUpperCase() : null;
        if (this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId) {
          let parametroBusqueda = {
            empresa: this.empresaSeleccionada.empCodigo,
            buscar: this.rhPrestamo.rhEmpleado.rhEmpleadoPK.empId,
            estado: true
          };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(EmpleadosListadoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
          modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
          modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
          modalRef.componentInstance.isModal = true;
          modalRef.result.then((result) => {
            if (result) {
              this.rhPrestamo.rhEmpleado = result;
              this.rhPrestamo.rhEmpleado.empNombres = result ? result.empApellidos + " " + result.empNombres : "";
              this.codigoEmpleado = result ? result.rhEmpleadoPK.empId : null;
              let element: HTMLElement = document.getElementById('trabajador') as HTMLElement;
              element ? element.focus() : null;
            }
            this.documentoValido = true;
          }, () => {
            let element: HTMLElement = document.getElementById('trabajador') as HTMLElement;
            element ? element.focus() : null;
          });
        }
      }
    }
  }

  nuevoPrestamo() {
    this.accion = LS.ACCION_CREAR;
  }

  guardarPrestamo(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado && this.documentoValido) {
        this.cargando = true;
        this.antesDeGuardarPrestamo(this.rhPrestamo);
        let parametro = {
          rhPrestamo: this.rhPrestamo,
          rhComboFormaPagoTO: this.rhComboFormaPagoTO,
          fechaHasta: this.fechaHasta
        };
        this.prestamoService.insertarPrestamo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  mayorizar(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_MAYORIZAR, this, true)) {
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado && this.documentoValido) {
        this.cargando = true;
        this.antesDeGuardarPrestamo(this.rhPrestamo);
        let contable = { ...this.conContableCopia };
        contable.conPendiente = this.estadoContableAMayorizar;
        let parametro = {
          rhPrestamo: this.rhPrestamo,
          conContable: contable
        };
        this.prestamoService.modificarRhPrestamo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  antesDeGuardarPrestamo(rhPrestamo: RhPrestamo) {
    rhPrestamo.conCuentas.conCuentasPK.ctaEmpresa = LS.KEY_EMPRESA_SELECT;
    rhPrestamo.conCuentas.conCuentasPK.ctaCodigo = this.rhComboFormaPagoTO.ctaCodigo;
    rhPrestamo.prdSector.prdSectorPK.secEmpresa = LS.KEY_EMPRESA_SELECT;
    rhPrestamo.prdSector.prdSectorPK.secCodigo = this.rhPrestamo.rhEmpleado.prdSector.prdSectorPK.secCodigo;
    if (this.esContable) {
      rhPrestamo.preAuxiliar = true;
    }
    if (this.reversar) {
      rhPrestamo.preValor = this.utilService.quitarComasNumero(rhPrestamo.preValor) * (-1);
    }
    rhPrestamo.preValor = this.utilService.quitarComasNumero(rhPrestamo.preValor);
  }

  despuesDeInsertarPrestamo(data) {
    if (data) {
      this.conContable = data.extraInfo.conContable;
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
      this.estadoContableAMayorizar ? this.mensajeOk(data.operacionMensaje) : this.preguntarImprimir(data.operacionMensaje);
    }
    this.cargando = false;
  }

  despuesDeModificarPrestamo(data) {
    this.conContable.conFecha = this.conContableCopia.conFecha;
    this.conContable.conObservaciones = this.conContableCopia.conObservaciones;
    this.conContable.conPendiente = this.estadoContableAMayorizar;
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    this.estadoContableAMayorizar ? this.mensajeOk(data.operacionMensaje) : this.preguntarImprimir(data.operacionMensaje);
  }

  mensajeOk(mensaje: string) {
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, mensaje);
    this.cargando = false;
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
  }

  limpiarResultado() {
    this.prestamoMotivoSeleccionado = this.listaPrestamoMotivo ? this.listaPrestamoMotivo[0] : null;
    this.rhPrestamo = new RhPrestamo()
    this.fechaHasta = this.fechaActual;
    this.conContable = null;
    this.vistaFormulario = false;
    this.accion = null;
  }

  preguntarImprimir(texto: string) {
    const modalRef = this.modalService.open(ImprimirComponent, { backdrop: 'static' });
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    //Imprimir contable
    let listaPk = [];
    let pk = new ConContablePK();
    pk = this.conContable.conContablePK;
    listaPk.push(pk);
    modalRef.componentInstance.parametrosImprimir = { listadoPK: listaPk };
    modalRef.componentInstance.nombreRutaImprimir = "todocompuWS/contabilidadWebController/generarReporteContableIndividual";
    modalRef.componentInstance.nombreArchivoPDFImprimir = "reportComprobanteContable";
    //Imprimir combo
    modalRef.componentInstance.parametrosImprimirCombo = {
      contable: this.conContable,
      rhPrestamo: this.rhPrestamo,
      rhComboFormaPagoTO: this.rhComboFormaPagoTO,
      fechaHasta: this.fechaHasta
    };
    modalRef.componentInstance.nombrerutaImprimirCombo = "todocompuWS/rrhhWebController/generarReporteComprobantePrestamo";
    modalRef.componentInstance.nombreArchivoPDFImprimirCombo = "reportComprobantePrestamo";
    modalRef.componentInstance.textoImprimirCombo = LS.LABEL_IMPRIMIR_COMPROBANTE_PRESTAMO;
    //Ambos
    modalRef.componentInstance.mensaje = texto;
    modalRef.componentInstance.mostrarCombo = true;

    modalRef.result.then((result) => {
      if (result) {
      } else {
      }
    }, () => {
      this.cargando = false;
      this.limpiarResultado();
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    });
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmDatos ? this.frmDatos.value : null));
    }, 50);
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmDatos)) {
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
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
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        }
      });
    }
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: !activar });
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

}
