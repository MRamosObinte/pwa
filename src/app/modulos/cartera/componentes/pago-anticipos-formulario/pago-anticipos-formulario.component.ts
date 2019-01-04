import { Component, OnInit, Input, Output, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ContableListadoService } from '../../../contabilidad/transacciones/contable-listado/contable-listado.service';
import { CarPagosAnticipoTO } from '../../../../entidadesTO/cartera/CarPagosAnticipoTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { CarComboPagosCobrosFormaTO } from '../../../../entidadesTO/cartera/CarComboPagosCobrosFormaTO';
import { PagosAnticiposService } from '../../transacciones/pagos-anticipos/pagos-anticipos.service';
import { ListadoProveedoresComponent } from '../../../inventario/componentes/listado-proveedores/listado-proveedores.component';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { CarCuentasPorPagarSaldoAnticiposTO } from '../../../../entidadesTO/cartera/CarCuentasPorPagarSaldoAnticiposTO';
import { InvProveedor } from '../../../../entidades/inventario/InvProveedor';

@Component({
  selector: 'app-pago-anticipos-formulario',
  templateUrl: './pago-anticipos-formulario.component.html'
})
export class PagoAnticiposFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() parametrosFormulario: any = {};
  @Output() enviarAccion = new EventEmitter();
  @Input() titulo: string = LS.CARTERA_ANTICIPO_PROVEEDORES;

  public constantes: any = LS;
  public innerWidth: number;
  public accion: string = null;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public vistaFormulario: boolean = false;
  public configAutonumericReales: AppAutonumeric;
  public es: object = {};
  //Objetos para crud
  public conContable: ConContable = new ConContable();
  public sectores: Array<PrdListaSectorTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public listaFormaPago: Array<CarComboPagosCobrosFormaTO> = new Array();
  public fpSeleccionada: CarComboPagosCobrosFormaTO = new CarComboPagosCobrosFormaTO();
  public pagoAnticipo: CarPagosAnticipoTO = new CarPagosAnticipoTO();
  public objetoSeleccionado: CarCuentasPorPagarSaldoAnticiposTO = new CarCuentasPorPagarSaldoAnticiposTO();
  public fechaActual: Date = new Date();
  public codigoProveedor: string = null;
  public observaciones: string = "";
  public nombreProveedor: string = "";
  public fecha: string = "";//yyyy-mm-dd
  public documento: string = "";
  public direccion: string = "";
  public isFechaValido = true;
  //Documento
  public documentoValido: boolean = true;
  @ViewChild("frmDatos") frmDatos: NgForm;
  public valoresIniciales: any;

  constructor(
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private auth: AuthService,
    private archivoService: ArchivoService,
    private contableService: ContableListadoService,
    private pagoAnticipoService: PagosAnticiposService,
    private periodoService: PeriodoService
  ) {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.configAutonumericReales = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '999999999',
      minimumValue: "0"
    }
  }

  ngOnInit() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.isScreamMd = this.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.accion = this.parametrosFormulario.accion;
    this.sectorSeleccionado = this.parametrosFormulario.sectorSeleccionado;
    this.objetoSeleccionado = this.parametrosFormulario.seleccionado;
    this.generarAtajos();
    this.obtenerDatosParaCrudAnticipos();
  }

  obtenerDatosParaCrudAnticipos() {
    this.parametrosFormulario.proveedor ? this.completarDatosProveedor(this.parametrosFormulario.proveedor) : null;
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, accion: 'P' }
    this.pagoAnticipoService.obtenerDatosParaCrudAnticipos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaCrudAnticipos(data) {
    this.fechaActual = new Date(data.fechaActual);
    this.despuesDeListarSectores(data.sectores);
    this.listaFormaPago = data.listaForma;
    this.fpSeleccionada = this.listaFormaPago[0];
    if (this.accion != LS.ACCION_CREAR) {
      this.titulo = this.titulo + " (" + this.objetoSeleccionado.antPeriodo + " | " + this.objetoSeleccionado.antTipo + " | " + this.objetoSeleccionado.antNumero + ")";
      this.obtenerInformacionParaMostrarAnticipoPago();
    } else {
      this.cargando = false;
      this.validarFechaPorPeriodo();
      this.extraerValoresIniciales();
    }
  }

  completarDatosProveedor(proveedor: InvProveedor) {
    this.codigoProveedor = proveedor.invProveedorPK.provCodigo;
    this.pagoAnticipo.provCodigo = proveedor.invProveedorPK.provCodigo;
    this.pagoAnticipo.provEmpresa = LS.KEY_EMPRESA_SELECT;
    this.nombreProveedor = proveedor.provRazonSocial;
    this.direccion = proveedor.provDireccion;
    setTimeout(() => { this.focusInput('fecha') }, 50);
  }

  obtenerInformacionParaMostrarAnticipoPago() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: this.objetoSeleccionado.antPeriodo,
      tipo: this.objetoSeleccionado.antTipo,
      numero: this.objetoSeleccionado.antNumero
    }
    this.pagoAnticipoService.obtenerAnticipoPago(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerAnticipoPago(data) {
    this.pagoAnticipo = data.carPagosAnticiposTO;
    this.fpSeleccionada = data.fpSeleccionada;
    this.sectorSeleccionado = this.sectores.find(item => item.secCodigo === this.pagoAnticipo.secCodigo);
    this.sectorSeleccionado = this.sectorSeleccionado ? this.sectorSeleccionado : new PrdListaSectorTO({ secCodigo: this.pagoAnticipo.secCodigo, secEmpresa: this.pagoAnticipo.secEmpresa })
    this.fpSeleccionada = this.listaFormaPago.find(item => item.fpSecuencial === this.pagoAnticipo.fpSecuencial);
    this.nombreProveedor = data.nombre;
    this.codigoProveedor = data.codigo;
    this.direccion = data.direccion;
    this.conContable = data.contable ? data.contable : new ConContable();
    this.fechaActual = new Date(this.conContable.conFecha);
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  despuesDeListarSectores(data) {
    this.sectores = data ? data : [];
    if (this.sectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  validarDocumento() {
    this.cargando = true;
    this.documentoValido = false;
    if (this.documento && this.fpSeleccionada.validar) {
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        documento: this.documento,//documento ingresado en el input
        cuenta: this.fpSeleccionada.ctaCodigo,//cuanta contable de la forma de pago
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

  validarFechaPorPeriodo() {
    this.isFechaValido = false;
    if (this.fechaActual) {
      let parametro = {
        fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaActual),
        empresa: LS.KEY_EMPRESA_SELECT
      }
      this.periodoService.getPeriodoPorFecha(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeGetPeriodoPorFecha(data: SisPeriodo) {
    if (data && !data.perCerrado) {
      this.isFechaValido = true;
    } else {
      this.isFechaValido = false;
    }
  }

  //proveedor
  buscarProveedor(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.pagoAnticipo.provCodigo) {
      let fueBuscado = (this.pagoAnticipo.provCodigo && this.codigoProveedor && this.pagoAnticipo.provCodigo === this.codigoProveedor);
      if (!fueBuscado) {
        let parametro = { empresa: LS.KEY_EMPRESA_SELECT, categoria: null, inactivos: false, busqueda: this.pagoAnticipo.provCodigo };
        event.srcElement.blur();
        event.preventDefault();
        this.abrirModalProveedor(parametro);
      }
    }
  }

  abrirModalProveedor(parametro) {
    const modalRef = this.modalService.open(ListadoProveedoresComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.parametrosBusqueda = parametro;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      if (result) {
        this.codigoProveedor = result.provCodigo;
        this.pagoAnticipo.provCodigo = result.provCodigo;
        this.pagoAnticipo.provEmpresa = result.provEmpresa;
        this.nombreProveedor = result.provRazonSocial;
        this.direccion = result.provDireccion;
        this.focusInput('fecha');
      } else {
        this.focusInput('proveedor');
      }
    }, () => {
      this.focusInput('proveedor');
    });
  }

  focusInput(id) {
    let element = document.getElementById(id);
    element ? element.focus() : null;
  }

  validarProveedor() {
    if (this.codigoProveedor !== this.pagoAnticipo.provCodigo) {
      this.codigoProveedor = null;
      this.nombreProveedor = "";
      this.pagoAnticipo.provCodigo = "";
      this.pagoAnticipo.provEmpresa = "";
      this.direccion = "";
    }
  }

  guardar(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado && this.documentoValido && this.isFechaValido) {
        this.cargando = true;
        this.antesDeGuardarPrestamo();
        let parametro = {
          carPagosAnticipoTO: this.pagoAnticipo,
          observaciones: this.observaciones,
          nombreProveedor: this.nombreProveedor,
          fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaActual),
          sectorProveedor: this.sectorSeleccionado.secCodigo,
          documento: this.documento
        };
        this.pagoAnticipoService.insertarAnticiposPago(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  antesDeGuardarPrestamo() {
    this.pagoAnticipo.antEmpresa = LS.KEY_EMPRESA_SELECT;
    this.pagoAnticipo.antTipo = "C-APRO";
    this.pagoAnticipo.secEmpresa = LS.KEY_EMPRESA_SELECT;
    this.pagoAnticipo.secCodigo = this.sectorSeleccionado.secCodigo;
    this.pagoAnticipo.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    this.pagoAnticipo.fpSecuencial = this.fpSeleccionada.fpSecuencial;
    this.pagoAnticipo.usrCodigo = this.auth.getCodigoUser();
  }

  despuesDeInsertarAnticiposPago(data) {
    try {
      this.conContable = data.extraInfo;
      this.preguntarImprimir(data.operacionMensaje);
    } catch(err) {
      this.cargando = false;
      this.cerrarFormulario();
    }
  }

  preguntarImprimir(texto: string) {
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: texto + '<br>' + LS.MSJ_PREGUNTA_IMPRIMIR + "<br>",
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_IMPRIMIR + "'></i>  " + LS.LABEL_IMPRIMIR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona Imprimir
        this.imprimirContable();
      } else {//Cierra el formulario
        this.cerrarFormulario();
      }
    });
  }

  cerrarFormulario() {
    let parametro = {
      accion: LS.ACCION_CREADO,
      resultante: this.pagoAnticipoService.construirObjetoParaPonerloEnLaLista(this.pagoAnticipo, this.conContable, this.nombreProveedor),
      empresa: this.empresaSeleccionada
    };
    this.cargando = false;
    this.enviarAccion.emit(parametro);
  }

  //CONTABLE
  imprimirContable() {
    this.cargando = true;
    let listaPk = [];
    let pk = this.conContable.conContablePK;
    listaPk.push(pk);
    let parametros = { listadoPK: listaPk };
    this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableIndividual", parametros, this.empresaSeleccionada)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('Contable.pdf', data);
          this.cargando = false;
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
    this.accion === LS.ACCION_CREAR ? this.cerrarFormulario() : null;
  }

  anular() {
    let parametros = {
      conContablePK: this.conContable.conContablePK,
      anularReversar: true,
      accionUsuario: "ANULAR",
      bandera: ""
    };
    this.cargando = true;
    this.pagoAnticipoService.anularReversarContable(this, parametros);
  }

  reversar() {
    let parametros = {
      conContablePK: this.conContable.conContablePK,
      anularReversar: false,
      accionUsuario: "REVERSAR",
      bandera: ""
    };
    this.cargando = true;
    this.pagoAnticipoService.anularReversarContable(this, parametros);
  }

  despuesDeAnularReversarContable(respuesta) {
    this.cargando = false;
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    let parametro = {
      accion: LS.ACCION_ELIMINADO
    };
    this.cargando = false;
    this.enviarAccion.emit(parametro);
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
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
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
