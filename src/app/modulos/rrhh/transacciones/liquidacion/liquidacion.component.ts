import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpleadosListadoComponent } from '../../componentes/empleados-listado/empleados-listado.component';
import { RhRol } from '../../../../entidades/rrhh/RhRol';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { RhComboFormaPagoTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoTO';
import { FormaPagoService } from '../../archivo/forma-pago/forma-pago.service';
import { NgForm } from '@angular/forms';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';
import { LiquidacionService } from './liquidacion.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ContableListadoService } from '../../../contabilidad/transacciones/contable-listado/contable-listado.service';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { SistemaService } from '../../../sistema/sistema/sistema.service';

@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.css']
})
export class LiquidacionComponent implements OnInit {
  @Input() listaEmpresas: Array<PermisosEmpresaMenuTO> = [];   //Cuando se quiere acceder desde otro componente
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();//Cuando se quiere acceder desde otro componente
  @Input() accion: string = LS.ACCION_CREAR;
  @Input() rhRol: RhRol = new RhRol();

  //MAYORIZANDO
  @Input() esContable: boolean = false;
  @Input() conContable: ConContable = new ConContable();
  @Input() tipoSeleccionado: ConTipoTO = new ConTipoTO();
  @Input() data: any = {};
  @Input() titulo: string = LS.TALENTO_HUMANO_LIQUIDACION;
  @Output() enviarAccion = new EventEmitter();

  public screamXS: boolean = true;
  public activarLiquidacion: boolean = true;
  public estadoContableAMayorizar: boolean = false;
  public puedeEditarTabla: boolean = false;
  @Input() listaFormaPago: Array<RhComboFormaPagoTO> = [];
  public formaPagoSeleccionada: RhComboFormaPagoTO = new RhComboFormaPagoTO();
  public listaMotivos = LS.LISTA_MOTIVOS_LIQUIDACION;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activarNegativo: boolean = false;
  public totalLiquidacion: number = 0;
  public configAutonumeric: AppAutonumeric;
  //contable
  public conContableCopia: any;
  public fechaContableValido: boolean = true;

