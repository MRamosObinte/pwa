import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { KardexService } from '../kardex/kardex.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { InvComprasRecepcionTO } from '../../../../entidadesTO/inventario/InvComprasRecepcionTO';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-cambiar-fecha-recepcion',
  templateUrl: './cambiar-fecha-recepcion.component.html',
  styleUrls: ['./cambiar-fecha-recepcion.component.css']
})
export class CambiarFechaRecepcionComponent implements OnInit {

  @Input() empresaSeleccionada;
  @Input() parametros;

  public cargando: boolean = true;
  public constantes: any = LS;
  public es: any = {}; //Locale Date (Obligatoria)
  public esModal: boolean = false;

  public datosCambiarFecha: InvComprasRecepcionTO = new InvComprasRecepcionTO();
  public fecha: any = null;
  public fechaActual: Date = new Date();

  @ViewChild("frmCambiarFecha") frmCambiarFecha: NgForm;
  public valoresIniciales: any;
  public datosCambiarFechaR: any;

  public fechaValida: boolean = true;

  constructor(
    private kardexService: KardexService,
    public activeModal: NgbActiveModal,
    private utilService: UtilService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private auth: AuthService,
    private sistemaService: AppSistemaService
  ) {
    this.datosCambiarFecha = new InvComprasRecepcionTO();
    this.constantes = LS;
    moment.locale('es'); // para la fecha
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    if (this.parametros) {
      this.esModal = true;
      this.cargando = true;
      this.obtenerDatosFechaRecepcion();
      this.iniciarAtajos();
      this.extraerValoresIniciales();
    }
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmCambiarFecha ? this.frmCambiarFecha.value : null));
      this.datosCambiarFechaR = JSON.parse(JSON.stringify(this.datosCambiarFecha ? this.datosCambiarFecha : null));
    }, 50);
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      this.cerrarModal();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  obtenerFechaActual() {
    this.sistemaService.obtenerFechaServidor(this, this.empresaSeleccionada);
  }

  despuesDeObtenerFechaServidor(data) {
    this.fechaActual = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
  }


  obtenerDatosFechaRecepcion() {
    this.kardexService.cambiarFechaRecepcion(this.parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeCambiarFechaRecepcion(data) {
    if (data) {
      this.datosCambiarFecha = new InvComprasRecepcionTO(data);
      this.fecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.datosCambiarFecha.recepFecha);
    } else {
      this.setearNuevosValores(this.datosCambiarFecha);
    }
    this.esModal = true;
    this.cargando = false;
  }

  insertar(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.setearValores(this.datosCambiarFecha);
        let parametros = {
          invComprasRecepcionTO: this.datosCambiarFecha,
        }
        this.kardexService.insertarCambioFechaRecepcion(parametros, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarCambioFechaRecepcion(respuesta) {
    this.cargando = false;
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    this.fechaValida = true
    this.cerrarModal();
  }

  setearValores(datosCambiarFecha: InvComprasRecepcionTO) {
    datosCambiarFecha.compEmpresa = LS.KEY_EMPRESA_SELECT;
    datosCambiarFecha.compMotivo = this.datosCambiarFecha.compMotivo;
    datosCambiarFecha.compNumero = this.datosCambiarFecha.compNumero;
    datosCambiarFecha.compPeriodo = this.datosCambiarFecha.compPeriodo;
    datosCambiarFecha.recepFecha = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fecha);
    datosCambiarFecha.usrCodigo = this.auth.getCodigoUser();
  }

  setearNuevosValores(datosCambiarFecha: InvComprasRecepcionTO) {
    datosCambiarFecha.compEmpresa = LS.KEY_EMPRESA_SELECT;
    datosCambiarFecha.compMotivo = this.parametros.motivo;
    datosCambiarFecha.compNumero = this.parametros.numero;
    datosCambiarFecha.compPeriodo = this.parametros.periodo;
  }

  cerrarModal() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmCambiarFecha)) {
      this.activeModal.close();
    } else {
      this.activeModal.close({
        esFechaValido: this.fechaValida,
        datosCambiarFecha: this.datosCambiarFecha
      });
    }
  }

}