  //EMPLEADO
  public codigoEmpleado: string = null;
  //Documento
  public documentoValido: boolean = true;
  //Fechas
  public fechaRegitro: any = new Date(); // Al guardar  fechaDesde y fechaHasta del rol es la fecha de registro
  public fechaFinLabores: any = new Date();
  public fechaActual: any = new Date();
  public fechaUltimoSueldo: any = new Date();
  public fechaValido: boolean = true;
  public periodoAbierto: boolean = false;
  public es: object = {};
  //Formulario
  @ViewChild("frmLiquidacion") frmLiquidacion: NgForm;
  public valoresIniciales: any;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private modalService: NgbModal,
    private formaPagoService: FormaPagoService,
    private appSistemService: AppSistemaService,
    private sistemaService: SistemaService,
    private liquidacionService: LiquidacionService,
    private contableService: ContableListadoService
  ) {
    this.screamXS = window.innerWidth <= LS.WINDOW_WIDTH_XS ? true : false;
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '99999.99',
      minimumValue: '0',
    }
  }

  ngOnInit() {
    this.obtenerFechaActualServidor();
    this.generarAtajosTeclado();
    this.inicializandoFormulario();
  }

  accionesBotones(event) {//recepcion de metodos
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.cambiarActivar()
        break;
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_MAYORIZAR:
        if (!this.fechaContableValido) {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        } else {
          this.estadoContableAMayorizar = event.estado;
          this.guardarLiquidacion(this.frmLiquidacion);
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

  //Fecha servidor
  obtenerFechaActualServidor() {
    this.cargando = true;
    this.appSistemService.obtenerFechaServidor(this, this.empresaSeleccionada);
  }

  despuesDeObtenerFechaServidor(data) {
    this.cargando = false;
    if (!this.esContable) {// cuando es Nuevo
      this.fechaUltimoSueldo = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
      this.fechaRegitro = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
      this.fechaFinLabores = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
      this.validarPeriodoAbierto();
    }
    this.fechaActual = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.utilService.formatoStringSinZonaHorariaYYYMMDD(data));
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.formaPagoSeleccionada = null;
    this.resetearFormulario();
    this.listarFormasDePago();
    this.valoresInicialesformulario();
  }

  //Atajos
  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarLiquidacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirLiquidacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarLiquidacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarLiquidacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //Formulario
  inicializandoFormulario() {
    //si es contables; hagamos esto
    this.esContable ? this.accion = this.data.accion : null;
    this.esContable ? this.activarLiquidacion = this.data.activar : null;
    this.esContable ? this.codigoEmpleado = this.rhRol.rhEmpleado.rhEmpleadoPK.empId : null;
    this.conContableCopia = this.esContable ? { ...this.conContable } : new ConContable();
    //cntinuamos normalmente
    switch (this.accion) {
      case LS.ACCION_CREAR: {
        this.listaEmpresas = this.route.snapshot.data["liquidacion"];
        this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
        this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
        this.rhRol.rhEmpleado.empMotivoSalida = this.listaMotivos[0];
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        if (this.rhRol.conCuentas && this.rhRol.conCuentas.conCuentasPK && this.rhRol.conCuentas.conCuentasPK.ctaCodigo) {
          this.formaPagoSeleccionada.ctaCodigo = this.rhRol.conCuentas.conCuentasPK.ctaCodigo;
          this.formaPagoSeleccionada.fpDetalle = this.rhRol.conCuentas.ctaDetalle;
        } else {
          this.formaPagoSeleccionada = null;
        }
        this.fechaRegitro = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.rhRol.rolDesde);
        this.fechaFinLabores = this.rhRol.rhEmpleado.empFechaUltimaSalida || this.rhRol.rhEmpleado.empFechaPrimeraSalida ?
          this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.rhRol.rhEmpleado.empFechaUltimaSalida ? this.rhRol.rhEmpleado.empFechaUltimaSalida : this.rhRol.rhEmpleado.empFechaPrimeraSalida) : this.fechaRegitro;
        this.fechaUltimoSueldo = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.rhRol.rolFechaUltimoSueldo);
        this.validarFechas();
        this.validarPeriodoAbierto();
        this.calcularTotal();
        this.despuesDeListarComboFormasPago(this.listaFormaPago);
        this.valoresInicialesformulario();
        break;
      }
      case LS.ACCION_CONSULTAR:
      case LS.ACCION_ANULAR:
      case LS.ACCION_RESTAURAR: {
        if (this.rhRol.conCuentas && this.rhRol.conCuentas.conCuentasPK && this.rhRol.conCuentas.conCuentasPK.ctaCodigo) {
          this.formaPagoSeleccionada.ctaCodigo = this.rhRol.conCuentas.conCuentasPK.ctaCodigo;
          this.formaPagoSeleccionada.fpDetalle = this.rhRol.conCuentas.ctaDetalle;
        } else {
          this.formaPagoSeleccionada = null;
        }
        this.fechaRegitro = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.rhRol.rolDesde);
        this.fechaFinLabores = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.rhRol.rhEmpleado.empFechaUltimaSalida ? this.rhRol.rhEmpleado.empFechaUltimaSalida : this.rhRol.rhEmpleado.empFechaPrimeraSalida);
        this.fechaValido = true;
        this.periodoAbierto = true;
        this.calcularTotal();
        this.despuesDeListarComboFormasPago(this.listaFormaPago);
        break;
      }
      default: {
        break;
      }
    }
    this.puedeEditarTabla = !this.esContable || this.data.accion === LS.ACCION_MAYORIZAR;
  }

  valoresInicialesformulario() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmLiquidacion ? this.frmLiquidacion.value : null));
    }, 50);
  }

  resetearFormulario() {
    this.totalLiquidacion = 0;
    this.rhRol = new RhRol();
    this.fechaRegitro = this.fechaActual;
    this.fechaFinLabores = this.fechaActual;
    this.filasService.actualizarFilas(0, 0);
    this.validarFechas();
    this.focusEmpleado();
    this.frmLiquidacion.form.markAsUntouched();
  }

  //Validaciones 
  validarFechas() {
    this.fechaValido = true;
    if (this.fechaRegitro && this.fechaFinLabores) {
      this.fechaFinLabores = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaFinLabores);
      this.fechaRegitro = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaRegitro);
      if (this.fechaFinLabores.getTime() > this.fechaRegitro.getTime()) {
        this.fechaValido = false;
      }
    } else {
      this.fechaValido = false;
    }
  }

  validarDocumento() {
    this.cargando = true;
    this.documentoValido = false;
    if (this.rhRol.rolDocumento && this.formaPagoSeleccionada.validar) {
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        documento: this.rhRol.rolDocumento.trim(),//documento ingresado en el input
        cuenta: this.formaPagoSeleccionada.ctaCodigo,//cuanta contable de la forma de pago
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

  //Forma de pago
  listarFormasDePago() {
    this.listaFormaPago = [];
    this.cargando = true;
    this.formaPagoService.listarComboFormasPago({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarComboFormasPago(lista) {
    this.listaFormaPago = lista;
    if (this.listaFormaPago.length > 0) {
      this.formaPagoSeleccionada = this.formaPagoSeleccionada && this.formaPagoSeleccionada.ctaCodigo ? this.listaFormaPago.find(item => item.ctaCodigo === this.formaPagoSeleccionada.ctaCodigo) : this.listaFormaPago[0];
    } else {
      this.formaPagoSeleccionada = null;
    }
    this.cargando = false;
  }

  //calculos
  calcularTotal() {
    this.rhRol.rolLiqXiii = !this.rhRol.rolLiqXiii ? 0 : this.rhRol.rolLiqXiii;
    this.rhRol.rolLiqXiv = !this.rhRol.rolLiqXiv ? 0 : this.rhRol.rolLiqXiv;
    this.rhRol.rolLiqVacaciones = !this.rhRol.rolLiqVacaciones ? 0 : this.rhRol.rolLiqVacaciones;
    this.rhRol.rolLiqDesahucio = !this.rhRol.rolLiqDesahucio ? 0 : this.rhRol.rolLiqDesahucio;
    this.rhRol.rolLiqDesahucioIntempestivo = !this.rhRol.rolLiqDesahucioIntempestivo ? 0 : this.rhRol.rolLiqDesahucioIntempestivo;
    this.rhRol.rolLiqBonificacion = !this.rhRol.rolLiqBonificacion ? 0 : this.rhRol.rolLiqBonificacion;

    let sumIngresos = this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqXiii) + this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqXiv) + this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqVacaciones);
    let sumDescuentos = this.rhRol.rhEmpleado.empSaldoAnticipos + this.rhRol.rhEmpleado.empSaldoPrestamos;
    let sumIndem = this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqDesahucio) + this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqDesahucioIntempestivo) + this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqBonificacion);
    let signoEmpSalAnt = this.activarNegativo ? (-1) * this.rhRol.rhEmpleado.empSaldoAnterior : this.rhRol.rhEmpleado.empSaldoAnterior;
    this.totalLiquidacion = sumIngresos + sumIndem - sumDescuentos + signoEmpSalAnt;
  }

  //Periodo
  validarPeriodoAbierto() {
    this.cargando = true;
    this.periodoAbierto = false;
    if (this.fechaRegitro) {
      let parametro = { empresa: this.empresaSeleccionada.empCodigo, fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD({ ...this.fechaRegitro }) };
      this.sistemaService.getIsPeriodoAbierto(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
    }
  }

  despuesDeObtenerIsPeriodoAbierto(data) {
    this.periodoAbierto = data;
    this.cargando = false;
  }

  //EMPLEADO
  buscarEmpleado(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      let fueBuscado = (this.rhRol.rhEmpleado.rhEmpleadoPK.empId === this.codigoEmpleado && this.rhRol.rhEmpleado.rhEmpleadoPK.empId && this.codigoEmpleado);
      if (!fueBuscado) {
        this.rhRol.rhEmpleado.rhEmpleadoPK.empId = this.rhRol.rhEmpleado.rhEmpleadoPK.empId === '' ? null : this.rhRol.rhEmpleado.rhEmpleadoPK.empId;
        this.rhRol.rhEmpleado.rhEmpleadoPK.empId = this.rhRol.rhEmpleado.rhEmpleadoPK.empId ? this.rhRol.rhEmpleado.rhEmpleadoPK.empId.toUpperCase() : null;
        if (this.rhRol.rhEmpleado.rhEmpleadoPK.empId) {
          let parametroBusqueda = {
            empresa: this.empresaSeleccionada.empCodigo,
            buscar: this.rhRol.rhEmpleado.rhEmpleadoPK.empId,
            estado: true
          };
          event.srcElement.blur();
          event.preventDefault();
          this.abrirModalEmpleado(parametroBusqueda);
        }
      }
    }
  }

  abrirModalEmpleado(parametroBusqueda) {
    const modalRef = this.modalService.open(EmpleadosListadoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      this.codigoEmpleado = result ? result.rhEmpleadoPK.empId : null;
      this.rhRol.rhEmpleado.rhEmpleadoPK.empId = result ? result.rhEmpleadoPK.empId : null;
      this.rhRol.rhEmpleado = result ? result : new RhEmpleado();
      this.rhRol.rhEmpleado.empNombres = result ? result.empApellidos + " " + result.empNombres : null;
      if (this.rhRol.rhEmpleado.empSaldoAnterior < 0) {
        this.rhRol.rhEmpleado.empSaldoAnterior = -1 * result.empSaldoAnterior;
        this.activarNegativo = true;
      }
      //Evaluar fechas
      if (this.rhRol.rhEmpleado.empFechaUltimoSueldo) {
        let fechaUltimoSueldo: any = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.rhRol.rhEmpleado.empFechaUltimoSueldo);
        let fechaUltimoSueldo1DiaMas = fechaUltimoSueldo.setDate(fechaUltimoSueldo.getDate() + 1);
        this.fechaUltimoSueldo = new Date(fechaUltimoSueldo1DiaMas);
        this.fechaRegitro = new Date(fechaUltimoSueldo1DiaMas);
      } else {
        this.fechaRegitro = this.fechaActual;
        this.fechaUltimoSueldo = this.fechaActual;
      }
      this.documentoValido = true;
      this.validarPeriodoAbierto();
      this.validarFechas();
      this.calcularTotal();
      this.focusMotivo();
    }, () => {//Cuando se cierra sin un dato
      this.focusEmpleado();
    });
  }

  validarEmpleado() {
    if (this.codigoEmpleado !== this.rhRol.rhEmpleado.rhEmpleadoPK.empId) {
      this.codigoEmpleado = null;
      this.totalLiquidacion = 0;
      this.rhRol = new RhRol();
      this.rhRol.rhEmpleado.empMotivoSalida = this.listaMotivos[0];
    }
  }

  focusEmpleado() {
    let element: HTMLElement = document.getElementById('empleado') as HTMLElement;
    element ? element.focus() : null;
  }

  focusMotivo() {
    let element: HTMLElement = document.getElementById('motivoSalida') as HTMLElement;
    element ? element.focus() : null;
  }

  //Operaciones
  guardarLiquidacion(form: NgForm) {
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado && this.totalLiquidacion >= 0 && this.documentoValido && this.fechaValido && this.periodoAbierto && this.isLiquidacion()) {
      let liquidacionCopia: RhRol = JSON.parse(JSON.stringify(this.rhRol));
      liquidacionCopia.rhEmpleado.empSaldoAnterior = this.activarNegativo ? -1 * liquidacionCopia.rhEmpleado.empSaldoAnterior : liquidacionCopia.rhEmpleado.empSaldoAnterior;
      liquidacionCopia.rolFechaUltimoSueldo = liquidacionCopia.rhEmpleado.empFechaUltimoSueldo ?
        this.utilService.formatoDateSinZonaHorariaYYYMMDD(liquidacionCopia.rhEmpleado.empFechaUltimoSueldo).getTime() :
        this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaActual).getTime();
      //cuenta y forma pago
      if (this.formaPagoSeleccionada.ctaCodigo) {
        liquidacionCopia.conCuentas.conCuentasPK.ctaEmpresa = this.empresaSeleccionada.empCodigo;
        liquidacionCopia.conCuentas.conCuentasPK.ctaCodigo = this.formaPagoSeleccionada.ctaCodigo;
        liquidacionCopia.rolFormaPago = this.formaPagoSeleccionada.ctaCodigo;
      }
      liquidacionCopia.rolDocumento = liquidacionCopia.rolDocumento === "" || !liquidacionCopia.rolDocumento ? null : liquidacionCopia.rolDocumento.trim();
      //Empleado
      if (liquidacionCopia.rhEmpleado.empFechaPrimeraSalida) {
        liquidacionCopia.rhEmpleado.empFechaUltimaSalida = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaFinLabores).getTime();
      } else {
        liquidacionCopia.rhEmpleado.empFechaPrimeraSalida = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaFinLabores).getTime();
      }
      liquidacionCopia.rhEmpleado.empInactivo = true;
      //Dias faltas reales
      liquidacionCopia.rolDiasFaltasReales = 1;
      //Cargo
      liquidacionCopia.empCargo = liquidacionCopia.rhEmpleado.empCargo;
      //Fechas
      liquidacionCopia.rolDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaRegitro).getTime();
      liquidacionCopia.rolHasta = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaRegitro).getTime();
      //Valores que aun no tengo, se envia NULL
      liquidacionCopia.conContableProvision = null;
      liquidacionCopia.conContable = null;
      liquidacionCopia.prdSector = liquidacionCopia.rhEmpleado.prdSector;
      let parametro = { rhRol: liquidacionCopia };
      if (!this.esContable) {
        this.liquidacionService.insertarLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        let contable = { ...this.conContableCopia };
        contable.conPendiente = this.estadoContableAMayorizar;
        liquidacionCopia.rolAuxiliar = true;
        let parametro = { rhRol: liquidacionCopia, conContable: contable };
        this.liquidacionService.modificarRhLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  isLiquidacion() {
    let isLiq = this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqBonificacion) !== 0
      || this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqDesahucio) !== 0
      || this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqBonificacion) !== 0
      || this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqBonificacion) !== 0
      || this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqDesahucioIntempestivo) !== 0
      || this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqSalarioDigno) !== 0
      || this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqVacaciones) !== 0
      || this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqXiii) !== 0
      || this.utilService.convertirDecimaleFloat(this.rhRol.rolLiqXiv) !== 0;
    return isLiq;
  }

  despuesDeInsertarLiquidacion(data) {
    this.cargando = false;
    if (data) {
      if (this.esContable) {
        this.conContable.conFecha = this.conContableCopia.conFecha;
        this.conContable.conObservaciones = this.conContableCopia.conObservaciones;
        this.conContable.conPendiente = this.estadoContableAMayorizar;
        if (this.estadoContableAMayorizar) {
          this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, data.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
          this.cancelarSiEsContable();
        } else {
          this.preguntarImprimir(data);
        }
      } else {
        this.preguntarImprimir(data);
      }
    }
  }

  preguntarImprimir(data) {
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: data.operacionMensaje + '<br>' + LS.MSJ_PREGUNTA_IMPRIMIR,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_IMPRIMIR + "'></i>  " + LS.LABEL_IMPRIMIR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona Imprimir
        this.imprimirContable(data.extraInfo);
      }
    });
    this.esContable ? this.cancelarSiEsContable() : this.resetearFormulario();
  }

  imprimirContable(data) {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaPk = [];
      let pk = new ConContablePK();
      pk = data.conContable.conContablePK;
      listaPk.push(pk);
      let parametros = { listadoPK: listaPk };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableIndividual", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('Contable.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
          this.esContable ? this.cancelarSiEsContable() : this.resetearFormulario();
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  cancelar() {
    if (this.sePuedeCancelar()) {
      this.esContable ? this.cancelarSiEsContable() : this.resetearFormulario();
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
          this.esContable ? this.cancelarSiEsContable() : this.resetearFormulario();
        }
      });
    }
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmLiquidacion);
  }

  cambiarActivar() {
    this.activarLiquidacion = !this.activarLiquidacion;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: this.activarLiquidacion });
  }

  cancelarSiEsContable() {
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
  }

}
